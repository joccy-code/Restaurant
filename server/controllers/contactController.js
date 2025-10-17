import { saveContactMessage, getAllContactMessages, deleteContactMessage } from "../models/contact.model.js";

// 📩 POST /api/contact
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    await saveContactMessage(name, email, phone || null, message);
    res.status(201).json({ message: "Your message has been sent successfully." });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 📬 GET /api/contact (Admin only)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await getAllContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🗑 DELETE /api/contact/:id (Admin only)
export const removeContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContactMessage(id);
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: "Server error" });
  }
};
