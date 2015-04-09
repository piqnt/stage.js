/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Easing = require('./easing');
var Cut = require('./core');

Cut.prototype.tween = function(duration, delay) {
  if (!this._tween) {
    this._tween = new Tween(this);
  }
  return this._tween.tween(duration, delay);
};

function Tween(cut) {
  // TODO: reuse head.start/keys/end

  var tween = this;
  this._owner = cut;
  this._queue = [];
  this._next = null;

  var lastTime = 0;
  cut.tick(function(elapsed, now, last) {
    if (!tween._queue.length) {
      return;
    }

    // ignore old elapsed
    var ignore = lastTime != last;
    lastTime = now;
    this.touch();
    if (ignore) {
      return;
    }

    var head = tween._queue[0];

    if (!head.time) {
      head.time = 1;
    } else {
      head.time += elapsed;
    }

    if (head.time < head.delay) {
      return;
    }

    if (!head.start) {
      head.start = {};
      head.keys = {};
      for ( var key in head.end) {
        if (typeof (start = cut.pin(key)) === 'number') {
          head.start[key] = start;
          head.keys[key] = key;
        } else if (typeof (startX = cut.pin(key + 'X')) === 'number'
            && typeof (startY = cut.pin(key + 'Y')) === 'number') {
          head.start[key + 'X'] = startX;
          head.keys[key + 'X'] = key;
          head.start[key + 'Y'] = startY;
          head.keys[key + 'Y'] = key;
        }
      }
    }

    var p = (head.time - head.delay) / head.duration;
    var over = p >= 1;
    p = p > 1 ? 1 : p;
    p = typeof head.easing == 'function' ? head.easing(p) : p;
    var q = 1 - p;

    for ( var key in head.keys) {
      cut.pin(key, head.start[key] * q + head.end[head.keys[key]] * p);
    }

    if (over) {
      tween._queue.shift();
      head.then && head.then.call(cut);
    }

  }, true);
};

Tween.prototype.tween = function(duration, delay) {
  this._next = {
    id : Cut._TS++,
    end : {},
    duration : duration || 400,
    delay : delay || 0
  };
  return this;
};

Tween.prototype.pin = function(a, b) {
  if (this._next !== this._queue[this._queue.length - 1]) {
    this._owner.touch();
    this._queue.push(this._next);
  }

  var end = this._next.end;
  if (typeof a === 'object') {
    for ( var attr in a) {
      end[attr] = a[attr];
    }
  } else if (typeof b !== 'undefined') {
    end[a] = b;
  }
  return this;
};

Tween.prototype.clear = function(forward) {
  var tween;
  while (tween = this._queue.shift()) {
    forward && this._owner.pin(tween.end);
  }
  return this;
};

Tween.prototype.then = function(then) {
  this._next.then = then;
  return this;
};

Tween.prototype.ease = function(easing) {
  this._next.easing = Easing(easing);
  return this;
};

module.exports = Tween;
