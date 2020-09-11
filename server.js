const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log(`New WS Connection`);
  // Emit to single new connection
  socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
