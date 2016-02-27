const feathers = require('feathers');
const service = require('../lib').default;

// Create the mailgun service
const mailgunService = service({
  apiKey: 'test',
  domain: 'mail.feathersjs.com'
});

// Create a feathers instance with a mailer service
var app = feathers()
  .use('/mailer', mailgunService);


// Start the server.
const port = 3030;

module.exports = app.listen(port);