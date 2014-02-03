/*
 * ExtraJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

var Extra = Extra || {}, X = Extra;

Extra.Randomize = Randomize = function() {
  this._options = [];
  this._nope = null;
  this._filter = function(option) {
    return option;
  };
};

Randomize.prototype.reset = function() {
  this._reset && this._reset();
  return this;
};

Randomize.prototype.clone = function() {
  var clone = new Randomize();
  Array.push.apply(clone._options, this._options);
  clone._nope = this._nope;
  clone._filter = this._filter;
  clone._lock = this._lock;
  clone._condition = this._condition;
  return clone;
};

Randomize.prototype.filter = function(func) {
  this._filter = func || function(option) {
    return option;
  };
  return this;
};

Randomize.prototype.nope = function(nope) {
  if (!arguments.length) {
    return this._nope;
  }
  this._nope = nope;
  return this;
};

Randomize.prototype.add = function(option, weight, lock) {
  this._options.push([ option, Randomize._numbor(weight, 1) ]);
  if (lock) {
    this._lock = this._options.length - 1;
  }
  return this;
};

Randomize.prototype.condition = function(condition, reset) {
  this._condition = condition;
  this._reset = reset;
  return this;
};

Randomize.prototype.test = function() {
  this._failed = this._condition && !this._condition.apply(null, arguments);
  return this;
};

Randomize.prototype.select = function(select) {
  return this._filter(this._options[select][0]);
};

Randomize.prototype.random = function() {

  if (this._failed) {
    this._failed = false;
    return this._filter(this._nope);
  }

  if (typeof this._lock === "number") {
    return this.select(this._lock);
  }

  var sum = 0;
  for (var i = 0; i < this._options.length; i++) {
    var option = this._options[i];
    option[2] = option[1].apply(null, arguments);
    sum += (option[2]);
  }

  var rand = Math.random() * sum;
  var selected = this._nope;
  for (var i = 0; i < this._options.length; i++) {
    var option = this._options[i];
    if ((rand -= option[2]) < 0) {
      selected = option[0];
      break;
    }
  }
  return this._filter(selected);
};

Randomize.prototype.spacing = function(spacing, init) {
  spacing = Randomize._numbor(spacing, 1);
  var space = init;
  this.condition(function(t) {
    t = arguments.length ? t : 1;
    if (typeof space !== "number") {
      space = spacing.apply(null, arguments);
      return false;
    }
    if ((space -= t) < 0) {
      space = spacing.apply(null, arguments);
      return true;
    }
    return false;
  }, function() {
    space = null;
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
