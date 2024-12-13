// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var validator = require ('express-validator')
const session = require('express-session')
const expressSanitizer = require('express-sanitizer');

//Import mysql module
var mysql = require('mysql2')

// Create the express application object
const app = express()
const port = 8000
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  }));
// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create an input sanitizer
app.use(expressSanitizer());

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'tech_shop_products_app',
    password: 'qwertyuiop',
    database: 'tech_shop_products'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.shopData = {shopName: "One Stop Tech Shop"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /products
const productsRoutes = require('./routes/products')
app.use('/products', productsRoutes)

// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))