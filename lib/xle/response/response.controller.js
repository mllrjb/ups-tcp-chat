'use strict';

const zpad = require('zpad')
  , dateformat = require('dateformat')
  , messageTypes = require('../chat-message-types.enum')
  , ChatMessage = require('../chat-message.model');

class ResponseController {

  constructor(controllers) {
    this.messageIdCounter = 1;
    this._destinationController = controllers.destination;
  }

  /**
   * PRIVATE methods
   */

  /**
   * Flip receiver and sender
   */
  _flipClients(chatMessage) {
    return new ChatMessage(chatMessage.receiverName,
      chatMessage.receiverType, chatMessage.senderName, chatMessage.senderType);
  }

  _nextMessageId() {
    return ['ND', '0001', dateformat('HH:MM:ss:l'), zpad(this.messageIdCounter++, 11)].join('-');
  }

  _nextDestination() {
    return this._destinationController.next();
  }

   /**
    * Handle a plcMsg by responding with a sortMsg + destinations
    */
  _handlePlcMsg(plcMsg) {
    const dest = this._nextDestination();
    if (dest && dest.length) {
      const sortMsg = this._flipClients(plcMsg);
      sortMsg.messageType = messageTypes.sort;
      sortMsg.dataFields = ([this._nextMessageId()].concat(dest.map(d => {
        return zpad(d, 5);
      })));
      return sortMsg;
    }
    // no destinations? don't respond
    return undefined;
  }

  /**
   * PUBLIC methods
   */

  createResponse(chatMessage) {
    if (messageTypes.plcMsg === chatMessage.messageType) {
      return this._handlePlcMsg(chatMessage);
    }
    // no defined response...
    return;
  }
  
}

module.exports = ResponseController;
