var User = require('../models/User');
var Story = require('../models/Story');
var Pin = require('../models/Pin');
var auth = require('../resources/auth');

var storiesController = {
  getAllStories : function(req, res) {
      Story.find({}, function(err, allStories){
        if(err){
          console.log(err);
        }
        res.json(allStories);
      });
  },
  getUserStories: function(req, res) {
    User.findById({_id: req.params.id}, function (err, user) {
        Story.find({_id: { $in: user.stories}}, function(err, stories){
          res.send(stories);
        })
    });
  },
  addStory: function(req, res) {
    User.findById({_id: req.params.id}, function (err, user) {
      var newStory = new Story(req.body);
      newStory.save(function (err, savedStory) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          user.stories.push(newStory);
          user.save();
          res.json(savedStory);
        }
      });
    });
  },
  getOneUser: function(req, res) {

  },
  currentUser: function(req, res) {

  },
  signUp: function(req, res) {

  },
  logIn: function(req, res) {

  }
}



module.exports = storiesController;
