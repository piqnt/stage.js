var Class = require('./core');
var Matrix = require('./matrix');

var iid = 0;

Class._init(function() {
  this._pin = new Pin(this);
});

Class.prototype.matrix = function(relative) {
  if (relative === true) {
    return this._pin.relativeMatrix();
  }
  return this._pin.absoluteMatrix();
};

Class.prototype.pin = function(a, b) {
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

function Pin(owner) {

  this._owner = owner;
  this._parent = null;

  // relative to parent
  this._relativeMatrix = new Matrix();

  // relative to stage
  this._absoluteMatrix = new Matrix();

  this.reset();
};

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

  // scale/skew/rotate center
  this._pivoted = false;
  this._pivotX = null;
  this._pivotY = null;

  // self pin point
  this._handled = false;
  this._handleX = 0;
  this._handleY = 0;

  // parent pin point
  this._aligned = false;
  this._alignX = 0;
  this._alignY = 0;

  // as seen by parent px
  this._offsetX = 0;
  this._offsetY = 0;

  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;

  // TODO: also set for owner
  this._ts_translate = ++iid;
  this._ts_transform = ++iid;
  this._ts_matrix = ++iid;
};

Pin.prototype._update = function() {
  this._parent = this._owner._parent && this._owner._parent._pin;

  // if handled and transformed then be translated
  if (this._handled && this._mo_handle != this._ts_transform) {
    this._mo_handle = this._ts_transform;
    this._ts_translate = ++iid;
  }

  if (this._aligned && this._parent
      && this._mo_align != this._parent._ts_transform) {
    this._mo_align = this._parent._ts_transform;
    this._ts_translate = ++iid;
  }

  return this;
};

Pin.prototype.toString = function() {
  return this._owner + ' (' + (this._parent ? this._parent._owner : null) + ')';
};

// TODO: ts fields require refactoring

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

  var abs = this._absoluteMatrix;
  abs.reset(this.relativeMatrix());

  this._parent && abs.concat(this._parent._absoluteMatrix);

  this._ts_matrix = ++iid;

  return abs;
};

Pin.prototype.relativeMatrix = function() {
  this._update();
  var ts = Math.max(this._ts_transform, this._ts_translate,
      this._parent ? this._parent._ts_transform : 0);
  if (this._mo_rel == ts) {
    return this._relativeMatrix;
  }
  this._mo_rel = ts;

  var rel = this._relativeMatrix;

  rel.identity();
  if (this._pivoted) {
    rel.translate(-this._pivotX * this._width, -this._pivotY * this._height);
  }
  rel.scale(this._scaleX, this._scaleY);
  rel.skew(this._skewX, this._skewY);
  rel.rotate(this._rotation);
  if (this._pivoted) {
    rel.translate(this._pivotX * this._width, this._pivotY * this._height);
  }

  // calculate effective box
  if (this._pivoted) {
    // origin
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;

  } else {
    // aabb
    var p, q;
    if (rel.a > 0 && rel.c > 0 || rel.a < 0 && rel.c < 0) {
      p = 0, q = rel.a * this._width + rel.c * this._height;
    } else {
      p = rel.a * this._width, q = rel.c * this._height;
    }
    if (p > q) {
      this._boxX = q;
      this._boxWidth = p - q;
    } else {
      this._boxX = p;
      this._boxWidth = q - p;
    }
    if (rel.b > 0 && rel.d > 0 || rel.b < 0 && rel.d < 0) {
      p = 0, q = rel.b * this._width + rel.d * this._height;
    } else {
      p = rel.b * this._width, q = rel.d * this._height;
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

  rel.translate(this._x, this._y);

  return this._relativeMatrix;
};

Pin.prototype.get = function(key) {
  if (typeof getters[key] === 'function') {
    return getters[key](this);
  }
};

// TODO: Use defineProperty instead? What about multi-field pinning?
Pin.prototype.set = function(a, b) {
  if (typeof a === 'string') {
    if (typeof setters[a] === 'function' && typeof b !== 'undefined') {
      setters[a](this, b);
    }
  } else if (typeof a === 'object') {
    for (b in a) {
      if (typeof setters[b] === 'function' && typeof a[b] !== 'undefined') {
        setters[b](this, a[b], a);
      }
    }
  }
  if (this._owner) {
    this._owner._ts_pin = ++iid;
    this._owner.touch();
  }
  return this;
};

var getters = {
  alpha : function(pin) {
    return pin._alpha;
  },

  textureAlpha : function(pin) {
    return pin._textureAlpha;
  },

  width : function(pin) {
    return pin._width;
  },

  height : function(pin) {
    return pin._height;
  },

  boxWidth : function(pin) {
    return pin._boxWidth;
  },

  boxHeight : function(pin) {
    return pin._boxHeight;
  },

  // scale : function(pin) {
  // },

  scaleX : function(pin) {
    return pin._scaleX;
  },

  scaleY : function(pin) {
    return pin._scaleY;
  },

  // skew : function(pin) {
  // },

  skewX : function(pin) {
    return pin._skewX;
  },

  skewY : function(pin) {
    return pin._skewY;
  },

  rotation : function(pin) {
    return pin._rotation;
  },

  // pivot : function(pin) {
  // },

  pivotX : function(pin) {
    return pin._pivotX;
  },

  pivotY : function(pin) {
    return pin._pivotY;
  },

  // offset : function(pin) {
  // },

  offsetX : function(pin) {
    return pin._offsetX;
  },

  offsetY : function(pin) {
    return pin._offsetY;
  },

  // align : function(pin) {
  // },

  alignX : function(pin) {
    return pin._alignX;
  },

  alignY : function(pin) {
    return pin._alignY;
  },

  // handle : function(pin) {
  // },

  handleX : function(pin) {
    return pin._handleX;
  },

  handleY : function(pin) {
    return pin._handleY;
  }
};

var setters = {
  alpha : function(pin, value) {
    pin._alpha = value;
  },

  textureAlpha : function(pin, value) {
    pin._textureAlpha = value;
  },

  width : function(pin, value) {
    pin._width_ = value;
    pin._width = value;
    pin._ts_transform = ++iid;
  },

  height : function(pin, value) {
    pin._height_ = value;
    pin._height = value;
    pin._ts_transform = ++iid;
  },

  scale : function(pin, value) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },

  scaleX : function(pin, value) {
    pin._scaleX = value;
    pin._ts_transform = ++iid;
  },

  scaleY : function(pin, value) {
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },

  skew : function(pin, value) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },

  skewX : function(pin, value) {
    pin._skewX = value;
    pin._ts_transform = ++iid;
  },

  skewY : function(pin, value) {
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },

  rotation : function(pin, value) {
    pin._rotation = value;
    pin._ts_transform = ++iid;
  },

  pivot : function(pin, value) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  pivotX : function(pin, value) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  pivotY : function(pin, value) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  offset : function(pin, value) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },

  offsetX : function(pin, value) {
    pin._offsetX = value;
    pin._ts_translate = ++iid;
  },

  offsetY : function(pin, value) {
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },

  align : function(pin, value) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },

  alignX : function(pin, value) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;

    this.handleX(pin, value);
  },

  alignY : function(pin, value) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;

    this.handleY(pin, value);
  },

  handle : function(pin, value) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },

  handleX : function(pin, value) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
  },

  handleY : function(pin, value) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
  },

  resizeMode : function(pin, value, all) {
    if (all) {
      if (value == 'in') {
        value = 'in-pad';
      } else if (value == 'out') {
        value = 'out-crop';
      }
      scaleTo(pin, all.resizeWidth, all.resizeHeight, value);
    }
  },

  resizeWidth : function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, value, null);
    }
  },

  resizeHeight : function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, null, value);
    }
  },

  scaleMode : function(pin, value, all) {
    if (all) {
      scaleTo(pin, all.scaleWidth, all.scaleHeight, value);
    }
  },

  scaleWidth : function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, value, null);
    }
  },

  scaleHeight : function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, null, value);
    }
  },

  matrix : function(pin, value) {
    this.scaleX(pin, value.a);
    this.skewX(pin, value.c / value.d);
    this.skewY(pin, value.b / value.a);
    this.scaleY(pin, value.d);
    this.offsetX(pin, value.e);
    this.offsetY(pin, value.f);
    this.rotation(pin, 0);
  }
};

