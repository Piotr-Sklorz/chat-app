var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(username, password, done) {
  User.findOne({ email: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { status: 409, message: 'Incorrect username.' }); }
    if (!user.verifyPassword(password)) { return done(null, false, { status: 409, message: 'Incorrect password.' }); }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, (err, user) => {
      done(err, user);
  });
});
