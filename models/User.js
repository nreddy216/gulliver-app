var mongoose = require('mongoose');
var Story = require('./Story');

var UserSchema = mongoose.Schema({
  dateCreated: { type: Date },
  dateUpdated: { type: Date },
  username: String,
  email: { type: String, unique: true, lowercase: true },
  firstName: String,
  lastName: String,
  password: { type: String, select: false}, //select??
  profilePic: String,
  stories: [Story]
  // isPublic: Boolean //users can create private accounts? icebox
  //followers: ref data - icebox
});

module.exports = mongoose.model('User', UserSchema);
