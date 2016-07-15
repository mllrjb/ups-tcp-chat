'use strict';

const gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  , yargs = require('yargs')
  , chai = require('chai')
  , path = require('path');

gulp.task('test.lib', function() {
  global.expect = chai.expect;
  global.sut = function(sutPath) {
    return require(path.join(__dirname, sutPath));
  };

  var mochaOpts = {
    grep: yargs.argv.grep,
    reporter: 'spec'
  };

  gulp.src('test/lib/**/*spec.js')
    .pipe(plugins.mocha(mochaOpts));
});

gulp.task('default', ['test.lib']);
