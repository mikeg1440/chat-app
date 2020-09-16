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
