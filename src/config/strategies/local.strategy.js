const passport = require('passport'),
      { Strategy } = require('passport-local');

module.exports = function localStrategy() {
  const userDef = {
    usernameField: 'username',
    emailField: 'email',
    passwordField: 'password'
  };

  passport.use(new Strategy(userDef, (username, email, password, done) => {
    // go out to database validate username and password
    const user = {
      username, email, password
    };

    done(null, user);
  }));
};