'use strict';

class ReceiverController {

  constructor() {
    this.builderFactory = require('../response/response-builder.factory');
    this._eventBus = require('../../eventbus');
    this._eventBus.on('client:message', (client, message) => {
      this.handle(message);
    });
  }

  handle(message) {
    const builder = this.builderFactory
      .getBuilder(message.messageType)
      .fromMessage(message);
    if (builder.hasResponse()) {
      this._eventBus.emit('client:response', builder);  
    }
  }

}

module.exports = new ReceiverController();
