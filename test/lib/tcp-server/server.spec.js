'use strict';

const tcpServer = sut('lib/tcp-server/server')
  , net = require('net')
  , portastic = require('portastic')
  , portRange = {
    min: 8000,
    max: 9000
  }
  , localhost = '127.0.0.1';

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

  it('should connect to port', (done) => {
    tcpServer.listen(port, () => {
      tcpServer.close(done);
    });
  });

  describe(': client', () => {
    beforeEach(done => {
      tcpServer.listen(port, done);
    });

    afterEach(done => {
      tcpServer.close(done);
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
