// Create a new router
const express = require("express")
const router = express.Router()

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

// API Explorer route - no authentication required
router.get('/api-explorer', function(req, res, next){
    res.render('api-explorer.ejs', { userId: req.session.userId || 'Guest' })
})

router.get('/weather', function(req, res, next) {
    res.render('weather.ejs');
});

router.get('/city_weather', function(req, res, next) {
  let apiKey = 'efe9ce8321b74a217c902e42eae9b158';
  let city = req.query.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function(err, response, body) {
      if (err) {
          return next(err);
      }

      var weather = JSON.parse(body);
      if (weather.cod === 200) {
          var wmsg = `
              <link rel="stylesheet"  type="text/css" href="/main.css" />
              <h1>Weather in ${weather.name}</h1>
              <p>Temperature: ${weather.main.temp}°C</p>
              <p>Humidity: ${weather.main.humidity}%</p>
              <p>Weather: ${weather.weather[0].description}</p>
            <div style="text-align: center;">
                  <button type="submit"><a href="/weather">Check another city</a></button>
              </div>
          `;
          res.send(wmsg);
      } else {
          res.send(`<p>City not found. Please try again. <a href="/weather">Go back</a></p>`);
      }
  });
});
// Export the router object so index.js can access it
module.exports = router