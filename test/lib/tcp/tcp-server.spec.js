'use strict';

const TcpServer = sut('lib/tcp/tcp-server')
  , net = require('net')
  , portastic = require('portastic')
  , TestClient = require('./test-tcp-client')
  , portRange = {
    min: 8000,
    max: 9000
  }
  , localhost = '127.0.0.1';

// TODO: server write to client

describe('TCP Chat Server', () => {

  var port;

  before(done => {
    portastic.find(portRange, (ports) => {
      if (ports.length < 1) {
        done('unable to find an open port in the range ' + 8000 + '-' + 9000);
      } else {
        port = ports[0];
        done();
      }
    });
  });

  // TODO: verify ports on disconnect
  it('should connect and disconnect', (done) => {
    const server = new TcpServer({
      port: port
    });
    server.on('connected', () => {
      server.on('disconnected', done);
      server.disconnect();
    });
  });

  describe(': client', () => {

    var server;

    beforeEach(done => {
      server = new TcpServer({
        port: port
      });
      server.on('connected', done);
    });

    afterEach(done => {
      server.on('disconnected', done);
      server.disconnect();
    });

    it('client can connect and close', (done) => {
      const client = net.connect({
        port: port,
        host: localhost
      }, () => {
        client.end();
      });

      client.on('close', () => {
        done();
      });
    });

    it('multiple clients can connect', (done) => {
      const client1 = net.connect({
        port: port,
        host: localhost
      }, () => {
        client1.end();
      });

      const client2 = net.connect({
        port: port,
        host: localhost
      }, () => {
        client2.end();
      });

      var closed = 0;
      function checkDone() {
        closed++;
        if (closed > 1) {
          done();
        }
      }

      client1.on('close', () => {
        checkDone();
      });

      client2.on('close', () => {
        checkDone();
      });
    });

  });

});
