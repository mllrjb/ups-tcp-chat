'use strict';

class ChatController {
  constructor(server) {
    this._clients = [];
    server.on('client', client => {
      this._clients.push(client);

      client.on('disconnect', () => {
        this._clients.splice(this._clients.indexOf(client));
      });

      client.on('message', message => {
        client.send('foobar');
      });
    });

    server.on('disconnected', () => {
      // shut down all clients
    });
  }

}

module.exports = ChatController;
// keeps track of clients
// listens for messages
// routes messages
// generates new messages

// tcpServer.on('client', (client) => {
//   client.on('message', (msg) => {
//     console.log(client._id + ': ' + msg);
//   });
// });
