/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
require('./pin');
require('./render');

var stats = require('./util/stats');
var create = require('./util/create');
var extend = require('./util/extend');

Root._super = Cut;
Root.prototype = create(Root._super.prototype);

Cut.root = function(request, render) {
  return new Root(request, render);
};

function Root(request, render) {
  Root._super.call(this);
  this.label('Root');

  this._paused = true;

  var self = this;
  var lastTime = 0;
  var loop = function(now) {
    if (self._paused === true) {
      return;
    }

    stats.tick = stats.node = stats.draw = 0;

    var last = lastTime || now;
    var elapsed = now - last;
    lastTime = now;

    var ticked = self._tick(elapsed, now, last);
    if (self._mo_touch != self._ts_touch) {
      self._mo_touch = self._ts_touch;
      render.call(self);
      self.request();
    } else if (ticked) {
      self.request();
    } else {
      self.pause();
    }

    stats.fps = elapsed ? 1000 / elapsed : 0;
  };

  this.request = function() {
    request(loop);
  };
};

Root.prototype.start = function() {
  return this.resume();
};

Root.prototype.resume = function(force) {
  if (this._paused || force) {
    this._paused = false;
    this.request();
  }
  return this;
};

Root.prototype.pause = function() {
  this._paused = true;
  return this;
};

Root.prototype.touch = function() {
  this.resume();
  return Root._super.prototype.touch.call(this);
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
  this._updateViewbox();
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
  this._viewbox = {
    width : width,
    height : height,
    mode : /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
  };
  this._updateViewbox();
  return this;
};

Root.prototype._updateViewbox = function() {
  var box = this._viewbox;
  var size = this._viewport;
  if (size && box) {
    this.pin({
      width : box.width,
      height : box.height
    });
    this._pin._scaleTo(size.width, size.height, box.mode);
  } else if (size) {
    this.pin({
      width : size.width,
      height : size.height
    });
  }
};
