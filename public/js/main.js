
const chatForm = document.getElementById('chatForm');
const roomNameDisplay = document.getElementById('roomName');
const userListDisplay = document.getElementById('users');
const disconnectBtn = document.getElementById('disconnectBtn');
let privateChats = {};

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

function handlePrivateMessage({msg}){
  if (privateChats.hasOwnProperty(msg.username)){
    let chatroom = privateChats[msg.username]
    if (chatroom.style.display === 'none'){
      chatroom.style.display = 'block';
    }
  }else {
    createChatbox(msg.username);
  }
  handleMessage(msg);
}

function createChatbox(username){
  let privateChatBox = document.createElement('div');
  privateChatBox.classList.add('chat-messages');
  privateChatBox.classList.add('active');
  privateChatBox.setAttribute('id', `privateChat-${username}`);
  chatBox.style.display = 'none';
  chatBox.classList.remove('active');
  document.querySelector('#chat-container').appendChild(privateChatBox);
  privateChats[username] = chatBox;
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
  const chatBox = document.querySelector('.chat-messages.active');
  if (!chatBox) return;

  const newDiv = document.createElement('div');

  newDiv.classList.add('message');
  newDiv.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`

  chatBox.appendChild(newDiv);
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
