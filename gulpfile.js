'use strict';

const gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  , istanbul = require('gulp-istanbul')
  , yargs = require('yargs')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , path = require('path')
  , winston = require('winston')
  , proxyquire = require('proxyquire');

chai.use(sinonChai);

function runMocha(done) {
  return function() {
    global.expect = chai.expect;
    global.sinon = sinon;

    global.sut = function(id) {
      return require(path.join(__dirname, id));
    };

    global.sutId = function sutId(id) {
      return path.join(__dirname, id);
    };

    global.mock = function(id, stubs) {
      return proxyquire(sutId(id), stubs);
    };

    var mochaOpts = {
      grep: yargs.argv.grep,
      reporter: 'spec'
    };

    // silence logging :)
    if (!yargs.argv.debug) {
      winston.remove(winston.transports.Console);
    }

    var stream = gulp.src(['test/lib/**/*spec.js', 'test/lib/**/*e2e.js'])
      .pipe(plugins.mocha(mochaOpts));

    if (!yargs.argv.nocoverage) {
      stream.pipe(istanbul.writeReports({
        reporters: ['text', 'lcov', 'html'],
        reportOpts: {
          dir: '.tmp/node/reports/coverage',
        }
      }));
    }

    stream.on('end', done);
  }
}

gulp.task('test.node', function(done) {
  if (!yargs.argv.coverage) {
    gulp.src('lib/**/*.js')
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire())
      .on('finish', runMocha(done));
  } else {
    runMocha(done)();
  }

});

gulp.task('default', ['test.node']);
