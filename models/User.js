// Create Schema==============================================================

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

// For Auth ==============================================================
UserSchema.pre('save', function (next) {
  // set created and updated
  now = new Date();
  this.dateUpdated = now;
  if (!this.dateCreated) {
    this.dateCreated = now;
  }

  // encrypt password
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

// Export ==============================================================

module.exports = mongoose.model('User', UserSchema);
