import express from "express";
import {
  createContactMessage,
  getContactMessages,
  removeContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// ✅ Public: user submits a message
router.post("/contact", createContactMessage);

// ✅ Admin: view all messages
router.get("/admin/contact-messages", getContactMessages);

// ✅ Admin: delete message by ID
router.delete("/admin/contact-messages/:id", removeContactMessage);

export default router;
