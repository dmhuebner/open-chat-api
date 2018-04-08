const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const messageModel = new Schema({
  username: String,
  dateCreated: Date,
  roomId: String,
  content: String,
  userId: String
});

module.exports = mongoose.model('Message', messageModel);