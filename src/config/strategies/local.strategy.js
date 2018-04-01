const passport = require('passport'),
      { Strategy } = require('passport-local'),
      User = require('../../models/User');

module.exports = function localStrategy() {
  const userDef = {
    usernameField: 'email',
    passwordField: 'password'
  };

  passport.use(new Strategy(userDef, (email, password, done) => {
    User.findOne({email: email}, (error, user) => {
      if (error) {

        return done(error);
      } else if (!user || user.password !== password) {

        return done(null, false);
      } else {

        const returnedUser = {
          _id: user._id,
          username: user.username,
          email: user.email,
          admin: user.admin
        };

        return done(null, returnedUser);
      }
    });
  }));
};