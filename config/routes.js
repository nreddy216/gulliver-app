var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

var usersController = require('../controllers/users');
var storiesController = require('../controllers/stories');
var pinsController = require('../controllers/pins');
var auth = require('../resources/auth');


/*
 * API Routes
 */

//USERS==================================================================
//authentication
router.route('/api/me')
      .get(auth.ensureAuthenticated, usersController.currentUser)
      .put(auth.ensureAuthenticated, usersController.addUser);
router.route('/auth/signup')
    .post(usersController.signUp);
router.route('/auth/login')
    .post(usersController.logIn);


//user routes so that no login is required to see others' profiles
router.route('/api/users')
    .get(usersController.getAllUsers);
router.route('/api/users/:id')
    .get(usersController.getOneUser);

//STORIES==================================================================
//stories routes
router.route('/api/users/:id/stories')
    .get(storiesController.getUserStories)
    .post(storiesController.addStory);

router.route('/api/stories')
    .get(storiesController.getAllStories);

router.route('/api/stories/:id')
      .get(storiesController.getOneStory)
      .delete(storiesController.deleteStory)
      .put(storiesController.editStory);

//PINS==================================================================
//pins routes
router.route('/api/users/:userId/stories/:storyId/pins')
    .get(pinsController.getUserPins);

router.route('/api/stories/:storyId/pins')
    .get(pinsController.getStoryPins)
    .post(pinsController.addPinToStory);

router.route('/api/pins/:id')
    .put(pinsController.editPin)
    .delete(pinsController.deletePin);

router.route('/search/:locationName')
    .get(pinsController.getLocationFromMapbox);

router.route('/api/mapboxToken')
    .get(auth.ensureAuthenticated, pinsController.getMapboxToken);



module.exports = router;
