# feathers-mailgun

> A [Mailgun](https://www.mailgun.com) Service for [FeatherJS](https://github.com/feathersjs).

## Unmaintained

> This module is no longer maintained. Use [feathers-mailer](https://github.com/feathersjs-ecosystem/feathers-mailer) with the [nodemailer-mailgun-transport](https://github.com/orliesaurus/nodemailer-mailgun-transport) instead.

## Installation

```bash
npm install mailgun-js feathers-mailgun --save
```

## Documentation

```js

// Register the service, see below for an example
app.use('/mailer', mailgunService({
    apiKey: "YOUR_MAILGUN_API_KEY",
    domain: 'YOUR_MAILGUN_DOMAIN' // ex. your.domain.com
  }
));

// Use the service
var email = {
   from: 'FROM_EMAIL',
   to: 'TO_EMAIL',
   subject: 'Mailgun test',
   html: 'This is the email body'
};

app.service('mailer').create(email).then(function (result) {
  console.log('Sent email', result);
}).catch(err => {
  console.log(err);
});

```

## Complete Example

Here's an example of a Feathers server with a `mailer` Mailgun service.

```js
import rest = from 'feathers-rest';
import feathers from 'feathers';
import bodyParser from 'body-parser';
import mailgunService from '../lib';


// Create a feathers instance.
var app = feathers()
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}));

// Register the Mailgun service
app.use('/mailer', mailgunService({
    apiKey: "YOUR_MAILGUN_API_KEY",
    domain: 'YOUR_MAILGUN_DOMAIN' // ex. your.domain.com
  }
));

// Use the service
var email = {
   from: 'FROM_EMAIL',
   to: 'TO_EMAIL',
   subject: 'Mailgun test',
   html: 'This is the email body'
};

app.service('mailer').create(email).then(function (result) {
  console.log('Sent email', result);
}).catch(err => {
  console.log(err);
});

// Start the server.
var port = 3030;
app.listen(port, function() {
  console.log(`Feathers server listening on port ${port}`);
});
```

You can run this example by using `node examples/app`. Make sure you've added your 

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).


## Author

[Cory Smith](https://github.com/corymsmith)
