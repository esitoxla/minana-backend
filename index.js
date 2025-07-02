import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";

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

app.use(cors())

//use routes
app.use(productsRouter);


app.listen(3005, () => {
    console.log("app is listening on port 3005");
})