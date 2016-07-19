'use strict';
 
const path = require('path')
  , fs = require('fs')
  , winston = require('winston')
  , nconf = require('nconf')
  , TcpServer = require('./lib/tcp/tcp-server.js')
  , ChatController = require('./lib/xle/chat.controller');


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
  }
});

winston.level = nconf.get('logger:level');

const tcpServer = new TcpServer({
  port: nconf.get('server:port')
});

const chatCtrl = new ChatController(tcpServer); 
