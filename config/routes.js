// BACKEND API ROUTES =================================

//require dependencies
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser') //parses info from POST
    auth = require('../resources/auth');

var app = express();

//require all backend controllers ===============================
var usersController = require('../controllers/usersController'),
    storiesController = require('../controllers/storiesController'),
    pinsController = require('../controllers/pinsController');

// API ==============================================
//TODO: MAKE API PRIVATE

//basic back-end routes ******************************
router.route('/api')
  .get(function(req, res){
    res.json({ api : "Welcome to the travelogue API"});
  });

//catch all route ? Not working
// router.route('*')
//   .get(function(req, res){
//       res.sendfile('../index.html');
//   });

// USER routes ****************************************
router.route('/api/users')
  .get(usersController.getAll);

// router.route('/api/users/:id', auth.ensureAuthenticated)
//   .get(usersController.getUser);


  /*
   * API Routes - satellizer lab
   */


//===============
app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  console.log("HITTING /api/me ", req.user);
  User.findById(req.user, function (err, user) {
    // res.send(user.populate('posts'));
    res.send(user.populate('stories'));
  });
});

app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found.' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.send(user);
    });
  });
});


  /*
   * Auth Routes
   */

  app.post('/auth/signup', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken.' });
      }
      var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      user.save(function (err, result) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
        res.send({ token: auth.createJWT(result) });
      });
    });
  });

  app.post('/auth/login', function (req, res) {
    User.findOne({ email: req.body.email }, '+password', function (err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Invalid email or password.' });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Invalid email or password.' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });


  /*
   * Catch All Route
   */
  app.get(['/', '/signup', '/login', '/profile'], function (req, res) {
    res.render('index');
  });


// STORY routes ****************************************
// router.route('/api/stories')
//   .get(storiesController.getAll);



//export the router so that server.js recognizes it
module.exports = router;
