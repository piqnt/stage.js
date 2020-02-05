var Easing = require('./easing');
var Class = require('../core');
var Pin = require('../pin');

Class.prototype.tween = function(duration, delay, append) {
  if (typeof duration !== 'number') {
    append = duration, delay = 0, duration = 0;
  } else if (typeof delay !== 'number') {
    append = delay, delay = 0;
  }

  if (!this._tweens) {
    this._tweens = [];
    var ticktime = 0;
    this.tick(function(elapsed, now, last) {
      if (!this._tweens.length) {
        return;
      }

      // ignore old elapsed
      var ignore = ticktime != last;
      ticktime = now;
      if (ignore) {
        return true;
      }

      var head = this._tweens[0];

      var next = head.tick(this, elapsed, now, last);

      if (next && head === this._tweens[0]) {
        this._tweens.shift();
      }

      if (Array.isArray(next)) {
        for (var i = 0; i < next.length; i++) {
          try {
            next[i].call(this);
          } catch (e) {
            console.log(e);
          }
        }
      } else if (typeof next === 'object') {
        this._tweens.unshift(next);
      }

      return true;
    }, true);
  }

  this.touch();
  if (!append) {
    this._tweens.length = 0;
  }
  var tween = new Tween(this, duration, delay);
  this._tweens.push(tween);
  return tween;
};

function Tween(owner, duration, delay) {
  this._end = {};
  this._duration = duration || 400;
  this._delay = delay || 0;

  this._owner = owner;
  this._time = 0;
};

Tween.prototype.tick = function(node, elapsed, now, last) {
  this._time += elapsed;

  if (this._time < this._delay) {
    return;
  }

  var time = this._time - this._delay;

  if (!this._start) {
    this._start = {};
    for ( var key in this._end) {
      this._start[key] = this._owner.pin(key);
    }
  }

  var p, over;
  if (time < this._duration) {
    p = time / this._duration;
    over = false;
  } else {
    p = 1;
    over = true;
  }

  if (typeof this._easing == 'function') {
    p = this._easing(p);
  }

  var q = 1 - p;

  for ( var key in this._end) {
    this._owner.pin(key, this._start[key] * q + this._end[key] * p);
  }

  if (over) {
    var actions = [this._hide, this._remove, this._done];
    actions = actions.filter(function( element ) {
      return typeof element === 'function';
    });
    return this._next || actions;
  }
};

Tween.prototype.tween = function(duration, delay) {
  return this._next = new Tween(this._owner, duration, delay);
};

Tween.prototype.duration = function(duration) {
  this._duration = duration;
  return this;
};

Tween.prototype.delay = function(delay) {
  this._delay = delay;
  return this;
};

Tween.prototype.ease = function(easing) {
  this._easing = Easing(easing);
  return this;
};

Tween.prototype.done = function(fn) {
  this._done = fn;
  return this;
};

Tween.prototype.hide = function() {
  this._hide = function() {
    this.hide();
  };
  return this;
};

Tween.prototype.remove = function() {
  this._remove = function() {
    this.remove();
  };
  return this;
};

Tween.prototype.pin = function(a, b) {
  if (typeof a === 'object') {
    for ( var attr in a) {
      pinning(this._owner, this._end, attr, a[attr]);
    }
  } else if (typeof b !== 'undefined') {
    pinning(this._owner, this._end, a, b);
  }
  return this;
};

function pinning(node, map, key, value) {
  if (typeof node.pin(key) === 'number') {
    map[key] = value;
  } else if (typeof node.pin(key + 'X') === 'number'
      && typeof node.pin(key + 'Y') === 'number') {
    map[key + 'X'] = value;
    map[key + 'Y'] = value;
  }
}

Pin._add_shortcuts(Tween);

/**
 * @deprecated Use .done(fn) instead.
 */
Tween.prototype.then = function(fn) {
  this.done(fn);
  return this;
};

/**
 * @deprecated NOOP
 */
Tween.prototype.clear = function(forward) {
  return this;
};

module.exports = Tween;