function scaleTo(pin, width, height, mode) {
  var w = typeof width === 'number';
  var h = typeof height === 'number';
  var m = typeof mode === 'string';
  pin._ts_transform = ++iid;
  if (w) {
    pin._scaleX = width / pin._width_;
    pin._width = pin._width_;
  }
  if (h) {
    pin._scaleY = height / pin._height_;
    pin._height = pin._height_;
  }
  if (w && h && m) {
    if (mode == 'out' || mode == 'out-crop') {
      pin._scaleX = pin._scaleY = Math.max(pin._scaleX, pin._scaleY);
    } else if (mode == 'in' || mode == 'in-pad') {
      pin._scaleX = pin._scaleY = Math.min(pin._scaleX, pin._scaleY);
    }
    if (mode == 'out-crop' || mode == 'in-pad') {
      pin._width = width / pin._scaleX;
      pin._height = height / pin._scaleY;
    }
  }
};

Class.prototype.scaleTo = function(a, b, c) {
  if (typeof a === 'object')
    c = b, b = a.y, a = a.x;
  scaleTo(this._pin, a, b, c);
  return this;
};

// Used by Tween class
Pin._add_shortcuts = function(Class) {
  Class.prototype.size = function(w, h) {
    this.pin('width', w);
    this.pin('height', h);
    return this;
  };

  Class.prototype.width = function(w) {
    if (typeof w === 'undefined') {
      return this.pin('width');
    }
    this.pin('width', w);
    return this;
  };

  Class.prototype.height = function(h) {
    if (typeof h === 'undefined') {
      return this.pin('height');
    }
    this.pin('height', h);
    return this;
  };

  Class.prototype.offset = function(a, b) {
    if (typeof a === 'object')
      b = a.y, a = a.x;
    this.pin('offsetX', a);
    this.pin('offsetY', b);
    return this;
  };

  Class.prototype.rotate = function(a) {
    this.pin('rotation', a);
    return this;
  };

  Class.prototype.skew = function(a, b) {
    if (typeof a === 'object')
      b = a.y, a = a.x;
    else if (typeof b === 'undefined')
      b = a;
    this.pin('skewX', a);
    this.pin('skewY', b);
    return this;
  };

  Class.prototype.scale = function(a, b) {
    if (typeof a === 'object')
      b = a.y, a = a.x;
    else if (typeof b === 'undefined')
      b = a;
    this.pin('scaleX', a);
    this.pin('scaleY', b);
    return this;
  };

  Class.prototype.alpha = function(a, ta) {
    this.pin('alpha', a);
    if (typeof ta !== 'undefined') {
      this.pin('textureAlpha', ta);
    }
    return this;
  };
};

Pin._add_shortcuts(Class);

module.exports = Pin;
