var Url = require('../models/url.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (app) {
  app.get('/urls/:tag', function (request, response) {
    var user = request.session.user;
    var tag = request.params.tag;
    Url.find({tags: tag})
      .then(function (docs) {
        response.render('urls', {
          urls: docs,
          user: user,
          webhost: require('../config').webhost,
          tag: tag
        });
      })
      .catch(function (require, response){
        console.log(err);
        response.send();
      });
  });

  app.get('/about/:idUrl', function (request, response) {
    url = request.params.idUrl;
    var id = parseInt(url, 36);
    
    Url.findById(id)
      .then(function (doc) {
        if (doc) {
          var webhost = require('../config').webhost;
          return response.send({url: doc, webhost: webhost});
      }
      response.status(404).send('Ссылка не найдена');
      })
      .catch(function (err) {
        console.log(err);
        response.end();
      })
  });

  app.post('/url', function (request, response) {
    if (!request.session.user) {
      return response.status(403).send();
    }

    var author = request.session.user;
    var longUrl = request.body.longUrl;
    var tags = request.body.tags;
    var description = request.body.description;

    Url.create({author: author, longUrl: longUrl, description: description, tags: tags})
      .then(function (doc) {
        response.send(doc);
      })
      .catch(function (err) {
        console.log(err);
        response.end();
      });
  });

  app.get('/cabinet', function (request, response) {
    var user = request.session.user;
    if (!user) {
      return response.status(403).send();
    }
    Url.find({author: user})
      .then(function (docs) {
        response.render('cabinet', {
          urls: docs,
          user: user,
          webhost: require('../config').webhost
        });
      })
      .catch(function (err) {
        console.log(err);
        response.status(500).send();
      });
  });

  app.get('/:shortUrl', function (request, response) {
    var shortUrl = parseInt(request.params.shortUrl, 36);
    
    Url.findByIdAndUpdate(shortUrl, {$inc: {amountRedirections: 1}})
      .then(function (doc) {
          response.redirect(doc.longUrl);
      })
      .catch(function (err) {
        response.status(404).send();
      });
  });

  app.put('/url', function (request, response) {
    if (!request.session.user) {
      return response.status(403).send();
    }

    var tags = request.body.tags;
    var description = request.body.description;
    var id = request.body.id;

    Url.findById(id)
      .then(function (doc) {
        if (doc.author !== request.session.user) {
          response.status(404).send('Ссылка не принадлежит вам');
        }

        doc.update({$set: {tags: tags, description: description}}, {new: true})
          .then(function (doc){
            response.send(doc);
          })
          .catch(function (err) {
            response.status(500).send('При обновлении документа произошла ошибка, попробуйте позже');
          })
      })
      .catch(function (err) {
        response.status(404).send('Отсутствует ссылка с заданным идентификатором');
      });
  });
}