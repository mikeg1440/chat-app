
let privateChats = {};


export function addNotification(username){
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

export function removeNotification(username){
  debugger;
  const userElement = document.querySelector(`#${username}`);
  if (userElement && userElement.childElementCount === 1){
    userElement.firstElementChild.remove();
  }
}

export function createChatbox(username){
  let privateChatBox = document.createElement('div');
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
  debugger
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


export function addPrivateMessage(chatbox, msg){
  // const chatBox = document.querySelector('.chat-messages.active');
  debugger
  // if (!chatbox) return;

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

}
