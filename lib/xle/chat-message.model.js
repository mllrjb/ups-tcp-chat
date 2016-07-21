'use strict';

class ChatMessage {
  constructor(senderName, senderType, receiverName, receiverType, messageType, dataFields) {
    this._senderName = senderName;
    this._senderType = senderType;
    this._receiverName = receiverName;
    this._receiverType = receiverType;
    this._messageType = messageType;
    this._dataFields = dataFields;
  }

  get senderName () {
    return this._senderName;
  }

  set senderName (senderName) {
    this._senderName = senderName;
  }

  get senderType () {
    return this._senderType;
  }

  set senderType (senderType) {
    this._senderType = senderType;
  }

  get receiverName () {
    return this._receiverName;
  }

  set receiverName (receiverName) {
    this._receiverName = receiverName;
  }

  get receiverType () {
    return this._receiverType;
  }

  set receiverType (receiverType) {
    this._receiverType = receiverType;
  }

  get messageType () {
    return this._messageType;
  }

  set messageType (messageType) {
    this._messageType = messageType;
  }

  get dataFields () {
    return this._dataFields;
  }

  set dataFields (dataFields) {
    this._dataFields = dataFields;
  }

  toText() {
    // TODO
    return [this._senderName, this._senderType, this._receiverName, 
      this._receiverType, this._messageType]
      .concat(this._dataFields)
      .join(',');
  }

  toString() {
    return 'ChatMessage(' + ['scn=' + this._senderName, 'sct=' + this._senderType, 'rcn=' + this._receiverName, 
      'rct=' + this._receiverType, 'mt=' + this._messageType]
      .concat('data=' + JSON.stringify(this._dataFields))
      .join(', ') + ')';
  }

  static fromText(data) {
    if (!data) {
      throw new Error('unable to deserialize message - empty data');
    }
    var fields = data.split(',');
    if (fields.length < 5) {
      throw new Error('unable to deserialize message - only ' + fields.length + ' field(s)!');
    }
    return new ChatMessage(fields[0], fields[1], fields[2], fields[3], fields[4], fields.splice(5));
  }

}

module.exports = ChatMessage;
