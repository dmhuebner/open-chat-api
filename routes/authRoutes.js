const express = require('express');

const routes = (User) => {
  const authRouter = express.Router();

  // TODO const authController = require('../controllers/authController')(User);
  authRouter.route('/')
    .get();

  return authRouter;
};

module.exports = routes;