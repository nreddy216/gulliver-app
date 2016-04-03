// STORIES CONTROLLER =================================

var Story = require('../models/Story');

//need to push stories into a user
// var User = require('../models/User');

//get all stories in existence
function getAll(req, res){
  console.log("Getting all stories from DB /api/stories");
  //find all users in db
  Story.find(function(err, stories){
    if(err){
      res.status(500).json({error: err.message});
    } else {
      res.json(stories);
    }
  });
};

//create one story
// function createStory(req, res){
//   console.log("Posting story to DB /api/users/:id");
//
//   //get user ID
//   var userID = req.params.id;
//
//   //create new user with data req.body
//   var newStory = new Story(req.body);
//   //save user to DB
//   newStory.save(function(err, savedStory){
//     if(err){
//       res.status(500).json({error: err.message});
//     } else {
//       User.find({_id: userID}, function(err, user){
//         if(err){
//           res.status(500).json({error: err.message});
//         } else {
//           user.stories.push(savedStory);
//         }
//       });
//       // res.json(savedStory);
//     }
//   });
// };

//get one user
// function getUser(req, res){
//   console.log("Getting all users for API /api/users/:id");
//   //create new user with data req.body
//   var userID = req.params.id;
//
//   //find one user in DB
//   User.findOne({_id: userID}, function(err, foundUser){
//     if(err){
//       res.status(500).json({error: err.message});
//     } else {
//       res.json(foundUser);
//     }
//   });
// };

module.exports = {
  getAll : getAll
  // createStory: createStory
  // getUser: getUser
}
