var User = require('../models/User');

//get all users
function getAll(req, res){
  console.log("Getting all users from DB /api/users");
  //find all users in db
  User.find(function(err, users){
    if(err){
      res.status(500).json({error: err.message});
    } else {
      res.json(users);
    }
  });
};

//create one user
function createUser(req, res){
  console.log("Posting user to DB /api/users");
  //create new user with data req.body
  var newUser = new User(req.body);
  //save user to DB
  newUser.save(function(err, savedUser){
    if(err){
      res.status(500).json({error: err.message});
    } else {
      res.json(savedUser);
    }
  });
};

//get one user
function getUser(req, res){
  console.log("Getting all users for API /api/users/:id");
  //create new user with data req.body
  var userID = req.params.id;

  //find one user in DB
  User.findOne({_id: userID}, function(err, foundUser){
    if(err){
      res.status(500).json({error: err.message});
    } else {
      res.json(foundUser);
    }
  });
};

module.exports = {
  getAll : getAll,
  createUser: createUser,
  getUser: getUser
}
