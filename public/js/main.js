
const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const roomNameDisplay = document.getElementById('roomName');
const userListDisplay = document.getElementById('users');
const disconnectBtn = document.getElementById('disconnectBtn');

const socket = io();
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', handleMessage);
socket.on('roomUsers', handleRoomUsers);
socket.on('privateMessage', handlePrivateMessage);

// Join chatroom
socket.emit('joinRoom', {username, room});

// listen for when user clicks leave button
disconnectBtn.addEventListener('click', (e) => {
  socket.emit('disconnect', {username, room})
})

function handlePrivateMessage({username, msg}){
  alert(`User ${username} sent a message`);
}

function handleRoomUsers(chat){

  // Update room name on page
  roomNameDisplay.innerText = chat.room;

  displayUsers(chat.users);
}

function displayUsers(users){
  userListDisplay.innerHTML = `${users.map(user => `<li class='user-btn' id=${user}>${user.username}</li>`).join('')}`;
}


function handleMessage(msg){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// When user sends a chat message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  e.target.reset();
  e.target.elements.msg.focus();
})

// When user clicks on a username from the user list
userListDisplay.addEventListener('click', (e) => {
  const user = e.target.innerHTML;
  alert(`Sending msg to ${user}`)
  socket.emit('privateMessage', {user, msg: 'Test message'});
});
