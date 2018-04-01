const express = require('express')
      debug = require('debug')('authRouter');

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
    .post((req, res) => {
      if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send('Bad request, request body incomplete');
      } else {
        // Check if email & password match a user
        // Password needs to be hashed
        User.findOne(req.email, (error, user) => {
          if (error) {
            res.status(500).send(error);
          } else if (user.password !== req.body.password) {
            res.status(401);
            res.send('Unable to authenticate user');
          } else {
            const returnedUser = {
              username: user.username,
              email: user.email,
              _id: user._id
            };

            res.status(200).send(returnedUser);
          }
        });
      }
    });

  return authRouter;
};

module.exports = routes;