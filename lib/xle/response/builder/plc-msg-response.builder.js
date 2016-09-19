'use strict';

const zpad = require('zpad')
    , winston = require('winston')
    , ResponseBuilder = require('./response.builder.js')
    , Message = require('../../message/message.model')
    , sortDestinationGenerator = require('../generator/sort/sort-destination.generator')
    , msgIdGenerator = require('../generator/msg-id/msg-id.generator')
    , pkgUidGenerator = require('../generator/pkg-uid/pkg-uid.generator');

class PlcMsgResponseBuilder extends ResponseBuilder {

  hasResponse() {
    return !!this._message;
  }

  fromMessage(message) {
    if (!message.dataFields || message.dataFields.length !== 1) {
      winston.warn('[plc-msg-response] invalid PLC_MSG - missing data field \'plcId\'');
    } else {
      this._message = message;
    }
    return this;
  }

  build() {
    const plcId = this._message.dataFields[0];

    const msgId = msgIdGenerator.next()
        , pkgGuid = pkgUidGenerator.generate(plcId)
        // TODO: is it ok for this to be unreadable?
        , trkNum = '??????????????????'
        // TODO: is it ok to hard-code this?
        , dims = 'E|008400620009'
        , destinations = sortDestinationGenerator.next().map(d => {
          return zpad(d, 5);
        });
    return new Message(this.name, this.type, undefined, undefined, 'SORT', [
      msgId, pkgGuid, trkNum, dims
    ].concat(destinations));
  }
  
}

module.exports = PlcMsgResponseBuilder;
