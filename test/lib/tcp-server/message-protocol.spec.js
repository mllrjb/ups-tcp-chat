'use strict';

const MessageProtocol = sut('lib/tcp-server/message-protocol');

describe('MessageProtocl', () => {

  it('should deserialize field types', () => {
    const text = 'SCN,SCT,RCN,RCT,MT,MSGID,PKGUID,TRKNUM,DEST1,DEST2,DEST3,DEST4';
    var msg = MessageProtocol.fromText(text);
    expect(msg.getSenderName()).to.equal('SCN');
    expect(msg.getSenderType()).to.equal('SCT');
    expect(msg.getReceiverName()).to.equal('RCN');
    expect(msg.getReceiverType()).to.equal('RCT');
    expect(msg.getMessageType()).to.equal('MT');
    expect(msg.getMessageId()).to.equal('MSGID');
    expect(msg.getDataFields()).to.deep.equal(['PKGUID','TRKNUM','DEST1','DEST2','DEST3','DEST4']);
  });

  it('should deserialize sample message', () => {
    const text = '10.1.1.2,XLE-0001,10.1.1.3,PFC-0123,SORT,TT–0001–23:59:01:998–12345678901,'
      + 'TR12341234567890A0A0A0A001,1Z0318017912345678,00001,09999,00123,01111';
    var msg = MessageProtocol.fromText(text);
    expect(msg.getSenderName()).to.equal('10.1.1.2');
    expect(msg.getSenderType()).to.equal('XLE-0001');
    expect(msg.getReceiverName()).to.equal('10.1.1.3');
    expect(msg.getReceiverType()).to.equal('PFC-0123');
    expect(msg.getMessageType()).to.equal('SORT');
    expect(msg.getMessageId()).to.equal('TT–0001–23:59:01:998–12345678901');
    expect(msg.getDataFields()).to.deep.equal(['TR12341234567890A0A0A0A001', '1Z0318017912345678', '00001', 
      '09999', '00123', '01111']);
  });

  it('should error without data', () => {
    expect(() => {
      MessageProtocol.fromText(undefined);
    }).to.throw('unable to deserialize message - empty data');
  });

  it('should error without insufficient fields', () => {
    const text = 'field1,field2,field3,field4,field5';
    expect(() => {
      MessageProtocol.fromText(text);
    }).to.throw('unable to deserialize message - only 5 fields!');
  });

  it('should serialize field types', () => {
    var msg = new MessageProtocol('SCN', 'SCT', 'RCN', 'RCT', 'MT', 'MSGID', ['PKGUID', 'TRKNUM', 'DEST1', 'DEST2', 'DEST3', 'DEST4']);
    expect(msg.toText()).to.equal('SCN,SCT,RCN,RCT,MT,MSGID,PKGUID,TRKNUM,DEST1,DEST2,DEST3,DEST4');
  });


  it('should serialize field types', () => {
    var msg = new MessageProtocol('10.1.1.2', 'XLE-0001', '10.1.1.3', 'PFC-0123', 'SORT', 'TT–0001–23:59:01:998–12345678901', 
      ['TR12341234567890A0A0A0A001', '1Z0318017912345678', '00001', '09999', '00123', '01111']);
    expect(msg.toText()).to.equal('10.1.1.2,XLE-0001,10.1.1.3,PFC-0123,SORT,TT–0001–23:59:01:998–12345678901,'
      + 'TR12341234567890A0A0A0A001,1Z0318017912345678,00001,09999,00123,01111');
  });

});
