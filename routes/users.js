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

router.get('/list', function(req, res) {
    let sqlquery = "SELECT * FROM Users"; // query database to get all the Users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
           next(err)
        }
        res.render("listOfUsers.ejs", {availableUsers:result});
     });
  });

  function isLoggedIn(req, res, next) {
    if (req.session.user) {
    next();
    } else {
    res.redirect('register');
    }
}
  router.get('/', isLoggedIn, (req, res) => {
    res.render('index.ejs')
  });
  
  // Login page
  router.get('/login', (req, res) => {
    res.render('login.ejs');
  });
  
  // Logout route
  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });

  router.post('/login', (req, res) => {
    let sqlquery = "SELECT * FROM Users WHERE username = ?"; // query the database to get the user by username
    const username = req.body.username;
    const saltRounds = 10;
    isMatch = false;
    // Execute SQL query
    db.query(sqlquery, [username], (err, result) => {
      if (err) {
        res.redirect('./');  // redirects to the home page if the query fails
        return;
      }
      // Check if user was found
      if (result.length === 0) {
        res.redirect('register');
        return;
      }
      const user = result[0]; // Get the first result (should be the user object)
      bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
              // Compare the password supplied with the hashed password in the database
        bcrypt.compare(req.body.password, hashedPassword, function(err, isMatch) { // `isMatch` is the result of the comparison  
            if (err) {
                // Handle any error that occurred during password comparison
                console.error('Error during password comparison:', err);
                res.status(500).send('An error occurred. Please try again.');
            } else if (isMatch) {
                // Passwords match - authentication successful
                // You can now send a success message or store the user in session, etc.
                res.redirect('/');
            } else {
                // Passwords do not match - authentication failed
                res.send('Invalid password. <a href="login">Try again</a>');
            }
        });  
      });
    });
  });
  
// Export the router object so index.js can access it
module.exports = router