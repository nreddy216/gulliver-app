var User = require('../models/User');
var Story = require('../models/Story');
var auth = require('../resources/auth');

var usersController = {
  getUser : function(req, res) {
    User.findById(req.user, function (err, user) {
      res.send(user.populate('stories'));
    });
  },
  addUser: function(req, res) {
    User.findById(req.user, function (err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found.' });
      }
      user.firstName = req.body.firstName || user.firstName;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.send(user.populate('stories'));
        // res.send(user);
      });
    });
  },
  getAllUsers: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      }
      res.send(users);
    });
  },
  getOneUser: function(req, res) {
    //different from get user bc gets it from the params ID rather than JWT - necessary b/c you might want to look at a user's profile w/o being the user themselves
    User.find({_id: req.params.id}, function(err, user){
      if(err){
        console.log(err);
      } else {
        user.populate('stories');
        res.json(user);
      }
    });
  },
  currentUser: function(req, res) {
    User.findById(req.user, function(err, user) {
      res.send(user);
    })
  },
  signUp: function(req, res) {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken.' });
      }
      var user = new User({
        firstName: req.body.firstName,
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
  },
  logIn: function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function (err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Invalid email or password.' });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Invalid email or password.' });
        }
        res.send({ token: auth.createJWT(user)});
        console.log(user)

      });
    });
  }
}



module.exports = usersController;
