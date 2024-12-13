const express = require("express")
const router = express.Router()
const request = require('request')

router.get('/products', function (req, res, next) {
    const searchTerm = req.query.search_term; // Extract search term from query parameters

    // Base SQL query to get all products
    let sqlquery = "SELECT * FROM products";

    // Modify SQL query if a search term is provided
    if (searchTerm) {
        sqlquery += " WHERE name LIKE ?";
    }

    // Execute the SQL query
    db.query(sqlquery, searchTerm ? [`%${searchTerm}%`] : [], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Database query failed' });
            return next(err);
        }
        res.json(result); // Return filtered or all results
    });
});

module.exports = router;