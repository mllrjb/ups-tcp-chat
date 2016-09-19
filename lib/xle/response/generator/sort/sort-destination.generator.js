'use strict';

class SortGenerator {

  constructor() {
    this._sequence = require('./sort-destination-sequence.config.js')();
    this._config = require('./sort-generator.config.js');
    // invoke parsing!
    this._seqIdx = 0;
    this._counter = 0;
  }

  _replaceSequence(seq) {
    this._sequence = seq;
    this._seqIdx = 0;
    this._counter = 0;
  }

  get loop () {
    return this._config.loop;;
  }

  get maxDigest() {
    return this._config.maxDigest;
  }

  next () {
    // safety net!
    var digest = 0;
    while (this._seqIdx < this._sequence.length && digest < this.maxDigest) {
      var config = this._sequence[this._seqIdx];
      if (this._counter < config.count) {
        this._counter++;
        return config.destinations;
      } else {
        // start over
        this._counter = 0;
        this._seqIdx++;
        if (this.loop) {
          this._seqIdx = this._seqIdx % this._sequence.length;
        }
      }
      digest++;
    }
    if (digest === this._maxDigest) {
      throw new Error('maximum number of iterations reached');
    }
  }

  clear() {
    this._replaceSequence([]);
  }

}

module.exports = new SortGenerator();
