-- Migration script to update Condition field to ENUM
-- Run this script if you have an existing database with VARCHAR Condition field

USE CarInventory;

-- First, update any existing data to use lowercase values
UPDATE Cars SET `Condition` = LOWER(`Condition`) WHERE `Condition` IS NOT NULL;

-- Update any non-standard values to 'used' as default
UPDATE Cars SET `Condition` = 'used' WHERE `Condition` NOT IN ('new', 'used', 'certified') OR `Condition` IS NULL;

-- Alter the table to change Condition from VARCHAR to ENUM
ALTER TABLE Cars MODIFY COLUMN `Condition` ENUM('used', 'new', 'certified');

-- Verify the changes
SELECT CarID, Make, Model, `Condition` FROM Cars; 