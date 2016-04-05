var mongoose = require('mongoose');
var Pin = require('./pin');

var StorySchema = mongoose.Schema({
  title: {type : String},
  created: { type: Date },
  updated: { type: Date },
  tags: [], //array that gets diff tags pushed on it
  pins: [Pin.schema]
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

});

module.exports = mongoose.model('Story', StorySchema);
