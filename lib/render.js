/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
require('./pin');

var stats = require('./util/stats');
var create = require('./util/create');

Cut.prototype._textures = null;
Cut.prototype._tickBefore = null;
Cut.prototype._tickAfter = null;
Cut.prototype._alpha = 1;

Cut.prototype.render = function(context) {
  if (!this._visible) {
    return;
  }
  stats.node++;

  var m = this.matrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

  // move this elsewhere!
  this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
  var alpha = this._pin._textureAlpha * this._alpha;

  if (context.globalAlpha != alpha) {
    context.globalAlpha = alpha;
  }

  if (this._textures !== null) {
    for (var i = 0, n = this._textures.length; i < n; i++) {
      this._textures[i].draw(context);
    }
  }

  if (context.globalAlpha != this._alpha) {
    context.globalAlpha = this._alpha;
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child.render(context);
  }
};

Cut.prototype.MAX_ELAPSE = Infinity;

Cut.prototype._tick = function(elapsed, now, last) {
  if (!this._visible) {
    return;
  }

  if (elapsed > this.MAX_ELAPSE) {
    elapsed = this.MAX_ELAPSE;
  }

  var ticked = false;

  if (this._tickBefore !== null) {
    for (var i = 0, n = this._tickBefore.length; i < n; i++) {
      stats.tick++;
      ticked = this._tickBefore[i].call(this, elapsed, now, last) === true
          || ticked;
    }
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    if (child._flag('_tick')) {
      ticked = child._tick(elapsed, now, last) === true ? true : ticked;
    }
  }

  if (this._tickAfter !== null) {
    for (var i = 0, n = this._tickAfter.length; i < n; i++) {
      stats.tick++;
      ticked = this._tickAfter[i].call(this, elapsed, now, last) === true
          || ticked;
    }
  }

  return ticked;
};

Cut.prototype.tick = function(ticker, before) {
  if (typeof ticker !== 'function') {
    return;
  }
  if (before) {
    if (this._tickBefore === null) {
      this._tickBefore = [];
    }
    this._tickBefore.push(ticker);
  } else {
    if (this._tickAfter === null) {
      this._tickAfter = [];
    }
    this._tickAfter.push(ticker);
  }
  this._flag('_tick', this._tickAfter !== null && this._tickAfter.length > 0
      || this._tickBefore !== null && this._tickBefore.length > 0);
};

Cut.prototype.untick = function(ticker) {
  if (typeof ticker !== 'function') {
    return;
  }
  var i;
  if (this._tickBefore !== null && (i = this._tickBefore.indexOf(ticker)) >= 0) {
    this._tickBefore.splice(i, 1);
  }
  if (this._tickAfter !== null && (i = this._tickAfter.indexOf(ticker)) >= 0) {
    this._tickAfter.splice(i, 1);
  }
};
