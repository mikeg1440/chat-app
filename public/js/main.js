
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

function addNotification(username){
  const userElement = document.querySelector(`#${username}`);
  debugger
  if (userElement){
    if (userElement.childElementCount === 0){
      let badge = document.createElement('span');
      badge.classList.add('badge');
      badge.innerText = '!';
      userElement.appendChild(badge);
    }
  }
}

function removeNotification(username){
  debugger;
  const userElement = document.querySelector(`#${username}`);
  if (userElement && userElement.childElementCount === 1){
    userElement.firstElementChild.remove();
  }
}

function handlePrivateMessage({msg}){
  let chatroom;
  // check to see if chatroom exists already, if not create a new one
  if (privateChats.hasOwnProperty(msg.username)){
    chatroom = privateChats[msg.username];
    addPrivateMessage(chatroom, msg);
  }else {
    chatroom = createChatbox(msg.username);
    chatroom.classList.add('in-active');
    addPrivateMessage(chatroom, msg);
  }

  // add notification if chat is not active
  if (!chatroom.classList.contains('active')){
    addNotification(msg.username);
  }

}

function createChatbox(username){
  let privateChatBox = document.createElement('div');
  privateChatBox.classList.add('chat-messages');

  privateChatBox.setAttribute('id', `privateChat-${username}`);

  document.querySelector('#chat-container').appendChild(privateChatBox);
  privateChats[username] = privateChatBox;

  return privateChatBox;
}

function handleRoomUsers(chat){
  // Update room name on page
  roomNameDisplay.innerText = chat.room;

  displayUsers(chat.users);
}

function displayUsers(users){
  userListDisplay.innerHTML = `${users.map(user => `<li class='user-btn' id=${user.username}>${user.username}</li>`).join('')}`;
}


function addPrivateMessage(chatbox, msg){
  // const chatBox = document.querySelector('.chat-messages.active');
  if (!chatbox) return;

  const newDiv = document.createElement('div');

  newDiv.classList.add('message');
  newDiv.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`

  chatbox.appendChild(newDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
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
  const chatbox = document.querySelector('.chat-messages.active');

  // check if the active chat is private
  if (chatbox.getAttribute('id').match(/privateChat/)){
    let username = chatbox.getAttribute('id').match(/privateChat-([\w]+)/)[1]
    socket.emit('privateMessage', {username, msg});
  }else {
    socket.emit('chatMessage', msg);
  }

  e.target.reset();
  e.target.elements.msg.focus();
})

// Highlight username when clicked to show active chat
function toggleUserHighlight(userElement){
  // check if userElement is already active
  if (userElement.classList.contains('active-user-chat')){
    userElement.classList.remove('active-user-chat');
    while (userElement.lastElementChild.tagName === 'SPAN'){
      userElement.lastElementChild.remove();
    }
  }else {
    userElement.classList.add('active-user-chat');
  }
}

// When user clicks on a username from the user list
userListDisplay.addEventListener('click', (e) => {
  let username = e.target.innerText;

  // filter out non-alpha chars
  username = username.match(/[\w]+/)[0];

  toggleUserHighlight(e.target);

  removeNotification(username);

  if (privateChats.hasOwnProperty(username)){
    const privateChat = document.querySelector(`#privateChat-${username}`);
    let currentChat = document.querySelector('.chat-messages.active');

    currentChat.classList.remove('active');
    currentChat.classList.add('in-active');
    privateChat.classList.remove('in-active');
    privateChat.classList.add('active');

    privateChat.classList.add('active');

  }else {

    let newChat = createChatbox(username);

    chatBox.classList.remove('active');
    chatBox.classList.add('in-active');
    newChat.classList.add('active');
  }
});
