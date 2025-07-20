-- Create the database
CREATE DATABASE CarInventory;

-- Use the database
USE CarInventory;

-- Table: Cars
CREATE TABLE Cars (
    CarID INT AUTO_INCREMENT PRIMARY KEY,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Color VARCHAR(20),
    Price DECIMAL(10, 2) CHECK (Price >= 0),
    `Condition` ENUM('used', 'new', 'certified'),
    DealerID INT NOT NULL,
    INDEX idx_make_model (Make, Model),
    FOREIGN KEY (DealerID) REFERENCES Dealers(DealerID) ON DELETE CASCADE
);

-- Table: MaintenanceRecords
CREATE TABLE MaintenanceRecords (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    CarID INT NOT NULL,
    ServiceDate DATE NOT NULL,
    ServiceDetails TEXT,
    Cost DECIMAL(10, 2),
    FOREIGN KEY (CarID) REFERENCES Cars(CarID) ON DELETE CASCADE
);

-- Table: Dealers
CREATE TABLE Dealers (
    DealerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(50),
    Location VARCHAR(255)
);

-- Table: Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(20) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    HashedPassword VARCHAR(255) NOT NULL,
    INDEX idx_username (Username)
);

-- Create the application user
CREATE USER IF NOT EXISTS 'car_inventory_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON CarInventory.* TO 'car_inventory_app'@'localhost';
