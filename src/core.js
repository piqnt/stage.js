import is from 'is';
import stats from './util/stats';
import { Pin } from './pin';

var iid = 0;
stats.create = 0;

export const create = function() {
  return new Stage();
};

export function Stage() {
  stats.create++;

  this._pin = new Pin(this);
}

Stage.prototype.matrix = function(relative) {
  if (relative === true) {
    return this._pin.relativeMatrix();
  }
  return this._pin.absoluteMatrix();
};

Stage.prototype.pin = function(a, b) {
  if (typeof a === 'object') {
    this._pin.set(a);
    return this;

  } else if (typeof a === 'string') {
    if (typeof b === 'undefined') {
      return this._pin.get(a);
    } else {
      this._pin.set(a, b);
      return this;
    }
  } else if (typeof a === 'undefined') {
    return this._pin;
  }
};

Stage.prototype.scaleTo = function(a, b, c) {
  if (typeof a === 'object')
    c = b, b = a.y, a = a.x;
  this._pin.scaleTo(a, b, c);
  return this;
};

Pin._add_shortcuts(Stage.prototype);

// TODO: do not clear next/prev/parent on remove

Stage.prototype._label = '';

Stage.prototype._visible = true;

Stage.prototype._parent = null;
Stage.prototype._next = null;
Stage.prototype._prev = null;

Stage.prototype._first = null;
Stage.prototype._last = null;

Stage.prototype._attrs = null;
Stage.prototype._flags = null;

Stage.prototype.toString = function() {
  return '[' + this._label + ']';
};

/**
 * @deprecated Use label()
 */
Stage.prototype.id = function(id) {
  return this.label(id);
};

Stage.prototype.label = function(label) {
  if (typeof label === 'undefined') {
    return this._label;
  }
  this._label = label;
  return this;
};

