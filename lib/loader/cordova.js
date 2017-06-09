/**
 * Cordova/PhoneGap loader with FastContext support.
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

var Class = require('../core');

var once = require('../util/once');

if (typeof FastContext === 'undefined') {
  FastContext = window.FastContext;
}

Class._supported = (function() {
  var elem = document.createElement('canvas');
  return (elem.getContext && elem.getContext('2d')) ? true : false;
})();

window.addEventListener('load', function() {
  DEBUG && console.log('On load.');

  var start = once(function(msg) {
    DEBUG && msg && console.log('Started on ' + msg);
    if (Class._supported) {
      Class.start();
    }
    // TODO if not supported
  });

  // setTimeout(function() {
  // start('timeout');
  // }, 3000);

  document.addEventListener('click', function() {
    start('click');
  }, false);

  document.addEventListener('mousemove', function() {
    start('mousemove');
  }, false);

  document.addEventListener('deviceready', function() {
    start('deviceready');
  }, false);

  document.addEventListener('pause', function() {
    Class.pause();
  }, false);

  document.addEventListener('resume', function() {
    Class.resume();
  }, false);
}, false);

Class.config({
  'app-loader' : AppLoader,
  'image-loader' : ImageLoader
});

function AppLoader(app, configs) {
  configs = configs || {};
  var canvas = configs.canvas, context = null, full = false;
  var width = 0, height = 0, ratio = 1;

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas) {
    canvas = document.getElementById('cutjs')
        || document.getElementById('stage');
  }

  if (!canvas) {
    full = true;
    DEBUG && console.log('Creating Canvas...');
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }

  context = canvas.getContext('2d', {
    fastcontext : true
  });

  context.isFast = !!context.isFast;

  full = full || context.isFast;

  DEBUG && console.log('FastContext: ' + context.isFast);

  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  ratio = devicePixelRatio / backingStoreRatio;

  var requestAnimationFrame = window.requestAnimationFrame
      || window.msRequestAnimationFrame || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame
      || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };

  DEBUG && console.log('Creating stage...');
  var root = Class.root(requestAnimationFrame, render);

  function render() {
    if (context.isFast) {
      context.clear();
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
    }
    root.render(context);
  }

  root.background = function(color) {
    if (context.isFast) {
      context.setBackgroundColor && context.setBackgroundColor(color);
    } else {
      canvas.style.backgroundColor = color;
    }
    return this;
  };

  app(root, canvas);

  resize();
  window.addEventListener('resize', resize, false);
  window.addEventListener('orientationchange', resize, false);

  function resize() {

    if (full) {
      // screen.availWidth/Height?
      width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

    } else {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    }

    width *= ratio;
    height *= ratio;

    if (canvas.width === width && canvas.height === height) {
      return;
    }

    canvas.width = width;
    canvas.height = height;

    DEBUG && console.log('Resize: ' + width + ' x ' + height + ' / ' + ratio);

    root.viewport(width, height, ratio);

    render();
  }
}

function ImageLoader(src, success, error) {
  DEBUG && console.log('Loading image: ' + src);
  var image;
  if (FastContext) {
    image = FastContext.createImage(src, loaded, error);
  } else {
    image = new Image();
    image.onload = loaded;
    image.onerror = error;
    image.src = src;
  }
  function loaded() {
    success(image);
  }
}
