var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var User = require('../models/user');
var Url = require('../models/url');

chai.use(chaiHttp);

describe('User', function () {
  before(function (done) {
    User.remove({}, function (err) {
      User.count({}, function (err, number) {
        expect(err).to.be.null;
        expect(number).to.be.empty;

        done();
      });
    });
  });

  describe('POST запрос на создание пользователя', function () {

    it('Пользователь должен быть зарегистрирован', function (done) {
      var data = {
        login: 'mikhail',
        password: 'qwerty123',
        repeatedPassword: 'qwerty123'
      }

      var request = chai.request.agent(app);
      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);

          done();
        });
    });

    it('Регистрация не осуществляется, т.к. пользователь только что зарегистрировался и сразу авторизован', function (done) {
      var data = {
        login: 'testUser',
        password: 'qwerty1232',
        repeatedPassword: 'qwerty1232'
      }
      
      var data2 = {
        login: 'testUser2',
        password: 'qwerty1232',
        repeatedPassword: 'qwerty1232'
      }

      var request = chai.request.agent(app);
      
      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(res).to.have.status(200);

          request
            .post('/register')
            .send(data2)
            .end(function (err, res) {
              expect(res).to.have.status(403);
              done();
            });
        });
    });

    it('Регистрация не должна проходить при несовпадении паролей', function (done) {
      var data = {
        login: 'testUser3',
        password: 'qwerty111',
        repeatedPassword: 'qwerty11'
      }

      var request = chai.request.agent(app);

      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);
          
          done();
        });
    });

    it('Регистрация с уже имеющимся логином не должна осуществляться', function (done) {
      var data = {
        login: 'mikhail',
        password: 'qwerty',
        repeatedPassword: 'qwerty'
      }

      var request = chai.request.agent(app);

      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Длина логина должна быть не менее 3 символов (ввод короткой строки)', function (done) {
      var data = {
        login: 'te',
        password: 'qwerty111',
        repeatedPassword: 'qwerty111'
      }

      var request = chai.request.agent(app);

      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Регистрация недопустима при отсутствии полей', function (done) {
      var request = chai.request.agent(app);

      request
        .post('/register')
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Логин на русском языке является некорректным', function (done) {
      var data = {
        login: 'пользователь',
        password: 'qwerty111',
        repeatedPassword: 'qwerty111'
      }

      var request = chai.request.agent(app);
      
      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Пароль не может быть с пробелами', function (done) {
      var data = {
        login: 'testUser4',
        password: 'qwer t y',
        repeatedPassword: 'qwer t y'
      }

      var request = chai.request.agent(app);
      
      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Пароль не может быть с русскими символами', function (done) {
      var data = {
        login: 'testUser5',
        password: 'АБВГдеж',
        repeatedPassword: 'АБВГдеж'
      }

      var request = chai.request.agent(app);
      
      request
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });

    it('Пароль не может быть короче 6 символов', function (done) {
      var data = {
        login: 'testUser5',
        password: 'qwery',
        repeatedPassword: 'qwery'
      }

      chai.request(app)
        .post('/register')
        .send(data)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);

          done();
        });
    });
  });

  describe('Авторизация и выход', function () {
    var request = chai.request.agent(app);

    it('Пользователь должен войти в систему', function (done) {
      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty123'})
        .end(function (err, res) {
          expect(res).to.have.status(200);

          done();
        });
    });

    it('Пользователь не должен войти в систему, так как уже авторизован (сессия имеется)', function (done) {
      request
        .post('/login')
        .send({login: 'testUser', password: 'qwerty1232'})
        .end(function (err, res) {
          expect(res).to.have.status(403);
          expect(err).to.not.be.null;

          done();
        });
    });

    it('Пользователь должен выйти из профиля (завершить сессию) и перенаправиться на главную страницу', function (done) {
      request
        .get('/logout')
        .end(function (err, res) {
          expect(res).to.have.redirect;
          done();
        });
    });

    it('Пользователь не должен авторизоваться по неверному логину', function (done) {
      request
        .post('/login')
        .send({login: 'testtesttest', password: 'qwerty1232'})
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(405);
          done();
        });
    });

    it('Пользователь не должен авторизоваться по неверному паролю', function (done) {
      request
        .post('/login')
        .send({login: 'mikhail', password: 'qwerty1'})
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });

    it('Перенаправление на главную страницу', function (done) {
      request
        .get('/logout')
        .end(function (err, res) {
          expect(res).to.have.redirect;

          done();
        });
    });
  });
});