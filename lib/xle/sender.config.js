'use strict';

const nconf = require('nconf');

module.exports = {
  name: nconf.get('sender:name') || '0.0.0.0',
  type: nconf.get('sender:type') || 'XLE'
};
