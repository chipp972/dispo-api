# Dispo API

## Rest API

### Authentication

Authenticate admin and users

### Data

Fetch data from the api and create/update/delete data

## Websocket API

Should be used to fetch data and get real time updates

Event types :

* READ
* CREATE
* EDIT
* REMOVE

Data types :

* USER
* COMPANY
* COMPANYTYPE
* COMPANYPOPULARITY

### requests

You can requests users, company, company types and company popularities on the
websocket

```javascript
socket.emit('READ_COMPANYTYPE'); // will get all company types
socket.emit('READ_COMPANY', { _id: 'a company id' }); // request all companies matching the id
socket.emit('READ_COMPANYPOPULARITY', { companyId: 'a company id ' });
```

The server will emit a response with the same event name and the result (an
array):

```javascript
socket.on('READ_COMPANYTYPE', companyTypeList => {
  console.log(`Here are my companyTypes : ${companyTypeList}`);
});
```

### events

Events will be sent every time someone create, update or delete data in the app
(including the client that was at the origin of the event).

```javascript
socket.on('CREATE_COMPANY', company => {
  console.log(`The company ${company.name} was created`);
});
```

## Heroku Documentation

For more information about using Node.js on Heroku, see these Dev Center
articles:

* [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
* [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
* [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
* [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
