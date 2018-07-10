const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      logger = require('morgan'),
      passport = require('passport'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      validator = require('express-validator'),
      http = require('http'),
      commonEventEmitter = require('./src/services/eventEmitter');

let db;
if (process.env.ENV === 'unit-test') {
  db = mongoose.connect('mongodb://localhost/openChatAPI_unitTest');
} else {
  db = mongoose.connect('mongodb://localhost/openChatAPI');
}

const app = express(),
      port = process.env.PORT || 3000,
      server = http.Server(app);

// Middleware
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

require('./src/config/passport.js')(app);

const User = require('./src/models/User');
const Room = require('./src/models/Room');
const Message = require('./src/models/Message');

const authRouter = require('./src/routes/authRoutes')(User);
const roomRouter = require('./src/routes/roomRoutes')(Room, User);
const messageRouter = require('./src/routes/messageRoutes')(Message, Room);

// Main routes
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomRouter);

// Nested routes
roomRouter.use('/:roomId/messages', messageRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Open Chat API!')
});

// Socket IO events
const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function(socket) {
  debug(chalk.green('Client connected to the socket'));

  commonEventEmitter.on('new-message', (newRoomMessage) => {
    socket.emit('new-room-message', newRoomMessage);
  });
});

server.listen(port, () => {
  debug(`Open Chat API is running on PORT: ${chalk.green(port)}`);
});

module.exports = app;