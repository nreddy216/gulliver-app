var mongoose = require('mongoose');

var PinSchema = mongoose.Schema({
  pinOrder: Number, //what order does this pin go in the story?
  locationName: String, //what the user wants to call the location
  latitude: { type: Number }, //get both from MapBox
  longitude: { type: Number },
  zoom: { type: Number},
  zipcode: { type: String },
  textContent: { type: String, default: ''}, //actual story
  photoUrl: String, //array with all the photos for the pin
  videoUrl: String,
  audioUrl: String
})

module.exports = mongoose.model('Pin', PinSchema);
