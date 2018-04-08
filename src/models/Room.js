const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const roomModel = new Schema({
  roomName: {type: String},
  userIds: [{type: String}],
  private: {type: Boolean, default: true},
  roomOwnerId: {type: String}
});

module.exports = mongoose.model('Room', roomModel);