import Stage from './core';
import Mouse from './mouse';
import './loop';

import stats from './util/stats';

if (typeof DEBUG === 'undefined')
  DEBUG = true;

Stage.mount = function(configs) {
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

  context = canvas.getContext('2d');

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
  var root = new Root(requestAnimationFrame, render);
  root.dom = canvas;

  function render() {
    if (width > 0 && height > 0) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      root.render(context);
    }
  }

  root.background = function(color) {
    canvas.style.backgroundColor = color;
    return this;
  };

  // resize();
  // window.addEventListener('resize', resize, false);
  // window.addEventListener('orientationchange', resize, false);

  var lastWidth = -1;
  var lastHeight = -1;
  (function resizeLoop() {
    var width, height;
    if (full) {
      // screen.availWidth/Height?
      width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      height = (window.innerHeight > 0 ? window.innerHeight : screen.height);
    } else {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    }
    if (lastWidth !== width || lastHeight !== height) {
      lastWidth = width;
      lastHeight = height;
      resize();
    }
    requestAnimationFrame(resizeLoop);
  })();

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

  Mouse.subscribe(root, canvas);

  _stages.push(root);
  root.start();
  return root;
};

var _stages = [];
var _paused = false;

// todo: replace this with a proper event system
Stage.pause = function() {
  if (!_paused) {
    _paused = true;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].pause();
    }
  }
};

// todo: replace this with a proper event system
Stage.resume = function() {
  if (_paused) {
    _paused = false;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].resume();
    }
  }
};

Root._super = Stage;
Root.prototype = Object.create(Root._super.prototype);

function Root(request, render) {
  Root._super.call(this);
  this.label('Root');

  var paused = true;
  var stopped = true;

  var self = this;
  var lastTime = 0;
  var loop = function(now) {
    if (paused === true || stopped === true) {
      return;
    }

    var last = lastTime || now;
    var elapsed = now - last;
    lastTime = now;

    var ticked = self._tick(elapsed, now, last);
    if (self._mo_touch != self._ts_touch) {
      self._mo_touch = self._ts_touch;
      render(self);
      request(loop);
    } else if (ticked) {
      request(loop);
    } else {
      paused = true;
    }

    stats.fps = elapsed ? 1000 / elapsed : 0;
  };

  this.start = function() {
    stopped = false;
    return this.resume();
  };

  this.resume = function() {
    if (paused) {
      this.publish('resume');
      paused = false;
      request(loop);
    }
    return this;
  };

  this.pause = function() {
    if (!paused) {
      this.publish('pause');
    }
    paused = true;
    return this;
  };

  this.touch_root = this.touch;
  this.touch = function() {
    this.resume();
    return this.touch_root();
  };
  this.stop = function() {
    stopped = true;
    return this;
  };
};

Root.prototype.background = function(color) {
  // to be implemented by loaders
  return this;
};

Root.prototype.viewport = function(width, height, ratio) {
  if (typeof width === 'undefined') {
    return Object.assign({}, this._viewport);
  }
  this._viewport = {
    width : width,
    height : height,
    ratio : ratio || 1
  };
  this.viewbox();
  var data = Object.assign({}, this._viewport);
  this.visit({
    start : function(node) {
      if (!node._flag('viewport')) {
        return true;
      }
      node.publish('viewport', [ data ]);
    }
  });
  return this;
};

// TODO: static/fixed viewbox
Root.prototype.viewbox = function(width, height, mode) {
  if (typeof width === 'number' && typeof height === 'number') {
    this._viewbox = {
      width : width,
      height : height,
      mode : /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
    };
  }

  var box = this._viewbox;
  var size = this._viewport;
  if (size && box) {
    this.pin({
      width : box.width,
      height : box.height
    });
    this.scaleTo(size.width, size.height, box.mode);
  } else if (size) {
    this.pin({
      width : size.width,
      height : size.height
    });
  }

  return this;
};

export default Root;
