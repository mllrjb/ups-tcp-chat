'use strict';

const nconf = require('nconf')
    , PlcMsgResponseBuilder = require('./builder/plc-msg-response.builder')
    // , SortConfirmationResponseBuilder = require('./builder/sort-confirmation-response.builder')
    , UnknownResponseBuilder = require('./builder/unknown-response.builder');

class ResponseBuilderFactory {

  constructor() {
    this._config = require('../sender.config');
  }

  get senderName() {
    return this._config.name;
  }

  get senderType() {
    return this._config.type;
  }

  getBuilder(messageType) {
    switch (messageType) {

      case 'PLC_MSG':
        return new PlcMsgResponseBuilder(this.senderName, this.senderType);
        break;
      // case 'SORTCONF':
      //   return new SortConfirmationResponseBuilder(this.senderName, this.senderType);
      //   break;
      default:
        return new UnknownResponseBuilder();
    }

  }

}

module.exports = new ResponseBuilderFactory();
