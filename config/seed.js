var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/travelogue');

var Story = require('../models/story')
var User = require('../models/user');

User.remove({}, function(err) {
  if (err) {
    console.log("Error with removing User : ", err);
  }
});

Story.remove({}, function(err) {
  if (err) {
    console.log("Error with removing Story : ", err);
  }
});

var users = [
  {
      email: "user1@gmail.com",
      firstName: "User One",
      username: "user1",
      password: "user1"
  },
  {
      email: "user2@gmail.com",
      firstName: "User Two",
      username: "user2",
      password: "user2"
  }

];

User.create(users, function(err, doc) {
    if (err){ console.log("Error : ", err); }
    else {
      console.log("Created: " , doc);
      mongoose.connection.close();
    }
  });
