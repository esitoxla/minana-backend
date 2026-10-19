import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const orderItemSchema = new Schema(
  {
    productId: String,
    name: String,
    pricePerUnit: Number,
    quantity: Number,
    totalPrice: Number,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: false }, // guest checkout allowed for now
    customerName: String,
    customerEmail: { type: String, required: true },
    customerPhone: String,
    items: [orderItemSchema],
    amount: { type: Number, required: true },
    currency: { type: String, default: "GHS" },
    externalref: { type: String, required: true, unique: true },
    provider: { type: String, default: "moolre" },
    providerReference: { type: String }, // Moolre's own generated ID, from webhook/status response
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "abandoned"],
      default: "pending",
    },
    checkoutUrl: String,
  },
  { timestamps: true },
);

orderSchema.plugin(toJSON);
export const Order = model("Order", orderSchema);
