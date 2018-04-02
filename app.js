const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      logger = require('morgan'),
      passport = require('passport'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      validator = require('express-validator');

let db;
if (process.env.ENV === 'unit-test') {
  db = mongoose.connect('mongodb://localhost/openChatAPI_unitTest');
} else {
  db = mongoose.connect('mongodb://localhost/openChatAPI');
}

const app = express(),
      port = process.env.PORT || 3000;

app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'openChat',
  resave: true,
  saveUninitialized: true
}));
app.use(validator());

require('./src/config/passport.js')(app);

const User = require('./src/models/User');

const authRouter = require('./src/routes/authRoutes')(User);

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Open Chat API!')
});

app.listen(port, () => {
  debug(`Open Chat API is running on PORT: ${chalk.green(port)}`);
});

module.exports = app;