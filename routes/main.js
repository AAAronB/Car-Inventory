// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')
// Handle our routes
router.get('/',function(req, res, next){
    res.render('login.ejs')
})


router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/products', function(req, res, next) {
    res.render('product.ejs');
});

router.get('/find_products', function (req, res, next) {
    const apiKey = '27b923d1-5973-4a93-8e74-da1e57af8c4c';
    const apiId = '675adeeec985538e87175ab0'; 
    const product = req.query.product;

    const options = {
        url: `https://api.techspecs.io/v5/products/search?query=${product}`,
        headers: {
            'X-API-KEY': apiKey,
            'X-API-ID': apiId
        }
    };

    request(options, function (err, response, body) {
        if (err) {
            return next(err);
        }
        try {
            const data = JSON.parse(body); // Parse the API response
            res.json(data);
        } catch (parseError) {
            next(parseError); 
        }
    });    
});

// Export the router object so index.js can access it
module.exports = router