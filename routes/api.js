const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

// GET /api/cars - Get all cars
router.get('/cars', (req, res) => {
    const sqlquery = "SELECT c.*, d.Name as DealerName, d.Location as DealerLocation FROM Cars c LEFT JOIN Dealers d ON c.DealerID = d.DealerID";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// GET /api/cars/:id - Get car by ID
router.get('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const sqlquery = "SELECT c.*, d.Name as DealerName, d.Location as DealerLocation FROM Cars c LEFT JOIN Dealers d ON c.DealerID = d.DealerID WHERE c.CarID = ?";
    
    db.query(sqlquery, [carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json({ success: true, data: result[0] });
    });
});

// POST /api/cars - Add new car
router.post('/cars', [
    check('Make').notEmpty().withMessage('Make is required'),
    check('Model').notEmpty().withMessage('Model is required'),
    check('Price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    check('DealerID').isInt({ min: 1 }).withMessage('Valid DealerID is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { Make, Model, Color, Price, Condition, DealerID } = req.body;
    const sqlquery = "INSERT INTO Cars (Make, Model, Color, Price, `Condition`, DealerID) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sqlquery, [Make, Model, Color, Price, Condition, DealerID], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Car added successfully',
            carId: result.insertId 
        });
    });
});

// PUT /api/cars/:id - Update car
router.put('/cars/:id', [
    check('Make').notEmpty().withMessage('Make is required'),
    check('Model').notEmpty().withMessage('Model is required'),
    check('Price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const carId = req.params.id;
    const { Make, Model, Color, Price, Condition, DealerID } = req.body;
    const sqlquery = "UPDATE Cars SET Make = ?, Model = ?, Color = ?, Price = ?, `Condition` = ?, DealerID = ? WHERE CarID = ?";
    
    db.query(sqlquery, [Make, Model, Color, Price, Condition, DealerID, carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json({ success: true, message: 'Car updated successfully' });
    });
});

// DELETE /api/cars/:id - Delete car
router.delete('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const sqlquery = "DELETE FROM Cars WHERE CarID = ?";
    
    db.query(sqlquery, [carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json({ success: true, message: 'Car deleted successfully' });
    });
});

// GET /api/dealers - Get all dealers
router.get('/dealers', (req, res) => {
    const sqlquery = "SELECT * FROM Dealers";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// POST /api/dealers - Add new dealer
router.post('/dealers', [
    check('Name').notEmpty().withMessage('Dealer name is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { Name, Contact, Location } = req.body;
    const sqlquery = "INSERT INTO Dealers (Name, Contact, Location) VALUES (?, ?, ?)";
    
    db.query(sqlquery, [Name, Contact, Location], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Dealer added successfully',
            dealerId: result.insertId 
        });
    });
});

// GET /api/maintenance - Get maintenance records
router.get('/maintenance', (req, res) => {
    const sqlquery = "SELECT m.*, c.Make, c.Model FROM MaintenanceRecords m LEFT JOIN Cars c ON m.CarID = c.CarID";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// GET /api/maintenance/:carId - Get maintenance records for specific car
router.get('/maintenance/:carId', (req, res) => {
    const carId = req.params.carId;
    const sqlquery = "SELECT m.*, c.Make, c.Model FROM MaintenanceRecords m LEFT JOIN Cars c ON m.CarID = c.CarID WHERE m.CarID = ?";
    
    db.query(sqlquery, [carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// POST /api/maintenance - Add maintenance record
router.post('/maintenance', [
    check('CarID').isInt({ min: 1 }).withMessage('Valid CarID is required'),
    check('ServiceDate').isDate().withMessage('Valid service date is required'),
    check('ServiceDetails').notEmpty().withMessage('Service details are required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { CarID, ServiceDate, ServiceDetails, Cost } = req.body;
    const sqlquery = "INSERT INTO MaintenanceRecords (CarID, ServiceDate, ServiceDetails, Cost) VALUES (?, ?, ?, ?)";
    
    db.query(sqlquery, [CarID, ServiceDate, ServiceDetails, Cost], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Maintenance record added successfully',
            recordId: result.insertId 
        });
    });
});

// GET /api/users - Get all users
router.get('/users', (req, res) => {
    const sqlquery = "SELECT UserID, FirstName, LastName, Username, Email FROM Users";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// GET /api/search/cars - Search cars by make, model, or condition
router.get('/search/cars', (req, res) => {
    const { make, model, condition, minPrice, maxPrice } = req.query;
    let sqlquery = "SELECT c.*, d.Name as DealerName FROM Cars c LEFT JOIN Dealers d ON c.DealerID = d.DealerID WHERE 1=1";
    const params = [];

    if (make) {
        sqlquery += " AND c.Make LIKE ?";
        params.push(`%${make}%`);
    }
    if (model) {
        sqlquery += " AND c.Model LIKE ?";
        params.push(`%${model}%`);
    }
    if (condition) {
        sqlquery += " AND c.Condition = ?";
        params.push(condition);
    }
    if (minPrice) {
        sqlquery += " AND c.Price >= ?";
        params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
        sqlquery += " AND c.Price <= ?";
        params.push(parseFloat(maxPrice));
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true, data: result, count: result.length });
    });
});

// GET /api/stats - Get basic statistics
router.get('/stats', (req, res) => {
    const queries = {
        totalCars: "SELECT COUNT(*) as count FROM Cars",
        totalDealers: "SELECT COUNT(*) as count FROM Dealers",
        totalMaintenance: "SELECT COUNT(*) as count FROM MaintenanceRecords",
        avgPrice: "SELECT AVG(Price) as avgPrice FROM Cars",
        carsByCondition: "SELECT `Condition`, COUNT(*) as count FROM Cars GROUP BY `Condition`"
    };

    const results = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;

    Object.keys(queries).forEach(key => {
        db.query(queries[key], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            results[key] = result[0];
            completed++;
            
            if (completed === totalQueries) {
                res.json({ success: true, data: results });
            }
        });
    });
});

module.exports = router;