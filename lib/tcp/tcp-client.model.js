'use strict';

const ChatClient = require('../xle/chat-client.model');

const EOM = '\r\n';

class TcpClient extends ChatClient {
  constructor(socket) {
    super();
    this._socket = socket;
    this._buffer = '';
    socket.on('data', (data) => {
      this._buffer += data;
      this._checkBuffer();
    });
    socket.on('end', () => {
      super.disconnect();
    });
  }

  _checkBuffer() {
    var endIdx = this._buffer.indexOf(EOM);
    if (endIdx > -1) {
      var msg = this._buffer.substring(0, endIdx);
      this._buffer = this._buffer.substring(endIdx + 2);
      this.emit('message', msg);
      this._checkBuffer();
    }
  }

  send(message) {
    this._socket.write(message + EOM);
  }

  disconnect() {
    this._socket.end();
    super.disconnect();
  }
}

module.exports = TcpClient;
