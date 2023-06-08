import is from 'is';
import stats from './util/stats';
import { Pin } from './pin';

var iid = 0;
stats.create = 0;

function assertType(obj) {
  if (obj && obj instanceof Node) {
    return obj;
  }
  throw 'Invalid node: ' + obj;
};

export const create = function() {
  return new Node();
};


// There are three sets of core functions:
// - tree model manipulation functions:
// - rendering and game look
// - events handling

export function Node() {
  stats.create++;

  this._pin = new Pin(this);
}

Node.prototype.matrix = function(relative) {
  if (relative === true) {
    return this._pin.relativeMatrix();
  }
  return this._pin.absoluteMatrix();
};

Node.prototype.pin = function(a, b) {
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

Node.prototype.scaleTo = function(a, b, c) {
  if (typeof a === 'object')
    c = b, b = a.y, a = a.x;
  this._pin.scaleTo(a, b, c);
  return this;
};

Pin._add_shortcuts(Node.prototype);

// TODO: do not clear next/prev/parent on remove

Node.prototype._label = '';

Node.prototype._visible = true;

Node.prototype._parent = null;
Node.prototype._next = null;
Node.prototype._prev = null;

Node.prototype._first = null;
Node.prototype._last = null;

Node.prototype._attrs = null;
Node.prototype._flags = null;

Node.prototype.toString = function() {
  return '[' + this._label + ']';
};

/**
 * @deprecated Use label()
 */
Node.prototype.id = function(id) {
  return this.label(id);
};

Node.prototype.label = function(label) {
  if (typeof label === 'undefined') {
    return this._label;
  }
  this._label = label;
  return this;
};

Node.prototype.attr = function(name, value) {
  if (typeof value === 'undefined') {
    return this._attrs !== null ? this._attrs[name] : undefined;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Node.prototype.visible = function(visible) {
  if (typeof visible === 'undefined') {
    return this._visible;
  }
  this._visible = visible;
  this._parent && (this._parent._ts_children = ++iid);
  this._ts_pin = ++iid;
  this.touch();
  return this;
};

Node.prototype.hide = function() {
  return this.visible(false);
};

Node.prototype.show = function() {
  return this.visible(true);
};

Node.prototype.parent = function() {
  return this._parent;
};

Node.prototype.next = function(visible) {
  var next = this._next;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Node.prototype.prev = function(visible) {
  var prev = this._prev;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Node.prototype.first = function(visible) {
  var next = this._first;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};

Node.prototype.last = function(visible) {
  var prev = this._last;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Node.prototype.visit = function(visitor, data) {
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

Node.prototype.append = function(child, more) {
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

Node.prototype.prepend = function(child, more) {
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

Node.prototype.appendTo = function(parent) {
  append(parent, this);
  return this;
};

Node.prototype.prependTo = function(parent) {
  prepend(parent, this);
  return this;
};

Node.prototype.insertNext = function(sibling, more) {
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

Node.prototype.insertPrev = function(sibling, more) {
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

Node.prototype.insertAfter = function(prev) {
  insertAfter(this, prev);
  return this;
};

Node.prototype.insertBefore = function(next) {
  insertBefore(this, next);
  return this;
};

function append(parent, child) {
  assertType(child);
  assertType(parent);

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
  assertType(child);
  assertType(parent);

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
  assertType(self);
  assertType(next);

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
  assertType(self);
  assertType(prev);

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

Node.prototype.remove = function(child, more) {
  if (typeof child !== 'undefined') {
    if (is.array(child)) {
      for (var i = 0; i < child.length; i++)
        assertType(child[i]).remove();

    } else if (typeof more !== 'undefined') {
      for (var i = 0; i < arguments.length; i++)
        assertType(arguments[i]).remove();

    } else {
      assertType(child).remove();
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

Node.prototype.empty = function() {
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

Node.prototype.touch = function() {
  this._ts_touch = ++iid;
  this._parent && this._parent.touch();
  return this;
};

/**
 * Deep flags used for optimizing event distribution.
 */
Node.prototype._flag = function(obj, name) {
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
Node.prototype.hitTest = function(hit) {
  var width = this._pin._width;
  var height = this._pin._height;
  return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
};

Node.prototype._textures = null;
Node.prototype._alpha = 1;

Node.prototype.render = function(context) {
  if (!this._visible) {
    return;
  }
  stats.node++;

  var m = this.matrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

  // move this elsewhere!
  this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
  var alpha = this._pin._textureAlpha * this._alpha;

  if (context.globalAlpha != alpha) {
    context.globalAlpha = alpha;
  }

  if (this._textures !== null) {
    for (var i = 0, n = this._textures.length; i < n; i++) {
      this._textures[i].draw(context);
    }
  }

  if (context.globalAlpha != this._alpha) {
    context.globalAlpha = this._alpha;
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child.render(context);
  }
};

Node.prototype._tickBefore = null;
Node.prototype._tickAfter = null;
Node.prototype.MAX_ELAPSE = Infinity;

Node.prototype._tick = function(elapsed, now, last) {
  if (!this._visible) {
    return;
  }

  if (elapsed > this.MAX_ELAPSE) {
    elapsed = this.MAX_ELAPSE;
  }

  var ticked = false;

  if (this._tickBefore !== null) {
    for (var i = 0; i < this._tickBefore.length; i++) {
      stats.tick++;
      var tickFn = this._tickBefore[i];
      ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
    }
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    if (child._flag('_tick')) {
      ticked = child._tick(elapsed, now, last) === true ? true : ticked;
    }
  }

  if (this._tickAfter !== null) {
    for (var i = 0; i < this._tickAfter.length; i++) {
      stats.tick++;
      var tickFn = this._tickAfter[i];
      ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
    }
  }

  return ticked;
};

Node.prototype.tick = function(ticker, before) {
  if (typeof ticker !== 'function') {
    return;
  }
  if (before) {
    if (this._tickBefore === null) {
      this._tickBefore = [];
    }
    this._tickBefore.push(ticker);
  } else {
    if (this._tickAfter === null) {
      this._tickAfter = [];
    }
    this._tickAfter.push(ticker);
  }
  this._flag('_tick', this._tickAfter !== null && this._tickAfter.length > 0
      || this._tickBefore !== null && this._tickBefore.length > 0);
};

Node.prototype.untick = function(ticker) {
  if (typeof ticker !== 'function') {
    return;
  }
  var i;
  if (this._tickBefore !== null && (i = this._tickBefore.indexOf(ticker)) >= 0) {
    this._tickBefore.splice(i, 1);
  }
  if (this._tickAfter !== null && (i = this._tickAfter.indexOf(ticker)) >= 0) {
    this._tickAfter.splice(i, 1);
  }
};

Node.prototype.timeout = function(fn, time) {
  this.setTimeout(fn, time);
};

Node.prototype.setTimeout = function(fn, time) {
  function timer(t) {
    if ((time -= t) < 0) {
      this.untick(timer);
      fn.call(this);
    } else {
      return true;
    }
  }
  this.tick(timer);
  return timer;
};

Node.prototype.clearTimeout = function(timer) {
  this.untick(timer);
};

Node.prototype._listeners = null;

Node.prototype._event_callback = function(name, on) {
  this._flag(name, on)
};

Node.prototype.on = function(types, listener) {
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

Node.prototype.off = function(types, listener) {
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

Node.prototype.listeners = function(type) {
  return this._listeners && this._listeners[type];
};

Node.prototype.publish = function(name, args) {
  var listeners = this.listeners(name);
  if (!listeners || !listeners.length) {
    return 0;
  }
  for (var l = 0; l < listeners.length; l++) {
    listeners[l].apply(this, args);
  }
  return listeners.length;
};

Node.prototype.trigger = function(name, args) {
  this.publish(name, args);
  return this;
};
