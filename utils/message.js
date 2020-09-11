
const moment = require('moment');

module.exports = formatMessage;

function formatMessage(username, text){
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
