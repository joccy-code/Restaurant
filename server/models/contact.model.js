import {db} from "../db.js";

export const saveContactMessage = (name, email, phone, message) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, message], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getAllContactMessages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const deleteContactMessage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM contact_messages WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
