var Class = require('./core');
var is = require('./util/is');

var iid = 0;

// TODO: do not clear next/prev/parent on remove

Class.prototype._label = '';

Class.prototype._visible = true;

Class.prototype._parent = null;
Class.prototype._next = null;
Class.prototype._prev = null;

Class.prototype._first = null;
Class.prototype._last = null;

Class.prototype._attrs = null;
Class.prototype._flags = null;

Class.prototype.toString = function() {
  return '[' + this._label + ']';
};

/**
 * @deprecated Use label()
 */
Class.prototype.id = function(id) {
  return this.label(id);
};

Class.prototype.label = function(label) {
  if (typeof label === 'undefined') {
    return this._label;
  }
  this._label = label;
  return this;
};

Class.prototype.attr = function(name, value) {
  if (typeof value === 'undefined') {
    return this._attrs !== null ? this._attrs[name] : undefined;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Class.prototype.visible = function(visible) {
  if (typeof visible === 'undefined') {
    return this._visible;
  }
  this._visible = visible;
  this._parent && (this._parent._ts_children = ++iid);
  this._ts_pin = ++iid;
  this.touch();
  return this;
};

Class.prototype.hide = function() {
  return this.visible(false);
};

Class.prototype.show = function() {
  return this.visible(true);
};

Class.prototype.parent = function() {
  return this._parent;
};

Class.prototype.next = function(visible) {
  var next = this._next;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Class.prototype.prev = function(visible) {
  var prev = this._prev;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Class.prototype.first = function(visible) {
  var next = this._first;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Class.prototype.last = function(visible) {
  var prev = this._last;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Class.prototype.visit = function(visitor, data) {
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

Class.prototype.append = function(child, more) {
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

Class.prototype.prepend = function(child, more) {
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

Class.prototype.appendTo = function(parent) {
  append(parent, this);
  return this;
};

Class.prototype.prependTo = function(parent) {
  prepend(parent, this);
  return this;
};

Class.prototype.insertNext = function(sibling, more) {
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

Class.prototype.insertPrev = function(sibling, more) {
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

Class.prototype.insertAfter = function(prev) {
  insertAfter(this, prev);
  return this;
};

Class.prototype.insertBefore = function(next) {
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

Class.prototype.remove = function(child, more) {
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

Class.prototype.empty = function() {
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

Class.prototype.touch = function() {
  this._ts_touch = ++iid;
  this._parent && this._parent.touch();
  return this;
};

/**
 * Deep flags used for optimizing event distribution.
 */
Class.prototype._flag = function(obj, name) {
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
Class.prototype.hitTest = function(hit) {
  var width = this._pin._width;
  var height = this._pin._height;
  return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
};

function _ensure(obj) {
  if (obj && obj instanceof Class) {
    return obj;
  }
  throw 'Invalid node: ' + obj;
};

module.exports = Class;
