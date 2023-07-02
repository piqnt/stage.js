import { Easing } from './easing';
import { Node } from './core';
import { Pin } from './pin';

Node.prototype.tween = function(a, b, c) {
  let options;
  if (typeof a === 'object' && a !== null) {
    options = a;
  } else if (typeof a === 'number' && typeof b === 'number') {
    options = {
      duration: a,
      delay: b,
      append: c,
    };
  } else if (typeof a === 'number') {
    options = {
      duration: a,
      delay: 0,
      append: b,
    };
  } else {
    options = {
      duration: 400,
      delay: 0,
      append: a,
    };
  }

  if (!this._tweens) {
    this._tweens = [];
    var ticktime = 0;
    this.tick(function(elapsed, now, last) {
      if (!this._tweens.length) {
        return false;
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
  if (!options.append) {
    this._tweens.length = 0;
  }
  var tween = new Tween(this, options);
  this._tweens.push(tween);
  return tween;
};

export class Tween {
  _ending = [];
  constructor(owner, options = {}) {
    this._end = {};
    this._duration = options.duration || 400;
    this._delay = options.delay || 0;

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

    var p = Math.min(time / this._duration, 1);
    var ended = p >= 1;

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
      this.hide();
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
   * @deprecated this doesn't do anything anymore, call tween on the node instead.
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

