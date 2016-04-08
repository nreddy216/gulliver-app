// require express and other modules
var express = require('express'),
    router = express.Router(), //router ~
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    auth = require('./resources/auth'),
    // ~ models
    User = require('./models/User'),
    Story = require('./models/Story')
    Pin = require('./models/Pin');

// require and load dotenv
require('dotenv').load();

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');


//connect to specified heroku port or localhost:3000
var port = process.env.PORT || 3000;

// connect to mongodb
var uri = process.env.MONGOLAB_URI || "mongodb://localhost/travelogue";
mongoose.connect(uri);

/*
 * API Routes
 */


app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    // res.send(user.populate('stories'));
    res.send(user);
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
      // res.send(user.populate('stories'));
      res.send(user);
    });
  });
});


//testing users data
app.get('/api/users', function (req, res) {

  User.find({}, function(err, users){
    if(err){
      console.log(err);
    }
    res.send(users);
  });
});


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

//ADD STORIES FROM SPECIFIC USER
app.post('/api/users/:id/stories', function(req, res){
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
});

//GET PINS FROM SPECIFIC USER -- double nested version
app.get('/api/users/:userId/stories/:storyId/pins', function(req, res){
  User.findById({_id: req.params.userId}, function (err, user) {
    Story.find({_id: { $in: user.stories}}, function(err, story){

      // console.log(story[0].pins);
      Pin.find({_id: { $in: story.pins}}, function(err, pins){
        if(err){
          console.log("Error: ", err);
        }
        res.send(pins);
      })
    })

  });
});

//GET PINS FROM SPECIFIC STORY -- only getting from story id
app.get('/api/stories/:storyId/pins', function(req, res){
  Story.findById({_id: req.params.storyId}, function (err, story) {
    Pin.find({_id: { $in: story.pins}}, function(err, pins){
      if(err){
        console.log("Error: ", err);
      }
      res.send(pins);
      })
    })
  });

//POST PINS FROM SPECIFIC STORY -- only getting from story id
app.post('/api/stories/:storyId/pins', function(req, res){
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

//get specific story with the pins
app.get('/api/stories/:id', function (req, res) {
    Story.findById({_id: req.params.id}, function (err, story) {
      Pin.find({_id: { $in: story.pins}}, function(err, pins){
        if(err){
          console.log("Error: ", err);
        }
        res.json({story: story, pins: pins});
        })
      });
});

//delete specific story
app.delete('/api/stories/:id', function (req, res) {

  Story.remove({_id: req.params.id}, function(err, story){
      if(err){
        res.status(500).json({error: err.message});
      }
      res.json({ deleted: story });
  });
});

//edit specific story
app.put('/api/stories/:id', function (req, res) {
  // console.log(req.session);
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
});


//edit specific pin
app.put('/api/pins/:id', function (req, res) {
  // console.log(req.session);
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
});

//edit specific pin
app.delete('/api/pins/:id', function (req, res) {
  // console.log(req.session);

  Pin.remove({_id: req.params.id}, function(err, deletedPin) {
      if(err){
        res.json({message: 'Could not delete pin b/c:' + error});
      }
      res.json({message: 'Pin successfully deleted'});
  });
});


//get specific pin
app.get('/api/pins/:id', function (req, res) {
  // console.log(req.session);
  Pin.findById({_id: req.params.id}, function (err, pin) {
    res.json(pin);
  });
});

 //get all  pins
app.get('/api/pins', function (req, res) {
  // console.log(req.session);
  Pin.find({}, function (err, pins) {
    res.json(pins);
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

app.get('*', function (req, res) {
  res.render('index');
});


/*
 * Listen on localhost:3000
 */
app.listen(port, function() {
  console.log('server started');
});
