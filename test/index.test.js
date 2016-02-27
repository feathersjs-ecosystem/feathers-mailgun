/*jshint expr: true*/

import { expect } from 'chai';
import assert from 'assert';
import feathers from 'feathers';

import server from './test-app';
import service from '../src';


const mailgun = service({apiKey: 'API_KEY', domain: 'mail.feathersjs.com'});
const app = feathers().use('/mailer', mailgun);

describe('Mailgun Service', function () {

  after(done => server.close(() => done()));

  describe('Initialization', () => {

    describe('when missing api key', () => {
      it('throws an error', () => {
        expect(service.bind(null, {})).to.throw('Mailgun `apiKey` needs to be provided');
      });
    });

    describe('when missing domain', () => {
      it('throws an error', () => {
        expect(service.bind(null, {apiKey: 'API_KEY'})).to.throw('Mailgun `domain` needs to be provided');
      });
    });
  });

  describe('Sending messages', () => {

    describe('when missing from field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`from` must be specified');
          done();
        });
      });
    });

    describe('when missing to field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({from: 'from@from.com'}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`to` must be specified');
          done();
        });
      });
    });

    describe('when missing subject field', () => {
      it('throws an error', (done) => {
        app.service('mailer').create({from: 'from@from.com', to: 'to@to.com'}).then(done).catch(err => {
          assert.equal(err.code, 400);
          assert.equal(err.message, '`subject` must be specified');
          done();
        });
      });
    });

    describe('when missing html field', () => {
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
});
