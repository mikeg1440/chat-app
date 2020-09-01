
let privateChats = {};


export function addNotification(username){
  const userElement = document.querySelector(`#${username}`);
  if (userElement){
    if (userElement.childElementCount === 0){
      const badge = document.createElement('span');
      badge.classList.add('badge');
      badge.innerText = '!';
      userElement.appendChild(badge);
    }
  }
}

export function removeNotification(username){
  const userElement = document.querySelector(`#${username}`);
  if (userElement && userElement.childElementCount === 1){
    userElement.firstElementChild.remove();
  }
}

export function createChatbox(username){
  const privateChatBox = document.createElement('div');
  privateChatBox.classList.add('chat-messages');
  privateChatBox.setAttribute('id', `privateChat-${username}`);
  document.querySelector('#chat-container').appendChild(privateChatBox);
  privateChats[username] = privateChatBox;

  return privateChatBox;
}

export function handleMessage(msg){
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


export function handlePrivateMessage({msg}){
  let chatroom;
  // check to see if chatroom exists already, if not create a new one
  if (privateChats.hasOwnProperty(msg.username)){
    chatroom = privateChats[msg.username];
  }else {
    chatroom = createChatbox(msg.username);
    chatroom.classList.add('in-active');
  }
  addPrivateMessage(chatroom, msg);

  // add notification if chat is not active
  if (!chatroom.classList.contains('active')){
    addNotification(msg.username);
  }

}


export function addPrivateMessage(chatbox, msg){

  const newDiv = document.createElement('div');

  newDiv.classList.add('message');
  newDiv.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`

  chatbox.appendChild(newDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}


export function activateChat(username){
  const currentChat = document.querySelector('.chat-messages.active');
  let newChat;

  if (privateChats.hasOwnProperty(username)){
    newChat = document.querySelector(`#privateChat-${username}`);
    newChat.classList.remove('in-active');
  }else {
    newChat = createChatbox(username);
  }

  currentChat.classList.remove('active');
  currentChat.classList.add('in-active');

  newChat.classList.add('active');
}

// Highlight username when clicked to show active chat
export function toggleUserHighlight(userElement){
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
