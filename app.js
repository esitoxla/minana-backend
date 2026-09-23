import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://minana-services-ltd.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

export default app;
