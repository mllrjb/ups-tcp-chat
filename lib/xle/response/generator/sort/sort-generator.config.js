'use strict';

const nconf = require('nconf');

module.exports = {
  loop: !!nconf.get('sort:generator:loop'),
  maxDigest: nconf.get('sort:generator:maxDigest') || 20
};
