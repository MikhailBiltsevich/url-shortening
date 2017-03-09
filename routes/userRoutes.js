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
        req.session.user = login;
        response.redirect('/');
      })
      .catch(function (err) {
        console.log(err.message);
        response.send('При регистрации произошла ошибка. Попробуйте снова');
      });
  });

  app.post('/login', function (request, response) {
    var login = request.body.login;
    var password = request.body.password;

    User.findOne({login: login})
      .then(function (doc) {
        doc.comparePasswords(password)
          .then(function (isSuccess) {
            if (isSuccess) {
              request.session.user = doc.login;
            }
            response.redirect('/');
          });
      })
      .catch(function (err) {
        response.redirect('/');
      });
  });

  app.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
    });
    response.redirect('/');
  });
};