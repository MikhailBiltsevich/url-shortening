var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var Url = require('../models/url');
var User = require('../models/user');

chai.use(chaiHttp);

describe('Url', function () {
  before(function (done) {
    Url.remove({}, function (err) {
      Url.count({}, function (err, number) {
        expect(err).to.be.null;
        expect(number).to.be.empty;

        done();
      });
    });
  });

  before(function (done) {
    User.remove({}, function (err) {
      User.count({}, function (err, number) {
        expect(err).to.be.null;
        expect(number).to.be.empty;

        done();
      });
    });
  });

  describe('Создание новой ссылки', function () {
    it('Ссылка должна быть создана', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/register')
        .send({login: 'mikhail', password: 'qwerty123', repeatedPassword: 'qwerty123'})
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);

          request
            .post('/url')
            .send({longUrl: 'http://vk.com', description: 'social network', tags: ['vk', 'social', 'vkontakte']})
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res).to.be.json;
              expect(res).to.have.status(200);

              done();
            });
        });
    });

    it('Ссылка не должна быть создана (пользователь не авторизован)', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/url')
        .send({longUrl: 'http://vk.com', description: 'social network', tags: ['vk', 'social', 'vkontakte']})
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(403);

          done();
        });
    });

    it('Ссылка не должна быть создана (полная ссылка не указана)', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty123'})
        .end(function (err, res) {
          expect(err).to.not.exist;

          request
            .post('/url')
            .send({description: 'social network', tags: ['vk', 'social', 'vkontakte']})
            .end(function (err, res) {
              expect(err).to.exist;
              expect(res).to.have.status(400);

              done();
            });
        });
    });
  });

  describe('Получение ссылок по тегу', function () {

    it('Ссылки не должны быть найдены, но страница отображается', function (done) {
      var tag = 'js';

      var request = chai.request.agent(app);
      request
        .get('/urls/' + tag)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);

          done();
        });
    });

    it('Ссылки не должны быть найдены, страница не отображается (тег не указан)', function (done) {
      var request = chai.request.agent(app);
      request
        .get('/urls/')
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(404);

          done();
        });
    });
  });

  describe('Поиск ссылки по id', function () {
    var id;
    before(function (done) {
      Url.find(function (err, docs) {
        id = docs[0]._id;
        expect(id).to.exist;
        done();
      });
    });
    
    it('Ссылка должна быть найдена', function (done) {
      var request = chai.request.agent(app);
      request
        .get('/url/' + id)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          done();
        });
    });
    
    it('Ссылка не должна быть найдена (id не указан)', function (done) {
      var request = chai.request.agent(app);
      request
        .get('/url/')
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(404);

          done();
        });
    });

    it('Ссылка не должна быть найдена (id указан)', function (done) {
      var request = chai.request.agent(app);
      var errorId = id - 1;
      request
        .get('/url/' + errorId)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(404);

          done();
        });
    });
  });

  describe('Получение информации о ссылке по id', function () {
    var id;
    before(function (done) {
      Url.find(function (err, docs) {
        id = docs[0]._id;
        expect(id).to.exist;
        done();
      });
    });

    it('Информация о ссылке должна быть получена', function (done) {
      var request = chai.request.agent(app);
      
      request
        .get('/about/' + id.toString(36))
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          done();
        });
    });
    
    it('Информация о ссылке не должна быть найдена (id не указан)', function (done) {
      var request = chai.request.agent(app);
      request
        .get('/about/')
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(404);

          done();
        });
    });

    it('Информация о ссылке не должна быть найдена (id указан)', function (done) {
      var request = chai.request.agent(app);
      var errorId = id - 1;
      request
        .get('/about/' + errorId.toString(36))
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(404);

          done();
        });
    });
  });

  describe('Получение страницы управления ссылками', function () {
    it('Страница должна быть сформирована', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty123'})
        .end(function (err, res) {
          expect(err).to.not.exist;

          request
            .get('/cabinet')
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res).to.have.status(200);

              done();
            });
        });
    });

    it('Страница должна быть сформирована (у пользователя нет ссылок)', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/register')
        .send({login: 'user', password: 'qwerty', repeatedPassword: 'qwerty'})
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);

          request
            .get('/cabinet')
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res).to.have.status(200);

              done();
            });
        });
    });

    it('Страница не должна быть сформирована (пользователь не авторизован)', function (done) {
      var request = chai.request.agent(app);

      request
        .get('/cabinet')
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(403);

          done();
        });
    });
  });

  describe('Перенаправление по сокращенной ссылке', function () {
    var id;
    before(function (done) {
      Url.find(function (err, docs) {
        id = docs[0]._id;
        expect(id).to.exist;
        done();
      });
    });

    it('Перенаправление должно осуществиться', function (done) {
      var request = chai.request.agent(app);

      request
        .get('/' + id.toString(36))
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.redirect;

          done();
        });
    });

    it('Перенаправление не должно осуществиться (ссылка отсутствует)', function (done) {
      var request = chai.request.agent(app);
      var errorId = id - 1;
      request
        .get('/' + errorId.toString(36))
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(404);

          done();
        });
    });
  });

  describe('Изменение ссылки', function () {
    var id;
    before(function (done) {
      Url.find(function (err, docs) {
        id = docs[0]._id;
        expect(id).to.exist;
        done();
      });
    });

    it('Ссылка должна быть изменена', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty123'})
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);

          request
            .put('/url')
            .send({id: id, description: 'social', tags: ['social network', 'vkontakte']})
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res).to.be.json;
              expect(res).to.have.status(200);

              done();
            });
        });
    });

    it('Ссылка не должна быть изменена (пользователь не владеет ссылкой по указанному id)', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/login')
        .send({login: 'user', password: 'qwerty'})
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);

          request
            .put('/url')
            .send({id: id, description: 'social web', tags: ['network', 'vk', 'vkontakte']})
            .end(function (err, res) {
              expect(err).to.exist;
              expect(res).to.have.status(404);

              done();
            });
        });
    });

    it('Изменение несуществующей ссылки', function (done) {
      var request = chai.request.agent(app);
      var errorId = id - 1;

      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty123'})
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);

          request
            .put('/url')
            .send({id: errorId, description: 'social', tags: ['social network', 'vkontakte']})
            .end(function (err, res) {
              expect(err).to.exist;
              expect(res).to.have.status(404);

              done();
            });
        });
    });

    it('Попытка изменения ссылки будучи неавторизованым', function (done) {
      var request = chai.request.agent(app);

      request
        .put('/url')
        .send({id: id, description: 'vkontakte is social network', tags: ['social-network', 'VK', 'ВК', 'Вконтакте',  'vkontakte']})
        .end(function (err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(403);

          done();
        })
    });
  });
});