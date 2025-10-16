import { db } from "../db.js";

// Get all menu items (language support)
export const getAllMenuItems = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // en, am, or or

    const columns = [
      `m.id`,
      `m.name_${lang} AS name`,
      `m.description_${lang} AS description`,
      `m.price`,
      `c.name_${lang} AS category`,
      `m.image`,
      `m.is_available`,
      `m.is_special`,
      `m.discount`,
    ].join(", ");

    const [rows] = await db.query(
      `SELECT ${columns} 
       FROM menu_items m 
       LEFT JOIN categories c ON m.category_id = c.id`
    );

    res.json({ success: true, menu: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en";

    const columns = [
      `m.id`,
      `m.name_${lang} AS name`,
      `m.description_${lang} AS description`,
      `m.price`,
      `c.name_${lang} AS category`,
      `m.image`,
      `m.is_available`,
      `m.is_special`,
      `m.discount`,
    ].join(", ");

    // const [rows] = await db.query(
    //   `SELECT ${columns}
    //    FROM menu_items m
    //    LEFT JOIN categories c ON m.category_id = c.id
    //    WHERE m.id = ?`,
    //   [id]
    // );

    // Instead of selecting dynamically based on lang
    const [rows] = await db.query(
      `SELECT m.id, m.name_en, m.name_am, m.name_or, 
          m.description_en, m.description_am, m.description_or,
          m.price, m.category_id, m.image, 
          m.is_available, m.is_special, m.discount
   FROM menu_items m
   WHERE m.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Menu item not found" });

    res.json({ success: true, menuItem: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const {
      name_en,
      name_am,
      name_or,
      description_en,
      description_am,
      description_or,
      price,
      category_id,
      image,
      is_available,
      is_special,
      discount,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO menu_items 
  (name_en, name_am, name_or, description_en, description_am, description_or, price, category_id, image, is_available, is_special, discount) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name_en,
        name_am,
        name_or,
        description_en,
        description_am,
        description_or,
        price,
        category_id, // ⚠️ This should actually be the ID of the category, not its name
        image,
        is_available,
        is_special,
        discount,
      ]
    );

    res.json({
      success: true,
      message: "Menu item created",
      menuId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    // Allowed fields to update
    const allowedFields = [
      "name_en",
      "name_am",
      "name_or",
      "description_en",
      "description_am",
      "description_or",
      "price",
      "category_id",
      "image",
      "is_available",
      "is_special",
      "discount",
    ];

    // Filter only valid fields
    const filteredFields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(filteredFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    const setString = Object.keys(filteredFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(filteredFields);

    const [result] = await db.query(
      `UPDATE menu_items SET ${setString} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM menu_items WHERE id = ?", [id]);
    res.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
