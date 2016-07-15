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

    describe(': ways to write', () => {
      var client;

      beforeEach(done => {
        client = net.connect({
          port: port,
          host: localhost
        }, done);
        client.setNoDelay(true);
      });

      afterEach(done => {
        client.on('close', done);
        client.end();
        tcpServer.clearMessages();
      });

      class PartialWriter {
        constructor(client, value) {
          this._client = client;
          this._value = value;
          this._idx = 0;
          this._promise = new Promise((resolve) => {
            this._resolve = () => {
              resolve();
            };
          });
        }
        write(count) {
          // console.log('write ' + count + ' from ' + this._idx);
          var idx = this._idx;
          this._idx += count;
          var self = this;
          this._promise = this._promise.then(function() {
            // console.log('writing ' + count + ' from ' + idx);
            return new Promise(resolve => {
              var data;
              if ((idx + count) < self._value.length) {
                data = self._value.substring(idx, (idx + count));
              } else {
                data = self._value.slice(idx);
              }
              // console.log('data: ' + data);
              self._client.write(data, () => {
                // console.log('wrote ' + data);
                // allow the server to execute
                setTimeout(resolve);
              });
            });
          });
          return this;
        }
        end(cb) {
          this._promise.then(() => {
            setTimeout(cb);
          });
          this._resolve();
        }
      }

      it('write message in chunks', (done) => {
        const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

        var writer = new PartialWriter(client, msg + '\r\n');
        writer.write(10)
          .write(5)
          .write(999)
          .end(() => {
            // handle end
            const result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal(msg);
            done();
          });
      });

      it('write message in tiny chunks', (done) => {
        const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

        var writer = new PartialWriter(client, msg + '\r\n');
        writer.write(1)
          .write(1)
          .write(1)
          .write(1)
          .write(1)
          .write(1)
          .write(1)
          .write(1)
          .write(999)
          .end(() => {
            // handle end
            const result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal(msg);
            done();
          });
      });

      it('write entire message', (done) => {
        const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

        var writer = new PartialWriter(client, msg + '\r\n');
        writer.write(999)
          .end(() => {
            // handle end
            const result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal(msg);
            done();
          });
      });

      it('write multiple messages in chunks', (done) => {
        const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234\r\n'
          + '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235\r\n'
          + '192.168.1.4';

        var writer = new PartialWriter(client, msg);
        writer.write(58)
          .write(58)
          .write(999)
          .end(() => {
            console.log(tcpServer.getMessages());
            // handle end
            var result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234');

            result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235');

            result = tcpServer.nextMessage();
            expect(result).to.not.be.ok;
            done();
          });
      });

      it('write multiple messages all at once', (done) => {
        const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234\r\n'
          + '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235\r\n'
          + '192.168.1.4';

        var writer = new PartialWriter(client, msg);
        writer.write(999)
          .end(() => {
            console.log(tcpServer.getMessages());
            // handle end
            var result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234');

            result = tcpServer.nextMessage();
            expect(result).to.be.ok;
            expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235');

            result = tcpServer.nextMessage();
            expect(result).to.not.be.ok;
            done();
          });
      });
    });
  });

});
