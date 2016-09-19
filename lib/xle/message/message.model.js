'use strict';

class Message {
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

  set senderName (value) {
    this._senderName = value;
  }

  get senderType () {
    return this._senderType;
  }

  set senderType (value) {
    this._senderType = value;
  }

  get receiverName () {
    return this._receiverName;
  }

  set receiverName (value) {
    this._receiverName = value;
  }

  get receiverType () {
    return this._receiverType;
  }

  set receiverType (value) {
    this._receiverType = value;
  }

  get messageType () {
    return this._messageType;
  }

  set messageType (value) {
    this._messageType = value;
  }

  get dataFields () {
    return this._dataFields;
  }

  set dataFields (value) {
    this._dataFields = value;
  }

  toText() {
    return [this._senderName, this._senderType, this._receiverName, 
      this._receiverType, this._messageType]
      .concat(this._dataFields)
      .join(',');
  }

  toString() {
    return 'Message(' + ['scn=' + this._senderName, 'sct=' + this._senderType, 'rcn=' + this._receiverName, 
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
    return new Message(fields[0], fields[1], fields[2], fields[3], fields[4], fields.splice(5));
  }

}

module.exports = Message;
