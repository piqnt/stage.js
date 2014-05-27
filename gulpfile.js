var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var bump = require('gulp-bump');

var paths = {
  web : [ 'cut-core.js', 'cut-loader.web.js', 'cut-mouse.js' ],
  corova : [ 'cut-core.js', 'cut-loader.corova.js', 'cut-mouse.js' ],
  fc : [ 'cut-core.js', 'cut-loader.fc.js', 'cut-mouse.js' ]
};

gulp.task('default', [ 'dist' ]);

gulp.task('web', dist(paths.web, 'cut.web.js', 'cut.web.min.js'));
gulp.task('cordova', dist(paths.web, 'cut.cordova.js', 'cut.cordova.min.js'));
gulp.task('fc', dist(paths.web, 'cut.fc.js', 'cut.fc.min.js'));
gulp.task('dist', [ 'web', 'cordova', 'fc' ]);

gulp.task('bump', function() {
  var task = gulp.src([ './bower.json', './package.json' ]);
  task = task.pipe(bump(args.bump ? {
    version : args.bump
  } : {}));
  task = task.pipe(gulp.dest('./'));
  return task;
});

function dist(files, src, min) {
  return function() {
    var pkg = getPackageJson();
    var task = gulp.src(files);
    task = task.pipe(concat(src));
    task = task
        .pipe(uglify({
          compress : false,
          mangle : false,
          output : {
            beautify : true,
            comments : function(node, comment) {
              return comment.type != "comment2"
                  || !/@license/i.test(comment.value);
            }
          }
        }));
    task = task.pipe(wrap({
      src : 'dist.js'
    }, {
      version : pkg.version
    }));
    task = task.pipe(gulp.dest('dist'));
    task = task.pipe(concat(min));
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