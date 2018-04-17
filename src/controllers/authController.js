const emailValidators = require('../validators/emailValidators'),
      debug = require('debug')('app:authController'),
      bcrypt = require('bcryptjs'),
      passport = require('passport'),
      jwt = require('jsonwebtoken'),
      jwtKey = require('../config/security')();

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
        user.save((error, savedUser) => {
          if (error) {
            res.status(400);
            res.send(error);
          } else {
            const token = jwt.sign({user: savedUser}, jwtKey);

            res.status(201).send({
              token: token,
              message: 'User was created successfully'
            });

            debug('User was created successfully');
          }
        });
      }

      emailValidators.emailIsUnique(user.email, res, save);
    }
  };

  const signIn = (req, res) => {
      const token = jwt.sign({user: req.user}, jwtKey);

      res.status(200).send({
        token: token,
        user: req.user
      });

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