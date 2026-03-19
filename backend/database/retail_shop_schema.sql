-- Retail Shop Management System
-- MySQL 8+ schema and seed data
-- Import with:
--   mysql -u root -p < backend/database/retail_shop_schema.sql

DROP DATABASE IF EXISTS retail_shop_management;
CREATE DATABASE retail_shop_management;
USE retail_shop_management;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS stock_history;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS shop_profile;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE shop_profile (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  shop_name VARCHAR(150) NOT NULL,
  gstin VARCHAR(32),
  address_line TEXT,
  phone VARCHAR(30),
  email VARCHAR(120),
  currency_code CHAR(3) NOT NULL DEFAULT 'INR',
  gst_default_rate DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  sku VARCHAR(40) UNIQUE,
  product_name VARCHAR(150) NOT NULL,
  unit ENUM('kg', 'liter', 'unit', 'packet') NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  current_stock DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  opening_stock DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  low_stock_threshold DECIMAL(12,2) NOT NULL DEFAULT 10.00,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE price_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  changed_by BIGINT NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes VARCHAR(255),
  CONSTRAINT fk_price_history_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_price_history_user FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE sales (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(120),
  billed_by BIGINT NULL,
  sale_datetime DATETIME NOT NULL,
  gst_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  subtotal DECIMAL(12,2) NOT NULL,
  gst_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('cash', 'upi', 'card', 'credit') NOT NULL DEFAULT 'cash',
  notes VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_user FOREIGN KEY (billed_by) REFERENCES users(id)
);

CREATE TABLE sale_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sale_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  unit ENUM('kg', 'liter', 'unit', 'packet') NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  price_used DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE stock_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  stock_date DATETIME NOT NULL,
  opening_stock DECIMAL(12,2) NOT NULL,
  received_stock DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  sold_stock DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  closing_stock DECIMAL(12,2) NOT NULL,
  entry_type ENUM('refill', 'sale', 'adjustment') NOT NULL DEFAULT 'refill',
  reference_sale_id BIGINT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stock_history_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_stock_history_sale FOREIGN KEY (reference_sale_id) REFERENCES sales(id)
);

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  notification_type ENUM('info', 'warning', 'error') NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  related_product_id BIGINT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_product FOREIGN KEY (related_product_id) REFERENCES products(id)
);

CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_sales_datetime ON sales(sale_datetime);
CREATE INDEX idx_sales_customer ON sales(customer_name);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_stock_history_product_date ON stock_history(product_id, stock_date);
CREATE INDEX idx_price_history_product_date ON price_history(product_id, changed_at);

INSERT INTO shop_profile (id, shop_name, gstin, address_line, phone, email, currency_code, gst_default_rate)
VALUES
  (1, 'Annapoorna Retail Mart', '33ABCDE1234F1Z5', '12 Market Street, Coimbatore, Tamil Nadu', '+91-9876543210', 'shop@example.com', 'INR', 5.00);

INSERT INTO users (id, full_name, username, password_hash, role, is_active)
VALUES
  (1, 'Admin User', 'admin', 'admin123', 'admin', TRUE),
  (2, 'Staff User', 'staff', 'staff123', 'staff', TRUE);

INSERT INTO categories (id, name, description)
VALUES
  (1, 'Oil', 'Edible oils and liquid stock items'),
  (2, 'Groceries', 'Daily grocery stock items');

