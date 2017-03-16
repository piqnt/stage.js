if (typeof DEBUG === 'undefined')
  DEBUG = true;

var stats = require('./util/stats');
var extend = require('./util/extend');
var is = require('./util/is');
var _await = require('./util/await');

stats.create = 0;

function Class(arg) {
  if (!(this instanceof Class)) {
    if (is.fn(arg)) {
      return Class.app.apply(Class, arguments);
    } else if (is.object(arg)) {
      return Class.atlas.apply(Class, arguments);
    } else {
      return arg;
    }
  }

  stats.create++;

  for (var i = 0; i < _init.length; i++) {
    _init[i].call(this);
  }
}

var _init = [];

Class._init = function(fn) {
  _init.push(fn);
};

var _load = [];

Class._load = function(fn) {
  _load.push(fn);
};

var _config = {};

Class.config = function() {
  if (arguments.length === 1 && is.string(arguments[0])) {
    return _config[arguments[0]];
  }
  if (arguments.length === 1 && is.object(arguments[0])) {
    extend(_config, arguments[0]);
  }
  if (arguments.length === 2 && is.string(arguments[0])) {
    _config[arguments[0], arguments[1]];
  }
};

var _app_queue = [];
var _preload_queue = [];
var _stages = [];
var _loaded = false;
var _paused = false;

Class.app = function(app, opts) {
  if (!_loaded) {
    _app_queue.push(arguments);
    return;
  }
  DEBUG && console.log('Creating app...');
  var loader = Class.config('app-loader');
  loader(function(stage, canvas) {
    DEBUG && console.log('Initing app...');
    for (var i = 0; i < _load.length; i++) {
      _load[i].call(this, stage, canvas);
    }
    app(stage, canvas);
    _stages.push(stage);
    DEBUG && console.log('Starting app...');
    stage.start();
  }, opts);
};

var loading = _await();

Class.preload = function(load) {
  if (typeof load === 'string') {
    var url = Class.resolve(load);
    if (/\.js($|\?|\#)/.test(url)) {
      DEBUG && console.log('Loading script: ' + url);
      load = function(callback) {
        loadScript(url, callback);
      };
    }
  }
  if (typeof load !== 'function') {
    return;
  }
  // if (!_started) {
  // _preload_queue.push(load);
  // return;
  // }
  load(loading());
};

Class.start = function(config) {
  DEBUG && console.log('Starting...');

  Class.config(config);

  // DEBUG && console.log('Preloading...');
  // _started = true;
  // while (_preload_queue.length) {
  // var load = _preload_queue.shift();
  // load(loading());
  // }

  loading.then(function() {
    DEBUG && console.log('Loading apps...');
    _loaded = true;
    while (_app_queue.length) {
      var args = _app_queue.shift();
      Class.app.apply(Class, args);
    }
  });
};

Class.pause = function() {
  if (!_paused) {
    _paused = true;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].pause();
    }
  }
};

Class.resume = function() {
  if (_paused) {
    _paused = false;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].resume();
    }
  }
};

Class.create = function() {
  return new Class();
};

Class.resolve = (function() {

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return function(url) {
      return url;
    };
  }

  var scripts = document.getElementsByTagName('script');

  function getScriptSrc() {
    // HTML5
    if (document.currentScript) {
      return document.currentScript.src;
    }

    // IE>=10
    var stack;
    try {
      var err = new Error();
      if (err.stack) {
        stack = err.stack;
      } else {
        throw err;
      }
    } catch (err) {
      stack = err.stack;
    }
    if (typeof stack === 'string') {
      stack = stack.split('\n');
      // Uses the last line, where the call started
      for (var i = stack.length; i--;) {
        var url = stack[i].match(/(\w+\:\/\/[^/]*?\/.+?)(:\d+)(:\d+)?/);
        if (url) {
          return url[1];
        }
      }
    }

    // IE<11
    if (scripts.length && 'readyState' in scripts[0]) {
      for (var i = scripts.length; i--;) {
        if (scripts[i].readyState === 'interactive') {
          return scripts[i].src;
        }
      }
    }

    return location.href;
  }

  return function(url) {
    if (/^\.\//.test(url)) {
      var src = getScriptSrc();
      var base = src.substring(0, src.lastIndexOf('/') + 1);
      url = base + url.substring(2);
      // } else if (/^\.\.\//.test(url)) {
      // url = base + url;
    }
    return url;
  };
})();

module.exports = Class;

function loadScript(src, callback) {
  var el = document.createElement('script');
  el.addEventListener('load', function() {
    callback();
  });
  el.addEventListener('error', function(err) {
    callback(err || 'Error loading script: ' + src);
  });
  el.src = src;
  el.id = 'preload-' + Date.now();
  document.body.appendChild(el);
};