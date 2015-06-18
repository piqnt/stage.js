var Easing = require('./easing');
var Class = require('../core');
var Pin = require('../pin');

Class.prototype.tween = function(duration, delay) {
  if (!this._tween) {
    this._tween = new Tween(this);
  }
  return this._tween.tween(duration, delay);
};

var iid = 0;

function Tween(node) {
  // TODO: reuse head.start/end

  var tween = this;
  this._owner = node;
  this._queue = [];
  this._next = null;

  var lastTime = 0;
  node.tick(function(elapsed, now, last) {
    if (!tween._queue.length) {
      return;
    }

    // ignore old elapsed
    var ignore = lastTime != last;
    lastTime = now;
    if (ignore) {
      return true;
    }

    var head = tween._queue[0];

    head.time += elapsed;

    var started = head.time - head.delay;

    if (started < 0) {
      return true;
    }

    if (!head.start) {
      head.start = {};
      for ( var key in head.end) {
        head.start[key] = node.pin(key);
      }
    }

    var p, over;
    if (started < head.duration) {
      p = started / head.duration, over = false;
    } else {
      p = 1, over = true;
    }
    p = typeof head.easing == 'function' ? head.easing(p) : p;
    var q = 1 - p;

    for ( var key in head.end) {
      node.pin(key, head.start[key] * q + head.end[key] * p);
    }

    if (over) {
      tween._queue.shift();
      head.callback && head.callback.call(node);
    }

    return true;
  }, true);
};

Tween.prototype.tween = function(duration, delay) {
  this._next = {
    id : ++iid,
    end : {},
    duration : duration || 400,
    delay : delay || 0,
    time : 0
  };
  return this;
};

function mapPinning(node, map, key, value) {
  if (typeof node.pin(key) === 'number') {
    map[key] = value;
  } else if (typeof node.pin(key + 'X') === 'number'
      && typeof node.pin(key + 'Y') === 'number') {
    map[key + 'X'] = value;
    map[key + 'Y'] = value;
  }
}

Tween.prototype.pin = function(a, b) {
  if (this._next !== this._queue[this._queue.length - 1]) {
    this._owner.touch();
    this._queue.push(this._next);
  }

  if (typeof a === 'object') {
    for ( var attr in a) {
      mapPinning(this._owner, this._next.end, attr, a[attr]);
    }
  } else if (typeof b !== 'undefined') {
    mapPinning(this._owner, this._next.end, a, b);
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

/**
 * @deprecated Use end(fn) instead.
 */
Tween.prototype.then = function(fn) {
  this._next.callback = fn;
  return this;
};

Tween.prototype.ease = function(easing) {
  this._next.easing = Easing(easing);
  return this;
};

Tween.prototype.end = function(fn) {
  this._next.callback = fn;
  return this;
};

Tween.prototype.hide = function() {
  this.end(function() {
    this.hide();
  });
  return this;
};

Tween.prototype.remove = function() {
  this.end(function() {
    this.remove();
  });
  return this;
};

Pin._add_shortcuts(Tween);

module.exports = Tween;
