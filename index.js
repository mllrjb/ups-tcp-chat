'use strict';
 
const path = require('path')
  , fs = require('fs')
  , winston = require('winston')
  , nconf = require('nconf')
  , TcpServer = require('./lib/tcp/tcp-server.js')
  , ChatController = require('./lib/xle/chat.controller')
  , ResponseController = require('./lib/xle/response/response.controller')
  , DestinationController = require('./lib/xle/destination/destination.controller');


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

const tcpServer = new TcpServer({
  port: nconf.get('server:port')
});

const destinationController = new DestinationController(nconf.get('destination'));

const responseController = new ResponseController({
  destination: destinationController
});

const chatController = new ChatController(tcpServer, {
  response: responseController
}); 
