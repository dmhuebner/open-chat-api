const express = require('express')
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      logger = require('morgan');

let db;
if (process.env.ENV === 'unit-test') {
  db = mongoose.connect('mongodb://localhost/openChatAPI_unitTest');
} else {
  db = mongoose.connect('mongodb://localhost/openChatAPI');
}

const app = express(),
      port = process.env.PORT || 3000;

app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const authRouter = require('./routes/authRoutes')();

app.use('/api/openChat', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Open Chat API!')
});

app.listen(port, () => {
  debug(`Open Chat API is running on PORT: ${chalk.green(port)}`);
});

module.exports = app;