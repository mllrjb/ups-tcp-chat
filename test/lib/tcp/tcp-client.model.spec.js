'use strict';

const EventEmitter = require('events').EventEmitter
  , TcpClient = sut('./lib/tcp/tcp-client.model');

describe('TcpClient', () => {

  describe(' <eom>', () => {

    it('should detect end of message in full message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd\r\n');

      expect(spy).to.have.been.called;
    });

    it('should not detect end of message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd');

      expect(spy).to.have.not.been.called;
    });

    it('should detect eventual end of message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd');

      expect(spy).to.have.not.been.called;

      socket.emit('data', 'efgh');

      expect(spy).to.have.not.been.called;

      socket.emit('data', '\r\n');

      expect(spy).to.have.been.called;
    });

  });

  describe(' disconnect', () => {

    it('should emit disconnect', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpClient(socket);

      client.on('disconnect', spy);

      socket.emit('end');

      expect(spy).to.have.been.called;
    });

    it('should disconnect', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      socket.end = sinon.spy();
      const client = new TcpClient(socket);

      client.on('disconnect', spy);

      client.disconnect();

      expect(spy).to.have.been.called;
      expect(socket.end).to.have.been.called;
    });

  });

  describe('write', () => {

    it('should write with eom', () => {
      const socket = new EventEmitter();
      socket.write = sinon.spy();
      const client = new TcpClient(socket);

      client.send('foo');
      expect(socket.write).to.have.been.called;
      expect(socket.write).to.have.been.calledWith('foo\r\n');
    });

  });
});

// describe(': ways to write', () => {
//       var client;

//       beforeEach(done => {
//         client = net.connect({
//           port: port,
//           host: localhost
//         }, done);
//         client.setNoDelay(true);
//       });

//       afterEach(done => {
//         client.on('close', done);
//         client.end();
//       });

//       it('write message in chunks', (done) => {
//         const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

//         var writer = new TestClient(client, msg + '\r\n');
//         writer.write(10)
//           .write(5)
//           .write(999)
//           .end(() => {
//             // handle end
//             const result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal(msg);
//             done();
//           });
//       });

//       it('write message in tiny chunks', (done) => {
//         const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

//         var writer = new TestClient(client, msg + '\r\n');
//         writer.write(1)
//           .write(1)
//           .write(1)
//           .write(1)
//           .write(1)
//           .write(1)
//           .write(1)
//           .write(1)
//           .write(999)
//           .end(() => {
//             // handle end
//             const result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal(msg);
//             done();
//           });
//       });

//       it('write entire message', (done) => {
//         const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234';

//         var writer = new TestClient(client, msg + '\r\n');
//         writer.write(999)
//           .end(() => {
//             // handle end
//             const result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal(msg);
//             done();
//           });
//       });

//       it('write multiple messages in chunks', (done) => {
//         const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234\r\n'
//           + '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235\r\n'
//           + '192.168.1.4';

//         var writer = new TestClient(client, msg);
//         writer.write(58)
//           .write(58)
//           .write(999)
//           .end(() => {
//             console.log(tcpServer.getMessages());
//             // handle end
//             var result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234');

//             result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235');

//             result = tcpServer.nextMessage();
//             expect(result).to.not.be.ok;
//             done();
//           });
//       });

//       it('write multiple messages all at once', (done) => {
//         const msg = '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234\r\n'
//           + '192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235\r\n'
//           + '192.168.1.4';

//         var writer = new TestClient(client, msg);
//         writer.write(999)
//           .end(() => {
//             console.log(tcpServer.getMessages());
//             // handle end
//             var result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001234');

//             result = tcpServer.nextMessage();
//             expect(result).to.be.ok;
//             expect(result).to.equal('192.168.1.4,PCF-0003,192.168.1.7,XLe–1234,PLC_MSG,001235');

//             result = tcpServer.nextMessage();
//             expect(result).to.not.be.ok;
//             done();
//           });
//       });
//     });
