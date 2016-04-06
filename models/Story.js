var mongoose = require('mongoose');
// var Pin = require('./Pin');
var Schema = mongoose.Schema;

var StorySchema = mongoose.Schema({
  title: {type : String},
  created: { type: Date },
  updated: { type: Date },
  tags: [], //array that gets diff tags pushed on it
  centerLatitude: { type: Number },
  centerLongitude: { type: Number },
  centerZoom: Number,
  pins: [{type: Schema.Types.ObjectId, ref:'Pin'}]
  // sharedAnonymously: Boolean, //icebox
  //likes: Number //icebox
  //comments: [CommentSchema] //icebox
  //is

});

//FIGURE OUT HOW TO SET TIME DATA LATER
// StorySchema.pre('save', function (next) {
//   // set created and updated
//   now = new Date();
//   this.updated = now;
//   if (!this.created) {
//     this.created = now;
//   }
// });


module.exports = mongoose.model('Story', StorySchema);
