const winston = require('winston')
  , TcpServer = require('./lib/tcp/tcp-server.js')
  , ChatController = require('./lib/xle/chat.controller');

winston.level = 'debug';

const TCP_CHAT_PORT = 9001;

const tcpServer = new TcpServer({
  port: TCP_CHAT_PORT
});

tcpServer.on('connected', () => {
  console.log('TCP server listening at localhost:' + TCP_CHAT_PORT);
});

const chatCtrl = new ChatController(tcpServer); 
