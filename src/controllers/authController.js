const emailValidators = require('../validators/emailValidators'),
      debug = require('debug')('app:authController'),
      bcrypt = require('bcryptjs'),
      passport = require('passport');

const authController = (User) => {

  const signUp = (req, res) => {

    // Validate & sanitize email
    emailValidators.validateEmail(req);

    debug(req.validationErrors());

    const user = new User(req.body);
    const validationErrors = req.validationErrors();

    if (validationErrors) {
      let errorMessage = '';
      validationErrors.forEach((error, index) => {
        errorMessage += `${index + 1}: Bad request, Param: ${error.param}, Message: ${error.msg}, Value: ${error.value}`
      });
      res.status(400);
      res.send(errorMessage);
    } else if (!req.body.email || !req.body.password) {
      res.status(400);
      res.send('Bad request, request body incomplete');
    } else {

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      user.password = hash;

      function save() {
        user.save((error) => {
          if (error) {
            res.status(400);
            res.send(error);
          } else {
            res.status(201);
            res.send('User was created successfully');
            debug('User was created successfully');
          }
        });
      }

      emailValidators.emailIsUnique(user.email, res, save);
    }
  };

  const signIn = (req, res) => {
      res.status(200).send(req.user);
      debug('login successful');
    };

  const localPassportStrategy = passport.authenticate('local');

  return {
    signUp: signUp,
    signIn: signIn,
    localPassportStrategy: localPassportStrategy
  };
};

module.exports = authController;