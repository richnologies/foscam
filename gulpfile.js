const gulp = require('gulp');
const args = require('yargs').argv;
const sequence = require('run-sequence');

const $ = require('gulp-load-plugins')({lazy: true});

gulp.task('build', () => {
  return gulp.src('./src/**/*.js')
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('test', done => {
  if (args.coverage) {
    sequence(
      'pre-tests',
      'run-tests',
      done);
  } else {
    sequence(
      'run-tests',
      done);
  }
});

gulp.task('pre-tests', () => {
  return gulp.src('./lib/**/*.js')
    .pipe($.istanbul({
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('run-tests', () => {
  let stream = gulp.src('./test/*.spec.js', {read: false})
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
