import express from "express";
import crypto from "crypto";
import { Order } from "../models/orderModel.js";

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    const { items, amount, customerName, customerEmail, customerPhone } =
      req.body;

    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "items and customerEmail are required" });
    }

    const serverAmount = items.reduce((sum, item) => {
      return sum + Number(item.pricePerUnit) * Number(item.quantity);
    }, 0);

    const clientAmount = Number(amount);
    if (
      !Number.isFinite(serverAmount) ||
      !Number.isFinite(clientAmount) ||
      Math.abs(serverAmount - clientAmount) > 0.01
    ) {
      return res.status(400).json({ error: "amount does not match items" });
    }

    const externalref = `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const order = await Order.create({
      items,
      amount: serverAmount,
      customerName,
      customerEmail,
      customerPhone,
      externalref,
      status: "pending",
    });

    const moolreRes = await fetch(
      `${process.env.MOOLRE_BASE_URL}/embed/src/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-USER": process.env.MOOLRE_API_USER,
          "X-API-PUBKEY": process.env.MOOLRE_API_PUBKEY,
        },
        body: JSON.stringify({
          state: "starter",
          accountnumber: process.env.MOOLRE_ACCOUNT_NUMBER,
          tx_source: "node",
          reference: externalref,
          email: customerEmail,
          amount: serverAmount.toFixed(2),
          currency: "GHS",
          callback: `${process.env.BACKEND_URL}/api/moolre/webhook`,
          redirect: `${process.env.FRONTEND_URL}/cart/payment?ref=${externalref}`,
          expiration_time: 10,
        }),
      },
    );

    const moolreData = await moolreRes.json();
    const checkoutUrl = moolreData?.data?.authorization_url;

    if (!checkoutUrl) {
      console.error("Moolre checkout link missing:", moolreRes.status, moolreData);
      order.status = "failed";
      await order.save();
      return res
        .status(502)
        .json({ error: "Failed to create Moolre checkout link" });
    }

    order.checkoutUrl = checkoutUrl;
    await order.save();

    res.json({ checkoutUrl, externalref });
  } catch (err) {
    console.error("Checkout init error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong initializing checkout" });
  }
});

export default router;
