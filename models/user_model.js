const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const userSchema = new Schema({ 
  username: String,
  email: String,
  password: String,
  status: Number
});
const User = mongoose.model('users', userSchema);
// It will create a ‘Users’ collection!
module.exports = User;