import { toJSON } from "@reis/mongoose-to-json";
import { Schema, model } from "mongoose";



const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt fields
);

productSchema.plugin(toJSON);

export const ProductModel = model("products", productSchema)
