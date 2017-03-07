var User = require('../models/user.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (app) {
  app.post('/register', function (request, response) {
    var login = request.body.login;
    var password = request.body.password;
    var repeatedPassword = request.body.repeatedPassword;

    User.create({login: login, dataPassword: {password, repeatedPassword}})
      .then(function (doc) {
        response.redirect('/');
      })
      .catch(function (err) {
        console.log(err.message);
        response.send('При регистрации произошла ошибка. Попробуйте снова');
      });
  });
};