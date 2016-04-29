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
  getUserStories: function(req, res) { //GET STORIES FROM SPECIFIC USER
    User.findById({_id: req.params.id}, function (err, user) {
        Story.find({_id: { $in: user.stories}}, function(err, stories){
          res.send(stories);
        })
    });
  },
  addStory: function(req, res) { //ADD STORIES TO SPECIFIC USER
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
  getOneStory: function(req, res) {
    //get specific story with the pins included (not just ref ids)
    Story.findById({_id: req.params.id}, function (err, story) {
      if(err || story==null){
        res.status(201).json({story: "this story has been deleted"});
      } else {
        Pin.find({_id: { $in: story.pins}}, function(err, pins){
          if(err){
            console.log("Error: ", err);
          }
          res.json({story: story, pins: pins});
          })
        };
      });
  },
  editStory: function(req, res) {
    // edit specific story
    Story.findById({_id: req.params.id}, function (err, story) {
      if (err) {
        return res.status(400).send({ message: 'Story not found.' });
      }
      story.title = req.body.title || story.title;
      story.save(function(err) {
        if(err){
          res.send(err);
        }
        res.send(story);
      });
    });
  },
  deleteStory: function(req, res) {
    Story.remove({_id: req.params.id}, function(err, story){
        if(err){
          res.status(500).json({error: err.message});
        }
        res.json({ deleted: story });
    });
  }
}



module.exports = storiesController;
