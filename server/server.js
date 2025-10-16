import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import promotionRoutes from "./routes/promotions.js";

dotenv.config();

const app = express();

app.use(cors());

// 🚀 Increase payload size limit to handle larger image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Example test route
app.get("/test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/promotions", promotionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
