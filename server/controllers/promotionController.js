import { db } from "../db.js";

// Get all promotions (special menu items)
// export const getAllPromotions = async (req, res) => {
//   try {
//     const lang = req.query.lang || "en"; // selected language ex: lang=en

//     const columns = [
//       `m.id`,
//       `m.name_${lang} AS name`,
//       `m.description_${lang} AS description`,
//       `m.price`,
//       `c.name_${lang} AS category`,
//       `m.image`,
//       `m.is_special`,
//       `m.discount`,
//     ].join(", ");

//     const [rows] = await db.query(
//       `SELECT ${columns}
//        FROM menu_items m
//        LEFT JOIN categories c ON m.category_id = c.id
//        WHERE m.is_special = 1`
//     );

//     res.json({ success: true, promotions: rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// Get all promotions (with menu item info)
export const getAllPromotions = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const [rows] = await db.query(
      `SELECT 
         p.food_id,
         p.discount_percentage AS discount,
         p.start_date,
         p.end_date,
         m.id AS menu_id,
         m.name_${lang} AS name,
         m.price,
         m.is_special
       FROM promotions p
       JOIN menu_items m ON p.food_id = m.id
       ORDER BY p.start_date DESC`
    );

    // Map to frontend-friendly format
    const promotions = rows.map((row) => ({
      food_id: row.food_id,
      discount: row.discount,
      start_date: row.start_date,
      end_date: row.end_date,
      menu_item: {
        id: row.menu_id,
        name_en: row.name,
        price: row.price,
        is_special: row.is_special,
      },
    }));

    res.json({ success: true, promotions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add promotion
export const addPromotion = async (req, res) => {
  try {
    const { menu_id, discount, start_date, end_date } = req.body;

    // Validation
    if (!menu_id || discount === undefined || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "menu_id, discount, start_date, and end_date are required",
      });
    }

    const discountValue = Number(discount);

    // 1️⃣ Update the menu item
    const [updateResult] = await db.query(
      "UPDATE menu_items SET is_special = 1, discount = ? WHERE id = ?",
      [discountValue, menu_id]
    );

    if (updateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // 2️⃣ Insert into promotions table
    await db.query(
      "INSERT INTO promotions (food_id, start_date, end_date, discount_percentage) VALUES (?, ?, ?, ?)",
      [menu_id, start_date, end_date, discountValue]
    );

    res.json({ success: true, message: "Promotion added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//update promotion
export const updatePromotion = async (req, res) => {
  try {
    const { menu_id } = req.params;
    const { discount, start_date, end_date } = req.body;

    // 1️⃣ Validate input
    if (!menu_id || discount === undefined || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "menu_id, discount, start_date, and end_date are required",
      });
    }

    const discountValue = Number(discount);

    // 2️⃣ Check if the promotion exists
    const [existing] = await db.query(
      "SELECT * FROM promotions WHERE food_id = ?",
      [menu_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found for this menu item",
      });
    }

    // 3️⃣ Update the promotions table
    await db.query(
      "UPDATE promotions SET discount_percentage = ?, start_date = ?, end_date = ? WHERE food_id = ?",
      [discountValue, start_date, end_date, menu_id]
    );

    // 4️⃣ Update the menu_items table (is_special and discount)
    await db.query(
      "UPDATE menu_items SET is_special = 1, discount = ? WHERE id = ?",
      [discountValue, menu_id]
    );

    res.json({
      success: true,
      message: "Promotion updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove promotion
export const removePromotion = async (req, res) => {
  try {
    const { menu_id } = req.params;

    if (!menu_id) {
      return res
        .status(400)
        .json({ success: false, message: "menu_id is required" });
    }

    // 1️⃣ Delete the promotion from the promotions table
    const [deleteResult] = await db.query(
      "DELETE FROM promotions WHERE food_id = ?",
      [menu_id]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found for this menu item",
      });
    }

    // 2️⃣ Update the menu item to remove the special flag and reset discount
    await db.query(
      "UPDATE menu_items SET is_special = 0, discount = 0 WHERE id = ?",
      [menu_id]
    );

    res.json({ success: true, message: "Promotion removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
