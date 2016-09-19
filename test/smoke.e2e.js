'use strict';

// device connect
// LOGON / FILTER -> identifies device type / name

// PLC_MSG w/ id from PFC
// * receiver (create response factory)
// * message router (identify client)
// * responder (create message and send to client)
// create SORT w/ id + bogus
// send SORT to PLC

describe('Smoke', () => {

  it('should receive PLC_MSG from PFC (as SCANNER)', () => {
    const socket = new EventEmitter();
      const client = new TcpChatClient(socket);

      client.on('message', spy);

      socket.emit('data', 'abcd\r\n');
  });

});
