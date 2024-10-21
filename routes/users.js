// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})   

router.post('/registered', [
    check('email').isEmail(),
], function (req, res, next) {
    // Sanitize the inputs
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const username = req.sanitize(req.body.username);
    const email = req.sanitize(req.body.email);
    const plainPassword = req.sanitize(req.body.password);
    // Checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('./register');
    } else {
        // Use firstName wherever necessary
        const saltRounds = 10;
        // Hash the password
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            let addquery = "INSERT INTO users(first_name,last_name,username,password,email,hashedPassword) VALUES (?, ?, ?, ?, ?, ?)";
            let newUser = [firstName, lastName, username, plainPassword, email, hashedPassword];
            
            db.query(addquery, newUser, (err) => {
                if (err) {
                    return console.error(err.message);
                }

                let result = 'Hello ' + firstName + ' ' + lastName + ' you are now registered! We will send an email to you at ' + email;
                result += ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword;
                res.send(result);
            })
        })
    }
})

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // Query database to get all users
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("listOfUsers.ejs", {availableUsers: result});
    })
})

router.get('/loggedIn', (req, res) => {
  req.session.userId = req.body.username;
  res.render('index.ejs',{ userId: req.session.userId })
})

// Login page
router.get('/login', (req, res) => {
  res.render('login.ejs');
})
  
// Logout route
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('./'); // Redirect if an error occurs
      }
      res.send('You are now logged out. <a href="./">Home</a>'); // Confirmation message
  })
})

router.post('/login', (req, res) => {
    const sqlquery = "SELECT * FROM Users WHERE username = ?"; // Query to get the user by username
    const username = req.sanitize(req.body.username);
    const plainPassword = req.sanitize(req.body.password);
    
    // Execute SQL query
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
          res.redirect('./');  // Redirect to the home page if the query fails
          return;
        }
        
        // Check if user was found
        if (result.length === 0) {
          // Always redirect to the registration page
          res.redirect('register'); // Redirects to the register page
          return;
        }
        
        const user = result[0]; // Get the first result (the user object)
        
        // Compare the password supplied with the hashed password in the database
        bcrypt.compare(plainPassword, user.hashedPassword, (err, isMatch) => {
            if (err) {
                // Handle any error that occurred during password comparison
                console.error('Error during password comparison:', err);
                res.status(500).send('An error occurred. Please try again.');
            } else if (isMatch) {
                // Passwords match - authentication successful
                req.session.userId = user.username; // Store user ID in session
                res.redirect('/'); // Redirect to the home page
            } else {
                // Passwords do not match - authentication failed
                res.redirect('register'); // Redirect to the registration page
            }
        })
    })
  })
// Export the router object so index.js can access it
module.exports = router