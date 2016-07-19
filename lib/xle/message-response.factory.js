'use strict';

const zpad = require('zpad')
  , dateformat = require('dateformat')
  , messageTypes = require('./message-types.enum')
  , ChatMessage = require('./chat-message.model');

var messageIdCounter = 1;

function generateMessageId() {
  return ['ND', '0001', dateformat('HH:MM:ss:l'), zpad(messageIdCounter++, 11)].join('-');
}

class MessageResponseFactory {

  static createResponse(chatMessage) {
    if (chatMessage.messageType === messageTypes.plcMsg) {
      // create sort message
      const sortMessage = MessageResponseFactory.flipSenderReceiver(chatMessage);
      sortMessage.messageType = messageTypes.sort;
      sortMessage.dataFields = [generateMessageId(), zpad(1, 5)];
      return sortMessage;
    }
    return;
  }

  static flipSenderReceiver(chatMessage) {
    return new ChatMessage(chatMessage.receiverName,
      chatMessage.receiverType, chatMessage.senderName, chatMessage.senderType);
  }
  
}

module.exports = MessageResponseFactory;
