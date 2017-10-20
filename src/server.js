const http = require('http');
const express = require('express');
const io = require('socket.io');
import { adminListeners } from './action';
import redis from './database/redis';

const logger = console;

// Express app
const app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/../public'));

// redirection
app.get('/', (request, response) => {
  response.redirect('/index.html');
});

process.once('SIGINT', () => {
  logger.info('Server is down');
  redis.disconnect(() => {
    process.exit(0);
  });
});

// HTTP server
const server = http.Server(app);
server.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

// Web socket
const ws = io(server);
ws.on('connection', socket => {
  socket.broadcast.emit('news', { hello: 'world' });

  socket.on('ping', data => {
    soccket.emit('pong', data);
  });

  adminListeners(socket, redis);
});
