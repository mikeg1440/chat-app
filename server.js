const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chatbot';

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log(`New WS Connection`);

  // handle new user joining
  socket.on('joinRoom', handleJoin)

  // Emit to single new connection
  socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

  // Emit to all connections on new user
  socket.broadcast.emit('message', formatMessage(botName, `User has joined the chat!`));

  // Emit when user leaves
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'User has left the chat'));
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('Username', msg));
  })

  function handleJoin(client){
    console.log(client);
    console.log(`${client.userName} joined ${client.room} room!`);
  }

})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
