var mongoose = require('mongoose');

var StorySchema = mongoose.Schema({
  title: String,
  dateCreated: Date,
  dateUpdated: Date,
  tags: Array, //array that gets diff tags pushed on it
  pins: [PinSchema]
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

})

module.exports = mongoose.model('Story', StorySchema);
