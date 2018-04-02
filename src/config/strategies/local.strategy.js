const passport = require('passport'),
      { Strategy } = require('passport-local'),
      User = require('../../models/User'),
      bcrypt = require('bcryptjs');

module.exports = function localStrategy() {
  const userDef = {
    usernameField: 'email',
    passwordField: 'password'
  };

  passport.use(new Strategy(userDef, (email, password, done) => {
    // Sanitize email input
    const sanitizedEmail = email.toLowerCase().replace((/^\s+|\s+$/g), '');

    User.findOne({email: sanitizedEmail}, (error, user) => {
      let passwordsMatch = false;

      if (!user ) {
        return done(null, false);
      } else {
        passwordsMatch = bcrypt.compareSync(password, user.password);
      }

      if (error) {
        return done(error);
      } else if (passwordsMatch) {

        const returnedUser = {
          _id: user._id,
          username: user.username,
          email: user.email,
          admin: user.admin
        };

        return done(null, returnedUser);
      } else {
        return done(null, false);
      }
    });
  }));
};