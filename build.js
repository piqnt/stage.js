var darwin = require('darwin');
var uglify = require('uglify-js');

function cli(args) {
  build([ 'cut-core.js', 'cut-loader.web.js', 'cut-mouse.js' ], 'cut.web');
  build([ 'cut-core.js', 'cut-loader.cordova.js', 'cut-mouse.js' ],
      'cut.cordova');
  build([ 'cut-core.js', 'cut-loader.fc.js', 'cut-mouse.js' ], 'cut.fc');
}

function build(scripts, target) {

  var src = darwin.cd(__dirname);
  var dest = src.cd('dist');
  var temp = src.select('dist-temp.js').text();
  var pkg = src.select('package.json').json();

  scripts = src.select(scripts).join('\n');

  console.log(target + ' ' + scripts.length);

  scripts = uglify.minify(scripts, {
    fromString : true,
    compress : false,
    mangle : false,
    output : {
      beautify : true,
      comments : /^((?!@license)[\s\S])*$/i
    }
  }).code;

  scripts = temp.replace('contents;', scripts).replace('version;', pkg.version);

  console.log(target + '.js ' + scripts.length);
  dest.file(target + '.js').write(scripts);

  scripts = uglify.minify(scripts, {
    fromString : true,
    output : {
      comments : /@license/i
    }
  }).code;

  console.log(target + '.min.js ' + scripts.length);
  dest.file(target + '.min.js').write(scripts);
}

cli(process.argv.slice(2));
