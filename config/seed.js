var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/travelogue');

var Story = require('../models/Story')
var User = require('../models/User');

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
      username: "user1",
      password: "user1"
  },
  {
      email: "user2@gmail.com",
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
