/*
 * ExtraJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

(function() {

  function Randomize() {
    this._options = [];
    this._nope = null;
    this._map = function(option) {
      return option;
    };
  }

  Randomize.prototype.reset = function() {
    this._reset && this._reset();
    return this;
  };

  Randomize.prototype.map = function(func) {
    this._map = func || function(value) {
      return value;
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
      this._lock = option;
    }
    return this;
  };

  Randomize.prototype.select = function(select) {
    return this._map(this._options[select][0]);
  };

  Randomize.prototype.random = function() {

    if (this._lock) {
      return this._map(this._lock);
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
    return this._map(selected);
  };

  Randomize.prototype.condition = function(condition, reset) {
    this._condition = condition;
    this._reset = reset;
    return this;
  };

  Randomize.prototype.test = function() {
    this._test = this._condition ? this._condition.apply(null, arguments)
        : null;
    if (!this._tested) {
      var self = this;
      this._tested = {
        random : function() {
          var test = self._test;
          self._test = null;
          if (test === false) {
            return self._map(self._nope);
          }
          return self.random.apply(self, arguments);
        }
      };
    }
    return this._tested;
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

  if (typeof define === "function" && define.amd) { // AMD
    define(function() {
      return Randomize;
    });
  }
  if (typeof module !== 'undefined') { // CommonJS
    module.exports = Randomize;
  }
  if (window) { // Browser
    window.Randomize = Randomize;
  }

})();