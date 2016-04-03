var mongoose = require('mongoose');

var PinSchema = mongoose.Schema({
  storyOrder: Number, //what order does this pin go in the story?
  locationName: String, //what the user wants to call the location
  latitude: String, //get both from MapBox
  longitude: String,
  textContent: String, //actual story
  photoUrl: [], //array with all the photos for the pin
  videoUrl: [],
  audioUrl: []
})

module.exports = mongoose.model('Pin', PinSchema);
