if (!global._babelPolyfill) { require('babel-polyfill'); }

import errors from 'feathers-errors';
import Mailgun from 'mailgun-js';

class Service {
  constructor(options = {}) {

    if (!options.apiKey) {
      throw new Error('Mailgun `apiKey` needs to be provided');
    }

    if (!options.domain) {
      throw new Error('Mailgun `domain` needs to be provided');
    }

    this.options = options;
    this.mailgun = new Mailgun({apiKey: options.apiKey, domain: options.domain});
  }

  _send(data, callback) {
    return this.mailgun.messages().send(data, callback);
  }

  create(data) {
    return new Promise((resolve, reject) => {
      this._validateParams(data);
      this._send(this._formatData(data), function (err, body) {
        if (err) {
          return reject(err);
        } else {
          return resolve(body);
        }
      });
    });
  }

  _validateParams(data) {
    if (!data.from) {
      throw new errors.BadRequest('`from` must be specified');
    }

    if (!data.to) {
      throw new errors.BadRequest('`to` must be specified');
    }

    if (!data.subject) {
      throw new errors.BadRequest('`subject` must be specified');
    }

    if (!data.html) {
      throw new errors.BadRequest('`html` must be specified');
    }
  }

  // Convert array of emails to comma delimited if needed
  _formatData(data) {
    var to = data.to;
    if (typeof data.to === 'object') {
      to = data.to.join(',');
    }

    return Object.assign(data, { to: to });
  }
}

export default function init(options) {
  return new Service(options);
}

init.Service = Service;
