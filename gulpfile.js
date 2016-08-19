'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var notifier = require('node-notifier');
var server = require('gulp-server-livereload');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

var bundler = watchify(browserify({
  entries: ['./public/src/app.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle() {
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./views/'))
}
bundler.on('update', bundle)

gulp.task('build', function() {
  bundle()
});

gulp.task('serve', function(done) {
  gulp.src('./views/')
    .pipe(server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          cb( /main.js/.test(filePath) )
        }
      },
      open: true
    }));
});

/**
 * default task
 */
gulp.task('default', ['build', 'serve']);
gulp.task('test', ['lint', 'test']);
gulp.task('lint', ['lint']);

/**
 * lint task
 */
gulp.task('lint', function() {
  return gulp.src([
    '**/*.js',
    '!node_modules/**',
    '!views/**',
  ])
    .pipe(debug({title: 'linting'}))
    .pipe(eslint())
    .pipe(eslint.failOnError());
});

/**
 * test task depends on task lint
 */
gulp.task('test', function() {
  return gulp.src('test/**/*.js')
    .pipe(debug({title: 'testing'}))
    .pipe(mocha())
    .once('end', function() { process.exit(); });
});
