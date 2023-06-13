import { Easing } from './easing';
import { Node } from './core';
import { Pin } from './pin';

Node.prototype.tween = function(duration, delay, append) {
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

      var ended = head.tick(this, elapsed, now, last);

      if (ended) {
        if (head === this._tweens[0]) {
          this._tweens.shift();
        }
        var next = head.finish();
        if (next) {
          this._tweens.unshift(next)
        }
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

export class Tween {
  _ending = [];
  constructor(owner, duration, delay) {
    this._end = {};
    this._duration = duration || 400;
    this._delay = delay || 0;

    this._owner = owner;
    this._time = 0;
  }
  // @internal
  tick(node, elapsed, now, last) {
    this._time += elapsed;

    if (this._time < this._delay) {
      return;
    }

    var time = this._time - this._delay;

    if (!this._start) {
      this._start = {};
      for (var key in this._end) {
        this._start[key] = this._owner.pin(key);
      }
    }

    var p, ended;
    if (time < this._duration) {
      p = time / this._duration;
      ended = false;
    } else {
      p = 1;
      ended = true;
    }

    if (typeof this._easing == 'function') {
      p = this._easing(p);
    }

    var q = 1 - p;

    for (var key in this._end) {
      this._owner.pin(key, this._start[key] * q + this._end[key] * p);
    }

    return ended;
  }

  // @internal
  finish() {
    this._ending.forEach(callback => {
      try {
        callback.call(this._owner)
      } catch (e) {
        console.error(e);
      }
    });
    return this._next;
  }
  tween(duration, delay) {
    return this._next = new Tween(this._owner, duration, delay);
  }
  duration(duration) {
    this._duration = duration;
    return this;
  }
  delay(delay) {
    this._delay = delay;
    return this;
  }
  ease(easing) {
    this._easing = Easing.get(easing);
    return this;
  }
  done(fn) {
    this._ending.push(fn);
    return this;
  }
  hide() {
    this._ending.push(function() {
      this.remove();
    });
    this._hide = true;
    return this;
  }
  remove() {
    this._ending.push(function() {
      this.remove();
    });
    this._remove = true;
    return this;
  }
  pin(a, b) {
    if (typeof a === 'object') {
      for (var attr in a) {
        pinning(this._owner, this._end, attr, a[attr]);
      }
    } else if (typeof b !== 'undefined') {
      pinning(this._owner, this._end, a, b);
    }
    return this;
  }
  /**
   * @deprecated Use .done(fn) instead.
   */
  then(fn) {
    this.done(fn);
    return this;
  }
  /**
   * @deprecated NOOP
   */
  clear(forward) {
    return this;
  }
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

Pin._add_shortcuts(Tween.prototype);

