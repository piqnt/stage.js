/*
 * CutJS
 * Copyright (c) 2013-2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

function Cut() {
  if (!(this instanceof Cut)) {
    if (typeof arguments[0] === 'function') {
      return Cut.Root.add.apply(Cut.Root, arguments);
    } else if (typeof arguments[0] === 'object') {
      return Cut.Texture.add.apply(Cut.Texture, arguments);
    }
  }

  Cut._stats.create++;

  this._id = '';
  this._visible = true;

  this._parent = null;
  this._next = null;
  this._prev = null;

  this._first = null;
  this._last = null;

  this._pin = new Cut.Pin(this);
  this._cutouts = [];
  this._tickBefore = [];
  this._tickAfter = [];

  this._alpha = 1;

  this._attrs = null;
  this._listeners = null;
  this._flags = null;
}

Cut._create = (function() {
  if (typeof Object.create == 'function') {
    return function(proto, props) {
      return Object.create.call(Object, proto, props);
    };
  } else {
    return function(proto, props) {
      if (props) {
        throw Error('Second argument is not supported!');
      }
      if (!proto || typeof proto !== 'object') {
        throw Error('Invalid prototype!');
      }
      noop.prototype = proto;
      return new noop;
    };
    function noop() {
    }
  }
})();

Cut._extend = function(base) {
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    for ( var name in obj) {
      if (obj.hasOwnProperty(name)) {
        base[name] = obj[name];
      }
    }
  }
  return base;
};

Cut._ensure = function(obj) {
  if (obj && obj instanceof Cut) {
    return obj;
  }
  throw 'Invalid node: ' + obj;
};

if (typeof performance !== 'undefined' && performance.now) {
  Cut._now = function() {
    return performance.now();
  };
} else if (Date.now) {
  Cut._now = function() {
    return Date.now();
  };
} else {
  Cut._now = function() {
    return +new Date();
  };
}

Cut._isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

Cut._TS = 0;

Cut._stats = {
  create : 0,
  tick : 0,
  node : 0,
  cutout : 0
};

Cut.create = function() {
  return new Cut();
};

Cut.prototype.MAX_ELAPSE = Infinity;

Cut.prototype._tick = function(elapsed, now, last) {
  if (!this._visible) {
    return;
  }

  if (elapsed > this.MAX_ELAPSE) {
    elapsed = this.MAX_ELAPSE;
  }

  this._pin.tick();

  var ticked = false;

  var length = this._tickBefore.length;
  for (var i = 0; i < length; i++) {
    Cut._stats.tick++;
    ticked = this._tickBefore[i].call(this, elapsed, now, last) === true ? true
        : ticked;
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    ticked = child._tick(elapsed, now, last) === true ? true : ticked;
  }

  var length = this._tickAfter.length;
  for (var i = 0; i < length; i++) {
    Cut._stats.tick++;
    ticked = this._tickAfter[i].call(this, elapsed, now, last) === true ? true
        : ticked;
  }

  return ticked;
};

Cut.prototype.tick = function(ticker, before) {
  if (before) {
    this._tickBefore.push(ticker);
  } else {
    this._tickAfter.push(ticker);
  }
};

Cut.prototype.untick = function(ticker) {
  var i;
  if (!ticker) {
  } else if ((i = this._tickBefore.indexOf(ticker)) >= 0) {
    this._tickBefore.splice(i, 1);
  } else if ((i = this._tickAfter.indexOf(ticker)) >= 0) {
    this._tickAfter.splice(i, 1);
  }
};

Cut.prototype.render = function(context) {
  if (!this._visible) {
    return;
  }
  Cut._stats.node++;

  var m = this._pin.absoluteMatrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

  this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
  var alpha = this._pin._textureAlpha * this._alpha;

  if (context.globalAlpha != alpha) {
    context.globalAlpha = alpha;
  }

  var length = this._cutouts.length;
  for (var i = 0; i < length; i++) {
    this._cutouts[i].render(context);
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

Cut.prototype.toString = function() {
  return '[' + this._id + ']';
};

Cut.prototype.id = function(id) {
  if (typeof id === 'undefined') {
    return this._id;
  }
  this._id = id;
  return this;
};

Cut.prototype.attr = function(name, value) {
  if (typeof value === 'undefined') {
    return this._attrs !== null ? this._attrs[name] : undefined;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Cut.prototype.on = Cut.prototype.listen = function(types, listener) {
  if (types = this._onoff(types, listener, true)) {
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
  if (types = this._onoff(types, listener, false)) {
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

Cut.prototype._onoff = function(types, listener, create) {
  if (!types || !types.length || typeof listener !== 'function') {
    return false;
  }
  if (!(types = (Cut._isArray(types) ? types.join(' ') : types).match(/\S+/g))) {
    return false;
  }
  if (this._listeners === null) {
    if (create) {
      this._listeners = {};
    } else {
      return false;
    }
  }
  return types;
};

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

Cut.prototype.visible = function(visible) {
  if (typeof visible === 'undefined') {
    return this._visible;
  }

  this._visible = visible;
  this._parent && (this._parent._ts_children = Cut._TS++);
  this._ts_pin = Cut._TS++;
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

Cut.prototype.append = function() {
  for (var i = 0; i < arguments.length; i++) {
    Cut._ensure(arguments[i]);
    arguments[i].appendTo(this);
  }
  return this;
};

Cut.prototype.prepend = function() {
  for (var i = 0; i < arguments.length; i++) {
    Cut._ensure(arguments[i]);
    arguments[i].prependTo(this);
  }
  return this;
};

Cut.prototype.appendTo = function(parent) {
  Cut._ensure(parent);

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

  this._ts_parent = Cut._TS++;
  parent._ts_children = Cut._TS++;
  parent.touch();
  return this;
};

Cut.prototype.prependTo = function(parent) {
  Cut._ensure(parent);

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

  this._ts_parent = Cut._TS++;
  parent._ts_children = Cut._TS++;
  parent.touch();
  return this;
};

Cut.prototype.insertNext = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      Cut._ensure(arguments[i]);
      arguments[i] && arguments[i].insertAfter(this);
    }
  }
  return this;
};

Cut.prototype.insertPrev = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      Cut._ensure(arguments[i]);
      arguments[i] && arguments[i].insertBefore(this);
    }
  }
  return this;
};

Cut.prototype.insertBefore = function(next) {
  Cut._ensure(next);

  this.remove();

  var parent = next._parent;
  var prev = next._prev;

  next._prev = this;
  prev && (prev._next = this) || parent && (parent._first = this);

  this._parent = parent;
  this._prev = prev;
  this._next = next;

  this._parent._flag(this, true);

  this._ts_parent = Cut._TS++;
  this.touch();
  return this;
};

Cut.prototype.insertAfter = function(prev) {
  Cut._ensure(prev);

  this.remove();

  var parent = prev._parent;
  var next = prev._next;

  prev._next = this;
  next && (next._prev = this) || parent && (parent._last = this);

  this._parent = parent;
  this._prev = prev;
  this._next = next;

  this._parent._flag(this, true);

  this._ts_parent = Cut._TS++;
  this.touch();
  return this;
};

Cut.prototype.remove = function() {
  if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
      Cut._ensure(arguments[i]);
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

    this._parent._ts_children = Cut._TS++;
    this._parent.touch();
  }

  this._prev = this._next = this._parent = null;
  this._ts_parent = Cut._TS++;
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

  this._ts_children = Cut._TS++;
  this.touch();
  return this;
};

// Deep flags used for optimizing event distribution.
Cut.prototype._flag = function(obj, on) {
  if (typeof on === 'undefined') {
    return this._flags !== null && this._flags[obj] || 0;
  }
  if (typeof obj === 'string') {
    if (on) {
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
          this._flag(type, on);
        }
      }
    }
  }
  return this;
};

Cut.prototype.touch = function() {
  this._ts_touch = Cut._TS++;
  this._parent && this._parent.touch();
  return this;
};

Cut.prototype.pin = function(a, b) {
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

Cut.prototype.matrix = function() {
  return this._pin
      .absoluteMatrix(this, this._parent ? this._parent._pin : null);
};

Cut.image = function(cutout) {
  var image = new Cut.Image();
  cutout && image.image(cutout);
  return image;
};

Cut.Image = function() {
  Cut.Image._super.call(this);
};

Cut.Image._super = Cut;
Cut.Image.prototype = Cut._create(Cut.Image._super.prototype);
Cut.Image.prototype.constructor = Cut.Image;

/**
 * @deprecated Use image
 */
