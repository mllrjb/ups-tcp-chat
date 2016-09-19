'use strict';

const nconf = require('nconf')
    , winston = require('winston');

const BLANK_SEQUENCE = {
  count: Infinity,
  destinations: ['00000']
};

module.exports = function loadConfig() {

  const sequenceConfigs = nconf.get('sort:destination:sequence');
  if (!sequenceConfigs) {
    winston.warn('[sort-destination] no sequences configured');
    return [BLANK_SEQUENCE];
    throw new Error('unable to parse empty rule ;)'); 
  }

  if (! sequenceConfigs instanceof Array) {
    winston.warn('[sort-destination] unable to parse sequence configuration');
    winston.debug('[sort-destination] ', sequenceConfigs);
    return [BLANK_SEQUENCE];
  }

  const sequence = [];
  sequenceConfigs.map(config => {
    // parse config text
    var parts = config.split(' ');
    if (parts.length < 2) {
      winston.warn('[sort-destination] ignoring invalid sequence ', config);
      return;
    }

    var c, d = [];
    if (parts[0] === '*') {
      c = Infinity;
    } else if (Number.parseInt(parts[0]) > 0) {
      // avoid negatives!
      c = Math.abs(Number.parseInt(parts[0]));
    } else {
      winston.warn('[sort-destination] unable to parse count from config ', config);
      return;
    }

    var dests = parts[1].split(',');
    if (dests.length) {
      dests.forEach((di) => {
        if (Number.parseInt(di)) {
          // avoid negatives!
          d.push(Math.abs(Number.parseInt(di)));
        } else {
        // skip destinations we don't understand
          winston.warn('[sort-destination] unable to convert destinations from config ', config);
        }
      });

      sequence.push({
        count: c,
        destinations: d
      });
    } else {
      winston.warn('[sort-destination] unable to parse destinations from config ', config);
      return;
    }
  });
  if (sequence.length) {
    return sequence;
  } else {
    return [BLANK_SEQUENCE];
  }
}


