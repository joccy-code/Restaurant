import express from "express";
import {
  getAllPromotions,
  addPromotion,
  removePromotion,
  updatePromotion, // ✅ import the new function
} from "../controllers/promotionController.js";

const router = express.Router();

// GET all current promotions, e.g., /api/promotions?lang=en
router.get("/", getAllPromotions);

// POST add a promotion
router.post("/", addPromotion);

// PUT update a promotion by menu_id
router.put("/:menu_id", updatePromotion); // ✅ new route

// DELETE remove a promotion by menu_id
router.delete("/:menu_id", removePromotion);

export default router;
