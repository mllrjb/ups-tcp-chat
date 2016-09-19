'use strict';

const zpad = require('zpad');

class PkgUidGenerator {

  constructor() {
    this._config = require('./pkg-uid-generator.config');
    this._increment = this._config.uniqueId.start;
  }

  get increment() {
    return this._increment += this._config.uniqueId.increment;
  }

  get cameraId() {
    return this._config.cameraId;
  }

  generate(plcId) {
    return plcId + zpad(this.increment, 5) + this.cameraId;
  }
}

module.exports = new PkgUidGenerator();
