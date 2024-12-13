const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', [
    check('search_text').notEmpty()
], function (req, res, next) {
    // Check for validation errors
    const search_result = req.sanitize(req.query.search_text);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are validation errors, redirect to the search page
        return res.redirect('./search'); // Redirect back to the search page
    }

    // If valid, proceed to search the database
    let sqlquery = "SELECT * FROM products WHERE type_of_device LIKE ?";
    db.query(sqlquery, [`%${search_result}%`], (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { available_products: result });
    })
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM products" // query database to get all the products
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {available_products:result})
     })
})

router.get('/add_product', function (req, res, next) {
    res.render('add_product.ejs')
})

router.post('/product_added', [
    // Validate that the product model is not empty
    check('model').notEmpty(),
    // Validate that the product type is not empty
    check('type').notEmpty(),
    // Validate that the price is not empty and is a valid number
    check('price').notEmpty().isNumeric()
], function (req, res, next) {
    // Checking for validation errors
    const model = req.sanitize(req.body.model);
    const type = req.sanitize(req.body.type);
    const price = req.sanitize(req.body.price);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./add_product')
    } else {
        // Saving data in database
        let sqlquery = "INSERT INTO products (model, type_of_device, price) VALUES (?, ?, ?)";
        let newrecord = [model, type, price];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
        res.send('This product is added to the database, model: ' + model + ' type of device: ' + type + ' price: ' + price);
        })
    }
})

router.get('/bargain_products', function(req, res, next) {
    let sqlquery = "SELECT * FROM products WHERE price < 200"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {available_products:result})
    })
}) 
// Export the router object so index.js can access it
module.exports = router