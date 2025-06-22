import express from "express";
import { submitMessage } from "../controllers/messagesController.js";

const router = express.Router();

// POST route for handling form submissions
router.post("/api/messages", submitMessage);

export default router;
