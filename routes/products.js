import { Router } from "express";
import upload from "../middlewares/upload.js";
import adminMiddleware from "../middlewares/isAdmin.js";
import {
  postProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const productsRouter = Router();

productsRouter.post("/products", adminMiddleware, upload.single("image"), postProduct);

productsRouter.get("/products", getAllProducts);

productsRouter.get("/products/:id", getProductById);

productsRouter.put("/products/:id", adminMiddleware, upload.single("image"), updateProduct);

productsRouter.delete("/products/:id", adminMiddleware,  deleteProduct);

export default productsRouter