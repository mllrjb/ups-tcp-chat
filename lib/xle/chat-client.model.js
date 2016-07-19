'use strict';

const EventEmitter = require('events').EventEmitter
  , shortid = require('shortid');

/**
 * Emits: disconnect, message
 */
class ChatClient extends EventEmitter {
  constructor(socket) {
    super();
    this._id = shortid.generate();
  }

  get id() {
    return this._id;
  }

  send(message) {
    throw new Error('ChatClient.send must be implemented by a concrete class!');
  }

  disconnect() {
    this.emit('disconnect');
  }
}

module.exports = ChatClient;
