-- Migration: change menu_items.image from VARCHAR(255) to TEXT
-- Run this against your `restaurant_db` database, for example:
-- mysql -u <user> -p restaurant_db < alter_image_to_text.sql

ALTER TABLE menu_items MODIFY COLUMN image TEXT;

