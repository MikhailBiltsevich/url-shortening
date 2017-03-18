var User = require('../models/user.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (app) {
  app.post('/register', function (request, response) {
    if (request.session.user) {
      return response.status(403).send();
    }

    var login = request.body.login;
    var password = request.body.password;
    var repeatedPassword = request.body.repeatedPassword;

    User.create({login: login, dataPassword: {password, repeatedPassword}})
      .then(function (doc) {
        request.session.user = doc.login;
        response.status(200).send();
      })
      .catch(function (err) {
        var responseMessage;
        if (err.code === 11000) {
          responseMessage = 'Пользователь с таким логином уже существует';
        }
        else {
          responseMessage = err.message;
        }
        response.status(405).send(responseMessage);
      });
  });

  app.post('/login', function (request, response) {
    var login = request.body.login;
    var password = request.body.password;

    if (request.session.user) {
      return response.status(403).send();
    }

    User.findOne({login: login})
      .then(function (doc) {
        doc.comparePasswords(password)
          .then(function (isSuccess) {
            if (isSuccess) {
              request.session.user = doc.login;
              return response.status(200).send();
            }
              response.status(404).send();
          });
      })
      .catch(function (err) {
        response.status(405).send();
      });
  });

  app.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        response.redirect('/');
    });
  });
};