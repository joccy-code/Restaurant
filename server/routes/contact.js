import express from "express";
import {
  createContactMessage,
  getContactMessages,
  removeContactMessage,
} from "../controllers/contact.controller.js";

const router = express.Router();

// 🌍 Public route: user sends message
router.post("/contact", createContactMessage);

// 🧑‍💼 Admin routes
router.get("/contact-messages", getContactMessages);
router.delete("/contact-messages/:id", removeContactMessage);

export default router;