Stage.prototype.attr = function(name, value) {
  if (typeof value === 'undefined') {
    return this._attrs !== null ? this._attrs[name] : undefined;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Stage.prototype.visible = function(visible) {
  if (typeof visible === 'undefined') {
    return this._visible;
  }
  this._visible = visible;
  this._parent && (this._parent._ts_children = ++iid);
  this._ts_pin = ++iid;
  this.touch();
  return this;
};

Stage.prototype.hide = function() {
  return this.visible(false);
};

Stage.prototype.show = function() {
  return this.visible(true);
};

Stage.prototype.parent = function() {
  return this._parent;
};

Stage.prototype.next = function(visible) {
  var next = this._next;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Stage.prototype.prev = function(visible) {
  var prev = this._prev;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Stage.prototype.first = function(visible) {
  var next = this._first;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Stage.prototype.last = function(visible) {
  var prev = this._last;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Stage.prototype.visit = function(visitor, data) {
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

Stage.prototype.append = function(child, more) {
  if (is.array(child))
    for (var i = 0; i < child.length; i++)
      append(this, child[i]);

  else if (typeof more !== 'undefined') // deprecated
    for (var i = 0; i < arguments.length; i++)
      append(this, arguments[i]);

  else if (typeof child !== 'undefined')
    append(this, child);

  return this;
};

Stage.prototype.prepend = function(child, more) {
  if (is.array(child))
    for (var i = child.length - 1; i >= 0; i--)
      prepend(this, child[i]);

  else if (typeof more !== 'undefined') // deprecated
    for (var i = arguments.length - 1; i >= 0; i--)
      prepend(this, arguments[i]);

  else if (typeof child !== 'undefined')
    prepend(this, child);

  return this;
};

Stage.prototype.appendTo = function(parent) {
  append(parent, this);
  return this;
};

Stage.prototype.prependTo = function(parent) {
  prepend(parent, this);
  return this;
};

Stage.prototype.insertNext = function(sibling, more) {
  if (is.array(sibling))
    for (var i = 0; i < sibling.length; i++)
      insertAfter(sibling[i], this);

  else if (typeof more !== 'undefined') // deprecated
    for (var i = 0; i < arguments.length; i++)
      insertAfter(arguments[i], this);

  else if (typeof sibling !== 'undefined')
    insertAfter(sibling, this);

  return this;
};

Stage.prototype.insertPrev = function(sibling, more) {
  if (is.array(sibling))
    for (var i = sibling.length - 1; i >= 0; i--)
      insertBefore(sibling[i], this);

  else if (typeof more !== 'undefined') // deprecated
    for (var i = arguments.length - 1; i >= 0; i--)
      insertBefore(arguments[i], this);

  else if (typeof sibling !== 'undefined')
    insertBefore(sibling, this);

  return this;
};

Stage.prototype.insertAfter = function(prev) {
  insertAfter(this, prev);
  return this;
};

Stage.prototype.insertBefore = function(next) {
  insertBefore(this, next);
  return this;
};

function append(parent, child) {
  _ensure(child);
  _ensure(parent);

  child.remove();

  if (parent._last) {
    parent._last._next = child;
    child._prev = parent._last;
  }

  child._parent = parent;
  parent._last = child;

  if (!parent._first) {
    parent._first = child;
  }

  child._parent._flag(child, true);

  child._ts_parent = ++iid;
  parent._ts_children = ++iid;
  parent.touch();
}

function prepend(parent, child) {
  _ensure(child);
  _ensure(parent);

  child.remove();

  if (parent._first) {
    parent._first._prev = child;
    child._next = parent._first;
  }

  child._parent = parent;
  parent._first = child;

  if (!parent._last) {
    parent._last = child;
  }

  child._parent._flag(child, true);

  child._ts_parent = ++iid;
  parent._ts_children = ++iid;
  parent.touch();
};

function insertBefore(self, next) {
  _ensure(self);
  _ensure(next);

  self.remove();

  var parent = next._parent;
  var prev = next._prev;

  next._prev = self;
  prev && (prev._next = self) || parent && (parent._first = self);

  self._parent = parent;
  self._prev = prev;
  self._next = next;

  self._parent._flag(self, true);

  self._ts_parent = ++iid;
  self.touch();
};

function insertAfter(self, prev) {
  _ensure(self);
  _ensure(prev);

  self.remove();

  var parent = prev._parent;
  var next = prev._next;

  prev._next = self;
  next && (next._prev = self) || parent && (parent._last = self);

  self._parent = parent;
  self._prev = prev;
  self._next = next;

  self._parent._flag(self, true);

  self._ts_parent = ++iid;
  self.touch();
};

Stage.prototype.remove = function(child, more) {
  if (typeof child !== 'undefined') {
    if (is.array(child)) {
      for (var i = 0; i < child.length; i++)
        _ensure(child[i]).remove();

    } else if (typeof more !== 'undefined') {
      for (var i = 0; i < arguments.length; i++)
        _ensure(arguments[i]).remove();

    } else {
      _ensure(child).remove();
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

Stage.prototype.empty = function() {
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

Stage.prototype.touch = function() {
  this._ts_touch = ++iid;
  this._parent && this._parent.touch();
  return this;
};

/**
 * Deep flags used for optimizing event distribution.
 */
Stage.prototype._flag = function(obj, name) {
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

/**
 * @private
 */
Stage.prototype.hitTest = function(hit) {
  var width = this._pin._width;
  var height = this._pin._height;
  return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
};

function _ensure(obj) {
  if (obj && obj instanceof Stage) {
    return obj;
  }
  throw 'Invalid node: ' + obj;
};

Stage.prototype._listeners = null;

Stage.prototype._event_callback = function(name, on) {
  this._flag(name, on)
};

Stage.prototype.on = function(types, listener) {
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
      if (typeof this._event_callback === 'function') {
        this._event_callback(type, true);
      }
    }
  }
  return this;
};

Stage.prototype.off = function(types, listener) {
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
        if (typeof this._event_callback === 'function') {
          this._event_callback(type, false);
        }
      }
    }
  }
  return this;
};

Stage.prototype.listeners = function(type) {
  return this._listeners && this._listeners[type];
};

Stage.prototype.publish = function(name, args) {
  var listeners = this.listeners(name);
  if (!listeners || !listeners.length) {
    return 0;
  }
  for (var l = 0; l < listeners.length; l++) {
    listeners[l].apply(this, args);
  }
  return listeners.length;
};

Stage.prototype.trigger = function(name, args) {
  this.publish(name, args);
  return this;
};
