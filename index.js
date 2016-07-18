const TcpServer = require('./lib/tcp/tcp-server.js');

const TCP_CHAT_PORT = 9001;

var tcpServer = new TcpServer({
  port: TCP_CHAT_PORT
});

tcpServer.on('connected', () => {
  console.log('TCP server listening at localhost:' + TCP_CHAT_PORT);  
});

tcpServer.on('client', (client) => {
  client.on('message', (msg) => {
    console.log(client._id + ': ' + msg);
  });
});
