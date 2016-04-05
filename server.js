// require express and other modules
var express = require('express'),
    router = express.Router(), //router ~
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    auth = require('./resources/auth'),
    // ~ models
    User = require('./models/user'),
    Story = require('./models/story')
    Pin = require('./models/pin');

// require and load dotenv
require('dotenv').load();

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// connect to mongodb
mongoose.connect('mongodb://localhost/travelogue');

// require User and Post models
var User = require('./models/user');

/*
 * API Routes
 */


app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    res.send(user.populate('stories'));
  });
});

app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
  // console.log(req.session);
  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found.' });
    }
    user.firstName = req.body.firstName || user.firstName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.send(user.populate('stories'));
    });
  });
});



// app.get('/api/users/:id', function(req, res){
//   User.findById({_id: req.params.id}, function)
// })


//testing users data
app.get('/api/users', function (req, res) {

  User.find({}, function(err, users){
    if(err){
      console.log(err);
    }
    res.send(users);
  });
});







// app.post('/api/users', auth.ensureAuthenticated, function (req, res) {
//   User.findById(req.user, function (err, user) {
//     var newStory = new Story(req.body);
//     newStory.save(function (err, savedStory) {
//       if (err) {
//         res.status(500).json({ error: err.message });
//       } else {
//         user.stories.push(newStory);
//         user.save();
//         res.json(savedStory);
//       }
//     });
//   });
// });

//auth.ensureAuthenticated ? This doesn't work
// app.get('/api/me/stories', auth.ensureAuthenticated, function (req, res) {
//
//   User.find(req.user, function(err, user){
//     if(err){
//       console.log(err);
//     }
//     res.send(user.stories);
//   });
// });


//testing retrieving stories in user
app.get('/api/users/:id', function(req, res){
  User.find({_id: req.params.id}, function(err, user){
    if(err){
      console.log(err);
    } else {
      res.json(user);
    }
  })
});

//GET STORIES FROM SPECIFIC USER
app.get('/api/users/:id/stories', function(req, res){
  User.findById({_id: req.params.id}, function (err, user) {
      Story.find({_id: { $in: user.stories}}, function(err, stories){
        res.send(stories);
      })
  });

});

//testing stories data
app.get('/api/stories', function (req, res) {

  Story.find({}, function(err, allStories){
    if(err){
      console.log(err);
    }
    res.json(allStories);
  });
});

//post to user stories
//auth.ensureAuthenticated,
app.post('/api/stories', auth.ensureAuthenticated, function (req, res) {
  console.log(" USER ", req);
  User.findById(req.user, function (err, user) {
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
});


/*
 * Auth Routes
 */

//sign up and login
app.post('/auth/signup', function (req, res) {
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
});

//login
app.post('/auth/login', function (req, res) {
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
});


/*
 * Catch All Route
 */
app.get(['/', '/signup', '/login', '/profile'], function (req, res) {
  res.render('index');
});


/*
 * Listen on localhost:3000
 */
app.listen(3000, function() {
  console.log('server started');
});
