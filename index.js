const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('pages/index');
});

const server = http.Server(app);
server.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

const ws = io(server);
ws.on('connection', socket => {
  socket.emit('news', { hello: 'world' });

  socket.on('ping', (data) => {
    socket.emit('pong', data);
  })
});
