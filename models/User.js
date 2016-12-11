// Create Schema==============================================================

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  created: { type: Date },
  updated: { type: Date },
  username: String,
  email: { type: String, unique: true, lowercase: true },
  firstName: String,
  lastName: String,
  password: { type: String, select: false},
  profilePic: String,
  stories: [{type: Schema.Types.ObjectId, ref:'Story'}]
});

// For Auth ==============================================================
UserSchema.pre('save', function (next) {
  // set created and updated
  now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
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
