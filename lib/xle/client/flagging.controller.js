'use strict';

const winston = require('winston');

class FlaggingController {

  constructor() {
    this.builderFactory = require('../response/response-builder.factory');
    this._eventBus = require('../../eventbus');
    this._eventBus.on('client:message', (client, message) => {
      this.identify(client, message);
    });
  }

  flag(client, flag) {
    winston.info('[client-flagging] flagging client %s as %s', client.id, flag);
    client.flag(flag);
  }

  identify(client, message) {
    if (message.messageType === 'FILTER') {
      if (message.dataFields.indexOf('\'SORT\'') > -1) {
        this.flag(client, 'SORT');
      }
      if (message.dataFields.indexOf('\'HB\'') > -1) {
        this.flag(client, 'HB');
      }
    }
  }

}

module.exports = new FlaggingController();
