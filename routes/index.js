const routes = require('./routes');
const userRoutes = require('./userRoutes');
const urlRoutes = require('./urlRoutes');

module.exports = function (app) {
  routes(app);
  userRoutes(app);
  urlRoutes(app);
};