'use strict';

const winston = require('winston');

class IdentificationController {

  constructor() {
    this.builderFactory = require('../response/response-builder.factory');
    this._eventBus = require('../../eventbus');
    this._eventBus.on('client:message', (client, message) => {
      this.identify(client, message);
    });
  }

  identify(client, message) {
    if (message.messageType === 'LOGON') {
      winston.info('[client-identifier] assigning client %s as %s,%s', client.id, 
        message.senderName, message.senderType);
      client.name = message.senderName;
      client.type = message.senderType;
    }
  }

}

module.exports = new IdentificationController();
