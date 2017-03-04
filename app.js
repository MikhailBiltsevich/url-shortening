const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbConfig');
const mongoose = require('mongoose');

const app = express();

const port = 8080;

app.use(bodyParser.json());

mongoose.connect(db.url, function (err) {
    if (err) {
      return console.log(err);
    }

    require('./routes')(app);

    app.listen(port, function () {
        console.log('We are live on ' + port);
      });
  });
