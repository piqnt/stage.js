/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
var isarray = require('./util/isarray');

Cut.prototype._listeners = null;

Cut.prototype.on = Cut.prototype.listen = function(types, listener) {
  if (types = _check(this, types, listener, true)) {
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(listener);
      this._flag(type, true);
    }
  }
  return this;
};

Cut.prototype.off = function(types, listener) {
  if (types = _check(this, types, listener, false)) {
    for (var i = 0; i < types.length; i++) {
      var type = types[i], all = this._listeners[type], index;
      if (all && (index = all.indexOf(listener)) >= 0) {
        all.splice(index, 1);
        if (!all.length) {
          delete this._listeners[type];
        }
        this._flag(type, false);
      }
    }
  }
  return this;
};

function _check(node, types, listener, create) {
  if (!types || !types.length || typeof listener !== 'function') {
    return false;
  }
  if (!(types = (isarray(types) ? types.join(' ') : types).match(/\S+/g))) {
    return false;
  }
  if (node._listeners === null) {
    if (create) {
      node._listeners = {};
    } else {
      return false;
    }
  }
  return types;
}

Cut.prototype.listeners = function(type) {
  return this._listeners && this._listeners[type];
};

Cut.prototype.publish = function(name, args) {
  var listeners = this.listeners(name);
  if (!listeners || !listeners.length) {
    return 0;
  }
  for (var l = 0; l < listeners.length; l++) {
    listeners[l].apply(this, args);
  }
  return listeners.length;
};

Cut.prototype.trigger = function(name, args) {
  this.publish(name, args);
  return this;
};
