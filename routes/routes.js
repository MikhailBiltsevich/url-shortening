var User = require('../models/user.js');

module.exports = function (app) {

  app.get('/', function (request, response) {
    response.render('index', {
      user: request.session.user
    });
  });

  app.get('/registration', function (request, response) {
    if (request.session.user) {
      response.redirect('/');
    }
    else {
      response.render('registration', {
      user: request.session.user
    });
    }
  });
};
