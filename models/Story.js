var mongoose = require('mongoose');
// var Pin = require('./Pin');
var Schema = mongoose.Schema;

var StorySchema = mongoose.Schema({
  title: {type : String},
  // created: { type: Date },
  // updated: { type: Date },
  tags: [], //array that gets diff tags pushed on it //not used yet
  centerLatitude: { type: Number },
  centerLongitude: { type: Number },
  centerZoom: Number,
  pins: [{type: Schema.Types.ObjectId, ref:'Pin'}],
  user: [{type: Schema.Types.ObjectId, ref:'User'}],
  imageUrl: String
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

}, {timestamps: {createdAt: 'created_at'}});



module.exports = mongoose.model('Story', StorySchema);
