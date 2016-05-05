/*
 * Copyright (c) 2016 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

(function() {

  function Pool() {
    var _create, _exit, _enter, _discard;
    var _list = [], _max = 4, _name = "";
    var _created = 0, _checkedout = 0, _checkedin = 0, _discarded = 0;

    this.create = function(create) {
      _create = create;
      return this;
    };

    this.exit = function(exit) {
      _exit = exit;
      return this;
    };

    this.enter = function(enter) {
      _enter = enter;
      return this;
    };

    this.discard = function(discard) {
      _discard = discard;
      return this;
    };

    this.max = function(max) {
      if (!arguments.length) {
        return _max;
      }
      _max = max;
      return this;
    };

    this.name = function(name) {
      if (!arguments.length) {
        return _name;
      }
      _name = name;
      return this;
    };

    this.checkOut = function(create) {
      var item;
      if (_list.length) {
        item = _list.shift();
      } else {
        _created++;
        item = (create || _create).apply(this);
      }
      _checkedout++;
      _exit && _exit.call(this, item);
      return item;
    };

    this.checkIn = function(item, discard) {
      if (_list.length < _max) {
        _checkedin++;
        _enter && _enter.call(this, item);
        _list.push(item);
      } else {
        _discarded++;
        (discard = discard || _discard) && discard.call(this, item);
      }
    };

    this.toString = function() {
      return "Pool" + (_name ? " (" + _name + ")" : "") + ":" + " +" + _created
          + " >" + _checkedout + " <" + _checkedin + " -" + _discarded + " ="
          + _list.length + "/" + _max;
    };
  }

  if (typeof define === "function" && define.amd) { // AMD
    define(function() {
      return Pool;
    });
  }
  if (typeof module !== 'undefined') { // CommonJS
    module.exports = Pool;
  }
  if (window) { // Browser
    window.Pool = Pool;
  }

})();