const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userModel = new Schema({
  username: {type: String},
  email: {type: String, index: { unique: true }},
  password: {type: String},
  admin: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userModel);