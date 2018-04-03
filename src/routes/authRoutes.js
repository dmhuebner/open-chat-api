const express = require('express');

const routes = (User) => {
  const authRouter = express.Router();

  const authController = require('../controllers/authController')(User);

  authRouter.route('/signUp')
    .post(authController.signUp);

  authRouter.route('/signIn')
    .post(authController.localPassportStrategy, authController.signIn);

  return authRouter;
};

module.exports = routes;