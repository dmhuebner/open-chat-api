const passport = require('passport');
require('./strategies/local.strategy')();

const passportConfig = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  // stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves user from session
  passport.deserializeUser((user, done) => {
    // Can just deserialize user.id or other property instead of whole user object
    done(null, user);

  });
};

module.exports = passportConfig;