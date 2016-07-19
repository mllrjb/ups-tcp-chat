'use strict';

const EventEmitter = require('events').EventEmitter
  , TcpChatClient = sut('./lib/tcp/tcp-chat-client.model');

describe('TcpChatClient', () => {

  describe(' <eom>', () => {

    it('should detect end of message in full message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpChatClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd\r\n');

      expect(spy).to.have.been.called;
    });

    it('should not detect end of message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpChatClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd');

      expect(spy).to.have.not.been.called;
    });

    it('should detect eventual end of message', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      const client = new TcpChatClient(socket);

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
      const client = new TcpChatClient(socket);

      client.on('disconnect', spy);

      socket.emit('end');

      expect(spy).to.have.been.called;
    });

    it('should disconnect', () => {
      var spy = sinon.spy();
      const socket = new EventEmitter();
      socket.end = sinon.spy();
      const client = new TcpChatClient(socket);

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
      const client = new TcpChatClient(socket);

      client.send('foo');
      expect(socket.write).to.have.been.called;
      expect(socket.write).to.have.been.calledWith('foo\r\n');
    });

  });
});
