var User = require('../models/user.js');

module.exports = function (app) {

  app.get('/', function (request, response) {
    response.send();
  });

};
