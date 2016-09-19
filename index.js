'use strict';
 
const path = require('path')
  , fs = require('fs')
  , winston = require('winston')
  , nconf = require('nconf');

const configPath = path.join(__dirname, 'config.yml');

nconf.env({separator: '__'}).argv();
nconf.formats.yaml = require('nconf-yaml');

try {
  if (fs.statSync(configPath).isFile()) {
    nconf.file({ file: configPath, format: nconf.formats.yaml });
  }
} catch(err) {
  // ignore
}

nconf.defaults({
  logger: {
    level: 'info'
  },
  server: {
    port: 9000
  },
  destination: {
    loop: true,
    sequence: ['* 00001']
  }
});

winston.level = nconf.get('logger:level');

require('./lib/tcp/tcp-server');
require('./lib/xle/receiver/receiver.controller');
require('./lib/xle/client/identification.controller');
require('./lib/xle/client/flagging.controller');
require('./lib/xle/router/router.controller');
