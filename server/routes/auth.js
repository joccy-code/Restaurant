import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/register (optional, only for first setup)
router.post("/register", register);

export default router;
