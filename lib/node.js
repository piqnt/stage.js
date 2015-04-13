/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');

var iid = 0;

// TODO: do not clear next/prev/parent on remove

Cut.prototype._label = '';

Cut.prototype._visible = true;

Cut.prototype._parent = null;
Cut.prototype._next = null;
Cut.prototype._prev = null;

Cut.prototype._first = null;
Cut.prototype._last = null;

Cut.prototype._attrs = null;
Cut.prototype._flags = null;

Cut.prototype.toString = function() {
  return '[' + this._label + ']';
};

/**
 * @deprecated Use label()
 */
Cut.prototype.id = function(id) {
  return this.label(id);
};

Cut.prototype.label = function(label) {
  if (typeof label === 'undefined') {
    return this._label;
  }
  this._label = label;
  return this;
};

Cut.prototype.attr = function(name, value) {
  if (typeof value === 'undefined') {
    return this._attrs !== null ? this._attrs[name] : undefined;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Cut.prototype.visible = function(visible) {
  if (typeof visible === 'undefined') {
    return this._visible;
  }
  this._visible = visible;
  this._parent && (this._parent._ts_children = ++iid);
  this._ts_pin = ++iid;
  this.touch();
  return this;
};

Cut.prototype.hide = function() {
  return this.visible(false);
};

Cut.prototype.show = function() {
  return this.visible(true);
};

Cut.prototype.parent = function() {
  return this._parent;
};

Cut.prototype.next = function(visible) {
  var next = this._next;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Cut.prototype.prev = function(visible) {
  var prev = this._prev;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Cut.prototype.first = function(visible) {
  var next = this._first;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Cut.prototype.last = function(visible) {
  var prev = this._last;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Cut.prototype.visit = function(visitor, data) {
  var reverse = visitor.reverse;
  var visible = visitor.visible;
  if (visitor.start && visitor.start(this, data)) {
    return;
  }
  var child, next = reverse ? this.last(visible) : this.first(visible);
  while (child = next) {
    next = reverse ? child.prev(visible) : child.next(visible);
    if (child.visit(visitor, data)) {
      return true;
    }
  }
  return visitor.end && visitor.end(this, data);
};

Cut.prototype.append = function() {
  for (var i = 0; i < arguments.length; i++) {
    _ensure(arguments[i]);
    arguments[i].appendTo(this);
  }
  return this;
};

Cut.prototype.prepend = function() {
  for (var i = 0; i < arguments.length; i++) {
    _ensure(arguments[i]);
    arguments[i].prependTo(this);
  }
  return this;
};

Cut.prototype.appendTo = function(parent) {
  _ensure(parent);

  this.remove();

  if (parent._last) {
    parent._last._next = this;
    this._prev = parent._last;
  }

  this._parent = parent;
  parent._last = this;

  if (!parent._first) {
    parent._first = this;
  }

  this._parent._flag(this, true);

  this._ts_parent = ++iid;
  parent._ts_children = ++iid;
  parent.touch();
  return this;
};

Cut.prototype.prependTo = function(parent) {
  _ensure(parent);

  this.remove();

  if (parent._first) {
    parent._first._prev = this;
    this._next = parent._first;
  }

  this._parent = parent;
  parent._first = this;

  if (!parent._last) {
    parent._last = this;
  }

  this._parent._flag(this, true);

  this._ts_parent = ++iid;
  parent._ts_children = ++iid;
  parent.touch();
  return this;
};

Cut.prototype.insertNext = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      _ensure(arguments[i]);
      arguments[i] && arguments[i].insertAfter(this);
    }
  }
  return this;
};

Cut.prototype.insertPrev = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      _ensure(arguments[i]);
      arguments[i] && arguments[i].insertBefore(this);
    }
  }
  return this;
};

Cut.prototype.insertBefore = function(next) {
  _ensure(next);

  this.remove();

  var parent = next._parent;
  var prev = next._prev;

  next._prev = this;
  prev && (prev._next = this) || parent && (parent._first = this);

  this._parent = parent;
  this._prev = prev;
  this._next = next;

  this._parent._flag(this, true);

  this._ts_parent = ++iid;
  this.touch();
  return this;
};

Cut.prototype.insertAfter = function(prev) {
  _ensure(prev);

  this.remove();

  var parent = prev._parent;
  var next = prev._next;

  prev._next = this;
  next && (next._prev = this) || parent && (parent._last = this);

  this._parent = parent;
  this._prev = prev;
  this._next = next;

  this._parent._flag(this, true);

  this._ts_parent = ++iid;
  this.touch();
  return this;
};

Cut.prototype.remove = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      _ensure(arguments[i]);
      arguments[i] && arguments[i].remove();
    }
    return this;
  }

  if (this._prev) {
    this._prev._next = this._next;
  }
  if (this._next) {
    this._next._prev = this._prev;
  }

  if (this._parent) {
    if (this._parent._first === this) {
      this._parent._first = this._next;
    }
    if (this._parent._last === this) {
      this._parent._last = this._prev;
    }

    this._parent._flag(this, false);

    this._parent._ts_children = ++iid;
    this._parent.touch();
  }

  this._prev = this._next = this._parent = null;
  this._ts_parent = ++iid;
  // this._parent.touch();

  return this;
};

Cut.prototype.empty = function() {
  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child._prev = child._next = child._parent = null;

    this._flag(child, false);
  }

  this._first = this._last = null;

  this._ts_children = ++iid;
  this.touch();
  return this;
};

Cut.prototype.touch = function() {
  this._ts_touch = ++iid;
  this._parent && this._parent.touch();
  return this;
};

/**
 * Deep flags used for optimizing event distribution.
 */
Cut.prototype._flag = function(obj, name) {
  if (typeof name === 'undefined') {
    return this._flags !== null && this._flags[obj] || 0;
  }
  if (typeof obj === 'string') {
    if (name) {
      this._flags = this._flags || {};
      if (!this._flags[obj] && this._parent) {
        this._parent._flag(obj, true);
      }
      this._flags[obj] = (this._flags[obj] || 0) + 1;

    } else if (this._flags && this._flags[obj] > 0) {
      if (this._flags[obj] == 1 && this._parent) {
        this._parent._flag(obj, false);
      }
      this._flags[obj] = this._flags[obj] - 1;
    }
  }
  if (typeof obj === 'object') {
    if (obj._flags) {
      for ( var type in obj._flags) {
        if (obj._flags[type] > 0) {
          this._flag(type, name);
        }
      }
    }
  }
  return this;
};

function _ensure(obj) {
  if (obj && obj instanceof Cut) {
    return obj;
  }
  throw 'Invalid node: ' + obj;
};

module.exports = Cut;
