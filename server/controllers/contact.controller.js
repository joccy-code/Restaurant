import { db } from "../db.js";

// 📩 POST /api/contact
export const createContactMessage = async (req, res) => {
  try {
    console.log("📥 Incoming message:", req.body);

    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const sql = `
      INSERT INTO contact_messages (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [name, email, phone || null, message], (err, result) => {
      if (err) {
        console.error("❌ MySQL Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("✅ Message saved with ID:", result.insertId);
      return res
        .status(201)
        .json({ message: "Your message has been sent successfully!" });
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📬 GET /api/contact-messages
export const getContactMessages = (req, res) => {
  const sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(rows);
  });
};

// 🗑 DELETE /api/contact-messages/:id
export const removeContactMessage = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM contact_messages WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Message deleted successfully." });
  });
};
