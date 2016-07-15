'use strict';

class MessageProtocol {
	constructor(senderName, senderType, receiverName, receiverType, messageType, messageId, dataFields) {
    this._senderName = senderName;
    this._senderType = senderType;
    this._receiverName = receiverName;
    this._receiverType = receiverType;
    this._messageType = messageType;
    this._messageId = messageId;
    this._dataFields = dataFields;
	}

  getSenderName () {
    return this._senderName;
  }

  setSenderName (senderName) {
    this._senderName = senderName;
  }

  getSenderType () {
    return this._senderType;
  }

  setSenderType (senderType) {
    this._senderType = senderType;
  }

  getReceiverName () {
    return this._receiverName;
  }

  setReceiverName (receiverName) {
    this._receiverName = receiverName;
  }

  getReceiverType () {
    return this._receiverType;
  }

  setReceiverType (receiverType) {
    this._receiverType = receiverType;
  }

  getMessageType () {
    return this._messageType;
  }

  setMessageType (messageType) {
    this._messageType = messageType;
  }

  getMessageId () {
    return this._messageId;
  }

  setMessageId (messageId) {
    this._messageId = messageId;
  }

  getDataFields () {
    return this._dataFields;
  }

  setDataFields (dataFields) {
    this._dataFields = dataFields;
  }

  toText() {
    // TODO
    return [this._senderName, this._senderType, this._receiverName, 
      this._receiverType, this._messageType, this._messageId]
      .concat(this._dataFields)
      .join(',');
  }

  toString() {
    return ['scn=' + this._senderName, 'sct=' + this._senderType, 'rcn=' + this._receiverName, 
      'rct=' + this._receiverType, 'mt=' + this._messageType, 'msgid=' + this._messageId]
      .concat('data=' + JSON.stringify(this._dataFields))
      .join(', ');
  }

  static fromText(data) {
    if (!data) {
      throw new Error('unable to deserialize message - empty data');
    }
    var fields = data.split(',');
    if (fields.length < 6) {
      throw new Error('unable to deserialize message - only ' + fields.length + ' fields!');
    }
    return new MessageProtocol(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5], fields.splice(6));
  }

}

module.exports = MessageProtocol;
