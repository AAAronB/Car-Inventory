const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/search', function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', [
    check('make').optional(),
    check('model').optional(),
    check('year').optional().isNumeric().custom(value => value >= 1900),
    check('price_max').optional().isNumeric().custom(value => value >= 0)
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('/search');
    }

    const make = req.sanitize(req.query.make);
    const model = req.sanitize(req.query.model);
    const year = req.sanitize(req.query.year);
    const price_max = req.sanitize(req.query.price_max);
    let sqlquery = "SELECT * FROM cars WHERE 1=1";
    let params = [];

    if (make) {
        sqlquery += " AND make LIKE ?";
        params.push(`%${make}%`);
    }
    if (model) {
        sqlquery += " AND model LIKE ?";
        params.push(`%${model}%`);
    }
    if (year) {
        sqlquery += " AND year = ?";
        params.push(year);
    }
    if (price_max) {
        sqlquery += " AND price <= ?";
        params.push(price_max);
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { availableCars: result });
    });
})

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT c.*, d.Name as DealerName FROM cars c LEFT JOIN dealers d ON c.DealerID = d.DealerID";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", {
            availableCars: result
        });
    });
})

router.get('/list-dealers', function(req, res, next) {
    let sqlquery = "SELECT * FROM dealers"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("dealer-list.ejs", {dealers:result})
    })
})
router.get('/bargains', function(req, res, next) {
    let sqlquery = "SELECT c.*, d.Name as DealerName FROM cars c LEFT JOIN dealers d ON c.DealerID = d.DealerID WHERE Price < 20000"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableCars:result})
    })
})



router.get('/addcar', function (req, res, next) {
    db.query("SELECT DealerID, Name FROM dealers", (err, dealers) => {
        if (err) {
            return next(err);
        }
        res.render('add-car.ejs', { dealers: dealers });
    });
})

router.post('/caradded', [
    check('make').notEmpty(),
    check('model').notEmpty(),
    check('price').notEmpty().isNumeric().custom(value => value >= 0),
    check('color').notEmpty(),
    check('condition').notEmpty(),
    check('dealer').notEmpty().isNumeric() // Add validation for dealer
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/addcar')
    } else {
        let sqlquery = "INSERT INTO Cars (Make, Model, Color, Price, `Condition`, DealerID) VALUES (?, ?, ?, ?, ?, ?)";
        let newrecord = [
            req.sanitize(req.body.make),
            req.sanitize(req.body.model),
            req.sanitize(req.body.color),
            req.sanitize(req.body.price),
            req.sanitize(req.body.condition),
            req.sanitize(req.body.dealer) // Add the dealer ID
        ];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            res.send(`Car added to database: ${newrecord[0]} ${newrecord[1]} (${newrecord[2]})`);
        });
    }
})

router.get('/check-maintenance', function(req, res, next) {
    res.render("check-maintenance.ejs")
})

router.get('/maintenance', function(req, res, next) {
    let carQuery = "SELECT CarID FROM Cars WHERE Make = ? AND Model = ?";
    db.query(carQuery, [req.query.make, req.query.model], (err, carResult) => {
        if (err) {
            return next(err);
        }
        if (!carResult.length) {
            return res.render("maintenance.ejs", { maintenanceHistory: [] });
        }
        const carId = carResult[0].CarID;
        //console.log(carId);

        let sqlquery = "SELECT * FROM maintenancerecords WHERE CarID = ? ORDER BY ServiceDate DESC"
        db.query(sqlquery, [carId], (err, result) => {
            if (err) {
                next(err)
            }
            res.render("maintenance.ejs", {maintenanceHistory:result})
        })
    })
})

router.get('/addmaintenance', function(req, res, next){
    res.render('add-maintenance.ejs')
})

router.post('/maintenanceadded', [
    check('car_id').notEmpty().isNumeric(),
    check('service_type').notEmpty(),
    check('service_date').notEmpty().isDate(),
    check('cost').notEmpty().isNumeric()
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/addmaintenance')
    } else {
        let sqlquery = "INSERT INTO maintenance (car_id, service_type, service_date, cost) VALUES (?, ?, ?, ?)";
        let newrecord = [
            req.sanitize(req.body.car_id),
            req.sanitize(req.body.service_type),
            req.sanitize(req.body.service_date),
            req.sanitize(req.body.cost)
        ];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        })
    }
})

router.get('/adddealer', function(req, res, next) {
    res.render('add-dealer.ejs')
})

router.post('/dealeradded', [
    check('name').notEmpty(),
    check('location').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty().isEmail()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/adddealer')
    } else {
        let sqlquery = "INSERT INTO dealers (name, location, phone, email) VALUES (?, ?, ?, ?)";
        let newrecord = [
            req.sanitize(req.body.name),
            req.sanitize(req.body.location),
            req.sanitize(req.body.phone),
            req.sanitize(req.body.email)
        ];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            res.send(`Dealer added to database: ${newrecord[0]} (${newrecord[1]})`);
        })
    }
})

router.get('/addowner', function(req, res, next) {
    res.render('add-owner.ejs')
})

router.post('/owneradded', [
    check('car_id').notEmpty().isNumeric(),
    check('name').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('phone').notEmpty(),
    check('address').notEmpty()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/addowner')
    } else {
        let sqlquery = "INSERT INTO owners (car_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
        let newrecord = [
            req.sanitize(req.body.car_id),
            req.sanitize(req.body.name),
            req.sanitize(req.body.email),
            req.sanitize(req.body.phone),
            req.sanitize(req.body.address)
        ];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        })
    }
})

module.exports = router