const routes = require('./routes');
const userRoutes = require('./userRoutes');

module.exports = function (app) {
  routes(app);
  userRoutes(app);
};
