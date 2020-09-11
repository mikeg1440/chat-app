
const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const socket = io();
socket.on('message', handleMessage);

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
