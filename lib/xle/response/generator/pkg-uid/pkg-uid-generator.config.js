'use strict';

const nconf = require('nconf');

module.exports = {
  cameraId: nconf.get('pkguid:cameraId') || 'XYZ7890',
  uniqueId: {
    start: nconf.get('pkguid:uniqueId:start') || 300,
    increment: nconf.get('pkguid:increment.increment') | 10
  }
};
