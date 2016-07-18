'use strict';

class PartialWriter {
  constructor(client, value) {
    this._client = client;
    this._value = value;
    this._idx = 0;
    this._promise = new Promise((resolve) => {
      this._resolve = () => {
        resolve();
      };
    });
  }
  write(count) {
    // console.log('write ' + count + ' from ' + this._idx);
    var idx = this._idx;
    this._idx += count;
    var self = this;
    this._promise = this._promise.then(function() {
      // console.log('writing ' + count + ' from ' + idx);
      return new Promise(resolve => {
        var data;
        if ((idx + count) < self._value.length) {
          data = self._value.substring(idx, (idx + count));
        } else {
          data = self._value.slice(idx);
        }
        // console.log('data: ' + data);
        self._client.write(data, () => {
          // console.log('wrote ' + data);
          // allow the server to execute
          setTimeout(resolve);
        });
      });
    });
    return this;
  }
  end(cb) {
    this._promise.then(() => {
      setTimeout(cb);
    });
    this._resolve();
  }
}

module.exports = PartialWriter;
