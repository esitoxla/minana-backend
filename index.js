import express from "express"
import cors from "cors"

import messageRouter from "./routes/messages.js";


const app = express()

app.use(express.json());
app.use(cors())

//use routes
app.use(messageRouter);


app.listen(3005, () => {
    console.log("app is listening on port 3005");
})