-- =========================
-- Table: admin_users
-- =========================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','staff') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Table: categories
-- =========================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(50),
    name_am VARCHAR(50),
    name_or VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Table: menu_items
-- =========================
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name_en VARCHAR(100),
    name_am VARCHAR(100),
    name_or VARCHAR(100),
    description_en TEXT,
    description_am TEXT,
    description_or TEXT,
    price DECIMAL(10,2),
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_special BOOLEAN DEFAULT FALSE,
    discount DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================
-- Table: promotions
-- =========================
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT,
    start_date DATE,
    end_date DATE,
    discount_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- =========================
-- Table: settings
-- =========================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    about_en TEXT,
    about_am TEXT,
    about_or TEXT,
    phone VARCHAR(50),
    address VARCHAR(255),
    working_hours VARCHAR(100),
    social_links TEXT
);

-- =========================
-- Table: reservations
-- =========================
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(50),
    date DATE,
    time TIME,
    guests INT,
    status ENUM('pending','confirmed','cancel') DEFAULT 'pending'
);

-- =========================
-- Sample Data: admin_users
-- =========================
INSERT INTO admin_users (username, password, role) VALUES
('admin','hashed_password_here','admin');

-- =========================
-- Sample Data: categories
-- =========================
INSERT INTO categories (name_en, name_am, name_or) VALUES
('Pizza','ፒዛ','Pizaa'),
('Drinks','መጠጥ','Dhuga');

-- =========================
-- Sample Data: menu_items
-- =========================
INSERT INTO menu_items 
(category_id, name_en, name_am, name_or, description_en, price, is_available, is_special, discount)
VALUES
(1,'Margherita Pizza','ማርጌሪታ ፒዛ','Margherita Pizaa','Classic cheese pizza',10.00,TRUE,FALSE,0.00),
(2,'Coca Cola','ኮካ ኮላ','Coca Cola','Refreshing soft drink',2.50,TRUE,TRUE,10.00);

-- =========================
-- Sample Data: promotions
-- =========================
INSERT INTO promotions (food_id, start_date, end_date, discount_percentage) VALUES
(2,'2025-10-11','2025-10-20',10.00);

-- =========================
-- Sample Data: settings
-- =========================
INSERT INTO settings 
(about_en, about_am, about_or, phone, address, working_hours, social_links)
VALUES
(
'Best local pizza in town!',
'በከተማ ውስጥ ምርጥ ፒዛ!',
'Magariitii pizza biyya keessatti!',
'+251912345678',
'Jimma, Ethiopia',
'10:00-22:00',
'{"facebook":"https://fb.com/restaurant","instagram":"https://instagram.com/restaurant"}'
);
