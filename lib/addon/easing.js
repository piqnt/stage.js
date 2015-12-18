function _identity(x) {
  return x;
};
var _cache = {};
var _modes = {};
var _easings = {};

function Easing(token) {
  if (typeof token === 'function') {
    return token;
  }
  if (typeof token !== 'string') {
    return _identity;
  }
  var fn = _cache[token];
  if (fn) {
    return fn;
  }
  var match = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
  if (!match || !match.length) {
    return _identity;
  }
  var easing = _easings[match[1]];
  var mode = _modes[match[3]];
  var params = match[5];
  if (easing && easing.fn) {
    fn = easing.fn;
  } else if (easing && easing.fc) {
    fn = easing.fc.apply(easing.fc, params
        && params.replace(/\s+/, '').split(','));
  } else {
    fn = _identity;
  }
  if (mode) {
    fn = mode.fn(fn);
  }
  // TODO: It can be a memory leak with different `params`.
  _cache[token] = fn;
  return fn;
};

Easing.add = function(data) {
  // TODO: create a map of all { name-mode : data }
  var names = (data.name || data.mode).split(/\s+/);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (name) {
      (data.name ? _easings : _modes)[name] = data;
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
  name : 'exp expo',
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

module.exports = Easing;
