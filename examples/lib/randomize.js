/*
 * ExtraJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

function Randomize() {
  this._options = [];

  var self = this;
  this._true = function() {
    return self.random.apply(self, arguments);
  };
  this._false = function() {
    return self._nope;
  };
}

/**
 * For debugging.
 */
Randomize.prototype.lock = function(option) {
  this._lock = option;
};

Randomize.prototype.add = function(option, weight) {
  this._options.push({
    value : option,
    weight : Randomize._numbor(weight, 1)
  });
  return this;
};

Randomize.prototype.select = function(select) {
  return this._options[select][0];
};

Randomize.prototype.random = function() {
  if (this._lock) {
    return this._lock;
  }

  var sum = 0;
  for (var i = 0; i < this._options.length; i++) {
    var option = this._options[i];
    sum += (option.xweight = option.weight.apply(null, arguments));
  }

  var rand = Math.random() * sum;
  var selected;
  for (var i = 0; i < this._options.length; i++) {
    var option = this._options[i];
    selected = option.value; // let last one be selected
    if ((rand -= option.xweight) < 0) {
      break;
    }
  }
  return selected;
};

Randomize.prototype.condition = function(condition, reset) {
  this._condition = condition;
  this._reset = reset;
  this._nope = null;
  return this;
};

Randomize.prototype.nope = function(nope) {
  if (!arguments.length) {
    return this._nope;
  }
  this._nope = nope;
  return this;
};

Randomize.prototype.reset = function() {
  this._reset && this._reset();
  return this;
};

Randomize.prototype.test = function() {
  if (!this._condition || this._condition.apply(null, arguments)) {
    return this._true;
  } else {
    return this._false;
  }
};

Randomize.prototype.spacing = function(spacing) {
  spacing = Randomize._numbor(spacing, 1);
  var space = spacing();
  this.condition(function(t) {
    t = typeof t === 'number' ? t : 1;
    if ((space -= t) < 0) {
      space = spacing();
      return true;
    }
    return false;
  }, function() {
    space = spacing();
  });
  return this;
};

Randomize.prototype.prob = function(prob) {
  prob = Randomize._numbor(prob, 1);
  this.condition(function() {
    return Math.random() < prob();
  });
  return this;
};

Randomize._numbor = function(value, fallback) {
  if (typeof value == "function") {
    return value;
  }
  if (typeof value !== "number") {
    value = fallback;
  }
  return function() {
    return value;
  };
};

if (typeof define === "function" && define.amd) { // AMD
  define(function() {
    return Randomize;
  });
}
if (typeof module !== 'undefined') { // CommonJS
  module.exports = Randomize;
}
