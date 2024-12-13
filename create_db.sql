# Create database script for Tech Shop Products

# Create the database
CREATE DATABASE IF NOT EXISTS tech_shop_products;
USE tech_shop_products;

# Create the tables
CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT, model VARCHAR(50), type_of_device VARCHAR(30), price DECIMAL(5, 2) unsigned, PRIMARY KEY(id));
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT, first_name VARCHAR(50), last_name VARCHAR(50), username VARCHAR(20), 
password VARCHAR(20), email VARCHAR(50), hashedPassword VARCHAR(100), PRIMARY KEY(id));
# Create the app user
CREATE USER IF NOT EXISTS 'tech_shop_products_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON tech_shop_products.* TO ' tech_shop_products_app'@'localhost';
