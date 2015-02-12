/*
 * CutJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = typeof DEBUG === 'undefined' || DEBUG;

if (typeof Cut === 'undefined' && typeof require === 'function')
  var Cut = require('./cut-core');

Cut.prototype.tween = function(duration, delay) {
  if (!this._tween) {
    this._tween = new Tween(this);
  }
  return this._tween.tween(duration, delay);
};

function Tween(cut) {
  var tween = this;
  this._owner = cut;
  this._queue = [];
  this._next = null;

  cut.tick(function(elapsed) {
    if (!tween._queue.length) {
      return;
    }

    this.touch();

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

function Easing(token) {
  if (typeof token === 'function') {
    return token;
  }
  if (typeof token !== 'string') {
    return Easing._identity;
  }
  var fn = Easing._cache[token];
  if (fn) {
    return fn;
  }
  var match = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
  if (!match || !match.length) {
    return Easing._identity;
  }
  easing = Easing._easings[match[1]];
  mode = Easing._modes[match[3]];
  params = match[5];
  if (easing && easing.fn) {
    fn = easing.fn;
  } else if (easing && easing.fc) {
    fn = easing.fc.apply(easing.fc, params
        && params.replace(/\s+/, '').split(','));
  } else {
    fn = Easing._identity;
  }
  if (mode) {
    fn = mode.fn(fn);
  }
  // TODO: It can be a memory leak with different `params`.
  Easing._cache[token] = fn;
  return fn;
};

Easing._identity = function(x) {
  return x;
};

Easing._cache = {};

Easing._modes = {};

Easing._easings = {};

Easing.add = function(data) {
  var names = (data.name || data.mode).split(/\s+/);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (name) {
      (data.name ? Easing._easings : Easing._modes)[name] = data;
    }
  }
};

Easing.add({
  mode : 'in',
  fn : function(f) {
    return f;
  }
});

Easing.add({
  mode : 'out',
  fn : function(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
});

Easing.add({
  mode : 'in-out',
  fn : function(f) {
    return function(t) {
      return (t < 0.5) ? (f(2 * t) / 2) : (1 - f(2 * (1 - t)) / 2);
    };
  }
});

Easing.add({
  mode : 'out-in',
  fn : function(f) {
    return function(t) {
      return (t < 0.5) ? (1 - f(2 * (1 - t)) / 2) : (f(2 * t) / 2);
    };
  }
});

Easing.add({
  name : 'linear',
  fn : function(t) {
    return t;
  }
});

Easing.add({
  name : 'quad',
  fn : function(t) {
    return t * t;
  }
});

Easing.add({
  name : 'cubic',
  fn : function(t) {
    return t * t * t;
  }
});

Easing.add({
  name : 'quart',
  fn : function(t) {
    return t * t * t * t;
  }
});

Easing.add({
  name : 'quint',
  fn : function(t) {
    return t * t * t * t * t;
  }
});

Easing.add({
  name : 'sin sine',
  fn : function(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
});

Easing.add({
  name : 'exp',
  fn : function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
});

Easing.add({
  name : 'circle circ',
  fn : function(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
});

Easing.add({
  name : 'bounce',
  fn : function(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625
        * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625
        * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t
        + .984375;
  }
});

Easing.add({
  name : 'poly',
  fc : function(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
});

Easing.add({
  name : 'elastic',
  fc : function(a, p) {
    p = p || 0.45;
    a = a || 1;
    var s = p / (2 * Math.PI) * Math.asin(1 / a);
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t)
          * Math.sin((t - s) * (2 * Math.PI) / p);
    };
  }
});

Easing.add({
  name : 'back',
  fc : function(s) {
    s = typeof s !== 'undefined' ? s : 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
});

if (module !== 'undefined' && module.exports) {
  module.exports.Tween = Tween;
  module.exports.Easing = Easing;
}
