import express from "express";
import { handleContact } from "../controllers/messagesController";

const router = express.Router();

// POST route for handling form submissions
router.post("/api/messages", handleContact);

export default router;
