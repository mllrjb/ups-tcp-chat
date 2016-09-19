'use strict';

const nconf = require('nconf');

module.exports = {
  moduleType: nconf.get('msgid:moduleType') || 'AS',
  deviceNumber: nconf.get('msgid:deviceNumber') || 1,
  uniqueId: {
    start: nconf.get('msgid:uniqueId:start') || 0,
    increment: nconf.get('msgid:uniqueId:increment') || 1
  }
};
