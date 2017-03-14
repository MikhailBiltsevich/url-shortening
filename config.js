var config = {};

config.db = {};
config.port = 8080;
config.webhost = 'http://localhost:' + config.port + '/';

config.db.host = '127.0.0.1';//localhost
config.db.port = 27017;
config.db.name = 'url-shortening';

module.exports = config;