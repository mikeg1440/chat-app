const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin, getCurrentUser, userDisconnect, getRoomUsers} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chatbot';

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

  // handle new user joining
  // socket.on('joinRoom', handleJoin)
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    console.log(`${username} joined ${room} room with ID: ${user.id}!`);

    // Emit welcome message to single new connection
    socket.emit('message', formatMessage(botName, `Welcome to Chat ${user.username}!`));

    // Emit to all connections on new user
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat!`));

    // Emit when user leaves
    socket.on('disconnect', () => {
      io.emit('message', formatMessage(botName, `${user.username} has left the chat`));
    });

  });

  // Handle when user sends a new chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
