import {
  addNotification,
  removeNotification, 
  createChatbox,
  handleMessage,
  handlePrivateMessage,
  addPrivateMessage,
  activateChat,
  toggleUserHighlight } from './chat.js'

const chatForm = document.getElementById('chatForm');
const roomNameDisplay = document.getElementById('roomName');
const userListDisplay = document.getElementById('users');
const disconnectBtn = document.getElementById('disconnectBtn');

const socket = io();
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });    // grab the username and room from the URL query parameters

socket.on('message', handleMessage);
socket.on('roomUsers', handleRoomUsers);
socket.on('privateMessage', handlePrivateMessage);

// Join chatroom
socket.emit('joinRoom', {username, room});

// listen for when user clicks leave button
disconnectBtn.addEventListener('click', (e) => {
  socket.emit('disconnect', {username, room})
})


function handleRoomUsers(chat){
  // Update room name on page
  roomNameDisplay.innerText = chat.room;

  displayUsers(chat.users);
}

function displayUsers(users){
  userListDisplay.innerHTML = `${users.map(user => `<li class='user-btn' id=${user.username}>${user.username}</li>`).join('')}`;
}


// When user sends a chat message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  sendMessage(msg);

  e.target.reset();
  e.target.elements.msg.focus();
})

function sendMessage(msg){
  const chatbox = document.querySelector('.chat-messages.active');

  // check if the active chat is private
  if (chatbox.getAttribute('id').match(/privateChat/)){
    let username = chatbox.getAttribute('id').match(/privateChat-([\w]+)/)[1]
    socket.emit('privateMessage', {username, msg});
  }else {
    socket.emit('chatMessage', msg);
  }
}


// When user clicks on a username from the user list
userListDisplay.addEventListener('click', (e) => {
  let username = e.target.innerText;

  // filter out non-alpha chars
  username = username.match(/[\w]+/)[0];

  toggleUserHighlight(e.target);

  removeNotification(username);

  activateChat(username);
});
