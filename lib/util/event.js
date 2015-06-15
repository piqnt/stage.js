module.exports = function(prototype, callback) {

  prototype._listeners = null;

  prototype.on = prototype.listen = function(types, listener) {
    if (!types || !types.length || typeof listener !== 'function') {
      return this;
    }
    if (this._listeners === null) {
      this._listeners = {};
    }
    var isarray = typeof types !== 'string' && typeof types.join === 'function';
    if (types = (isarray ? types.join(' ') : types).match(/\S+/g)) {
      for (var i = 0; i < types.length; i++) {
        var type = types[i];
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].push(listener);
        if (typeof callback === 'function') {
          callback(this, type, true);
        }
      }
    }
    return this;
  };

  prototype.off = function(types, listener) {
    if (!types || !types.length || typeof listener !== 'function') {
      return this;
    }
    if (this._listeners === null) {
      return this;
    }
    var isarray = typeof types !== 'string' && typeof types.join === 'function';
    if (types = (isarray ? types.join(' ') : types).match(/\S+/g)) {
      for (var i = 0; i < types.length; i++) {
        var type = types[i], all = this._listeners[type], index;
        if (all && (index = all.indexOf(listener)) >= 0) {
          all.splice(index, 1);
          if (!all.length) {
            delete this._listeners[type];
          }
          if (typeof callback === 'function') {
            callback(this, type, false);
          }
        }
      }
    }
    return this;
  };

  prototype.listeners = function(type) {
    return this._listeners && this._listeners[type];
  };

  prototype.publish = function(name, args) {
    var listeners = this.listeners(name);
    if (!listeners || !listeners.length) {
      return 0;
    }
    for (var l = 0; l < listeners.length; l++) {
      listeners[l].apply(this, args);
    }
    return listeners.length;
  };

  prototype.trigger = function(name, args) {
    this.publish(name, args);
    return this;
  };

};
