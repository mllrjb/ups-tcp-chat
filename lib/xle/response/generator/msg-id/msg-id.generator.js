'use strict';

const zpad = require('zpad')
    , dateformat = require('dateformat');

class MsgIdGenerator {

  constructor() {
    this._config = require('./msg-id-generator.config');
    this._increment = this._config.uniqueId.start;
  }

  get moduleType() {
    return this._config.moduleType;
  }

  get deviceNumber() {
    return this._config.deviceNumber;
  }

  get increment() {
    return this._increment += this._config.uniqueId.increment;
  }

  next() {
    return [this.moduleType, zpad(this.deviceNumber, 4), dateformat('HH:MM:ss:l'), zpad(this.increment, 11)].join('-');
  }

}

module.exports = new MsgIdGenerator();
