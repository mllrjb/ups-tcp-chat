'use strict';

const nconf = require('nconf');

module.exports = {
  port: nconf.get('server:port')
};
