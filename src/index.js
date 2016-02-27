if (!global._babelPolyfill) {
  require('babel-polyfill');
}

import errors from 'feathers-errors';
import Mailgun from 'mailgun-js';

export class Service {
  constructor(options = {}) {

    if (!options.apiKey) {
      throw new Error('Mailgun `apiKey` needs to be provided');
    }

    if (!options.domain) {
      throw new Error('Mailgun `domain` needs to be provided');
    }
    this.options = options;
    this.mailgun = new Mailgun({apiKey: options.apiKey, domain: options.domain});
    this._send = this.mailgun.messages().send;
  }

  create(data) {

    if (!data.from) {
      return Promise.reject(new errors.BadRequest('`from` must be specified'));
    }

    if (!data.to) {
      return Promise.reject(new errors.BadRequest('`to` must be specified'));
    }

    if (!data.subject) {
      return Promise.reject(new errors.BadRequest('`subject` must be specified'));
    }

    if (!data.html) {
      return Promise.reject(new errors.BadRequest('`html` must be specified'));
    }

    // Convert array of emails to comma delimited if needed
    var to = data.to;
    if(typeof data.to !== 'string') {
      to = data.to.join(',');
    }

    var mailgunData = {
      from: data.from,
      to: to,
      subject: data.subject,
      html: data.html
    };

    return new Promise((resolve, reject) => {
      this._send(mailgunData, function (err, body) {
        if (err) {
          return reject(err);
        } else {
          return resolve(body);
        }
      });
    });
  }
}

export default function init(options) {
  return new Service(options);
}

init.Service = Service;