INSERT INTO products (
  id, category_id, sku, product_name, unit, current_price, current_stock, opening_stock, low_stock_threshold, image_url, is_active
)
VALUES
  (1, 1, 'OIL-001', 'Groundnut Oil', 'liter', 182.00, 72.00, 90.00, 20.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', TRUE),
  (2, 1, 'OIL-002', 'Sunflower Oil', 'liter', 168.00, 48.00, 60.00, 18.00, 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=80', TRUE),
  (3, 2, 'GRO-001', 'Raw Rice', 'kg', 58.00, 140.00, 200.00, 40.00, NULL, TRUE),
  (4, 2, 'GRO-002', 'Toor Dal', 'kg', 122.00, 34.00, 60.00, 15.00, NULL, TRUE),
  (5, 2, 'GRO-003', 'Sugar', 'kg', 46.00, 65.00, 90.00, 20.00, NULL, TRUE),
  (6, 2, 'GRO-004', 'Wheat Flour', 'kg', 42.00, 54.00, 75.00, 20.00, NULL, TRUE);

INSERT INTO price_history (id, product_id, old_price, new_price, changed_by, changed_at, notes)
VALUES
  (1, 1, 175.00, 182.00, 1, '2026-03-05 09:00:00', 'Supplier price increased'),
  (2, 2, 172.00, 168.00, 1, '2026-03-12 09:00:00', 'Promotional adjustment'),
  (3, 4, 118.00, 122.00, 1, '2026-03-14 09:00:00', 'Updated based on market rate');

INSERT INTO sales (
  id, invoice_number, customer_name, billed_by, sale_datetime, gst_enabled, subtotal, gst_amount, total_amount, payment_method, notes
)
VALUES
  (1, 'INV-1001', 'Manikandan', 2, '2026-03-19 10:30:00', TRUE, 1256.00, 62.80, 1318.80, 'cash', 'Morning retail invoice'),
  (2, 'INV-1002', NULL, 2, '2026-03-18 16:15:00', FALSE, 986.00, 0.00, 986.00, 'upi', 'Walk-in customer'),
  (3, 'INV-1003', 'Lakshmi Stores', 1, '2026-03-15 11:45:00', TRUE, 2169.00, 108.50, 2277.50, 'credit', 'Wholesale style billing');

INSERT INTO sale_items (sale_id, product_id, product_name, unit, quantity, price_used, line_total)
VALUES
  (1, 1, 'Groundnut Oil', 'liter', 4.00, 182.00, 728.00),
  (1, 4, 'Toor Dal', 'kg', 2.00, 122.00, 244.00),
  (1, 5, 'Sugar', 'kg', 6.20, 46.00, 285.20),

  (2, 3, 'Raw Rice', 'kg', 10.00, 58.00, 580.00),
  (2, 6, 'Wheat Flour', 'kg', 7.00, 42.00, 294.00),
  (2, 2, 'Sunflower Oil', 'liter', 1.00, 168.00, 168.00),

  (3, 1, 'Groundnut Oil', 'liter', 5.00, 182.00, 910.00),
  (3, 3, 'Raw Rice', 'kg', 15.00, 58.00, 870.00),
  (3, 4, 'Toor Dal', 'kg', 3.00, 122.00, 366.00),
  (3, 5, 'Sugar', 'kg', 0.50, 46.00, 23.00);

INSERT INTO stock_history (
  id, product_id, stock_date, opening_stock, received_stock, sold_stock, closing_stock, entry_type, reference_sale_id, notes
)
VALUES
  (1, 1, '2026-03-13 08:00:00', 60.00, 30.00, 18.00, 72.00, 'refill', NULL, 'Weekly refill entry'),
  (2, 2, '2026-03-13 08:00:00', 40.00, 20.00, 12.00, 48.00, 'refill', NULL, 'Weekly refill entry'),
  (3, 3, '2026-03-14 08:00:00', 150.00, 50.00, 60.00, 140.00, 'refill', NULL, 'Weekly refill entry'),
  (4, 4, '2026-03-16 08:00:00', 22.00, 20.00, 8.00, 34.00, 'refill', NULL, 'Weekly refill entry'),
  (5, 1, '2026-03-19 10:30:00', 76.00, 0.00, 4.00, 72.00, 'sale', 1, 'Stock deducted from invoice INV-1001'),
  (6, 4, '2026-03-19 10:30:00', 36.00, 0.00, 2.00, 34.00, 'sale', 1, 'Stock deducted from invoice INV-1001'),
  (7, 5, '2026-03-19 10:30:00', 71.20, 0.00, 6.20, 65.00, 'sale', 1, 'Stock deducted from invoice INV-1001');

INSERT INTO notifications (id, notification_type, message, related_product_id, is_read, created_at)
VALUES
  (1, 'warning', 'Toor Dal is below refill threshold.', 4, FALSE, '2026-03-19 09:00:00'),
  (2, 'info', 'Weekly refill due tomorrow for oil section.', NULL, FALSE, '2026-03-19 09:30:00');

CREATE OR REPLACE VIEW vw_current_stock_report AS
SELECT
  p.id AS product_id,
  p.product_name,
  c.name AS category_name,
  p.unit,
  p.opening_stock,
  p.current_stock,
  p.current_price,
  (p.current_stock * p.current_price) AS stock_value,
  p.low_stock_threshold,
  CASE
    WHEN p.current_stock <= p.low_stock_threshold THEN 'LOW'
    ELSE 'OK'
  END AS stock_status
FROM products p
JOIN categories c ON c.id = p.category_id;

CREATE OR REPLACE VIEW vw_sales_summary AS
SELECT
  DATE(s.sale_datetime) AS sale_date,
  COUNT(DISTINCT s.id) AS invoice_count,
  SUM(s.subtotal) AS subtotal_amount,
  SUM(s.gst_amount) AS gst_amount,
  SUM(s.total_amount) AS total_sales
FROM sales s
GROUP BY DATE(s.sale_datetime)
ORDER BY sale_date DESC;
