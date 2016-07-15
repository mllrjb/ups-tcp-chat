var tcpServer = require('./lib/tcp-server/server.js');

var TCP_CHAT_PORT = 9001;

tcpServer.listen(TCP_CHAT_PORT, function() {
  console.log('TCP server listening at localhost:' + TCP_CHAT_PORT);
});
