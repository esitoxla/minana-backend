// ABSA Project1-backend/routes/moolreRoutes.js
import express from "express";
import { Order } from "../models/orderModel.js";

const router = express.Router();

async function checkMoolreStatus(externalref) {
  const res = await fetch(
    `${process.env.MOOLRE_BASE_URL}/open/transact/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": process.env.MOOLRE_API_USER,
        "X-API-PUBKEY": process.env.MOOLRE_API_PUBKEY,
      },
      body: JSON.stringify({
        type: 1,
        accountnumber: process.env.MOOLRE_ACCOUNT_NUMBER,
        id: externalref,
        idtype: 1,
      }),
    },
  );
  const data = await res.json();
  return data;
}

// Documented Moolre payment-status and webhook payloads put an integer
// txstatus on `data`: 1 successful, 0 pending, 2 failed. Top-level `status`
// is the API envelope (1 = request accepted), not the payment result.
// This sandbox has not been captured here. Unrecognized shapes stay "pending".
function interpretStatus(data) {
  const txstatus = data?.data?.txstatus ?? data?.txstatus;
  if (txstatus === 1 || txstatus === "1") return "paid";
  if (txstatus === 2 || txstatus === "2") return "failed";
  return "pending";
}

function providerReferenceFrom(data) {
  const reference = data?.data?.transactionid ?? data?.transactionid;
  return reference == null ? undefined : String(reference);
}

router.post("/webhook", async (req, res) => {
  try {
    const data = req.body?.data;
    if (!data) return res.status(400).json({ error: "missing data" });

    if (data.secret !== process.env.MOOLRE_WEBHOOK_SECRET) {
      return res.status(401).json({ error: "invalid webhook secret" });
    }

    const order = await Order.findOne({ externalref: data.reference });
    if (!order) return res.status(404).json({ error: "order not found" });

    if (data.txstatus === 2) {
      order.status = "failed";
      await order.save();
    } else if (
      data.txstatus === 1 &&
      Math.abs(parseFloat(data.amount) - order.amount) <= 0.01 &&
      data.accountnumber === process.env.MOOLRE_ACCOUNT_NUMBER
    ) {
      order.status = "paid";
      order.providerReference = String(data.transactionid);
      await order.save();
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Moolre webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.get("/verify/:externalref", async (req, res) => {
  try {
    const order = await Order.findOne({ externalref: req.params.externalref });
    if (!order) return res.status(404).json({ error: "order not found" });

    if (order.status === "pending") {
      const data = await checkMoolreStatus(order.externalref);
      const paymentStatus = interpretStatus(data);
      if (paymentStatus !== "pending") order.status = paymentStatus;
      const providerReference = providerReferenceFrom(data);
      if (providerReference) order.providerReference = providerReference;
      if (order.isModified()) await order.save();
    }

    res.json({ status: order.status, externalref: order.externalref });
  } catch (err) {
    console.error("Moolre verify error:", err);
    res.status(500).json({ error: "Could not verify payment" });
  }
});

export default router;
