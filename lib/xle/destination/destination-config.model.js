'use strict';

class DestinationConfig {

  constructor(count, dest) {
    this._count = count;
    this._destination = dest;
  }

  static fromText(text) {
    if (!text) {
      throw new Error('unable to parse empty rule ;)');
    }
    // parse text
    var parts = text.split(' ');
    if (parts.length < 2) {
      throw new Error('unable to parse parts of \'' + text + '\'');
    }

    var c, d = [];
    if (parts[0] === '*') {
      c = Infinity;
    } else if (Number.parseInt(parts[0]) > 0) {
      // avoid negatives!
      c = Math.abs(Number.parseInt(parts[0]));
    } else {
      throw new Error('unable to parse count from \'' + text + '\'');
    }

    var dests = parts[1].split(',');
    if (dests.length) {
      dests.forEach((di) => {
        if (Number.parseInt(di)) {
          // avoid negatives!
          d.push(Math.abs(Number.parseInt(di)));
        }
        // skip destinations we don't understand
      });
    } else {
      throw new Error('unable to parse destination(s) from \'' + text + '\''); 
    }

    return new DestinationConfig(c, d);
  }

  get count () {
    return this._count;
  }

  get destination () {
    return this._destination;
  }

  toString() {
    return 'DestinationConfig(' + ['count=' + this.count, 'dest=' + this.destination.join(',')]
      .join(', ') + ')';
  }

}

module.exports = DestinationConfig;
