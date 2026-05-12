-- CREATE DATABASE pesancafe_db;
-- USE pesancafe_db;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `payment_type` ENUM('cash', 'qris', 'debit') NOT NULL DEFAULT 'cash',
  `payment_amount` DECIMAL(10, 2) NOT NULL,
  `change_amount` DECIMAL(10, 2) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Table: transaction_items
CREATE TABLE IF NOT EXISTS `transaction_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `menu_id` INT NOT NULL,
  `qty` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE CASCADE
);

-- DUMMY DATA FOR TESTING
-- Default Admin (Password is 'admin123' - plain text for simplicity here, although usually it should be hashed)
INSERT INTO `users` (`username`, `password`, `role`) VALUES 
('admin', 'admin123', 'admin'),
('kasir1', 'kasir123', 'kasir');

-- Default Menu Items
INSERT INTO `menu` (`name`, `category`, `price`, `description`, `is_active`) VALUES
('Espresso', 'Coffee', 15000.00, 'Kopi hitam pekat', TRUE),
('Cappuccino', 'Coffee', 25000.00, 'Kopi dengan busa susu', TRUE),
('Latte', 'Coffee', 28000.00, 'Kopi susu lembut', TRUE),
('Nasi Goreng Spesial', 'Food', 35000.00, 'Nasi goreng dengan telur dan ayam', TRUE),
('French Fries', 'Snack', 18000.00, 'Kentang goreng renyah', TRUE);