Cut.Image.prototype.setImage = function(a, b, c) {
  return this.image(a, b, c);
};

Cut.Image.prototype.image = function(cutout) {
  this._cutouts[0] = Cut.cutout(cutout);
  this._cutouts.length = 1;
  this.pin('width', this._cutouts[0] ? this._cutouts[0].dWidth() : 0);
  this.pin('height', this._cutouts[0] ? this._cutouts[0].dHeight() : 0);
  this._cutout = this._cutouts[0].clone();
  return this;
};

Cut.Image.prototype.cropX = function(w, x) {
  this._cutouts[0].sWidth(w);
  this._cutouts[0].sX(x);
  return this.image(this._cutouts[0]);
};

Cut.Image.prototype.cropY = function(h, y) {
  this._cutouts[0].sHeight(h);
  this._cutouts[0].sY(y);
  return this.image(this._cutouts[0]);
};

Cut.Image.prototype.tile = function(inner) {
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    this._repeat(inner, false);
  });
  return this;
};

Cut.Image.prototype.stretch = function(inner) {
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    this._repeat(inner, true);
  });
  return this;
};

Cut.Image.prototype._slice = function(i) {
  return this._cutouts[i] || (this._cutouts[i] = this._cutout.clone());
};

Cut.Image.prototype._repeat = function(inner, stretch) {

  if (this._mo_stretch == this._pin._ts_transform) {
    return;
  }
  this._mo_stretch = this._pin._ts_transform;

  var cleft = this._cutout._left;
  var cright = this._cutout._right;
  var ctop = this._cutout._top;
  var cbottom = this._cutout._bottom;

  var cwidth = this._cutout._width - cleft - cright;
  var cheight = this._cutout._height - ctop - cbottom;

  var width = this.pin('width');
  var height = this.pin('height');

  width = inner ? width : Math.max(width - cleft - cright, 0);
  height = inner ? height : Math.max(height - ctop - cbottom, 0);

  var c = 0;

  // top, left
  if (ctop && cleft) {
    this._slice(c++).sWidth(cleft).sX(0).sHeight(ctop).sY(0).dX(0).dY(0);
  }

  // bottom, left
  if (cbottom && cleft) {
    this._slice(c++).sWidth(cleft).sX(0).sHeight(cbottom).sY(cheight + ctop)
        .dX(0).dY(height + ctop);
  }

  // top, right
  if (ctop && cright) {
    this._slice(c++).sWidth(cright).sX(cwidth + cleft).sHeight(ctop).sY(0).dX(
        width + cleft).dY(0);
  }

  // bottom, right
  if (cbottom && cright) {
    this._slice(c++).sWidth(cright).sX(cwidth + cleft).sHeight(cbottom).sY(
        cheight + ctop).dX(width + cleft).dY(height + ctop);
  }

  if (stretch) {
    // top
    if (ctop) {
      this._slice(c++).sWidth(cwidth).sX(cleft).sHeight(ctop).sY(0).dX(cleft)
          .dY(0).dWidth(width);
    }
    // bottom
    if (cbottom) {
      this._slice(c++).sWidth(cwidth).sX(cleft).sHeight(cbottom).sY(
          cheight + ctop).dX(cleft).dY(height + ctop).dWidth(width);
    }
    // left
    if (cleft) {
      this._slice(c++).sWidth(cleft).sX(0).sHeight(cheight).sY(ctop).dX(0).dY(
          ctop).dHeight(height);
    }
    // right
    if (cright) {
      this._slice(c++).sWidth(cright).sX(cwidth + cleft).sHeight(cheight).sY(
          ctop).dX(width + cleft).dY(ctop).dHeight(height);
    }
    // center
    this._slice(c++).sWidth(cwidth).sX(cleft).sHeight(cheight).sY(ctop).dX(
        cleft).dY(ctop).dWidth(width).dHeight(height);

  } else { // tile

    var x = cleft;
    var r = width;
    while (r > 0) {
      var w = Math.min(cwidth, r);
      r -= cwidth;
      var y = ctop;
      var b = height;
      while (b > 0) {
        var h = Math.min(cheight, b);
        b -= cheight;
        this._slice(c++).sWidth(w).sX(cleft).sHeight(h).sY(ctop).dX(x).dY(y);
        if (r <= 0) {
          // left
          if (cleft) {
            this._slice(c++).sWidth(cleft).sX(0).sHeight(h).sY(ctop).dX(0)
                .dY(y);
          }
          // right
          if (cright) {
            this._slice(c++).sWidth(cright).sX(cwidth + cleft).sHeight(h).sY(
                ctop).dX(x + w).dY(y);
          }
        }
        y += h;
      }
      // top
      if (ctop) {
        this._slice(c++).sWidth(w).sX(cleft).sHeight(ctop).sY(0).dX(x).dY(0);
      }
      // bottom
      if (cbottom) {
        this._slice(c++).sWidth(w).sX(cleft).sHeight(cbottom)
            .sY(cheight + ctop).dX(x).dY(y);
      }
      x += w;
    }
  }

  this._cutouts.length = c;
};

