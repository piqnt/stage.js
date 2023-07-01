var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const stats = {
  create: 0,
  tick: 0,
  node: 0,
  draw: 0,
  fps: 0
};
class Matrix {
  constructor(a, b, c, d, e, f) {
    this.reset(a, b, c, d, e, f);
  }
  toString() {
    return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.e + ", " + this.f + "]";
  }
  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
  }
  reset(a, b, c, d, e, f) {
    this._dirty = true;
    if (typeof a === "object") {
      this.a = a.a, this.d = a.d;
      this.b = a.b, this.c = a.c;
      this.e = a.e, this.f = a.f;
    } else {
      this.a = a || 1, this.d = d || 1;
      this.b = b || 0, this.c = c || 0;
      this.e = e || 0, this.f = f || 0;
    }
    return this;
  }
  identity() {
    this._dirty = true;
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }
  rotate(angle) {
    if (!angle) {
      return this;
    }
    this._dirty = true;
    var u = angle ? Math.cos(angle) : 1;
    var v = angle ? Math.sin(angle) : 0;
    var a = u * this.a - v * this.b;
    var b = u * this.b + v * this.a;
    var c = u * this.c - v * this.d;
    var d = u * this.d + v * this.c;
    var e = u * this.e - v * this.f;
    var f = u * this.f + v * this.e;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  translate(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;
    this.e += x;
    this.f += y;
    return this;
  }
  scale(x, y) {
    if (!(x - 1) && !(y - 1)) {
      return this;
    }
    this._dirty = true;
    this.a *= x;
    this.b *= y;
    this.c *= x;
    this.d *= y;
    this.e *= x;
    this.f *= y;
    return this;
  }
  skew(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;
    var a = this.a + this.b * x;
    var b = this.b + this.a * y;
    var c = this.c + this.d * x;
    var d = this.d + this.c * y;
    var e = this.e + this.f * x;
    var f = this.f + this.e * y;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  concat(m) {
    this._dirty = true;
    var n = this;
    var a = n.a * m.a + n.b * m.c;
    var b = n.b * m.d + n.a * m.b;
    var c = n.c * m.a + n.d * m.c;
    var d = n.d * m.d + n.c * m.b;
    var e = n.e * m.a + m.e + n.f * m.c;
    var f = n.f * m.d + m.f + n.e * m.b;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  inverse() {
    if (this._dirty) {
      this._dirty = false;
      this.inverted = this.inverted || new Matrix();
      var z = this.a * this.d - this.b * this.c;
      this.inverted.a = this.d / z;
      this.inverted.b = -this.b / z;
      this.inverted.c = -this.c / z;
      this.inverted.d = this.a / z;
      this.inverted.e = (this.c * this.f - this.e * this.d) / z;
      this.inverted.f = (this.e * this.b - this.a * this.f) / z;
    }
    return this.inverted;
  }
  map(p, q) {
    q = q || {};
    q.x = this.a * p.x + this.c * p.y + this.e;
    q.y = this.b * p.x + this.d * p.y + this.f;
    return q;
  }
  mapX(x, y) {
    if (typeof x === "object")
      y = x.y, x = x.x;
    return this.a * x + this.c * y + this.e;
  }
  mapY(x, y) {
    if (typeof x === "object")
      y = x.y, x = x.x;
    return this.b * x + this.d * y + this.f;
  }
}
var iid$1 = 0;
function Pin(owner) {
  this._owner = owner;
  this._parent = null;
  this._relativeMatrix = new Matrix();
  this._absoluteMatrix = new Matrix();
  this.reset();
}
Pin.prototype.reset = function() {
  this._textureAlpha = 1;
  this._alpha = 1;
  this._width = 0;
  this._height = 0;
  this._scaleX = 1;
  this._scaleY = 1;
  this._skewX = 0;
  this._skewY = 0;
  this._rotation = 0;
  this._pivoted = false;
  this._pivotX = null;
  this._pivotY = null;
  this._handled = false;
  this._handleX = 0;
  this._handleY = 0;
  this._aligned = false;
  this._alignX = 0;
  this._alignY = 0;
  this._offsetX = 0;
  this._offsetY = 0;
  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;
  this._ts_translate = ++iid$1;
  this._ts_transform = ++iid$1;
  this._ts_matrix = ++iid$1;
};
Pin.prototype._update = function() {
  this._parent = this._owner._parent && this._owner._parent._pin;
  if (this._handled && this._mo_handle != this._ts_transform) {
    this._mo_handle = this._ts_transform;
    this._ts_translate = ++iid$1;
  }
  if (this._aligned && this._parent && this._mo_align != this._parent._ts_transform) {
    this._mo_align = this._parent._ts_transform;
    this._ts_translate = ++iid$1;
  }
  return this;
};
Pin.prototype.toString = function() {
  return this._owner + " (" + (this._parent ? this._parent._owner : null) + ")";
};
Pin.prototype.absoluteMatrix = function() {
  this._update();
  var ts = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_matrix : 0
  );
  if (this._mo_abs == ts) {
    return this._absoluteMatrix;
  }
  this._mo_abs = ts;
  var abs2 = this._absoluteMatrix;
  abs2.reset(this.relativeMatrix());
  this._parent && abs2.concat(this._parent._absoluteMatrix);
  this._ts_matrix = ++iid$1;
  return abs2;
};
Pin.prototype.relativeMatrix = function() {
  this._update();
  var ts = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_transform : 0
  );
  if (this._mo_rel == ts) {
    return this._relativeMatrix;
  }
  this._mo_rel = ts;
  var rel2 = this._relativeMatrix;
  rel2.identity();
  if (this._pivoted) {
    rel2.translate(-this._pivotX * this._width, -this._pivotY * this._height);
  }
  rel2.scale(this._scaleX, this._scaleY);
  rel2.skew(this._skewX, this._skewY);
  rel2.rotate(this._rotation);
  if (this._pivoted) {
    rel2.translate(this._pivotX * this._width, this._pivotY * this._height);
  }
  if (this._pivoted) {
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;
  } else {
    var p, q;
    if (rel2.a > 0 && rel2.c > 0 || rel2.a < 0 && rel2.c < 0) {
      p = 0, q = rel2.a * this._width + rel2.c * this._height;
    } else {
      p = rel2.a * this._width, q = rel2.c * this._height;
    }
    if (p > q) {
      this._boxX = q;
      this._boxWidth = p - q;
    } else {
      this._boxX = p;
      this._boxWidth = q - p;
    }
    if (rel2.b > 0 && rel2.d > 0 || rel2.b < 0 && rel2.d < 0) {
      p = 0, q = rel2.b * this._width + rel2.d * this._height;
    } else {
      p = rel2.b * this._width, q = rel2.d * this._height;
    }
    if (p > q) {
      this._boxY = q;
      this._boxHeight = p - q;
    } else {
      this._boxY = p;
      this._boxHeight = q - p;
    }
  }
  this._x = this._offsetX;
  this._y = this._offsetY;
  this._x -= this._boxX + this._handleX * this._boxWidth;
  this._y -= this._boxY + this._handleY * this._boxHeight;
  if (this._aligned && this._parent) {
    this._parent.relativeMatrix();
    this._x += this._alignX * this._parent._width;
    this._y += this._alignY * this._parent._height;
  }
  rel2.translate(this._x, this._y);
  return this._relativeMatrix;
};
Pin.prototype.get = function(key) {
  if (typeof getters[key] === "function") {
    return getters[key](this);
  }
};
Pin.prototype.set = function(a, b) {
  if (typeof a === "string") {
    if (typeof setters[a] === "function" && typeof b !== "undefined") {
      setters[a](this, b);
    }
  } else if (typeof a === "object") {
    for (b in a) {
      if (typeof setters[b] === "function" && typeof a[b] !== "undefined") {
        setters[b](this, a[b], a);
      }
    }
  }
  if (this._owner) {
    this._owner._ts_pin = ++iid$1;
    this._owner.touch();
  }
  return this;
};
var getters = {
  alpha: function(pin) {
    return pin._alpha;
  },
  textureAlpha: function(pin) {
    return pin._textureAlpha;
  },
  width: function(pin) {
    return pin._width;
  },
  height: function(pin) {
    return pin._height;
  },
  boxWidth: function(pin) {
    return pin._boxWidth;
  },
  boxHeight: function(pin) {
    return pin._boxHeight;
  },
  // scale : function(pin) {
  // },
  scaleX: function(pin) {
    return pin._scaleX;
  },
  scaleY: function(pin) {
    return pin._scaleY;
  },
  // skew : function(pin) {
  // },
  skewX: function(pin) {
    return pin._skewX;
  },
  skewY: function(pin) {
    return pin._skewY;
  },
  rotation: function(pin) {
    return pin._rotation;
  },
  // pivot : function(pin) {
  // },
  pivotX: function(pin) {
    return pin._pivotX;
  },
  pivotY: function(pin) {
    return pin._pivotY;
  },
  // offset : function(pin) {
  // },
  offsetX: function(pin) {
    return pin._offsetX;
  },
  offsetY: function(pin) {
    return pin._offsetY;
  },
  // align : function(pin) {
  // },
  alignX: function(pin) {
    return pin._alignX;
  },
  alignY: function(pin) {
    return pin._alignY;
  },
  // handle : function(pin) {
  // },
  handleX: function(pin) {
    return pin._handleX;
  },
  handleY: function(pin) {
    return pin._handleY;
  }
};
var setters = {
  alpha: function(pin, value) {
    pin._alpha = value;
  },
  textureAlpha: function(pin, value) {
    pin._textureAlpha = value;
  },
  width: function(pin, value) {
    pin._width_ = value;
    pin._width = value;
    pin._ts_transform = ++iid$1;
  },
  height: function(pin, value) {
    pin._height_ = value;
    pin._height = value;
    pin._ts_transform = ++iid$1;
  },
  scale: function(pin, value) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = ++iid$1;
  },
  scaleX: function(pin, value) {
    pin._scaleX = value;
    pin._ts_transform = ++iid$1;
  },
  scaleY: function(pin, value) {
    pin._scaleY = value;
    pin._ts_transform = ++iid$1;
  },
  skew: function(pin, value) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = ++iid$1;
  },
  skewX: function(pin, value) {
    pin._skewX = value;
    pin._ts_transform = ++iid$1;
  },
  skewY: function(pin, value) {
    pin._skewY = value;
    pin._ts_transform = ++iid$1;
  },
  rotation: function(pin, value) {
    pin._rotation = value;
    pin._ts_transform = ++iid$1;
  },
  pivot: function(pin, value) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  pivotX: function(pin, value) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  pivotY: function(pin, value) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  offset: function(pin, value) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = ++iid$1;
  },
  offsetX: function(pin, value) {
    pin._offsetX = value;
    pin._ts_translate = ++iid$1;
  },
  offsetY: function(pin, value) {
    pin._offsetY = value;
    pin._ts_translate = ++iid$1;
  },
  align: function(pin, value) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },
  alignX: function(pin, value) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = ++iid$1;
    this.handleX(pin, value);
  },
  alignY: function(pin, value) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = ++iid$1;
    this.handleY(pin, value);
  },
  handle: function(pin, value) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },
  handleX: function(pin, value) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = ++iid$1;
  },
  handleY: function(pin, value) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = ++iid$1;
  },
  resizeMode: function(pin, value, all) {
    if (all) {
      if (value == "in") {
        value = "in-pad";
      } else if (value == "out") {
        value = "out-crop";
      }
      scaleTo(pin, all.resizeWidth, all.resizeHeight, value);
    }
  },
  resizeWidth: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, value, null);
    }
  },
  resizeHeight: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, null, value);
    }
  },
  scaleMode: function(pin, value, all) {
    if (all) {
      scaleTo(pin, all.scaleWidth, all.scaleHeight, value);
    }
  },
  scaleWidth: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, value, null);
    }
  },
  scaleHeight: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, null, value);
    }
  },
  matrix: function(pin, value) {
    this.scaleX(pin, value.a);
    this.skewX(pin, value.c / value.d);
    this.skewY(pin, value.b / value.a);
    this.scaleY(pin, value.d);
    this.offsetX(pin, value.e);
    this.offsetY(pin, value.f);
    this.rotation(pin, 0);
  }
};
Pin.prototype.scaleTo = function(width, height, mode) {
  scaleTo(this, width, height, mode);
};
function scaleTo(pin, width, height, mode) {
  var w = typeof width === "number";
  var h = typeof height === "number";
  var m = typeof mode === "string";
  pin._ts_transform = ++iid$1;
  if (w) {
    pin._scaleX = width / pin._width_;
    pin._width = pin._width_;
  }
  if (h) {
    pin._scaleY = height / pin._height_;
    pin._height = pin._height_;
  }
  if (w && h && m) {
    if (mode == "out" || mode == "out-crop") {
      pin._scaleX = pin._scaleY = Math.max(pin._scaleX, pin._scaleY);
    } else if (mode == "in" || mode == "in-pad") {
      pin._scaleX = pin._scaleY = Math.min(pin._scaleX, pin._scaleY);
    }
    if (mode == "out-crop" || mode == "in-pad") {
      pin._width = width / pin._scaleX;
      pin._height = height / pin._scaleY;
    }
  }
}
Pin._add_shortcuts = function(prototype) {
  prototype.size = function(w, h) {
    this.pin("width", w);
    this.pin("height", h);
    return this;
  };
  prototype.width = function(w) {
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  };
  prototype.height = function(h) {
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  };
  prototype.offset = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  };
  prototype.rotate = function(a) {
    this.pin("rotation", a);
    return this;
  };
  prototype.skew = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  };
  prototype.scale = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  };
  prototype.alpha = function(a, ta) {
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  };
};
var iid = 0;
stats.create = 0;
function assertType(obj) {
  if (obj && obj instanceof Node) {
    return obj;
  }
  throw "Invalid node: " + obj;
}
const create = function() {
  return new Node();
};
function Node() {
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
  if (typeof a === "object") {
    this._pin.set(a);
    return this;
  } else if (typeof a === "string") {
    if (typeof b === "undefined") {
      return this._pin.get(a);
    } else {
      this._pin.set(a, b);
      return this;
    }
  } else if (typeof a === "undefined") {
    return this._pin;
  }
};
Node.prototype.scaleTo = function(a, b, c) {
  if (typeof a === "object")
    c = b, b = a.y, a = a.x;
  this._pin.scaleTo(a, b, c);
  return this;
};
Pin._add_shortcuts(Node.prototype);
Node.prototype._label = "";
Node.prototype._visible = true;
Node.prototype._parent = null;
Node.prototype._next = null;
Node.prototype._prev = null;
Node.prototype._first = null;
Node.prototype._last = null;
Node.prototype._attrs = null;
Node.prototype._flags = null;
Node.prototype.toString = function() {
  return "[" + this._label + "]";
};
Node.prototype.id = function(id) {
  return this.label(id);
};
Node.prototype.label = function(label) {
  if (typeof label === "undefined") {
    return this._label;
  }
  this._label = label;
  return this;
};
Node.prototype.attr = function(name, value) {
  if (typeof value === "undefined") {
    return this._attrs !== null ? this._attrs[name] : void 0;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};
Node.prototype.visible = function(visible) {
  if (typeof visible === "undefined") {
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
  if (Array.isArray(child))
    for (var i = 0; i < child.length; i++)
      append(this, child[i]);
  else if (typeof more !== "undefined")
    for (var i = 0; i < arguments.length; i++)
      append(this, arguments[i]);
  else if (typeof child !== "undefined")
    append(this, child);
  return this;
};
Node.prototype.prepend = function(child, more) {
  if (Array.isArray(child))
    for (var i = child.length - 1; i >= 0; i--)
      prepend(this, child[i]);
  else if (typeof more !== "undefined")
    for (var i = arguments.length - 1; i >= 0; i--)
      prepend(this, arguments[i]);
  else if (typeof child !== "undefined")
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
  if (Array.isArray(sibling))
    for (var i = 0; i < sibling.length; i++)
      insertAfter(sibling[i], this);
  else if (typeof more !== "undefined")
    for (var i = 0; i < arguments.length; i++)
      insertAfter(arguments[i], this);
  else if (typeof sibling !== "undefined")
    insertAfter(sibling, this);
  return this;
};
Node.prototype.insertPrev = function(sibling, more) {
  if (Array.isArray(sibling))
    for (var i = sibling.length - 1; i >= 0; i--)
      insertBefore(sibling[i], this);
  else if (typeof more !== "undefined")
    for (var i = arguments.length - 1; i >= 0; i--)
      insertBefore(arguments[i], this);
  else if (typeof sibling !== "undefined")
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
}
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
}
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
}
Node.prototype.remove = function(child, more) {
  if (typeof child !== "undefined") {
    if (Array.isArray(child)) {
      for (var i = 0; i < child.length; i++)
        assertType(child[i]).remove();
    } else if (typeof more !== "undefined") {
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
Node.prototype._ts_touch = null;
Node.prototype.touch = function() {
  this._ts_touch = ++iid;
  this._parent && this._parent.touch();
  return this;
};
Node.prototype._flag = function(obj, name) {
  if (typeof name === "undefined") {
    return this._flags !== null && this._flags[obj] || 0;
  }
  if (typeof obj === "string") {
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
  if (typeof obj === "object") {
    if (obj._flags) {
      for (var type in obj._flags) {
        if (obj._flags[type] > 0) {
          this._flag(type, name);
        }
      }
    }
  }
  return this;
};
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
    if (child._flag("_tick")) {
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
  if (typeof ticker !== "function") {
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
  this._flag("_tick", this._tickAfter !== null && this._tickAfter.length > 0 || this._tickBefore !== null && this._tickBefore.length > 0);
};
Node.prototype.untick = function(ticker) {
  if (typeof ticker !== "function") {
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
  this._flag(name, on);
};
Node.prototype.on = function(types, listener) {
  if (!types || !types.length || typeof listener !== "function") {
    return this;
  }
  if (this._listeners === null) {
    this._listeners = {};
  }
  var isarray = typeof types !== "string" && typeof types.join === "function";
  if (types = (isarray ? types.join(" ") : types).match(/\S+/g)) {
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(listener);
      if (typeof this._event_callback === "function") {
        this._event_callback(type, true);
      }
    }
  }
  return this;
};
Node.prototype.off = function(types, listener) {
  if (!types || !types.length || typeof listener !== "function") {
    return this;
  }
  if (this._listeners === null) {
    return this;
  }
  var isarray = typeof types !== "string" && typeof types.join === "function";
  if (types = (isarray ? types.join(" ") : types).match(/\S+/g)) {
    for (var i = 0; i < types.length; i++) {
      var type = types[i], all = this._listeners[type], index;
      if (all && (index = all.indexOf(listener)) >= 0) {
        all.splice(index, 1);
        if (!all.length) {
          delete this._listeners[type];
        }
        if (typeof this._event_callback === "function") {
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
var native = Math;
const math = Object.create(Math);
math.random = function(min, max) {
  if (typeof min === "undefined") {
    max = 1, min = 0;
  } else if (typeof max === "undefined") {
    max = min, min = 0;
  }
  return min == max ? min : native.random() * (max - min) + min;
};
math.wrap = function(num, min, max) {
  if (typeof min === "undefined") {
    max = 1, min = 0;
  } else if (typeof max === "undefined") {
    max = min, min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};
math.clamp = function(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};
math.length = function(x, y) {
  return native.sqrt(x * x + y * y);
};
math.rotate = math.wrap;
math.limit = math.clamp;
const isFn = function(value) {
  var str = Object.prototype.toString.call(value);
  return str === "[object Function]" || str === "[object GeneratorFunction]" || str === "[object AsyncFunction]";
};
const isHash = function(value) {
  return Object.prototype.toString.call(value) === "[object Object]" && value.constructor === Object;
};
class Texture {
  constructor(texture2, ratio) {
    if (typeof texture2 === "object") {
      this.src(texture2, ratio);
    }
  }
  pipe() {
    return new Texture(this);
  }
  /**
   * Signatures: (texture), (x, y, w, h), (w, h)
   */
  src(x, y, w, h) {
    if (typeof x === "object") {
      var drawable = x, ratio = y || 1;
      this._image = drawable;
      this._sx = this._dx = 0;
      this._sy = this._dy = 0;
      this._sw = this._dw = drawable.width / ratio;
      this._sh = this._dh = drawable.height / ratio;
      this.width = drawable.width / ratio;
      this.height = drawable.height / ratio;
      this.ratio = ratio;
    } else {
      if (typeof w === "undefined") {
        w = x, h = y;
      } else {
        this._sx = x, this._sy = y;
      }
      this._sw = this._dw = w;
      this._sh = this._dh = h;
      this.width = w;
      this.height = h;
    }
    return this;
  }
  /**
   * Signatures: (x, y, w, h), (x, y)
   */
  dest(x, y, w, h) {
    this._dx = x, this._dy = y;
    this._dx = x, this._dy = y;
    if (typeof w !== "undefined") {
      this._dw = w, this._dh = h;
      this.width = w, this.height = h;
    }
    return this;
  }
  draw(context, x1, y1, x2, y2, x3, y3, x4, y4) {
    var drawable = this._image;
    if (drawable === null || typeof drawable !== "object") {
      return;
    }
    var sx = this._sx, sy = this._sy;
    var sw = this._sw, sh = this._sh;
    var dx = this._dx, dy = this._dy;
    var dw = this._dw, dh = this._dh;
    if (typeof x3 !== "undefined") {
      x1 = math.clamp(x1, 0, this._sw), x2 = math.clamp(x2, 0, this._sw - x1);
      y1 = math.clamp(y1, 0, this._sh), y2 = math.clamp(y2, 0, this._sh - y1);
      sx += x1, sy += y1, sw = x2, sh = y2;
      dx = x3, dy = y3, dw = x4, dh = y4;
    } else if (typeof x2 !== "undefined") {
      dx = x1, dy = y1, dw = x2, dh = y2;
    } else if (typeof x1 !== "undefined") {
      dw = x1, dh = y1;
    }
    var ratio = this.ratio || 1;
    sx *= ratio, sy *= ratio, sw *= ratio, sh *= ratio;
    try {
      if (typeof drawable.draw === "function") {
        drawable.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        stats.draw++;
        context.drawImage(drawable, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    } catch (ex) {
      if (!drawable._draw_failed) {
        console.log("Unable to draw: ", drawable);
        console.log(ex);
        drawable._draw_failed = true;
      }
    }
  }
}
var NO_TEXTURE = new class extends Texture {
  constructor() {
    super();
    __publicField(this, "pipe", function() {
      return this;
    });
    __publicField(this, "src", function() {
      return this;
    });
    __publicField(this, "dest", function() {
      return this;
    });
    __publicField(this, "draw", function() {
    });
    this.x = this.y = this.width = this.height = 0;
  }
}();
var NO_SELECTION = new Selection(NO_TEXTURE);
function preloadImage(src) {
  console.log("Loading image: " + src);
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      console.log("Image loaded: " + src);
      resolve(img);
    };
    img.onerror = function(error) {
      console.log("Loading failed: " + src);
      reject(error);
    };
    img.src = src;
  });
}
var _atlases_map = {};
var _atlases_arr = [];
const atlas = async function(def) {
  var atlas2 = isFn(def.draw) ? def : new Atlas(def);
  if (def.name) {
    _atlases_map[def.name] = atlas2;
  }
  _atlases_arr.push(atlas2);
  deprecated(def, "imagePath");
  deprecated(def, "imageRatio");
  var url = def.imagePath;
  var ratio = def.imageRatio || 1;
  if ("string" === typeof def.image) {
    url = def.image;
  } else if (isHash(def.image)) {
    url = def.image.src || def.image.url;
    ratio = def.image.ratio || ratio;
  }
  if (url) {
    const image2 = await preloadImage(url);
    atlas2.src(image2, ratio);
  }
  return atlas2;
};
class Atlas extends Texture {
  constructor(def) {
    super();
    var atlas2 = this;
    deprecated(def, "filter");
    deprecated(def, "cutouts");
    deprecated(def, "sprites");
    deprecated(def, "factory");
    var map = def.map || def.filter;
    var ppu = def.ppu || def.ratio || 1;
    var trim = def.trim || 0;
    var textures = def.textures;
    var factory = def.factory;
    var cutouts = def.cutouts || def.sprites;
    function make(def2) {
      if (!def2 || isFn(def2.draw)) {
        return def2;
      }
      def2 = Object.assign({}, def2);
      if (isFn(map)) {
        def2 = map(def2);
      }
      if (ppu != 1) {
        def2.x *= ppu, def2.y *= ppu;
        def2.width *= ppu, def2.height *= ppu;
        def2.top *= ppu, def2.bottom *= ppu;
        def2.left *= ppu, def2.right *= ppu;
      }
      if (trim != 0) {
        def2.x += trim, def2.y += trim;
        def2.width -= 2 * trim, def2.height -= 2 * trim;
        def2.top -= trim, def2.bottom -= trim;
        def2.left -= trim, def2.right -= trim;
      }
      var texture2 = atlas2.pipe();
      texture2.top = def2.top, texture2.bottom = def2.bottom;
      texture2.left = def2.left, texture2.right = def2.right;
      texture2.src(def2.x, def2.y, def2.width, def2.height);
      return texture2;
    }
    function find(query) {
      if (textures) {
        if (isFn(textures)) {
          return textures(query);
        } else if (isHash(textures)) {
          return textures[query];
        }
      }
      if (cutouts) {
        var result = null, n = 0;
        for (var i = 0; i < cutouts.length; i++) {
          if (string.startsWith(cutouts[i].name, query)) {
            if (n === 0) {
              result = cutouts[i];
            } else if (n === 1) {
              result = [result, cutouts[i]];
            } else {
              result.push(cutouts[i]);
            }
            n++;
          }
        }
        if (n === 0 && isFn(factory)) {
          result = function(subquery) {
            return factory(query + (subquery ? subquery : ""));
          };
        }
        return result;
      }
    }
    this.select = function(query) {
      if (!query) {
        return new Selection(this.pipe());
      }
      var found = find(query);
      if (found) {
        return new Selection(found, find, make);
      }
    };
  }
}
function Selection(result, find, make) {
  function link(result2, subquery) {
    if (!result2) {
      return NO_TEXTURE;
    } else if (isFn(result2.draw)) {
      return result2;
    } else if (isHash(result2) && "number" === typeof result2.width && "number" === typeof result2.height && isFn(make)) {
      return make(result2);
    } else if (isHash(result2) && "undefined" !== typeof subquery) {
      return link(result2[subquery]);
    } else if (isFn(result2)) {
      return link(result2(subquery));
    } else if (Array.isArray(result2)) {
      return link(result2[0]);
    } else if ("string" === typeof result2 && isFn(find)) {
      return link(find(result2));
    }
  }
  this.one = function(subquery) {
    return link(result, subquery);
  };
  this.array = function(arr) {
    var array = Array.isArray(arr) ? arr : [];
    if (Array.isArray(result)) {
      for (var i = 0; i < result.length; i++) {
        array[i] = link(result[i]);
      }
    } else {
      array[0] = link(result);
    }
    return array;
  };
}
const texture = function(query) {
  if (!("string" === typeof query)) {
    return new Selection(query);
  }
  var result = null, atlas2, i;
  if ((i = query.indexOf(":")) > 0 && query.length > i + 1) {
    atlas2 = _atlases_map[query.slice(0, i)];
    result = atlas2 && atlas2.select(query.slice(i + 1));
  }
  if (!result && (atlas2 = _atlases_map[query])) {
    result = atlas2.select();
  }
  for (i = 0; !result && i < _atlases_arr.length; i++) {
    result = _atlases_arr[i].select(query);
  }
  if (!result) {
    console.error("Texture not found: " + query);
    result = NO_SELECTION;
  }
  return result;
};
function deprecated(hash, name, msg) {
  if (name in hash)
    console.log(msg ? msg.replace("%name", name) : "'" + name + "' field of texture atlas is deprecated.");
}
const canvas = function(type, attributes, plotter) {
  if (typeof type === "string") {
    if (typeof attributes === "object")
      ;
    else {
      if (typeof attributes === "function") {
        plotter = attributes;
      }
      attributes = {};
    }
  } else {
    if (typeof type === "function") {
      plotter = type;
    }
    attributes = {};
    type = "2d";
  }
  var canvas2 = document.createElement("canvas");
  var context = canvas2.getContext(type, attributes);
  var texture2 = new Texture(canvas2);
  texture2.context = function() {
    return context;
  };
  texture2.size = function(width, height, ratio) {
    ratio = ratio || 1;
    canvas2.width = width * ratio;
    canvas2.height = height * ratio;
    this.src(canvas2, ratio);
    return this;
  };
  texture2.canvas = function(fn) {
    if (typeof fn === "function") {
      fn.call(this, context);
    } else if (typeof fn === "undefined" && typeof plotter === "function") {
      plotter.call(this, context);
    }
    return this;
  };
  if (typeof plotter === "function") {
    plotter.call(texture2, context);
  }
  return texture2;
};
const PIXEL_RATIO = window.devicePixelRatio || 1;
let M;
function memoizeDraw(callback, memoKey = () => null) {
  let lastRatio = 0;
  let lastSelection = void 0;
  let texture2 = Stage.canvas();
  let sprite2 = Stage.sprite();
  let first = true;
  sprite2.tick(function() {
    let m = this._parent.matrix();
    if (first) {
      first = false;
      if (!(m = M)) {
        return;
      }
    }
    M = m;
    let newRatio = Math.max(Math.abs(m.a), Math.abs(m.b));
    let rationChange = lastRatio / newRatio;
    if (lastRatio === 0 || rationChange > 1.25 || rationChange < 0.8) {
      const newSelection = memoKey();
      if (lastSelection !== newSelection) {
        lastRatio = newRatio;
        callback(2.5 * newRatio / PIXEL_RATIO, texture2, sprite2);
        sprite2.texture(texture2);
        sprite2.__timestamp = Date.now();
      }
    }
  }, false);
  return sprite2;
}
class Mouse {
  constructor() {
    __publicField(this, "x", 0);
    __publicField(this, "y", 0);
    __publicField(this, "ratio", 1);
    __publicField(this, "stage");
    __publicField(this, "elem");
    __publicField(this, "clicklist", []);
    __publicField(this, "cancellist", []);
    __publicField(this, "handleStart", (event) => {
      event.preventDefault();
      this.locate(event);
      this.publish(event.type, event);
      this.lookup("click", this.clicklist);
      this.lookup("mousecancel", this.cancellist);
    });
    __publicField(this, "handleMove", (event) => {
      event.preventDefault();
      this.locate(event);
      this.publish(event.type, event);
    });
    __publicField(this, "handleEnd", (event) => {
      event.preventDefault();
      this.publish(event.type, event);
      if (this.clicklist.length) {
        this.publish("click", event, this.clicklist);
      }
      this.cancellist.length = 0;
    });
    __publicField(this, "handleCancel", (event) => {
      if (this.cancellist.length) {
        this.publish("mousecancel", event, this.cancellist);
      }
      this.clicklist.length = 0;
    });
    __publicField(this, "toString", function() {
      return (this.x | 0) + "x" + (this.y | 0);
    });
    __publicField(this, "locate", function(event) {
      const elem = this.elem;
      let x;
      let y;
      if (event.touches && event.touches.length) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      var rect = elem.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
      x -= elem.clientLeft | 0;
      y -= elem.clientTop | 0;
      this.x = x * this.ratio;
      this.y = y * this.ratio;
    });
    __publicField(this, "lookup", function(type, collect) {
      this.type = type;
      this.root = this.stage;
      this.event = null;
      collect.length = 0;
      this.collect = collect;
      this.root.visit({
        reverse: true,
        visible: true,
        start: this.visitStart,
        end: this.visitEnd
      }, this);
    });
    __publicField(this, "publish", function(type, event, targets) {
      this.type = type;
      this.root = this.stage;
      this.event = event;
      this.collect = false;
      this.timeStamp = Date.now();
      if (type !== "mousemove" && type !== "touchmove") {
        console.log(this.type + " " + this);
      }
      if (targets) {
        while (targets.length)
          if (this.visitEnd(targets.shift()))
            break;
        targets.length = 0;
      } else {
        this.root.visit({
          reverse: true,
          visible: true,
          start: this.visitStart,
          end: this.visitEnd
        }, this);
      }
    });
    __publicField(this, "visitStart", (node) => {
      return !node._flag(this.type);
    });
    __publicField(this, "visitEnd", (node) => {
      rel.raw = this.event;
      rel.type = this.type;
      rel.timeStamp = this.timeStamp;
      rel.abs.x = this.x;
      rel.abs.y = this.y;
      var listeners = node.listeners(this.type);
      if (!listeners) {
        return;
      }
      node.matrix().inverse().map(this, rel);
      if (!(node === this.root || node.attr("spy") || node.hitTest(rel))) {
        return;
      }
      if (this.collect) {
        this.collect.push(node);
      }
      if (this.event) {
        var cancel = false;
        for (var l = 0; l < listeners.length; l++) {
          cancel = listeners[l].call(node, rel) ? true : cancel;
        }
        return cancel;
      }
    });
  }
  mount(stage, elem) {
    this.stage = stage;
    this.elem = elem;
    this.ratio = stage.viewport().ratio || 1;
    stage.on("viewport", (size) => {
      this.ratio = size.ratio ?? this.ratio;
    });
    elem.addEventListener("touchstart", this.handleStart);
    elem.addEventListener("touchend", this.handleEnd);
    elem.addEventListener("touchmove", this.handleMove);
    elem.addEventListener("touchcancel", this.handleCancel);
    elem.addEventListener("mousedown", this.handleStart);
    elem.addEventListener("mouseup", this.handleEnd);
    elem.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleCancel);
    window.addEventListener("blur", this.handleCancel);
    return this;
  }
  unmount() {
    const elem = this.elem;
    elem.removeEventListener("touchstart", this.handleStart);
    elem.removeEventListener("touchend", this.handleEnd);
    elem.removeEventListener("touchmove", this.handleMove);
    elem.removeEventListener("touchcancel", this.handleCancel);
    elem.removeEventListener("mousedown", this.handleStart);
    elem.removeEventListener("mouseup", this.handleEnd);
    elem.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleCancel);
    window.removeEventListener("blur", this.handleCancel);
    return this;
  }
}
__publicField(Mouse, "CLICK", "click");
__publicField(Mouse, "START", "touchstart mousedown");
__publicField(Mouse, "MOVE", "touchmove mousemove");
__publicField(Mouse, "END", "touchend mouseup");
__publicField(Mouse, "CANCEL", "touchcancel mousecancel");
var rel = {}, abs = {};
defineValue(rel, "clone", function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(rel, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0) + " (" + this.abs + ")";
});
defineValue(rel, "abs", abs);
defineValue(abs, "clone", function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(abs, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0);
});
function defineValue(obj, name, value) {
  Object.defineProperty(obj, name, {
    value
  });
}
function IDENTITY(x) {
  return x;
}
var _cache = {};
var _modes = {};
var _easings = {};
class Easing {
  static get(token, fallback = IDENTITY) {
    if (typeof token === "function") {
      return token;
    }
    if (typeof token !== "string") {
      return fallback;
    }
    var fn = _cache[token];
    if (fn) {
      return fn;
    }
    var match = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
    if (!match || !match.length) {
      return fallback;
    }
    var easing = _easings[match[1]];
    var mode = _modes[match[3]];
    var params = match[5];
    if (easing && easing.fn) {
      fn = easing.fn;
    } else if (easing && easing.fc) {
      fn = easing.fc.apply(easing.fc, params && params.replace(/\s+/, "").split(","));
    } else {
      fn = fallback;
    }
    if (mode) {
      fn = mode.fn(fn);
    }
    _cache[token] = fn;
    return fn;
  }
  static add(data) {
    var names = (data.name || data.mode).split(/\s+/);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (name) {
        (data.name ? _easings : _modes)[name] = data;
      }
    }
  }
}
Easing.add({
  mode: "in",
  fn: function(f) {
    return f;
  }
});
Easing.add({
  mode: "out",
  fn: function(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
});
Easing.add({
  mode: "in-out",
  fn: function(f) {
    return function(t) {
      return t < 0.5 ? f(2 * t) / 2 : 1 - f(2 * (1 - t)) / 2;
    };
  }
});
Easing.add({
  mode: "out-in",
  fn: function(f) {
    return function(t) {
      return t < 0.5 ? 1 - f(2 * (1 - t)) / 2 : f(2 * t) / 2;
    };
  }
});
Easing.add({
  name: "linear",
  fn: function(t) {
    return t;
  }
});
Easing.add({
  name: "quad",
  fn: function(t) {
    return t * t;
  }
});
Easing.add({
  name: "cubic",
  fn: function(t) {
    return t * t * t;
  }
});
Easing.add({
  name: "quart",
  fn: function(t) {
    return t * t * t * t;
  }
});
Easing.add({
  name: "quint",
  fn: function(t) {
    return t * t * t * t * t;
  }
});
Easing.add({
  name: "sin sine",
  fn: function(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
});
Easing.add({
  name: "exp expo",
  fn: function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
});
Easing.add({
  name: "circle circ",
  fn: function(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
});
Easing.add({
  name: "bounce",
  fn: function(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
});
Easing.add({
  name: "poly",
  fc: function(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
});
Easing.add({
  name: "elastic",
  fc: function(a, p) {
    p = p || 0.45;
    a = a || 1;
    var s = p / (2 * Math.PI) * Math.asin(1 / a);
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p);
    };
  }
});
Easing.add({
  name: "back",
  fc: function(s) {
    s = typeof s !== "undefined" ? s : 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
});
Node.prototype.tween = function(duration, delay, append2) {
  if (typeof duration === "object" && duration !== null) {
    const options = duration;
    duration = options.duration;
    delay = options.delay;
    append2 = options.append;
  } else if (typeof duration !== "number") {
    append2 = duration, delay = 0, duration = 0;
  } else if (typeof delay !== "number") {
    append2 = delay, delay = 0;
  }
  if (!this._tweens) {
    this._tweens = [];
    var ticktime = 0;
    this.tick(function(elapsed, now, last) {
      if (!this._tweens.length) {
        return;
      }
      var ignore = ticktime != last;
      ticktime = now;
      if (ignore) {
        return true;
      }
      var head = this._tweens[0];
      var ended = head.tick(this, elapsed, now, last);
      if (ended) {
        if (head === this._tweens[0]) {
          this._tweens.shift();
        }
        var next = head.finish();
        if (next) {
          this._tweens.unshift(next);
        }
      }
      return true;
    }, true);
  }
  this.touch();
  if (!append2) {
    this._tweens.length = 0;
  }
  var tween = new Tween(this, duration, delay);
  this._tweens.push(tween);
  return tween;
};
class Tween {
  constructor(owner, duration, delay) {
    __publicField(this, "_ending", []);
    this._end = {};
    this._duration = duration || 400;
    this._delay = delay || 0;
    this._owner = owner;
    this._time = 0;
  }
  // @internal
  tick(node, elapsed, now, last) {
    this._time += elapsed;
    if (this._time < this._delay) {
      return;
    }
    var time = this._time - this._delay;
    if (!this._start) {
      this._start = {};
      for (var key in this._end) {
        this._start[key] = this._owner.pin(key);
      }
    }
    var p, ended;
    if (time < this._duration) {
      p = time / this._duration;
      ended = false;
    } else {
      p = 1;
      ended = true;
    }
    if (typeof this._easing == "function") {
      p = this._easing(p);
    }
    var q = 1 - p;
    for (var key in this._end) {
      this._owner.pin(key, this._start[key] * q + this._end[key] * p);
    }
    return ended;
  }
  // @internal
  finish() {
    this._ending.forEach((callback) => {
      try {
        callback.call(this._owner);
      } catch (e) {
        console.error(e);
      }
    });
    return this._next;
  }
  tween(duration, delay) {
    return this._next = new Tween(this._owner, duration, delay);
  }
  duration(duration) {
    this._duration = duration;
    return this;
  }
  delay(delay) {
    this._delay = delay;
    return this;
  }
  ease(easing) {
    this._easing = Easing.get(easing);
    return this;
  }
  done(fn) {
    this._ending.push(fn);
    return this;
  }
  hide() {
    this._ending.push(function() {
      this.remove();
    });
    this._hide = true;
    return this;
  }
  remove() {
    this._ending.push(function() {
      this.remove();
    });
    this._remove = true;
    return this;
  }
  pin(a, b) {
    if (typeof a === "object") {
      for (var attr in a) {
        pinning(this._owner, this._end, attr, a[attr]);
      }
    } else if (typeof b !== "undefined") {
      pinning(this._owner, this._end, a, b);
    }
    return this;
  }
  /**
   * @deprecated Use .done(fn) instead.
   */
  then(fn) {
    this.done(fn);
    return this;
  }
  /**
   * @deprecated this doesn't do anything anymore, call tween on the node instead.
   */
  clear(forward) {
    return this;
  }
}
function pinning(node, map, key, value) {
  if (typeof node.pin(key) === "number") {
    map[key] = value;
  } else if (typeof node.pin(key + "X") === "number" && typeof node.pin(key + "Y") === "number") {
    map[key + "X"] = value;
    map[key + "Y"] = value;
  }
}
Pin._add_shortcuts(Tween.prototype);
const _stages = [];
const pause = function() {
  for (let i = _stages.length - 1; i >= 0; i--) {
    _stages[i].pause();
  }
};
const resume = function() {
  for (let i = _stages.length - 1; i >= 0; i--) {
    _stages[i].resume();
  }
};
const mount = function(configs = {}) {
  let root = new Root();
  root.mount(configs);
  root.mouse = new Mouse().mount(root, root.dom);
  return root;
};
class Root extends Node {
  constructor() {
    super();
    __publicField(this, "canvas", null);
    __publicField(this, "dom", null);
    __publicField(this, "context", null);
    __publicField(this, "pixelWidth", -1);
    __publicField(this, "pixelHeight", -1);
    __publicField(this, "pixelRatio", 1);
    __publicField(this, "drawingWidth", 0);
    __publicField(this, "drawingHeight", 0);
    __publicField(this, "mounted", false);
    __publicField(this, "paused", false);
    __publicField(this, "sleep", false);
    __publicField(this, "mount", (configs = {}) => {
      if (typeof configs.canvas === "string") {
        this.canvas = document.getElementById(configs.canvas);
      } else if (configs.canvas instanceof HTMLCanvasElement) {
        this.canvas = configs.canvas;
      } else if (configs.canvas)
        ;
      if (!this.canvas) {
        this.canvas = document.getElementById("cutjs") || document.getElementById("stage");
      }
      if (!this.canvas) {
        console.log("Creating Canvas...");
        this.canvas = document.createElement("canvas");
        Object.assign(this.canvas.style, {
          position: "absolute",
          display: "block",
          top: "0",
          left: "0",
          bottom: "0",
          right: "0",
          width: "100%",
          height: "100%"
        });
        let body = document.body;
        body.insertBefore(this.canvas, body.firstChild);
      }
      this.dom = this.canvas;
      this.context = this.canvas.getContext("2d");
      this.devicePixelRatio = window.devicePixelRatio || 1;
      this.backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
      this.pixelRatio = this.devicePixelRatio / this.backingStoreRatio;
      this.mounted = true;
      _stages.push(this);
      this.requestFrame(this.onFrame);
    });
    __publicField(this, "frameRequested", false);
    __publicField(this, "requestFrame", () => {
      if (!this.frameRequested) {
        this.frameRequested = true;
        requestAnimationFrame(this.onFrame);
      }
    });
    __publicField(this, "lastTime", 0);
    __publicField(this, "_mo_touch", null);
    // monitor touch
    __publicField(this, "onFrame", (now) => {
      this.frameRequested = false;
      if (!this.mounted) {
        return;
      }
      this.requestFrame();
      const newPixelWidth = this.canvas.clientWidth;
      const newPixelHeight = this.canvas.clientHeight;
      if (this.pixelWidth !== newPixelWidth || this.pixelHeight !== newPixelHeight) {
        this.pixelWidth = newPixelWidth;
        this.pixelHeight = newPixelHeight;
        this.drawingWidth = newPixelWidth * this.pixelRatio;
        this.drawingHeight = newPixelHeight * this.pixelRatio;
        if (this.canvas.width !== this.drawingWidth || this.canvas.height !== this.drawingHeight) {
          this.canvas.width = this.drawingWidth;
          this.canvas.height = this.drawingHeight;
          console.log("Resize: [" + this.drawingWidth + ", " + this.drawingHeight + "] = " + this.pixelRatio + " x [" + this.pixelWidth + ", " + this.pixelHeight + "]");
          this.viewport({
            width: this.drawingWidth,
            height: this.drawingHeight,
            ratio: this.pixelRatio
          });
        }
      }
      let last = this.lastTime || now;
      let elapsed = now - last;
      if (!this.mounted || this.paused || this.sleep) {
        return;
      }
      this.lastTime = now;
      let tickRequest = this._tick(elapsed, now, last);
      if (this._mo_touch != this._ts_touch) {
        this._mo_touch = this._ts_touch;
        this.sleep = false;
        if (this.drawingWidth > 0 && this.drawingHeight > 0) {
          this.context.setTransform(1, 0, 0, 1, 0, 0);
          this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);
          this.render(this.context);
        }
      } else if (tickRequest) {
        this.sleep = false;
      } else {
        this.sleep = true;
      }
      stats.fps = elapsed ? 1e3 / elapsed : 0;
    });
    this.label("Root");
  }
  resume() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.paused = false;
    this.sleep = false;
    this.publish("resume");
    return this;
  }
  pause() {
    if (!this.paused) {
      this.publish("pause");
    }
    this.paused = true;
    return this;
  }
  touch() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.sleep = false;
    return Node.prototype.touch();
  }
  unmount() {
    var _a;
    this.mounted = false;
    let index = _stages.indexOf(this);
    if (index >= 0) {
      _stages.splice(index, 1);
    }
    (_a = this.mouse) == null ? void 0 : _a.unmount();
    return this;
  }
  background(color) {
    this.dom.style.backgroundColor = color;
    return this;
  }
  /**
   * Set/get viewport. This is combined with viewbox to determine the scale and position of the viewbox within the viewport.
   */
  viewport(width, height, ratio) {
    if (typeof width === "undefined") {
      return Object.assign({}, this._viewport);
    }
    if (typeof width === "object") {
      const options = width;
      width = options.width;
      height = options.height;
      ratio = options.ratio;
    }
    this._viewport = {
      width,
      height,
      ratio: ratio || 1
    };
    this.viewbox();
    let data = Object.assign({}, this._viewport);
    this.visit({
      start: function(node) {
        if (!node._flag("viewport")) {
          return true;
        }
        node.publish("viewport", [data]);
      }
    });
    return this;
  }
  /**
   * Set/get viewbox. This is combined with viewport to determine the scale and position of the viewbox within the viewport.
   * 
   * @param {mode} string - One of: 'in-pad' (like css object-fit: 'contain'), 'in', 'out-crop' (like css object-fit: 'cover'), 'out'
   */
  // TODO: static/fixed viewbox
  viewbox(width, height, mode) {
    if (typeof width === "number" && typeof height === "number") {
      this._viewbox = {
        width,
        height,
        mode: /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : "in-pad"
      };
    }
    let viewbox = this._viewbox;
    let viewport = this._viewport;
    if (viewport && viewbox) {
      this.pin({
        width: viewbox.width,
        height: viewbox.height
      });
      this.scaleTo(viewport.width, viewport.height, viewbox.mode);
    } else if (viewport) {
      this.pin({
        width: viewport.width,
        height: viewport.height
      });
    }
    return this;
  }
}
const sprite = function(frame) {
  var sprite2 = new Sprite();
  frame && sprite2.texture(frame);
  return sprite2;
};
Sprite._super = Node;
Sprite.prototype = Object.create(Sprite._super.prototype);
function Sprite() {
  Sprite._super.call(this);
  this.label("Sprite");
  this._textures = [];
  this._image = null;
}
Sprite.prototype.texture = function(frame) {
  this._image = texture(frame).one();
  this.pin("width", this._image ? this._image.width : 0);
  this.pin("height", this._image ? this._image.height : 0);
  this._textures[0] = this._image.pipe();
  this._textures.length = 1;
  return this;
};
Sprite.prototype.tile = function(inner) {
  this._repeat(false, inner);
  return this;
};
Sprite.prototype.stretch = function(inner) {
  this._repeat(true, inner);
  return this;
};
Sprite.prototype._repeat = function(stretch, inner) {
  var self = this;
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    if (this._mo_stretch == this._pin._ts_transform) {
      return;
    }
    this._mo_stretch = this._pin._ts_transform;
    var width = this.pin("width");
    var height = this.pin("height");
    this._textures.length = repeat(this._image, width, height, stretch, inner, insert);
  });
  function insert(i, sx, sy, sw, sh, dx, dy, dw, dh) {
    var repeat2 = self._textures.length > i ? self._textures[i] : self._textures[i] = self._image.pipe();
    repeat2.src(sx, sy, sw, sh);
    repeat2.dest(dx, dy, dw, dh);
  }
};
function repeat(img, owidth, oheight, stretch, inner, insert) {
  var width = img.width;
  var height = img.height;
  var left = img.left;
  var right = img.right;
  var top = img.top;
  var bottom = img.bottom;
  left = typeof left === "number" && left === left ? left : 0;
  right = typeof right === "number" && right === right ? right : 0;
  top = typeof top === "number" && top === top ? top : 0;
  bottom = typeof bottom === "number" && bottom === bottom ? bottom : 0;
  width = width - left - right;
  height = height - top - bottom;
  if (!inner) {
    owidth = Math.max(owidth - left - right, 0);
    oheight = Math.max(oheight - top - bottom, 0);
  }
  var i = 0;
  if (top > 0 && left > 0)
    insert(i++, 0, 0, left, top, 0, 0, left, top);
  if (bottom > 0 && left > 0)
    insert(i++, 0, height + top, left, bottom, 0, oheight + top, left, bottom);
  if (top > 0 && right > 0)
    insert(i++, width + left, 0, right, top, owidth + left, 0, right, top);
  if (bottom > 0 && right > 0)
    insert(
      i++,
      width + left,
      height + top,
      right,
      bottom,
      owidth + left,
      oheight + top,
      right,
      bottom
    );
  if (stretch) {
    if (top > 0)
      insert(i++, left, 0, width, top, left, 0, owidth, top);
    if (bottom > 0)
      insert(
        i++,
        left,
        height + top,
        width,
        bottom,
        left,
        oheight + top,
        owidth,
        bottom
      );
    if (left > 0)
      insert(i++, 0, top, left, height, 0, top, left, oheight);
    if (right > 0)
      insert(
        i++,
        width + left,
        top,
        right,
        height,
        owidth + left,
        top,
        right,
        oheight
      );
    insert(i++, left, top, width, height, left, top, owidth, oheight);
  } else {
    var l = left, r = owidth, w;
    while (r > 0) {
      w = Math.min(width, r), r -= width;
      var t = top, b = oheight, h;
      while (b > 0) {
        h = Math.min(height, b), b -= height;
        insert(i++, left, top, w, h, l, t, w, h);
        if (r <= 0) {
          if (left)
            insert(i++, 0, top, left, h, 0, t, left, h);
          if (right)
            insert(i++, width + left, top, right, h, l + w, t, right, h);
        }
        t += h;
      }
      if (top)
        insert(i++, left, 0, w, top, l, 0, w, top);
      if (bottom)
        insert(i++, left, height + top, w, bottom, l, t, w, bottom);
      l += w;
    }
  }
  return i;
}
Sprite.prototype.image = Sprite.prototype.texture;
const image = sprite;
const Image$1 = Sprite;
const anim = function(frames, fps) {
  var anim2 = new Anim();
  anim2.frames(frames).gotoFrame(0);
  fps && anim2.fps(fps);
  return anim2;
};
Anim._super = Node;
Anim.prototype = Object.create(Anim._super.prototype);
const FPS = 15;
function Anim() {
  Anim._super.call(this);
  this.label("Anim");
  this._textures = [];
  this._fps = FPS;
  this._ft = 1e3 / this._fps;
  this._time = -1;
  this._repeat = 0;
  this._index = 0;
  this._frames = [];
  var lastTime = 0;
  this.tick(function(t, now, last) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }
    var ignore = lastTime != last;
    lastTime = now;
    if (ignore) {
      return true;
    }
    this._time += t;
    if (this._time < this._ft) {
      return true;
    }
    var n = this._time / this._ft | 0;
    this._time -= n * this._ft;
    this.moveFrame(n);
    if (this._repeat > 0 && (this._repeat -= n) <= 0) {
      this.stop();
      this._callback && this._callback();
      return false;
    }
    return true;
  }, false);
}
Anim.prototype.fps = function(fps) {
  if (typeof fps === "undefined") {
    return this._fps;
  }
  this._fps = fps > 0 ? fps : FPS;
  this._ft = 1e3 / this._fps;
  return this;
};
Anim.prototype.setFrames = function(a, b, c) {
  return this.frames(a, b, c);
};
Anim.prototype.frames = function(frames) {
  this._index = 0;
  this._frames = texture(frames).array();
  this.touch();
  return this;
};
Anim.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};
Anim.prototype.gotoFrame = function(frame, resize) {
  this._index = math.wrap(frame, this._frames.length) | 0;
  resize = resize || !this._textures[0];
  this._textures[0] = this._frames[this._index];
  if (resize) {
    this.pin("width", this._textures[0].width);
    this.pin("height", this._textures[0].height);
  }
  this.touch();
  return this;
};
Anim.prototype.moveFrame = function(move) {
  return this.gotoFrame(this._index + move);
};
Anim.prototype.repeat = function(repeat2, callback) {
  this._repeat = repeat2 * this._frames.length - 1;
  this._callback = callback;
  this.play();
  return this;
};
Anim.prototype.play = function(frame) {
  if (typeof frame !== "undefined") {
    this.gotoFrame(frame);
    this._time = 0;
  } else if (this._time < 0) {
    this._time = 0;
  }
  this.touch();
  return this;
};
Anim.prototype.stop = function(frame) {
  this._time = -1;
  if (typeof frame !== "undefined") {
    this.gotoFrame(frame);
  }
  return this;
};
const string$1 = function(frames) {
  return new Str().frames(frames);
};
Str._super = Node;
Str.prototype = Object.create(Str._super.prototype);
function Str() {
  Str._super.call(this);
  this.label("String");
  this._textures = [];
}
Str.prototype.setFont = function(a, b, c) {
  return this.frames(a, b, c);
};
Str.prototype.frames = function(frames) {
  this._textures = [];
  if (typeof frames == "string") {
    frames = texture(frames);
    this._item = function(value) {
      return frames.one(value);
    };
  } else if (typeof frames === "object") {
    this._item = function(value) {
      return frames[value];
    };
  } else if (typeof frames === "function") {
    this._item = frames;
  }
  return this;
};
Str.prototype.setValue = function(a, b, c) {
  return this.value(a, b, c);
};
Str.prototype.value = function(value) {
  if (typeof value === "undefined") {
    return this._value;
  }
  if (this._value === value) {
    return this;
  }
  this._value = value;
  if (value === null) {
    value = "";
  } else if (typeof value !== "string" && !Array.isArray(value)) {
    value = value.toString();
  }
  this._spacing = this._spacing || 0;
  var width = 0, height = 0;
  for (var i = 0; i < value.length; i++) {
    var texture2 = this._textures[i] = this._item(value[i]);
    width += i > 0 ? this._spacing : 0;
    texture2.dest(width, 0);
    width = width + texture2.width;
    height = Math.max(height, texture2.height);
  }
  this.pin("width", width);
  this.pin("height", height);
  this._textures.length = value.length;
  return this;
};
const row = function(align) {
  return create().row(align).label("Row");
};
Node.prototype.row = function(align) {
  this.align("row", align);
  return this;
};
const column = function(align) {
  return create().column(align).label("Row");
};
Node.prototype.column = function(align) {
  this.align("column", align);
  return this;
};
Node.prototype.align = function(type, align) {
  this._padding = this._padding || 0;
  this._spacing = this._spacing || 0;
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    if (this._mo_seq == this._ts_touch) {
      return;
    }
    this._mo_seq = this._ts_touch;
    var alignChildren = this._mo_seqAlign != this._ts_children;
    this._mo_seqAlign = this._ts_children;
    var width = 0, height = 0;
    var child, next = this.first(true);
    var first = true;
    while (child = next) {
      next = child.next(true);
      child.matrix(true);
      var w = child.pin("boxWidth");
      var h = child.pin("boxHeight");
      if (type == "column") {
        !first && (height += this._spacing);
        child.pin("offsetY") != height && child.pin("offsetY", height);
        width = Math.max(width, w);
        height = height + h;
        alignChildren && child.pin("alignX", align);
      } else if (type == "row") {
        !first && (width += this._spacing);
        child.pin("offsetX") != width && child.pin("offsetX", width);
        width = width + w;
        height = Math.max(height, h);
        alignChildren && child.pin("alignY", align);
      }
      first = false;
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin("width") != width && this.pin("width", width);
    this.pin("height") != height && this.pin("height", height);
  });
  return this;
};
const box = function() {
  return create().box().label("Box");
};
Node.prototype.box = function() {
  this._padding = this._padding || 0;
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    if (this._mo_box == this._ts_touch) {
      return;
    }
    this._mo_box = this._ts_touch;
    var width = 0, height = 0;
    var child, next = this.first(true);
    while (child = next) {
      next = child.next(true);
      child.matrix(true);
      var w = child.pin("boxWidth");
      var h = child.pin("boxHeight");
      width = Math.max(width, w);
      height = Math.max(height, h);
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin("width") != width && this.pin("width", width);
    this.pin("height") != height && this.pin("height", height);
  });
  return this;
};
const layer = function() {
  return create().layer().label("Layer");
};
Node.prototype.layer = function() {
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    var parent = this.parent();
    if (parent) {
      var width = parent.pin("width");
      if (this.pin("width") != width) {
        this.pin("width", width);
      }
      var height = parent.pin("height");
      if (this.pin("height") != height) {
        this.pin("height", height);
      }
    }
  }, true);
  return this;
};
Node.prototype.padding = function(pad) {
  this._padding = pad;
  return this;
};
Node.prototype.spacing = function(space) {
  this._spacing = space;
  return this;
};
const Stage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Anim,
  Atlas,
  Image: Image$1,
  Math: math,
  Matrix,
  Mouse,
  Node,
  Pin,
  Root,
  Sprite,
  Str,
  Texture,
  Tween,
  anim,
  atlas,
  box,
  canvas,
  column,
  create,
  image,
  layer,
  math,
  memoizeDraw,
  mount,
  pause,
  resume,
  row,
  sprite,
  string: string$1,
  texture
}, Symbol.toStringTag, { value: "Module" }));
export {
  Anim,
  Atlas,
  Image$1 as Image,
  math as Math,
  Matrix,
  Mouse,
  Node,
  Pin,
  Root,
  Sprite,
  Str,
  Texture,
  Tween,
  anim,
  atlas,
  box,
  canvas,
  column,
  create,
  Stage$1 as default,
  image,
  layer,
  math,
  memoizeDraw,
  mount,
  pause,
  resume,
  row,
  sprite,
  string$1 as string,
  texture
};
