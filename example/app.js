const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const mailgunService = require('../lib');

// Create a feathers instance.
var app = feathers()
// Enable REST services
  .configure(rest())
  // Enable Socket.io services
  .configure(socketio())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}));

app.use('/mailer', mailgunService({
    apiKey: 'API_KEY',
    domain: 'DOMAIN' // ex. your.domain.com
  }
));

// Send an email!
app.service('mailer').create({
  from: 'cory.m.smith@gmail.com',
  to: 'cory.m.smith@gmail.com',
  subject: 'Mailgun test',
  html: 'Email body'
}).then(function (result) {
  console.log('Sent email', result);
}).catch(err => {
  console.log(err);
});

app.use(errorHandler());

// Start the server.
const port = 3030;

app.listen(port, function () {
  console.log(`Feathers server listening on port ${port}`);
});