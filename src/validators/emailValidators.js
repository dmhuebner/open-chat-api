const User = require('../models/User');

function validateEmail(req) {
  req.sanitize('email').trim();
  req.sanitize('email').normalizeEmail();
  req.checkBody('email').isEmail();

  return req;
};

function emailIsUnique(email, res, callback) {
  User.findOne({email: email}, (error, foundUser) => {
    if (foundUser) {
      res.status(400);
      res.send(`${email} has already been used. Email must be unique.`);
    } else {
      callback();
    }
  });
}

module.exports = {
  validateEmail: validateEmail,
  emailIsUnique: emailIsUnique
};