Cut.anim = function(frames, fps) {
  var anim = new Cut.Anim().frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};

Cut.Anim = function() {
  Cut.Anim._super.call(this);

  this._fps = Cut.Anim.FPS;
  this._ft = 1000 / this._fps;

  this._time = -1;
  this._repeat = 0;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  var lastTime = 0;
  this.tick(function(t, now, last) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }

    // ignore old elapsed
    var ignore = lastTime != last;
    lastTime = now;
    // this.touch();
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
};

Cut.Anim._super = Cut;
Cut.Anim.prototype = Cut._create(Cut.Anim._super.prototype);
Cut.Anim.prototype.constructor = Cut.Anim;

Cut.Anim.FPS = 22;

Cut.Anim.prototype.fps = function(fps) {
  if (typeof fps === 'undefined') {
    return this._fps;
  }
  this._fps = fps || Cut.Anim.FPS;
  this._ft = 1000 / this._fps;
  return this;
};

/**
 * @deprecated Use frames
 */
Cut.Anim.prototype.setFrames = function(a, b, c) {
  return this.frames(a, b, c);
};

Cut.Anim.prototype.frames = function(frames) {
  this._frame = 0;
  this._frames = [];
  this._labels = {};
  frames = Cut.cutout(frames, true);
  if (frames && frames.length) {
    for (var i = 0; i < frames.length; i++) {
      var cutout = frames[i];
      this._frames.push(cutout);
      this._labels[cutout._name] = i;
    }
  }
  this.touch();
  return this;
};

Cut.Anim.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};

Cut.Anim.prototype.gotoFrame = function(frame, resize) {
  frame = Cut.Math.rotate(frame, this._frames.length) | 0;
  this._frame = frame;
  resize = resize || !this._cutouts[0];
  this._cutouts[0] = this._frames[this._frame];
  if (resize) {
    this.pin('width', this._cutouts[0].dWidth());
    this.pin('height', this._cutouts[0].dHeight());
  }
  this._ts_frame = Cut._TS++;
  this.touch();
  return this;
};

Cut.Anim.prototype.moveFrame = function(move) {
  return this.gotoFrame(this._frame + move);
};

Cut.Anim.prototype.gotoLabel = function(label, resize) {
  return this.gotoFrame(this._labels[label] || 0, resize);
};

Cut.Anim.prototype.repeat = function(repeat, callback) {
  this._repeat = repeat * this._frames.length - 1;
  this._callback = callback;
  this.play();
  return this;
};

Cut.Anim.prototype.play = function(frame) {
  if (typeof frame !== 'undefined') {
    this.gotoFrame(frame);
    this._time = 0;
  } else if (this._time < 0) {
    this._time = 0;
  }

  this.touch();
  return this;
};

Cut.Anim.prototype.stop = function(frame) {
  this._time = -1;
  if (typeof frame !== 'undefined') {
    this.gotoFrame(frame);
  }
  return this;
};

Cut.string = function(frames) {
  return new Cut.String().frames(frames);
};

Cut.String = function() {
  Cut.String._super.call(this);
  this.row();
};

Cut.String._super = Cut;
Cut.String.prototype = Cut._create(Cut.String._super.prototype);
Cut.String.prototype.constructor = Cut.String;

/**
 * @deprecated Use frames
 */
Cut.String.prototype.setFont = function(a, b, c) {
  return this.frames(a, b, c);
};

Cut.String.prototype.frames = function(frames) {
  if (typeof frames == 'string') {
    this._frames = function(value) {
      return frames + value;
    };
  } else if (typeof frames === 'function') {
    this._frames = frames;
  }
  return this;
};

/**
 * @deprecated Use value
 */
Cut.String.prototype.setValue = function(a, b, c) {
  return this.value(a, b, c);
};

