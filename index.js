import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3005;

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://minana-services-ltd.netlify.app",
    ],
    credentials: true,
  }),
);


dns.setDefaultResultOrder("ipv4first");

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database is connected");

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}
