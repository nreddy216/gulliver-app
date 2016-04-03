var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  password_digest: String,
  profilePic: String,
  stories: [StorySchema]
  // isPublic: Boolean //users can create private accounts? icebox
  //followers: ref data - icebox
})

module.exports = mongoose.model('User', UserSchema);
