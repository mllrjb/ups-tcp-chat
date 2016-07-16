'use strict';

const gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  , istanbul = require('gulp-istanbul')
  , yargs = require('yargs')
  , chai = require('chai')
  , path = require('path');

function runMocha(done) {
  return function() {
    global.expect = chai.expect;
    global.sut = function(sutPath) {
      return require(path.join(__dirname, sutPath));
    };

    var mochaOpts = {
      grep: yargs.argv.grep,
      reporter: 'spec'
    };

    var stream = gulp.src('test/lib/**/*spec.js')
      .pipe(plugins.mocha(mochaOpts));

    if (yargs.argv.coverage) {
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
  if (yargs.argv.coverage) {
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
