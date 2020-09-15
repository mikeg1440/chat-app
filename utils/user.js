
const users = [];

module.exports = {
  userJoin,
  getCurrentUser,
  userDisconnect,
  getRoomUsers
}

function userJoin(id, username, room){
  let currentUser = getCurrentUser(id);
  if (currentUser) return currentUser;


  const user = {id, username, room};

  users.push(user);

  return user;
}

function getCurrentUser(id){
  return users.find(user => user.id === id);
}

function userDisconnect(id){
  const index = users.findIndex( user => user.id === id);
  if (index !== -1){
    // return users.splice(index, 1);
    return users[index];
  }
}

function getRoomUsers(room){
  return users.filter(user => user.room === room);
}
