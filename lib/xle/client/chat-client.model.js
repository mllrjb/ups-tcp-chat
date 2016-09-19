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
    this._flags = [];
  }

  get id() {
    if (this._name && this._type) {
      return [this.name, this.type].join(',');
    } else {
      return this._id;
    }
  }

  get name() {
    return this._name || '0.0.0.0';
  }

  set name(value) {
    this._name = value;
  }

  get type() {
    return this._type || 'PLC';
  }

  set type(value) {
    this._type = value;
  }

  send(message) {
    throw new Error('ChatClient.send must be implemented by a concrete class!');
  }

  disconnect() {
    this.emit('disconnect');
  }

  isFlagged(value) {
    return this._flags.indexOf(value) > -1;
  }

  flag(value) {
    this._flags.push(value);
  }
}

module.exports = ChatClient;
