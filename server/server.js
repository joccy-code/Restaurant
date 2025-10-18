import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import promotionRoutes from "./routes/promotions.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🧪 Test route
app.get("/test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// 🔹 Debug all requests
app.use((req, res, next) => {
  console.log("📌 Incoming request:", req.method, req.url);
  next();
});

// 🚀 Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api", contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
