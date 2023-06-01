import is from 'is';

if (typeof DEBUG === 'undefined')
  DEBUG = true;

import stats from './util/stats';
import _await from './util/await';

stats.create = 0;

function Stage(arg) {
  if (!(this instanceof Stage)) {
    if (is.fn(arg)) {
      return Stage.app.apply(Stage, arguments);
    } else if (is.object(arg)) {
      return Stage.atlas.apply(Stage, arguments);
    } else {
      return arg;
    }
  }

  stats.create++;

  for (var i = 0; i < _init.length; i++) {
    _init[i].call(this);
  }
}

export default Stage;

var _init = [];

Stage._init = function(fn) {
  _init.push(fn);
};

var _load = [];

Stage._load = function(fn) {
  _load.push(fn);
};

var _config = {};

Stage.config = function() {
  if (arguments.length === 1 && is.string(arguments[0])) {
    return _config[arguments[0]];
  }
  if (arguments.length === 1 && is.object(arguments[0])) {
    Object.assign(_config, arguments[0]);
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

Stage.app = function(app, opts) {
  if (!_loaded) {
    _app_queue.push(arguments);
    return;
  }
  DEBUG && console.log('Creating app...');
  var loader = Stage.config('app-loader');
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

Stage.preload = function(load) {
  if (typeof load !== 'function') {
    return;
  }
  // if (!_started) {
  // _preload_queue.push(load);
  // return;
  // }
  load(loading());
};

Stage.start = function(config) {
  DEBUG && console.log('Starting...');

  Stage.config(config);

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
      Stage.app.apply(Stage, args);
    }
  });
};

Stage.pause = function() {
  if (!_paused) {
    _paused = true;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].pause();
    }
  }
};

Stage.resume = function() {
  if (_paused) {
    _paused = false;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].resume();
    }
  }
};

Stage.create = function() {
  return new Stage();
};
