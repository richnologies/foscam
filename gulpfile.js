var gulp = require('gulp');
var args = require('yargs').argv;
var sequence = require('run-sequence');

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('build', ['build-test'], function() {
  return gulp.src(['./src/**/*.js', '!./src/**/*.spec.js'])
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('build-test', function() {
  return gulp.src('./src/**/*.spec.js')
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('test', function(done) {
  if (args.coverage) {
    sequence('pre-tests', 'run-tests', done);
  } else {
    sequence('run-tests', done);
  }
});

gulp.task('pre-tests', function() {
  return gulp.src('./lib/**/*.js')
    .pipe($.istanbul({
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('run-tests', function() {
  var stream = gulp.src('./test/*.spec.js', {read: false})
    .pipe($.mocha());
  if (args.coverage) {
    stream.pipe($.istanbul.writeReports({
      reportOpts: {
        dir: './coverage'
      }
    }));
  }
  return stream;
});
