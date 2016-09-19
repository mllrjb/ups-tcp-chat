'use strict';

const winston = require('winston')
    , Message = require('../message/message.model');

class RouterController {

  constructor() {
    this._eventBus = require('../../eventbus');
    this._clients = [];

    this._eventBus.on('client:response', builder => {
      this.route(builder);
    });

    this._eventBus.on('server:client', client =>  {
      this.addClient(client);
    });

    this._eventBus.on('server:disconnected', () => {
      // shut down all clients
      this.removeAllClients();
    });
  }

  addClient(client) {
    this._clients.push(client);

    client.on('disconnect', () => {
      var idx = this._clients.indexOf(client);
      // client could already be removed
      if (idx > -1) {
        this._clients.splice(idx, 1);
      } else {
        winston.warn('[RouterController] client %s is already removed', client.id);
      }
    });

    client.on('message', data => {
      try {
        const message = Message.fromText(data);
        this._eventBus.emit('client:message', client, message);
      } catch (err) {
        winston.error('[RouterController] unable to parse %s from %s: %s', data, client.id, err.toString());
        winston.debug('[RouterController] ', err.stack);
      }
    });
  }

  route(builder) {
    const response = builder.build();
    this._clients.forEach(client => {
      // only send messages to clients that are flagged for that message type
      if (client.isFlagged(response.messageType)) {
        response.receiverName = client.name;
        response.receiverType = client.type;
        client.send(response.toText());
      }
    });
  }

  removeAllClients() {
    winston.info('[RouterController] removing all clients (%d total', this._clients.length);
    this._clients.splice(0).each(c => {
      c.disconnect();
    });
  }
}

module.exports = new RouterController();
