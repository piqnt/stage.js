/*
 * ExtraJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

var Extra = Extra || {}, X = Extra;
Extra.Delta = Delta;

function Delta() {

  var _data = [], _entered = [], _exited = [];

  this.data = function(data) {
    if (!data)
      throw "Invalid data: " + data;

    _entered.length = 0;
    for (var i = 0; i < data.length; i++) {
      if (_data.indexOf(data[i]) < 0) {
        _entered.push(data[i]);
      }
    }

    _exited.length = 0;
    for (var i = 0; i < _data.length; i++) {
      if (data.indexOf(_data[i]) < 0) {
        _exited.push(_data[i]);
      }
    }

    _data.length = data.length;
    for (var i = 0; i < data.length; i++) {
      _data[i] = data[i];
    }

    return this;
  };

  this.update = function(callback) {
    if (typeof callback !== "function")
      throw "Invalid update callback!";
    for (var i = 0; i < _data.length; i++) {
      callback(_data[i]);
    }
    return this;
  };

  this.enter = function(callback) {
    if (typeof callback !== "function")
      throw "Invalid enter callback!";
    for (var i = 0; i < _entered.length; i++) {
      callback(_entered[i]);
    }
    return this;
  };

  this.exit = function(callback) {
    if (typeof callback !== "function") {
      throw "Invalid exit callback!";
    }
    for (var i = 0; i < _exited.length; i++) {
      callback(_exited[i]);
    }
    return this;
  };
}