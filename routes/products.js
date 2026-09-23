import { Router } from "express";
import upload from "../middlewares/upload.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import {
  postProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const productsRouter = Router();

productsRouter.post("/", requireAdmin, upload.single("image"), postProduct);
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.put("/:id", requireAdmin, upload.single("image"), updateProduct);
productsRouter.delete("/:id", requireAdmin, deleteProduct);

export default productsRouter