const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(session({
  secret: 'this is the black cat of luck', 
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(express.static(__dirname + '/public'));
app.use('/urls/:tag', express.static('public'));

mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name, function (err) {
  if (err) {
    return console.log(err);
  }

  require('./routes')(app);

  app.listen(config.port, function () {
      console.log('We are live on ' + config.port);
    });
});

module.exports = app;