const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbConfig');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(session({
  secret: 'this is the black cat of luck', 
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

mongoose.connect(db.url, function (err) {
  if (err) {
    return console.log(err);
  }

  require('./routes')(app);

  app.listen(port, function () {
      console.log('We are live on ' + port);
    });
});
