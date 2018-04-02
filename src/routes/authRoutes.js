const express = require('express')
      debug = require('debug')('app:authRouter'),
      passport = require('passport'),
      bcrypt = require('bcryptjs'),
      emailValidators = require('../validators/emailValidators');

const routes = (User) => {
  const authRouter = express.Router();

  // TODO const authController = require('../controllers/authController')(User);
  authRouter.route('/signUp')
    .post((req, res) => {

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
    });

  authRouter.route('/signIn')
    .post(passport.authenticate('local'), (req, res) => {
      res.status(200).send(req.user);
      debug('login successful');
    });

  return authRouter;
};

module.exports = routes;