import { Router } from "express";
import upload from "../middlewares/upload.js";
import {
  postProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const productsRouter = Router();

productsRouter.post("/products", upload.single("image"), postProduct);

productsRouter.get("/products", getAllProducts);

productsRouter.get("/products/:id", getProductById);

productsRouter.put("/products/:id", upload.single("image"), updateProduct);

productsRouter.delete("/products/:id", deleteProduct);

export default productsRouter