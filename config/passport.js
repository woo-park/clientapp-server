var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose')
// load up the user model
var User = require('../models/user');
// User = mongoose.model('User')
var settings = require('../config/settings'); // get settings file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = settings.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('hey')
    console.log(User)
    User.findOne({_id: jwt_payload._id}, function(err, user) {
          if (err) {
            console.log('h')
              return done(err, false);
          }
          if (user) {
            console.log('3')
              done(null, user);
          } else {
            console.log('s')
              done(null, false);
          }
      });
  }));
};

// config is used to get the user by matching jwt token with jwt token recieved from the client



//one lesson learned - mongoose model cannot be declared twice-
//it needs to be brought in once, then afterward, grab using User = mongoose.model('User') like so
