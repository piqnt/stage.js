/*
 * Copyright (c) 2016 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

function Randomize() {
  this._options = [];
}

/**
 * For debugging.
 */
Randomize.prototype.lock = function(option) {
  this._lock = option;
};

Randomize.prototype.add = function(option, weight) {
  weight = Randomize._fnum(weight, 1);
  this._options.push({
    value : option,
    weight : weight
  });
  return this;
};

Randomize.prototype.select = function(select) {
  return this._options[select][0];
};

Randomize.prototype.random = function(data) {
  if (this._lock) {
    return this._lock;
  }

  var sum = 0;
  for (var i = 0; i < this._options.length; i++) {
    var option = this._options[i];
    sum += option.xweight = option.weight(data);
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

Randomize.prototype.reset = function() {
  return this;
};

Randomize.prototype.test = function() {
  return true;
};

Randomize.prototype.spacing = function(space) {
  space = Randomize._fnum(space, 1);
  var next = 0;
  this.test = function(t, data) {
    t = typeof t === 'number' ? t : 1;
    if (next == 0) {
      next = space(data);
      return false;
    }
    if ((next -= t) <= 0) {
      next = space(data);
      return true;
    }
    return false;
  };
  this.reset = function() {
    next = 0;
    return this;
  };
  return this;
};

Randomize.prototype.prob = function(prob) {
  prob = Randomize._fnum(prob, 1);
  this.test = function(data) {
    return Math.random() < prob(data) ? true : false;
  };
  return this;
};

Randomize._fnum = function(value, fallback) {
  if (typeof value === 'function') {
    return value;
  }
  if (typeof value === 'number') {
    return function() {
      return value;
    };
  }
  return function() {
    return fallback;
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
