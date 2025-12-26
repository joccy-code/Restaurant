// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create connection
export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

console.log("✅ Connected to MySQL Database");
