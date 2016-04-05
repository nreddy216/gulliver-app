var mongoose = require('mongoose');
// var Pin = require('./Pin');
var Schema = mongoose.Schema;

var StorySchema = mongoose.Schema({
  title: {type : String},
  created: { type: Date },
  updated: { type: Date },
  tags: [], //array that gets diff tags pushed on it
  pins: [{type: Schema.Types.ObjectId, ref:'Pin'}]
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

});

module.exports = mongoose.model('Story', StorySchema);
