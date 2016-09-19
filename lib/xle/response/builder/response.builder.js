'use strict';

class ResponseBuilder {

  /**
   * @param {string} name Sender Name of the XLE server (e.g. 192.168.17.2)
   * @param {string} type Sender Type of the XLE server (e.g. XLE)
   */
  constructor(name, type) {
    if (new.target === ResponseBuilder) {
      throw new TypeError("Cannot construct ResponseBuilder instances directly");
    }
    if (typeof this.fromMessage !== 'function' || this.fromMessage.length !== 1) {
      throw new TypeError("Must implement #fromMessage(message)");
    }
    if (typeof this.build !== 'function' || this.build.length > 0) {
      throw new TypeError("Must implement #build");
    }
    if (typeof this.hasResponse !== 'function' || this.hasResponse.length > 0) {
      throw new TypeError("Must implement #hasResponse");
    }
    this._name = name;
    this._type = type;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  // hasResponse() {}

  // fromMessage(message) {}

  // build() {}

}

module.exports = ResponseBuilder;
