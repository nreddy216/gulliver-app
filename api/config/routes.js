//require dependencies
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'); //parses info from POST

//require all controllers
var usersController = require('../controllers/usersController'),
    storiesController = require('../controllers/storiesController'),
    pinsController = require('../controllers/pinsController');

// http://localhost:3000/stories

router.route('/stories')
  .get(storiesController.getAll);
