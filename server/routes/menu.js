import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";

const router = express.Router();

// GET all menu items, e.g., /api/menu?lang=en
router.get("/", getAllMenuItems);

// GET single menu item, e.g., /api/menu/:id?lang=am
router.get("/:id", getMenuItemById);

// Admin routes
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
