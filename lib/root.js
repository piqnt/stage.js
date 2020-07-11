var Class = require('./core');
require('./pin');
require('./loop');

var stats = require('./util/stats');
var create = require('./util/create');
var extend = require('./util/extend');

Root._super = Class;
Root.prototype = create(Root._super.prototype);

Class.root = function(request, render) {
  return new Root(request, render);
};

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

    stats.tick = stats.node = stats.draw = 0;

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
    return extend({}, this._viewport);
  }
  this._viewport = {
    width : width,
    height : height,
    ratio : ratio || 1
  };
  this.viewbox();
  var data = extend({}, this._viewport);
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
