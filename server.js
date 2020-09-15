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

  // handle new user joining a room
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Emit welcome message to single new connection
    socket.emit('message', formatMessage(botName, `Welcome to Chat ${user.username}!`));

    // Emit to all connections on new user
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat!`));

    // Emit users and room info
    io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room), userId: user.id});

    // Emit when user leaves
    socket.on('disconnect', () => {
      const user = userDisconnect(socket.id);

      if (user){
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
      }
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
