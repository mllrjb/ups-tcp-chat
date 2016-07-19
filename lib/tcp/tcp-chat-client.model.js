'use strict';

const ChatClient = require('../xle/chat-client.model')
  , winston = require('winston');

const EOM = '\r\n';

class TcpChatClient extends ChatClient {
  constructor(socket) {
    super();
    winston.info('[TcpChatClient] assigned client from %s:%d as %s', socket.remoteAddress, socket.remotePort, this.id);
    this._socket = socket;
    this._buffer = '';
    socket.on('data', (data) => {
      var msg = data.toString('utf8');
      winston.debug('[TcpChatClient] client %s raw data: %j', this.id, msg);
      this._buffer += msg;
      this._checkBuffer();
    });
    socket.on('end', () => {
      winston.info('[TcpChatClient] client %s hung up - disconnecting', this.id);
      super.disconnect();
    });
  }

  _checkBuffer() {
    var endIdx = this._buffer.indexOf(EOM);
    if (endIdx > -1) {
      var msg = this._buffer.substring(0, endIdx);
      this._buffer = this._buffer.substring(endIdx + 2);
      winston.info('[TcpChatClient] received \'%s\' from client %s', msg, this.id);
      this.emit('message', msg);
      this._checkBuffer();
    }
  }

  send(msg) {
    var data = msg + EOM;
    winston.info('[TcpChatClient] sending \'%s\' to client %s', msg, this.id);
    winston.debug('[TcpChatClient] client %s raw data: %j', this.id, data);
    this._socket.write(data);
  }

  disconnect() {
    winston.info('[TcpChatClient] disconnecting client %s', this.id);
    this._socket.end();
    super.disconnect();
  }
}

module.exports = TcpChatClient;
