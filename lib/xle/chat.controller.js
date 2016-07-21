'use strict';

const winston = require('winston')
  , ChatMessage = require('./chat-message.model');

class ChatController {
  constructor(server, controllers) {
    this._server = server;
    this._clients = [];
    this._responseController = controllers.response;

    this._server.on('client', (client) =>  {
      this._addClient(client);
    });

    this._server.on('disconnected', () => {
      // shut down all clients
      this._removeAllClients();
    });
  }

  _addClient(client) {
    this._clients.push(client);

    client.on('disconnect', () => {
      var idx = this._clients.indexOf(client);
      // client could already be removed
      if (idx) {
        this._clients.splice(idx, 1);
      }
    });

    client.on('message', message => {
      try {
        const chatMessage = ChatMessage.fromText(message);
        const chatResponse = this._responseController.createResponse(chatMessage);  
        if (chatResponse) {
          client.send(chatResponse.toText());
        }
      } catch (err) {
        winston.error('[ChatController] unable to parse %s from %s: %s', message, client.id, err.toString(), err.stack);
      }
    });
  }

  _removeAllClients() {
    winston.info('[ChatController] removing all clients (%d total', this._clients.length);
    this._clients.splice(0).each(c => {
      c.disconnect();
    });
  }

}

module.exports = ChatController;

