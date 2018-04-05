const should = require('should'),
      sinon = require('sinon');

describe('authController', () => {
  describe('signUp()', () => {

    const User = function(user) {
      this.save = () => {};
    };

    const sanitizeMock = () => {
      return {
        trim: sinon.spy(),
        normalizeEmail: sinon.spy()
      }
    };

    const checkBodyMock = () => {
      return {
        isEmail: sinon.spy()
      }
    };

    const res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    const authController = require('../controllers/authController')(User);

    describe('happy paths', () => {

      it('should not allow an empty on post', () => {
        const req = {
          body: {
            email: 'user@test.com',
            password: 'abcd1234',
            username: 'username'
          },
          sanitize: sanitizeMock,
          checkBody: checkBodyMock,
          validationErrors: sinon.spy()
        };

        authController.signUp(req, res);

        // TODO fix unit test
        // res.status.calledWith(201).should.equal(true);
        // res.send.calledWith('User was created successfully').should.equal(true);
        res.send.calledWith('Bad request, request body incomplete').should.equal(false);
      });
    });

    describe('sad paths', () => {

      it('should not allow an empty email on post', () => {
        const req = {
          body: {
            password: 'abcd1234'
          },
          sanitize: sanitizeMock,
          checkBody: checkBodyMock,
          validationErrors: sinon.spy()
        };

        authController.signUp(req, res);

        res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0]);
        res.send.calledWith('Bad request, request body incomplete').should.equal(true);
      });

      it('should not allow an empty password on post', () => {
        const req = {
          body: {
            email: 'user@test.com'
          },
          sanitize: sanitizeMock,
          checkBody: checkBodyMock,
          validationErrors: sinon.spy()
        };

        authController.signUp(req, res);

        res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0]);
        res.send.calledWith('Bad request, request body incomplete').should.equal(true);
      });
    });
  });

  describe('signIn()', () => {
    // TODO create signIn unit tests
  });
});