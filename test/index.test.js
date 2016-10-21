import chai, { expect } from 'chai';
import assert from 'assert';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import feathers from 'feathers';

import server from './test-app';
import service from '../src';

const mailgun = service({apiKey: 'API_KEY', domain: 'DOMAIN'});
const app = feathers().use('/mailer', mailgun);

const validParams = {
  from: 'from@from.com',
  to: 'to@to.com',
  subject: 'Email Subject',
  html: 'message html',
  'h:Reply-To': 'reply-here@from.com',
  'random field': 'This will be ignored'
};

const validParamsWithArrayInToField = {
  from: 'from@from.com',
  to: ['to@to.com', 'to2@to.com'],
  subject: 'Email Subject',
  html: 'message html',
  'h:Reply-To': 'reply-here@from.com',
  'random field': 'This will be ignored'
};

describe('Mailgun Service', function () {
  after(done => server.close(() => done()));

  describe('Initialization', () => {
    describe('without an api key', () => {
      it('throws an error', () => {
        expect(service.bind(null, {})).to.throw('Mailgun `apiKey` needs to be provided');
      });
    });

    describe('without a domain', () => {
      it('throws an error', () => {
        expect(service.bind(null, {apiKey: 'API_KEY'})).to.throw('Mailgun `domain` needs to be provided');
      });
    });
  });

  describe('Validation', () => {
    describe('when missing `from` field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`from` must be specified');
          done();
        });
      });
    });

    describe('when missing `to` field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({from: 'from@from.com'}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`to` must be specified');
          done();
        });
      });
    });

    describe('when missing `subject` field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({from: 'from@from.com', to: 'to@to.com'}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`subject` must be specified');
          done();
        });
      });
    });

    describe('when missing `html` field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({
          from: 'from@from.com',
          to: 'to@to.com',
          subject: 'Email Subject'
        }).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`html` must be specified');
          done();
        });
      });
    });
  });

  describe('Sending messages', () => {
    var mailgunSend;
    beforeEach(function (done) {
      mailgunSend =
      sinon
        .stub(app.service('mailer'), '_send', function (data, callback) {
          callback(null, {success: true});
        });
      done();
    });

    afterEach(function (done) {
      mailgunSend.restore();
      done();
    });

    describe('when sending to an array of email addresses', () => {
      it('correctly parses into a comma delimited string', (done) => {
        var expectedParams = {
          from: validParamsWithArrayInToField.from,
          to: 'to@to.com,to2@to.com',
          subject: validParamsWithArrayInToField.subject,
          html: validParamsWithArrayInToField.html,
          'h:Reply-To': validParamsWithArrayInToField['h:Reply-To'],
          'random field': validParamsWithArrayInToField['random field'] // This will be ignored by mailgun-js
        };
        app.service('mailer').create(validParamsWithArrayInToField).then(result => {
          expect(result.success).to.eql(true);
          expect(mailgunSend).to.have.been.calledWith(expectedParams);
          done();
        });
      });
    });

    describe('when all fields are valid', () => {
      it('successfully sends a message', (done) => {
        app.service('mailer').create(validParams).then(result => {
          expect(result.success).to.eql(true);
          expect(mailgunSend).to.have.been.calledWith(validParams);
          done();
        });
      });
    });
  });

  describe('Common functionality', () => {
    it('is CommonJS compatible', () => {
      assert.ok(typeof require('../lib') === 'function');
    });
  });
});
