var User = require('../models/User');
var Story = require('../models/Story');
var Pin = require('../models/Pin');
var auth = require('../resources/auth');

//for ajax calls
var http = require('http');
var request = require('request');

var pinsController = {
  getStoryPins: function(req, res) { //GET PINS FROM SPECIFIC STORY -- only getting from story id
    Story.findById({_id: req.params.storyId}, function (err, story) {
      Pin.find({_id: { $in: story.pins}}, function(err, pins){
        if(err){
          console.log("Error: ", err);
        }
        res.send(pins);
        })
      });
  },
  getUserPins: function(req, res) { //GET PINS FROM SPECIFIC USER -- double nested version
    User.findById({_id: req.params.userId}, function (err, user) {
      Story.find({_id: { $in: user.stories}}, function(err, story){

        // console.log(story[0].pins);
        Pin.find({_id: { $in: story.pins}}, function(err, pins){
          if(err){
            console.log("Error: ", err);
          }
          res.send(pins);
        })
      });

    });
  },
  addPinToStory: function(req, res) {  //POST PINS FROM SPECIFIC STORY -- only getting from story id
      Story.findById({_id: req.params.storyId}, function (err, story) {
        if (err) {
          return res.status(400).send({ message: 'Story not found.' });
        }
        var newPin = new Pin(req.body);
        newPin.save(function (err, savedPin) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            story.pins.push(newPin);
            story.save();
            res.json(savedPin);
          }
      });

    });
  },
  editPin: function(req, res) { //edit specific pin //Is this necessary?
    Pin.findById({_id: req.params.id}, function (err, pin) {
      if (err) {
        return res.status(400).send({ message: 'Pin not found.' });
      }
      pin.locationName = req.body.locationName || pin.locationName;
      pin.textContent = req.body.textContent || pin.textContent;
      pin.save(function(err) {
        if(err){
          res.send(err);
        }
        res.send(pin);
      });
    });
  },
  deletePin: function(req, res) {
    Pin.remove({_id: req.params.id}, function(err, deletedPin) {
        if(err){
          res.json({message: 'Could not delete pin b/c:' + error});
        }
        res.json({message: 'Pin successfully deleted'});
    });
  },
  getOnePin: function(req, res) { //Is this useful?
    Pin.findById({_id: req.params.id}, function (err, pin) {
      res.json(pin);
    });
  },
  getAllPins: function(req, res) { //only useful to do the front-page data viz idea, gets all pins in existence
    Pin.find({}, function (err, pins) {
      res.json(pins);
    });
  },
  getLocationFromMapbox: function(req, res){//use Mapbox API to get latitude & longitude

    var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ req.params.locationName +'.json?access_token=' + process.env.MAPBOX_API_TOKEN + '&autocomplete=true';
    request(apiEndpoint, function(error, response, body){
      body = JSON.parse(body);
      console.log(body);
      res.send(body);
    });
  },
  getMapboxToken: function(req, res){
    res.send(process.env.MAPBOX_API_TOKEN);
  }
}



module.exports = pinsController;
