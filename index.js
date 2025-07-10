import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

dotenv.config();

//connect to database
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database is connected')
    
} catch (error) {
    console.log(error)
}

const app = express()

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173/", // for local dev
      "https://minana-services-ltd.netlify.app/product", //  real Netlify domain
    ],
    credentials: true,
  })
);
  

//use routes
app.use(productsRouter, cartRouter);


app.listen(3005, () => {
    console.log("app is listening on port 3005");
})