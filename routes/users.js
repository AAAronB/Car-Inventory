// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
});    

router.post('/registered', function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password;
    const saltRounds = 10;
    
    // Hash the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        let addquery = "INSERT INTO users(first_name,last_name,username,password,email,hashedPassword) VALUES" + 
        "('" + req.body.first + "','" + req.body.last + "','" + req.body.username + "','"+ plainPassword+ "','" + req.body.email + "','" + hashedPassword +"');";
        db.query(addquery, (err) => {
            if (err) {
                return console.error(err.message); // returns an error message if the query fails
             } else if (err) {
            return res.status(500).send("Error hashing password.");
        }

        let result = 'Hello ' + req.body.first + ' ' + req.body.last + 
                     ' you are now registered! We will send an email to you at ' + req.body.email;
        result += ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword;
        // Send the result as a response
        res.send(result);
        });
    });
    });
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
router.get('/list', function(req, res) {
    let sqlquery = "SELECT * FROM Users"; // Query database to get all users
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("listOfUsers.ejs", { availableUsers: result });
    });
});

router.get('/loggedIn', (req, res) => {
  req.session.userId = req.body.username;
  res.render('index.ejs',{ userId: req.session.userId })
});

// Login page
router.get('/login', (req, res) => {
  res.render('login.ejs');
});
  
  // Logout route
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('./'); // Redirect if an error occurs
      }
      res.send('You are now logged out. <a href="./">Home</a>'); // Confirmation message
  });
});

router.post('/login', (req, res) => {
  const sqlquery = "SELECT * FROM Users WHERE username = ?"; // Query to get the user by username
  const username = req.body.username;

  // Execute SQL query
  db.query(sqlquery, [username], (err, result) => {
      if (err) {
          res.redirect('./');  // Redirects to the home page if the query fails
          return;
      }
      // Check if user was found
      if (result.length === 0) {
          res.redirect('register'); // User not found, redirect to register
          return;
      }
      
      const user = result[0]; // Get the first result (the user object)

      // Compare the password supplied with the hashed password in the database
      bcrypt.compare(req.body.password, user.hashedPassword, (err, isMatch) => {
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
              res.send('Invalid password. <a href="login">Try again</a>');
          }
      });
  });
});

// Export the router object so index.js can access it
module.exports = router