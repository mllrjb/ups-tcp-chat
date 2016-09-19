'use strict';

const EventEmitter = require('events').EventEmitter,
  net = require('net'),
  portastic = require('portastic'),
  async = require('async');


require('winston').level = 'debug';

const portRange = {
  min: 8000,
  max: 9000
};

describe('TCP Chat Server', () => {

  var port, eventBus;

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

  beforeEach(() => {
    // clean event bus every time
    eventBus = new EventEmitter();
  });

  function mockServer() {
    const mocks = {};
    mocks['./tcp-server.config'] = { port: port };
    mocks['../eventbus'] = eventBus;
    return mock('lib/tcp/tcp-server', mocks);
  }

  it('should connect and disconnect', (done) => {
    const server = mockServer();
    eventBus.on('server:connected', () => {
      eventBus.on('server:disconnected', done);
      server.disconnect();
    });
  });

  describe(': client connection', () => {

    var server;

    beforeEach(done => {
      server = mockServer();
      eventBus.on('server:connected', done);
    });

    afterEach(done => {
      eventBus.on('server:disconnected', done);
      server.disconnect();
    });

    it('client can connect and close', (done) => {
      const client = net.connect({
        port: port
      }, () => {
        client.end();
      });

      client.on('close', () => {
        done();
      });
    });

    it('multiple clients can connect', (done) => {
      const client1 = net.connect({
        port: port
      }, () => {
        client1.end();
      });

      const client2 = net.connect({
        port: port
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

  describe(': messages', () => {

    var server;

    beforeEach(done => {
      eventBus.on('server:connected', done);
      server = mockServer();
    });

    afterEach(done => {
      eventBus.on('server:disconnected', done);
      server.disconnect();
    });

    it('should send', (done) => {
      var spy = sinon.spy(),
        socket;

      async.waterfall([
        (cb) => {
          eventBus.on('server:client', client => {
            cb(null, socket, client);
          });
          socket = net.connect({
            port: port
          });
        },
        (socket, client, cb) => {
          client.on('message', msg => {
            expect(msg).to.equal('some message');
            cb(null, socket);
          });
          socket.write('some message\r\n');
        }
      ], (err, socket) => {
        socket.on('close', done);
        socket.end();
      });
    });

    it('should receive', (done) => {
      var spy = sinon.spy(),
        socket;

      async.waterfall([
        (cb) => {
          eventBus.on('server:client', client => {
            cb(null, socket, client);
          });
          socket = net.connect({
            port: port
          });
          socket.setEncoding('UTF-8');
        },
        (socket, client, cb) => {
          socket.on('data', data => {
            expect(data).to.equal('some other message\r\n');
            cb(null, socket);
          });
          client.send('some other message');
        }
      ], (err, socket) => {
        socket.on('close', done);
        socket.end();
      });
    });

    it('should send and receive', (done) => {
      async.waterfall([
        (cb) => {
          eventBus.on('server:client', client => {
            cb(null, socket, client);
          });
          var socket = net.connect({
            port: port
          });
          socket.setEncoding('UTF-8');
        },
        (socket, client, cb) => {
          client.on('message', msg => {
            cb(null, socket, client, msg);
          });
          socket.write('some message\r\n');
        },
        (socket, client, message, cb) => {
          expect(message).to.equal('some message');
          socket.on('data', data => {
            expect(data).to.equal('some other message\r\n');
            cb(null, socket);
          });
          client.send('some other message');
        }
      ], (err, socket) => {
        socket.on('close', done);
        socket.end();
      });
    });
  });

});
