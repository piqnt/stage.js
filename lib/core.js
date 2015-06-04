/*
 * Stage.js
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

var stats = require('./util/stats');
var extend = require('./util/extend');
var once = require('./util/once');
var is = require('./util/is');

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
var _started = false;
var _paused = false;

Class.app = function(app, opts) {
  if (!_started) {
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

Class.preload = function(load) {
  if (typeof load === 'string') {
    if (/\.js($|\?|\#)/.test(load)) {
      return Class.preloadScript(load);
    }
  }
  if (typeof load !== 'function') {
    return;
  }
  if (!_started) {
    _preload_queue.push(load);
    return;
  }
  load(function(err) {
    console.log(err);
  });
};

Class.start = function(config) {
  DEBUG && console.log('Starting...');

  Class.config(config);

  DEBUG && console.log('Preloading...');
  (function next() {
    if (_preload_queue.length) {
      var load = _preload_queue.shift();
      load(next);
    } else {
      DEBUG && console.log('Loading apps...');
      _started = true;
      while (_app_queue.length) {
        var args = _app_queue.shift();
        Class.app.apply(Class, args);
      }
    }
  })();
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

module.exports = Class;

Class.preloadScript = function(src) {
  return Class.preload(function(callback) {
    loadScript(src, callback);
  });
};

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