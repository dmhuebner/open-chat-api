const express = require('express')
      debug = require('debug')('authRouter');

const routes = (User) => {
  const authRouter = express.Router();

  // TODO const authController = require('../controllers/authController')(User);
  authRouter.route('/signUp')
    .post((req, res) => {
      // Create user
      // Log user in
      // req.login(req.body, () => {
      //   res.status(204).send('User created successfully');
      // });

      res.json(req.body);
    });

  // authRouter.route('/profile')
  //   .get((req, res) => {
  //     res.json(req.user);
  //   });

  return authRouter;
};

module.exports = routes;