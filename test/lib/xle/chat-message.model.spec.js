'use strict';

const ChatMessage = sut('lib/xle/chat-message.model');

describe('ChatMessage', () => {

  it('should deserialize field types', () => {
    const text = 'SCN,SCT,RCN,RCT,MT,MSGID,PKGUID,TRKNUM,DEST1,DEST2,DEST3,DEST4';
    var msg = ChatMessage.fromText(text);
    expect(msg.senderName).to.equal('SCN');
    expect(msg.senderType).to.equal('SCT');
    expect(msg.receiverName).to.equal('RCN');
    expect(msg.receiverType).to.equal('RCT');
    expect(msg.messageType).to.equal('MT');
    expect(msg.dataFields).to.deep.equal(['MSGID', 'PKGUID','TRKNUM','DEST1','DEST2','DEST3','DEST4']);
  });

  it('should deserialize sample message', () => {
    const text = '10.1.1.2,XLE-0001,10.1.1.3,PFC-0123,SORT,TT–0001–23:59:01:998–12345678901,'
      + 'TR12341234567890A0A0A0A001,1Z0318017912345678,00001,09999,00123,01111';
    var msg = ChatMessage.fromText(text);
    expect(msg.senderName).to.equal('10.1.1.2');
    expect(msg.senderType).to.equal('XLE-0001');
    expect(msg.receiverName).to.equal('10.1.1.3');
    expect(msg.receiverType).to.equal('PFC-0123');
    expect(msg.messageType).to.equal('SORT');
    expect(msg.dataFields).to.deep.equal(['TT–0001–23:59:01:998–12345678901', 'TR12341234567890A0A0A0A001', '1Z0318017912345678', '00001', 
      '09999', '00123', '01111']);
  });

  it('should error without data', () => {
    expect(() => {
      ChatMessage.fromText(undefined);
    }).to.throw('unable to deserialize message - empty data');
  });

  it('should error without insufficient fields', () => {
    const text = 'field1,field2,field3,field4';
    expect(() => {
      ChatMessage.fromText(text);
    }).to.throw('unable to deserialize message - only 4 field(s)!');
  });

  it('should serialize field types', () => {
    var msg = new ChatMessage('SCN', 'SCT', 'RCN', 'RCT', 'MT', ['MSGID', 'PKGUID', 'TRKNUM', 'DEST1', 'DEST2', 'DEST3', 'DEST4']);
    expect(msg.toText()).to.equal('SCN,SCT,RCN,RCT,MT,MSGID,PKGUID,TRKNUM,DEST1,DEST2,DEST3,DEST4');
  });


  it('should serialize field types', () => {
    var msg = new ChatMessage('10.1.1.2', 'XLE-0001', '10.1.1.3', 'PFC-0123', 'SORT', ['TT–0001–23:59:01:998–12345678901', 
      'TR12341234567890A0A0A0A001', '1Z0318017912345678', '00001', '09999', '00123', '01111']);
    expect(msg.toText()).to.equal('10.1.1.2,XLE-0001,10.1.1.3,PFC-0123,SORT,TT–0001–23:59:01:998–12345678901,'
      + 'TR12341234567890A0A0A0A001,1Z0318017912345678,00001,09999,00123,01111');
  });

});
