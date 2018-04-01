const express = require('express')
      debug = require('debug')('app:authRouter'),
      passport = require('passport');

const routes = (User) => {
  const authRouter = express.Router();

  // TODO const authController = require('../controllers/authController')(User);
  authRouter.route('/signUp')
    .post((req, res) => {
      // Password needs to be hashed
      const user = new User(req.body);
      if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send('Bad request, request body incomplete');
      } else {
        user.save((error) => {
          if (error) {
            res.status(400);
            res.send(error);
          } else {
            res.status(201);
            res.send('User was created successfully');
          }
        });
      }
      // Log user in
      // req.login(req.body, () => {
      //   res.status(204).send('User created successfully');
      // });
    });

  authRouter.route('/signIn')
    .post(passport.authenticate('local'), (req, res) => {
      res.status(200).send(req.user);
      debug('login successful');
    });

  return authRouter;
};

module.exports = routes;