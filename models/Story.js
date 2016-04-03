var mongoose = require('mongoose');
var Pin = require('./Pin');

var StorySchema = mongoose.Schema({
  title: String,
  dateCreated: { type: Date },
  dateUpdated: { type: Date },
  tags: [], //array that gets diff tags pushed on it
  pins: [Pin]
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

});

module.exports = mongoose.model('Story', StorySchema);
