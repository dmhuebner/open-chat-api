const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userModel = new Schema({
  username: {type: String},
  email: {type: String},
  password: {type: String},
  admin: {type: Boolean, default: false}
});

module.exports = mongoose.models('User', userModel);