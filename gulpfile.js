var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var browserify = require('browserify');

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var pkg = require('./package.json');

gulp.task('default', [ 'build' ]);

gulp.task('build', [ 'web', 'cordova', 'fc' ]);

gulp.task('web', dist('cut.web'));
gulp.task('cordova', dist('cut.cordova'));
gulp.task('fc', dist('cut.fc'));

gulp.task('web-nomin', dist('cut.web', true));
gulp.task('cordova-nomin', dist('cut.cordova', true));
gulp.task('fc-nomin', dist('cut.fc', true));
gulp.task('build-nomin', [ 'web-nomin', 'cordova-nomin', 'fc-nomin' ]);

gulp.task('test', function() {
  return gulp.src('test/*.js', {
    read : false
  }).pipe(mocha({}));
});

gulp.task('watch', function() {
  gulp.watch('{cut-*.js,temp/*}', [ 'test', 'build-nomin' ]);
});

function dist(file, nomin) {
  return function() {
    var task = browserify({
      entries : [ './temp/' + file ],
      standalone : 'Cut'
    });
    task = task.transform({
      fromString : true,
      compress : false,
      mangle : false,
      output : {
        beautify : true,
        comments : /^((?!@license)[\s\S])*$/i
      }
    }, 'uglifyify');
    task = task.bundle();
    task = task.pipe(source(file + '.js')).pipe(buffer()); // vinylify
    task = task.pipe(wrap({
      src : './temp/dist.js'
    }, {
      version : pkg.version
    }));
    task = task.pipe(gulp.dest('dist'));
    if (!nomin) {
      task = task.pipe(rename(file + '.min.js'));
      task = task.pipe(uglify({
        output : {
          comments : /@license/i
        }
      }));
      task = task.pipe(gulp.dest('dist'));
    }
    return task;
  };
}