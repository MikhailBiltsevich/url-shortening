var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    match: /^\w{3,}$/
  },
  hashedPassword: {
    type: String,
    required: true,
  }
});

userSchema.virtual('dataPassword')
  .set(function (data) {
    var isCorrectPassword = (data.password.search(/^\w{6,}$/) === 0 && data.password === data.repeatedPassword);
    if (isCorrectPassword) {
      this.hashedPassword = bcrypt.hashSync(data.password, 10);
    }
    else {
      throw new Error('Пароль должен быть не менее 6 символов и состоять из цифр, латинских букв и (или) нижнего подчеркивания');
    }
  });

userSchema.methods.comparePasswords = function (password) {
  return bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model('User', userSchema);