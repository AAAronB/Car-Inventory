# Insert data into the tables

USE CarInventory;

INSERT INTO Dealers (Name, Contact, Location) VALUES
('AutoNation', '0712345678', '123 Main St, Springfield'),
('CarMax', '0723457890', '456 Elm St, Springfield'),
('Budget Cars', '0756789012', '789 Oak St, Springfield');

INSERT INTO Cars (Make, Model, Color, Price, `Condition`, DealerID) VALUES
('Toyota', 'Camry', 'White', 24000.00, 'Used', 1),
('Honda', 'Civic', 'Blue', 28000.00, 'New', 2),
('Ford', 'F-150', 'Black', 35000.00, 'Used', 3),
('Tesla', 'Model 3', 'Red', 55000.00, 'New', 1),
('Chevrolet', 'Malibu', 'Silver', 18000.00, 'Certified', 2);

INSERT INTO MaintenanceRecords (CarID, ServiceDate, ServiceDetails, Cost) VALUES
(1, '2024-01-10', 'Oil change and tire rotation', 120.00),
(2, '2024-01-15', 'Battery replacement', 200.00),
(3, '2023-12-05', 'Brake pad replacement', 300.00),
(3, '2023-11-01', 'Transmission fluid change', 150.00),
(5, '2023-10-10', 'Air filter and spark plugs', 100.00);

SELECT * FROM Cars;
SELECT * FROM MaintenanceRecords WHERE CarID = 3;
