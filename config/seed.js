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
      password: "user1",
      stories: []
  },
  {
      email: "user2@gmail.com",
      firstName: "User Two",
      username: "user2",
      password: "user2",
      stories: []
  },
  {
      email: "amelia@gmail.com",
      firstName: "Amelia Earhart",
      username: "aviator",
      password: "amelia",
      stories: []
  }
];


// var fakeStories = [{
//     updatedAt: "1939-04-07T23:55:01.561Z",
//     created_at: "1937-04-07T23:55:01.561Z",
//     title: "My Plane Trip",
//     pins: [{
//       locationName: "Atchison",
//       pinOrder: 1,
//       longitude: 96.669705,
//       latitude: 61.994573,
//       textContent: "Amelia Mary Earhart is born in Atchison, Kansas"
//
// "
//     },
//     {
//       locationName: "Chicago",
//       pinOrder: 1,
//       longitude: -105.750596,
//       latitude: 55.585901,
//       textContent: "Amelia graduates from Hyde Park High School in Chicago."
//     }]
// }];

users.forEach(function(user){
});


User.create(users, function(err, doc) {
    if (err){ console.log("Error : ", err); }
    else {
      console.log("Created: " , doc);
      mongoose.connection.close();
    }
  });
