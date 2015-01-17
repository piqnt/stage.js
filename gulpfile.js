var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var bump = require('gulp-bump');
var mocha = require('gulp-mocha');

gulp.task('default', [ 'mocha', 'dist' ]);

gulp.task('dist', [ 'web', 'cordova', 'fc' ]);

gulp.task('web', dist([ 'cut-core.js', 'cut-loader.web.js', 'cut-mouse.js' ],
    'cut.web'));
gulp.task('cordova', dist([ 'cut-core.js', 'cut-loader.cordova.js',
    'cut-mouse.js' ], 'cut.cordova'));
gulp.task('fc', dist([ 'cut-core.js', 'cut-loader.fc.js', 'cut-mouse.js' ],
    'cut.fc'));

gulp.task('bump', function() {
  var task = gulp.src([ './bower.json', './package.json' ]);
  task = task.pipe(bump(args.bump ? {
    version : args.bump
  } : {}));
  task = task.pipe(gulp.dest('./'));
  return task;
});

gulp.task('mocha', function() {
  return gulp.src('test/*.js', {
    read : false
  }).pipe(mocha({}));
});

function dist(files, dist) {
  return function() {
    var pkg = getPackageJson();
    var task = gulp.src(files);
    task = task.pipe(concat(dist + '.js'));
    task = task.pipe(uglify({
      compress : false,
      mangle : false,
      output : {
        beautify : true,
        comments : /^((?!@license)[\s\S])*$/i
      }
    }));
    task = task.pipe(wrap({
      src : 'dist.js'
    }, {
      version : pkg.version
    }));
    task = task.pipe(gulp.dest('dist'));
    task = task.pipe(concat(dist + '.min.js'));
    task = task.pipe(uglify({
      output : {
        comments : /@license/i
      }
    }));
    task = task.pipe(gulp.dest('dist'));
    return task;
  };
}

function getPackageJson() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}