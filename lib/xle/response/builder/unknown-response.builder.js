'use strict';

const ResponseBuilder = require('./response.builder.js');

class UnknownResponseBuilder extends ResponseBuilder {

  hasResponse() {
    return false;
  }

  fromMessage(message) {
    return this;
  }

  build() {
    throw new Error('Attempting to build response for unknown type'); 
  }
  
}

module.exports = UnknownResponseBuilder;
