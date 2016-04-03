// BACKEND API ROUTES =================================

//require dependencies
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'); //parses info from POST

var app = express();

//require all controllers ===============================
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
  .get(usersController.getAll)
  .post(usersController.createUser);

router.route('/api/users/:id')
  .get(usersController.getUser);

// STORY routes ****************************************
router.route('/api/stories')
  .get(storiesController.getAll);



//export the router so that server.js recognizes it
module.exports = router;
