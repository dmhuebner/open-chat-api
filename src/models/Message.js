const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const messageModel = new Schema({
  username: String,
  dateCreated: Date,
  roomId: {type: String, index: true},
  content: String,
  userId: String
});

module.exports = mongoose.model('Message', messageModel);