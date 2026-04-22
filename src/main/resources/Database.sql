DROP DATABASE IF EXISTS customerproductmgmtdb;
CREATE DATABASE customerproductmgmtdb;
USE customerproductmgmtdb;

-- =========================
-- CUSTOMER TABLE
-- =========================
DROP TABLE IF EXISTS customer;
CREATE TABLE IF NOT EXISTS customer (
  customer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(45) NOT NULL,
  customer_email VARCHAR(45) NOT NULL,
  customer_type ENUM('Silver','Gold','Platinum') NOT NULL,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uk_customer_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =========================
-- PRODUCT TABLE
-- =========================
DROP TABLE IF EXISTS product;
CREATE TABLE IF NOT EXISTS product (
  product_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  PRIMARY KEY (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =========================
-- ORDER TABLE
-- =========================
DROP TABLE IF EXISTS cust_order;
CREATE TABLE IF NOT EXISTS cust_order (
  order_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  billing_amount DECIMAL(10,2) NOT NULL,
  customer_id INT UNSIGNED NOT NULL,
  order_date DATE NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id),

  CONSTRAINT fk_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer(customer_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_product
    FOREIGN KEY (product_id)
    REFERENCES product(product_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =========================
-- CUSTOMER DATA
-- =========================
INSERT INTO customer (customer_id, customer_name, customer_email, customer_type) VALUES
(1, 'John Doe', 'johndoe@gmail.com', 'Platinum'),
(2, 'Jane Smith', 'janesmith@gmail.com', 'Platinum'),
(3, 'Robert Brown', 'robertbrown@gmail.com', 'Platinum'),
(4, 'Emily Johnson', 'emilyjohnson@gmail.com', 'Gold'),
(5, 'Michael Wilson', 'michaelwilson@gmail.com', 'Silver');

-- =========================
-- PRODUCT DATA
-- =========================
INSERT INTO product (product_id, product_name, price, stock) VALUES
(1, 'Wireless Mouse', 24.99, 40),
(2, 'Bluetooth Keyboard', 79.99, 4),
(3, 'USB-C Hub', 15.50, 20),
(4, 'Laptop Stand', 45.00, 15),
(5, 'External Hard Drive', 60.75, 5);

-- =========================
-- ORDER DATA (FIXED VALUES)
-- =========================
INSERT INTO cust_order (order_id, billing_amount, customer_id, order_date, product_id, quantity) VALUES
(1, 49.98, 1, '2024-11-01', 1, 2),
(2, 79.99, 2, '2024-11-02', 2, 1),
(3, 15.50, 3, '2024-11-03', 3, 1),
(4, 45.00, 4, '2024-11-04', 4, 1),
(5, 60.75, 5, '2024-11-05', 5, 1);

COMMIT;