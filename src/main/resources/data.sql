INSERT IGNORE INTO customer (customer_id, customer_name, customer_email, customer_type) VALUES
(1, 'John Doe', 'johndoe@gmail.com', 'Platinum'),
(2, 'Jane Smith', 'janesmith@gmail.com', 'Platinum'),
(3, 'Robert Brown', 'robertbrown@gmail.com', 'Platinum'),
(4, 'Emily Johnson', 'emilyjohnson@gmail.com', 'Gold'),
(5, 'Michael Wilson', 'michaelwilson@gmail.com', 'Silver');

INSERT IGNORE INTO product (product_id, product_name, price, stock) VALUES
(1, 'Wireless Mouse', 24.99, 40),
(2, 'Bluetooth Keyboard', 79.99, 4),
(3, 'USB-C Hub', 15.50, 20),
(4, 'Laptop Stand', 45.00, 15),
(5, 'External Hard Drive', 60.75, 5);

INSERT IGNORE INTO cust_order (order_id, billing_amount, customer_id, order_date, product_id, quantity) VALUES
(1, 49.98, 1, '2024-11-01', 1, 2),
(2, 79.99, 2, '2024-11-02', 2, 1),
(3, 15.50, 3, '2024-11-03', 3, 1),
(4, 45.00, 4, '2024-11-04', 4, 1),
(5, 60.75, 5, '2024-11-05', 5, 1);
