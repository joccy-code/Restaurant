import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const [rows] = await db.query(
      "SELECT * FROM admin_users WHERE username = ?",
      [username]
    );
    if (rows.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });

    const admin = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });

    // Generate JWT token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Register (for initial setup)
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    const [result] = await db.query(
      "INSERT INTO admin_users(username, password) VALUES(?, ?)",
      [username, hashedPassword]
    );

    res.json({
      success: true,
      message: "Admin created",
      adminId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
