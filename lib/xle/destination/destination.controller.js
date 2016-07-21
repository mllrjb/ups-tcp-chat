'use strict';

const DestinationConfig = require('./destination-config.model');

class DestinationController {
  constructor(opts) {
    opts = opts || {};
    this._loop = opts.loop !== false;
    this._sequence = [];
    // invoke parsing!
    this.sequence = opts.sequence;
    this._seqIdx = 0;
    this._counter = 0;
    this._maxDigest = opts.maxDigest || 20;
  }

  _replaceSequence(seq) {
    this._sequence = seq;
    this._seqIdx = 0;
    this._counter = 0;
  }

  get loop () {
    return this._loop;
  }

  set loop (loop) {
    this._loop = loop;
  }

  clear() {
    this._replaceSequence([]);
  }

  set sequence (seq) {
    // ignore empty
    if (!seq) {
      return;
    }

    // parse sequences
    if (seq instanceof Array) {
      var sequence = [];
      seq.forEach((s) => {
        sequence.push(DestinationConfig.fromText(s));
      });
      // only update if everything was parsed, otherwise leave existing config
      this._replaceSequence(sequence);
    } else {
      this._replaceSequence([DestinationConfig.fromText(seq)]);
    }
  }

  next () {
    // safety net!
    var digest = 0;
    while (this._seqIdx < this._sequence.length && digest < this._maxDigest) {
      var config = this._sequence[this._seqIdx];
      if (this._counter < config.count) {
        this._counter++;
        return config.destination;
      } else {
        // start over
        this._counter = 0;
        this._seqIdx++;
        if (this._loop) {
          this._seqIdx = this._seqIdx % this._sequence.length;
        }
      }
      digest++;
    }
    if (digest === this._maxDigest) {
      throw new Error('maximum number of iterations reached');
    }
  }
}

module.exports = DestinationController;
