const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