Cut.String.prototype.value = function(value) {
  if (typeof value === 'undefined') {
    return this._value;
  }
  if (this._value === value) {
    return this;
  }
  this._value = value;

  if (typeof value !== 'string' && !Cut._isArray(value)) {
    value = value + '';
  }

  var child = this._first;
  for (var i = 0; i < value.length; i++) {
    var selector = this._frames(value[i]);
    if (child) {
      child.image(selector).show();
    } else {
      child = Cut.image(selector).appendTo(this);
    }
    child = child._next;
  }

  while (child) {
    child.hide();
    child = child._next;
  }
  return this;
};

Cut.row = function(align) {
  return Cut.create().row(align);
};

Cut.prototype.row = function(align) {
  this.sequence('row', align);
  return this;
};

Cut.column = function(align) {
  return Cut.create().column(align);
};

Cut.prototype.column = function(align) {
  this.sequence('column', align);
  return this;
};

Cut.sequence = function(type, align) {
  return new Cut.create().sequence(type, align);
};

Cut.prototype.sequence = function(type, align) {

  this._padding = this._padding || 0;
  this._spacing = this._spacing || 0;

  this.untick(this._layoutTicker);

  this._layoutTicker = function() {

    if (this._mo_seq == this._ts_touch) {
      return;
    }
    this._mo_seq = this._ts_touch;

    var alignChildren = (this._mo_seqAlign != this._ts_children);
    this._mo_seqAlign = this._ts_children;

    var width = 0, height = 0;

    var child, next = this.first(true);
    var first = true;
    while (child = next) {
      next = child.next(true);

      child._pin.relativeMatrix();
      var w = child._pin._boxWidth;
      var h = child._pin._boxHeight;

      if (type == 'column') {
        !first && (height += this._spacing);
        child.pin('offsetY') != height && child.pin('offsetY', height);
        width = Math.max(width, w);
        height = height + h;
        alignChildren && child.pin('alignX', align);

      } else if (type == 'row') {
        !first && (width += this._spacing);
        child.pin('offsetX') != width && child.pin('offsetX', width);
        width = width + w;
        height = Math.max(height, h);
        alignChildren && child.pin('alignY', align);
      }
      first = false;
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin('width') != width && this.pin('width', width);
    this.pin('height') != height && this.pin('height', height);

  };

  this.tick(this._layoutTicker);

  return this;
};

Cut.box = function() {
  return new Cut.create().box();
};

Cut.prototype.box = function() {
  if (this._boxTicker)
    return this;

  this._padding = this._padding || 0;

  this._boxTicker = function() {

    if (this._mo_box == this._ts_touch) {
      return;
    }
    this._mo_box = this._ts_touch;

    var width = 0, height = 0;

    var child, next = this.first(true);
    while (child = next) {
      next = child.next(true);
      child._pin.relativeMatrix();
      var w = child._pin._boxWidth;
      var h = child._pin._boxHeight;
      width = Math.max(width, w);
      height = Math.max(height, h);
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin('width') != width && this.pin('width', width);
    this.pin('height') != height && this.pin('height', height);

  };

  this.tick(this._boxTicker);

  return this;
};

Cut.prototype.padding = function(pad) {
  this._padding = pad;
  return this;
};

Cut.prototype.spacing = function(space) {
  this._spacing = space;
  return this;
};

Cut._config = {};

Cut.config = function() {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return Cut._config[arguments[0]];
  }
  if (arguments.length === 1 && typeof arguments[0] === 'object') {
    Cut._extend(Cut._config, arguments[0]);
  }
  if (arguments.length === 2 && typeof arguments[0] === 'string') {
    Cut._config[arguments[0], arguments[1]];
  }
};

Cut.start = function(config) {
  DEBUG && console.log('Starting...');
  config = Cut._extend({}, Cut._config, config);
  Cut.Texture.start(config['image-loader'], function() {
    Cut.Root.start(config['app-loader']);
  });
};

Cut.pause = function() {
  Cut.Root.pause();
};

Cut.resume = function() {
  Cut.Root.resume();
};

Cut.cutout = function(selector, prefix) {
  return Cut.Texture.select(selector, prefix);
};

Cut.Root = function(request, render) {
  Cut.Root._super.call(this);

  this._paused = true;

  var self = this;
  var loop = function() {
    if (self._paused === true) {
      return;
    }

    Cut._stats.tick = Cut._stats.node = Cut._stats.cutout = 0;

    var now = Cut._now();
    var last = self._lastTime || now;
    var elapsed = now - last;
    self._lastTime = now;

    var ticked = self._tick(elapsed, now, last);
    if (self._mo_touch != self._ts_touch) {
      self._mo_touch = self._ts_touch;
      render.call(self);
      self.request();
    } else if (ticked) {
      self.request();
    } else {
      self.pause();
    }

    Cut._stats.fps = 1000 / (Cut._now() - now);
  };

  this.request = function() {
    request(loop);
  };
};

Cut.Root._super = Cut;
Cut.Root.prototype = Cut._create(Cut.Root._super.prototype);
Cut.Root.prototype.constructor = Cut.Root;

Cut.Root.prototype.start = function() {
  return this.resume();
};

Cut.Root.prototype.resume = function(force) {
  if (this._paused || force) {
    this._paused = false;
    this.request();
  }
  return this;
};

Cut.Root.prototype.pause = function() {
  this._paused = true;
  return this;
};

Cut.Root.prototype.touch = function() {
  this.resume();
  return Cut.Root._super.prototype.touch.call(this);
};

Cut.Root.prototype.viewport = function(width, height, ratio) {
  if (typeof width === 'undefined') {
    return Cut._extend({}, this._viewport);
  }
  this._viewport = {
    width : width,
    height : height,
    ratio : ratio || 1
  };
  this._updateViewbox();
  var data = Cut._extend({}, this._viewport);
  this.visit({
    start : function(cut) {
      if (!cut._flag('viewport')) {
        return true;
      }
      cut.publish('viewport', [ data ]);
    }
  });
  return this;
};

Cut.Root.prototype.viewbox = function(width, height, mode) {
  this._viewbox = {
    width : width,
    height : height,
    mode : /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
  };
  this._updateViewbox();
  return this;
};

Cut.Root.prototype._updateViewbox = function() {
  var box = this._viewbox;
  var size = this._viewport;
  if (size && box) {
    this.pin({
      width : box.width,
      height : box.height
    });
    this._pin._scaleTo(size.width, size.height, box.mode);
  } else if (size) {
    this.pin({
      width : size.width,
      height : size.height
    });
  }
};

Cut.Root._queue = [];
Cut.Root._roots = [];
Cut.Root._loader = null;

Cut.Root.add = function(app, opts) {
  if (!Cut.Root._loader) {
    Cut.Root._queue.push(arguments);
    return;
  }
  DEBUG && console.log('Loading app...');
  this._loader(function(root, canvas) {
    DEBUG && console.log('Initing app...');
    app(root, canvas);
    Cut.Root._roots.push(root);
    DEBUG && console.log('Starting app...');
    root.start();
  }, opts);
};

Cut.Root.start = function(loader) {
  DEBUG && console.log('Loading apps...');
  Cut.Root._loader = loader;
  var args;
  while (args = Cut.Root._queue.shift()) {
    Cut.Root.add.apply(Cut.Root, args);
  }
};

Cut.Root.pause = function() {
  if (!Cut.Root._pause) {
    Cut.Root._pause = true;
    for (var i = Cut.Root._roots.length - 1; i >= 0; i--) {
      Cut.Root._roots[i].pause();
    }
  }
};

Cut.Root.resume = function() {
  if (Cut.Root._pause) {
    Cut.Root._pause = false;
    for (var i = Cut.Root._roots.length - 1; i >= 0; i--) {
      Cut.Root._roots[i].resume();
    }
  }
};

Cut.Texture = function(data) {
  this.isTexture = true;
  this._name = data.name || ++Cut._TS + '';
  this._imagePath = data.imagePath;
  this._imageRatio = data.imageRatio || 1;
  this._cutouts = data.cutouts || [];
  this._factory = data.factory;
  this._map = data.filter || data.map;
  this._ppu = data.ppu || data.ratio || 1;
  this._trim = data.trim || 0;
};

Cut.Texture.prototype._wrap = function(cutout) {
  if (!cutout || cutout.isCutout) {
    return cutout;
  }

  cutout = Cut._extend({}, cutout);

  if (typeof this._map === 'function') {
    cutout = this._map(cutout);
  }

  var ppu = this._ppu;
  if (ppu != 1) {
    cutout.x *= ppu, cutout.y *= ppu;
    cutout.width *= ppu, cutout.height *= ppu;
    cutout.top *= ppu, cutout.bottom *= ppu;
    cutout.left *= ppu, cutout.right *= ppu;
  }

  var trim = this._trim;
  if (trim) {
    cutout.x += trim, cutout.y += trim;
    cutout.width -= 2 * trim, cutout.height -= 2 * trim;
    cutout.top -= trim, cutout.bottom -= trim;
    cutout.left -= trim, cutout.right -= trim;
  }

  var self = this;
  cutout = new Cut.Out(cutout, function() {
    // do not query image until playing
    return Cut.Texture._images[self._imagePath];
  }, this._imageRatio);

  return cutout;
};

Cut.Texture.prototype.select = function(selector, prefix) {
  if (!prefix) {// one
    for (var i = 0; i < this._cutouts.length; i++) {
      var cutout = this._cutouts[i];
      var name = (cutout._name || cutout.name);
      if (name == selector) {
        return this._wrap(cutout);
      }
    }
    if (this._factory) {
      return this._wrap(this._factory(selector));
    }

  } else {// many
    var results = [];
    var length = selector.length;
    for (var i = 0; i < this._cutouts.length; i++) {
      var cutout = this._cutouts[i];
      var name = (cutout._name || cutout.name);
      if (name && name.substring(0, length) == selector) {
        results.push(this._wrap(cutout));
      }
    }
    if (results.length) {
      return results;
    }
  }
};

// TODO: invalidate cache on new texture, etc.
Cut.Texture._cache = {
  one : {},
  many : {}
};

Cut.Texture.select = function(selector, prefix) {
  if (typeof selector === 'function') {
    return Cut.Texture.select(selector(), prefix);
  }
  if (typeof selector !== 'string') {
    return selector;
  }

  var i = selector.indexOf(':');
  var tname = i < 1 ? null : selector.slice(0, i);
  var cname = i < 0 ? selector : selector.slice(i + 1);

  var cache = prefix ? Cut.Texture._cache.many : Cut.Texture._cache.one;
  var result = cache[selector];

  if (result) {
    return Cut.Texture._clone(result, prefix);
  } else if (result === null) {
    throw 'Cutout not found: \'' + selector + '\'';
  }

  if (tname) {
    var texture = Cut.Texture._list[tname];
    if (texture) {
      result = texture.select(cname, prefix);
    } else {
      throw 'Texture not found: \'' + selector + '\'';
    }
  } else {
    var list = Cut.Texture._list;
    for (tname in list) {
      if (list.hasOwnProperty(tname)) {
        result = list[tname].select(cname, prefix);
      }
      if (result) {
        break;
      }
    }
  }

  if (result) {
    cache[selector] = result;
    return Cut.Texture._clone(result, prefix);
  } else {
    cache[selector] = null;
    throw 'Cutout not found: \'' + selector + '\'';
  }
};

Cut.Texture._clone = function(result, prefix) {
  if (prefix) {
    var clone = [];
    for (var i = 0; i < result.length; i++) {
      clone[i] = result[i].clone();
    }
    return clone;
  } else {
    return result.clone();
  }
};

/**
 * @deprecated Use `Cut(texture)` instead.
 */
Cut.addTexture = function() {
  return Cut.Texture.add.apply(Cut.Texture, arguments);
};

Cut.Texture._list = {};

Cut.Texture.add = function() {
  for (var i = 0; i < arguments.length; i++) {
    var texture = arguments[i];
    texture = texture.isTexture ? texture : new Cut.Texture(texture);
    Cut.Texture._list[texture._name] = texture;
  }
  return this;
};

Cut.Texture._images = {};

Cut.Texture.start = function(loader, callback) {
  DEBUG && console.log('Loading images...');

  var loading = 0;

  var noimage = true;

  var textures = Cut.Texture._list;
  for ( var texture in textures) {
    var path = textures[texture]._imagePath;
    if (path) {
      loading++;
      Cut.Texture._images[path] = loader(path, complete, error);
      noimage = false;
    }
  }

  if (noimage) {
    DEBUG && console.log('No image to load.');
    callback && callback();
  }

  function complete() {
    DEBUG && console.log('Image loaded.');
    done();
  }

  function error(msg) {
    DEBUG && console.log('Error loading image: ' + msg);
    done();
  }

  function done() {
    if (--loading <= 0) {
      DEBUG && console.log('Images loaded.');
      callback && callback();
    }
  }
};

Cut.Out = function(def, image, ratio) {
  this.isCutout = true;

  this._ratio = 1;
  this._name = Math.random() * 1000 | 0;

  this._x = 0;
  this._y = 0;
  // this._width = ;
  // this._height = ;
  this._top = 0;
  this._bottom = 0;
  this._left = 0;
  this._right = 0;

  if (def) {
    this.setup(def);
    if (image) {
      this.image(image);
      this.ratio(ratio || 1);
    }
  }
};

Cut.Out.prototype.image = function(image) {
  if (typeof image === 'function') {
    this._imagefn = image;
    this._image = null;
  } else {
    this._image = image;
  }
  return this;
};

Cut.Out.prototype.ratio = function(ratio) {
  if (typeof ratio === 'undefined') {
    return this._ratio;
  }
  this._dirty = true;
  this._ratio = ratio;
  return this;
};

Cut.Out.prototype.name = function(name) {
  if (typeof name === 'undefined') {
    return this._name;
  }
  this._name = name;
  return this;
};

// TODO: use a better name!
Cut.Out.prototype.setup = function(def) {
  if (def) {
    this._name = def.name || def.name;
    this._x = def.x || 0;
    this._y = def.y || 0;
    this._width = def.width || 0;
    this._height = def.height || 0;
    this._top = def.top || 0;
    this._bottom = def.bottom || 0;
    this._left = def.left || 0;
    this._right = def.right || 0;
  }
  this._dx = 0;
  this._dy = 0;
  this._dw = this._width;
  this._dh = this._height;
  this._sx = this._x;
  this._sy = this._y;
  this._sw = this._width;
  this._sh = this._height;

  this._dirty = true;
  return this;
};

Cut.Out.prototype._update = function() {
  if (!this._dirty) {
    return;
  }
  this._dirty = false;

  this._sx = Cut.Math.limit(this._sx, this._x, this._x + this._width);
  this._sy = Cut.Math.limit(this._sy, this._y, this._y + this._height);
  this._sw = Cut.Math.limit(this._sw, 0, this._width + this._x - this._sx);
  this._sh = Cut.Math.limit(this._sh, 0, this._height + this._y - this._sy);

  this._sxr = this._sx * this._ratio;
  this._syr = this._sy * this._ratio;
  this._swr = this._sw * this._ratio;
  this._shr = this._sh * this._ratio;
};

Cut.Out.prototype.sX = function(x) {
  this._dirty = true;
  this._sx = this._x + x;
  return this;
};

Cut.Out.prototype.sY = function(y) {
  this._dirty = true;
  this._sy = this._y + y;
  return this;
};

/**
 * Changes source and dest width.
 */
Cut.Out.prototype.sWidth = function(w) {
  this._dirty = true;
  this._sw = w;
  this._dw = w;
  return this;
};

/**
 * Changes source and dest height.
 */
Cut.Out.prototype.sHeight = function(h) {
  this._dirty = true;
  this._sh = h;
  this._dh = h;
  return this;
};

Cut.Out.prototype.dX = function(x) {
  this._dx = x;
  return this;
};

Cut.Out.prototype.dY = function(y) {
  this._dy = y;
  return this;
};

/**
 * Changes only dest width, effectively scales image horizontally.
 */
Cut.Out.prototype.dWidth = function(width) {
  if (typeof width === 'undefined') {
    return this._dw;
  }
  this._dw = width;
  return this;
};

/**
 * Changes only dest height, effectively scales image vertically.
 */
Cut.Out.prototype.dHeight = function(height) {
  if (typeof height === 'undefined') {
    return this._dh;
  }
  this._dh = height;
  return this;
};

Cut.Out.prototype.render = function(context) {
  Cut._stats.cutout++;
  if (!this._image && this._imagefn) {
    this._image = this._imagefn();
  }
  if (this._dirty) {
    this._update();
  }
  if (!this._image) {
    return;
  }
  try {
    context.drawImage(this._image, // image
    this._sxr, this._syr, this._swr, this._shr, // source
    this._dx, this._dy, this._dw, this._dh // dest
    );
  } catch (e) {
    if (!this._failed) {
      console.log('Unable to render cutout: ' + this + ' ' + this._image);
      this._failed = true;
    }
  }
};

Cut.Out.prototype.clone = function() {
  var clone = Cut._create(Cut.Out.prototype);
  for ( var attr in this)
    if (this.hasOwnProperty(attr))
      clone[attr] = this[attr];
  clone.setup();
  clone._update();
  return clone;
};

Cut.Out.prototype.toString = function() {
  this._update();
  return '[' + this._name + ': ' + this._sx + 'x' + this._sy + '-' + this._sw
      + 'x' + this._sh + '' + this._dx + 'x' + this._dy + '-' + this._dw + 'x'
      + this._dh + ']';
};

Cut.drawing = function() {
  var drawing = Cut.Out.drawing.apply(null, arguments);
  var image = new Cut.image();
  image.drawing = function(fn) {
    return image.image(drawing.drawing(fn));
  };
  return image;
};

Cut.Out.drawing = function(name) {

  var canvas = document.createElement('canvas');
  var cutout = new Cut.Out().image(canvas);
  var context = canvas.getContext('2d');

  cutout.drawing = function(callback) {
    callback.call(this, context);
    return this;
  };

  cutout.size = function(width, height, ratio) {
    ratio = ratio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    cutout.ratio(ratio);
    cutout.setup({
      x : 0,
      y : 0,
      width : width,
      height : height
    });
    return this;
  };

  if (typeof arguments[arguments.length - 1] === 'function') {
    cutout.drawing(arguments[arguments.length - 1]);
  }

  name && cutout.name(name);

  return cutout;
};

Cut.Pin = function(owner) {

  this._owner = owner;
  this._parent = null;

  // relative to parent
  this._relativeMatrix = new Cut.Matrix();

  // relative to root
  this._absoluteMatrix = new Cut.Matrix();

  this.reset();
};

Cut.Pin.prototype.reset = function() {

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

  this._ts_translate = Cut._TS++;
  this._ts_transform = Cut._TS++;
  this._ts_matrix = Cut._TS++;
};

Cut.Pin.prototype.tick = function() {
  this._parent = this._owner._parent && this._owner._parent._pin;

  if (this._handled && this._mo_handle != this._ts_transform) {
    this._mo_handle = this._ts_transform;
    this._ts_translate = Cut._TS++;
  }

  if (this._aligned && this._parent
      && this._mo_align != this._parent._ts_transform) {
    this._mo_align = this._parent._ts_transform;
    this._ts_translate = Cut._TS++;
  }

  return this;
};

Cut.Pin.prototype.toString = function() {
  return this._owner.id() + ' ('
      + (this._parent ? this._parent._owner.id() : null) + ')';
};

Cut.Pin.prototype.absoluteMatrix = function() {
  var ts = Math.max(this._ts_transform, this._ts_translate,
      this._parent ? this._parent._ts_matrix : 0);
  if (this._mo_abs == ts) {
    return this._absoluteMatrix;
  }
  this._mo_abs = ts;

  var abs = this._absoluteMatrix;
  abs.copyFrom(this.relativeMatrix());

  this._parent && abs.concat(this._parent._absoluteMatrix);

  this._ts_matrix = Cut._TS++;

  return abs;
};

Cut.Pin.prototype.relativeMatrix = function() {
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

  if (this._pivoted) {
    // set handle on origin
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;

  } else {
    // set handle on aabb
    var p, q, m = rel;
    if (m.a > 0 && m.c > 0 || m.a < 0 && m.c < 0) {
      p = 0, q = m.a * this._width + m.c * this._height;
    } else {
      p = m.a * this._width, q = m.c * this._height;
    }
    if (p > q) {
      this._boxX = q;
      this._boxWidth = p - q;
    } else {
      this._boxX = p;
      this._boxWidth = q - p;
    }
    if (m.b > 0 && m.d > 0 || m.b < 0 && m.d < 0) {
      p = 0, q = m.b * this._width + m.d * this._height;
    } else {
      p = m.b * this._width, q = m.d * this._height;
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

Cut.Pin.prototype.get = function(a) {
  return Cut.Pin._get(this, a);
};

// TODO: Use get/set or defineProperty instead?
Cut.Pin.prototype.set = function(a, b) {
  if (typeof a === 'string') {
    Cut.Pin._set(this, a, b);
  } else if (typeof a === 'object') {
    for (b in a)
      Cut.Pin._set(this, b, a[b], a);
  }
  if (this._owner) {
    this._owner._ts_pin = Cut._TS++;
    this._owner.touch();
  }
  return this;
};

Cut.Pin._get = function(pin, key) {
  if (typeof (key = Cut.Pin._getters[key]) !== 'undefined') {
    return key.call(Cut.Pin._getters, pin);
  }
};

Cut.Pin._set = function(pin, key, value, all) {
  if (typeof (key = Cut.Pin._setters[key]) !== 'undefined'
      && typeof value !== 'undefined') {
    key.call(Cut.Pin._setters, pin, value, all);
  }
};

Cut.Pin._getters = {
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

Cut.Pin._setters = {
  alpha : function(pin, value) {
    pin._alpha = value;
  },

  textureAlpha : function(pin, value) {
    pin._textureAlpha = value;
  },

  width : function(pin, value) {
    pin._width_ = value;
    pin._width = value;
    pin._ts_transform = Cut._TS++;
  },

  height : function(pin, value) {
    pin._height_ = value;
    pin._height = value;
    pin._ts_transform = Cut._TS++;
  },

  scale : function(pin, value) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = Cut._TS++;
  },

  scaleX : function(pin, value) {
    pin._scaleX = value;
    pin._ts_transform = Cut._TS++;
  },

  scaleY : function(pin, value) {
    pin._scaleY = value;
    pin._ts_transform = Cut._TS++;
  },

  skew : function(pin, value) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = Cut._TS++;
  },

  skewX : function(pin, value) {
    pin._skewX = value;
    pin._ts_transform = Cut._TS++;
  },

  skewY : function(pin, value) {
    pin._skewY = value;
    pin._ts_transform = Cut._TS++;
  },

  rotation : function(pin, value) {
    pin._rotation = value;
    pin._ts_transform = Cut._TS++;
  },

  pivot : function(pin, value) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = Cut._TS++;
  },

  pivotX : function(pin, value) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = Cut._TS++;
  },

  pivotY : function(pin, value) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = Cut._TS++;
  },

  offset : function(pin, value) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = Cut._TS++;
  },

  offsetX : function(pin, value) {
    pin._offsetX = value;
    pin._ts_translate = Cut._TS++;
  },

  offsetY : function(pin, value) {
    pin._offsetY = value;
    pin._ts_translate = Cut._TS++;
  },

  align : function(pin, value) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },

  alignX : function(pin, value) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = Cut._TS++;

    this.handleX(pin, value);
  },

  alignY : function(pin, value) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = Cut._TS++;

    this.handleY(pin, value);
  },

  handle : function(pin, value) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },

  handleX : function(pin, value) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = Cut._TS++;
  },

  handleY : function(pin, value) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = Cut._TS++;
  },

  resizeMode : function(pin, value, all) {
    if (all) {
      if (value == 'in') {
        value = 'in-pad';
      } else if (value == 'out') {
        value = 'out-crop';
      }
      pin._scaleTo(all.resizeWidth, all.resizeHeight, value);
    }
  },

  resizeWidth : function(pin, value, all) {
    if (!all || !all.resizeMode) {
      pin._scaleTo(value, null);
    }
  },

  resizeHeight : function(pin, value, all) {
    if (!all || !all.resizeMode) {
      pin._scaleTo(null, value);
    }
  },

  scaleMode : function(pin, value, all) {
    if (all) {
      pin._scaleTo(all.scaleWidth, all.scaleHeight, value);
    }
  },

  scaleWidth : function(pin, value, all) {
    if (!all || !all.scaleMode) {
      pin._scaleTo(value, null);
    }
  },

  scaleHeight : function(pin, value, all) {
    if (!all || !all.scaleMode) {
      pin._scaleTo(null, value);
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

Cut.Pin.prototype._scaleTo = function(width, height, mode) {
  var w = typeof width === 'number';
  var h = typeof height === 'number';
  var m = typeof mode === 'string';
  var pin = this;
  pin._ts_transform = Cut._TS++;
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

Cut.Matrix = function(a, b, c, d, e, f) {
  this.changed = true;
  this.a = a || 1;
  this.b = b || 0;
  this.c = c || 0;
  this.d = d || 1;
  this.e = e || 0;
  this.f = f || 0;
};

Cut.Matrix.prototype.toString = function() {
  return '[' + this.a + ', ' + this.b + ', ' + this.c + ', ' + this.d + ', '
      + this.e + ', ' + this.f + ']';
};

Cut.Matrix.prototype.clone = function() {
  return new Cut.Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
};

Cut.Matrix.prototype.copyTo = function(m) {
  m.copyFrom(this);
  return this;
};

Cut.Matrix.prototype.copyFrom = function(m) {
  this.changed = true;
  this.a = m.a;
  this.b = m.b;
  this.c = m.c;
  this.d = m.d;
  this.e = m.e;
  this.f = m.f;
  return this;
};

Cut.Matrix.prototype.identity = function() {
  this.changed = true;
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.e = 0;
  this.f = 0;
  return this;
};

Cut.Matrix.prototype.rotate = function(angle) {
  if (!angle) {
    return this;
  }

  this.changed = true;

  var u = angle ? Math.cos(angle) : 1;
  // android bug may give bad 0 values
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
};

Cut.Matrix.prototype.translate = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this.changed = true;
  this.e += x;
  this.f += y;
  return this;
};

Cut.Matrix.prototype.scale = function(x, y) {
  if (!(x - 1) && !(y - 1)) {
    return this;
  }
  this.changed = true;
  this.a *= x;
  this.b *= y;
  this.c *= x;
  this.d *= y;
  this.e *= x;
  this.f *= y;
  return this;
};

Cut.Matrix.prototype.skew = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this.changed = true;

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
};

Cut.Matrix.prototype.concat = function(m) {
  this.changed = true;

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
};

Cut.Matrix.prototype.reverse = function() {
  if (this.changed) {
    this.changed = false;
    this.reversed = this.reversed || new Cut.Matrix();
    var z = this.a * this.d - this.b * this.c;
    this.reversed.a = this.d / z;
    this.reversed.b = -this.b / z;
    this.reversed.c = -this.c / z;
    this.reversed.d = this.a / z;
    this.reversed.e = (this.c * this.f - this.e * this.d) / z;
    this.reversed.f = (this.e * this.b - this.a * this.f) / z;
  }
  return this.reversed;
};

Cut.Matrix.prototype.map = function(p, q) {
  q = q || {};
  q.x = this.a * p.x + this.c * p.y + this.e;
  q.y = this.b * p.x + this.d * p.y + this.f;
  return q;
};

Cut.Matrix.prototype.mapX = function(x, y) {
  return this.a * x + this.c * y + this.e;
};

Cut.Matrix.prototype.mapY = function(x, y) {
  return this.b * x + this.d * y + this.f;
};

Cut.Math = {};

Cut.Math.random = function(min, max) {
  if (typeof min === 'undefined') {
    max = 1, min = 0;
  } else if (typeof max === 'undefined') {
    max = min, min = 0;
  }
  return min == max ? min : Math.random() * (max - min) + min;
};

Cut.Math.rotate = function(num, min, max) {
  if (typeof min === 'undefined') {
    max = 1, min = 0;
  } else if (typeof max === 'undefined') {
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

Cut.Math.length = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

Cut.Math.limit = function(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

module.exports = Cut;
