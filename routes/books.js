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
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    db.query(sqlquery, [`%${search_result}%`], (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { availableBooks: result });
    })
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     })
})

router.get('/addbook', function (req, res, next) {
    res.render('addbook.ejs')
})

router.post('/bookadded', [
    // Validate that the book name is not empty
    check('name').notEmpty(),
    // Validate that the price is not empty and is a valid number
    check('price').notEmpty().isNumeric()
], function (req, res, next) {
    // Checking for validation errors
    const name = req.sanitize(req.body.name);
    const price = req.sanitize(req.body.price);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./addbook')
    } else {
        // Saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
        let newrecord = [name, price];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
        res.send('This book is added to the database, name: ' + name + ' price: ' + price);
        })
    }
})

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableBooks:result})
    })
}) 
// Export the router object so index.js can access it
module.exports = router