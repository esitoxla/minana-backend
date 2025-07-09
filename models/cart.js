import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false } //will prevent each item from getting a unique id as the database does
);

const cartSchema = new Schema(
  {
    userId: {
      type: String, // instead of mongoose.Schema.Types.ObjectId
      required: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



cartSchema.plugin(toJSON);

export const Cart = model("Cart", cartSchema);
