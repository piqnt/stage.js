/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

var stats = require('./util/stats');
var extend = require('./util/extend');
var once = require('./util/once');

stats.create = 0;

function Cut(arg) {
  if (!(this instanceof Cut)) {
    if (typeof arg === 'undefined' || arg === null) {
      return arg;
    } else if (typeof arg === 'function') {
      return Cut.app.apply(Cut, arguments);
    } else if (typeof arg === 'object') {
      return Cut.atlas.apply(Cut, arguments);
    }
  }

  stats.create++;

  for (var i = 0; i < _init.length; i++) {
    _init[i].call(this);
  }
}

var _init = [];

Cut._init = function(fn) {
  _init.push(fn);
};

var _config = {};

Cut.config = function() {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return _config[arguments[0]];
  }
  if (arguments.length === 1 && typeof arguments[0] === 'object') {
    extend(_config, arguments[0]);
  }
  if (arguments.length === 2 && typeof arguments[0] === 'string') {
    _config[arguments[0], arguments[1]];
  }
};

var _app_queue = [];
var _preload_queue = [];
var _app_roots = [];
var _started = false;
var _paused = false;

Cut.app = function(app, opts) {
  if (!_started) {
    _app_queue.push(arguments);
    return;
  }
  DEBUG && console.log('Creating app...');
  var loader = Cut.config('app-loader');
  loader(function(root, canvas) {
    DEBUG && console.log('Initing app...');
    app(root, canvas);
    _app_roots.push(root);
    DEBUG && console.log('Starting app...');
    root.start();
  }, opts);
};

Cut.preload = function(load) {
  if (!_started) {
    _preload_queue.push(load);
    return;
  }
  load(function(err) {
  });
};

Cut.start = function(config) {
  DEBUG && console.log('Starting...');

  Cut.config(config);

  DEBUG && console.log('Preloading...');

  var loading = 0;

  if (!_preload_queue.length) {
    done();
  } else {
    while (_preload_queue.length) {
      var preload = _preload_queue.shift();
      preload(once(done));
      loading++;
    }
  }

  function done() {
    if (--loading <= 0) {
      DEBUG && console.log('Loading apps...');
      _started = true;
      while (_app_queue.length) {
        var args = _app_queue.shift();
        Cut.app.apply(Cut, args);
      }
    }
  }
};

Cut.pause = function() {
  if (!_paused) {
    _paused = true;
    for (var i = _app_roots.length - 1; i >= 0; i--) {
      _app_roots[i].pause();
    }
  }
};

Cut.resume = function() {
  if (_paused) {
    _paused = false;
    for (var i = _app_roots.length - 1; i >= 0; i--) {
      _app_roots[i].resume();
    }
  }
};

Cut.create = function() {
  return new Cut();
};

module.exports = Cut;
