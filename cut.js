/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

function Cut() {
  if (arguments[0] === Cut.Proto)
    return;

  Cut.CREATED++;

  this._id = "";
  this._visible = true;

  this._parent = null;
  this._next = null;
  this._prev = null;

  this._first = null;
  this._last = null;

  this._pin = new Cut.Pin().tick(this);
  this._outs = [];
  this._tickBefore = [];
  this._tickAfter = [];
  this._spy = false;

  this._alpha = 1;
};

Cut.create = function() {
  return new Cut();
};

Cut.CREATED = 0;
Cut.TICKED;
Cut.PAINTED;
Cut.PASTED;

Cut.Proto = {};

Cut.prototype.render = function(context) {
  Cut.TICKED = 0, Cut.PAINTED = 0, Cut.PASTED = 0;
  this._tick();
  this._paint(context);
};

Cut.prototype._tick = function() {
  if (!this._visible) {
    return;
  }
  this._pin.tick(this);

  var length = this._tickBefore.length;
  for ( var i = 0; i < length; i++) {
    Cut.TICKED++;
    this._tickBefore[i].call(this);
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child._tick();
  }

  var length = this._tickAfter.length;
  for ( var i = 0; i < length; i++) {
    Cut.TICKED++;
    this._tickAfter[i].call(this);
  }
};

Cut.prototype.addTicker = function(ticker, before) {
  if (before) {
    this._tickBefore.push(ticker);
  } else {
    this._tickAfter.push(ticker);
  }
};

Cut.prototype._paint = function(context) {
  if (!this._visible) {
    return;
  }
  Cut.PAINTED++;

  var m = this.matrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

  this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
  var alpha = this._pin._textureAlpha * this._alpha;

  if (context.globalAlpha != alpha) {
    context.globalAlpha = alpha;
  }

  var length = this._outs.length;
  for ( var i = 0; i < length; i++) {
    this._outs[i].paste(context);
  }

  if (context.globalAlpha != this._alpha) {
    context.globalAlpha = this._alpha;
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child._paint(context);
  }
};

Cut.prototype.toString = function() {
  return "[" + this._id + "]";
};

Cut.prototype.id = function(id) {
  if (!arguments.length) {
    return this._id;
  }
  this._id = id;
  return this;
};

Cut.prototype.attr = function(name, value) {
  if (arguments.length < 2) {
    return this._attrs ? this._attrs[name] : undefined;
  }
  (this._attrs ? this._attrs : this._attrs = {})[name] = value;
  return this;
};

Cut.prototype.listen = function(type, listener) {
  var names = type.split(/\s+/);
  for ( var i = 0; i < names.length; i++) {
    type = names[i];
    if (type && typeof listener === "function") {
      this._listeners = this._listeners || {};
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(listener);
    }
  }
  return this;
};

Cut.prototype.listeners = function(type) {
  return this._listeners && this._listeners[type];
};

Cut.prototype.publish = function(name, args) {
  var listeners = this.listeners(name);
  if (!listeners || !listeners.length) {
    return false;
  }
  for ( var l = 0; l < listeners.length; l++) {
    listeners[l].apply(this, args);
  }
  return true;
};

Cut.prototype.visit = function(visitor) {
  var reverse = visitor.reverse;
  var all = !visitor.visible;
  if (visitor.start && visitor.start(this)) {
    return;
  }
  var child, next = reverse ? this.last(all) : this.first(all);
  while (child = next) {
    next = reverse ? child.prev(all) : child.next(all);
    if (child.visit(visitor, reverse)) {
      return true;
    }
  }
  return visitor.end && visitor.end(this);
};

Cut.prototype.visible = function(visible) {
  if (!arguments.length) {
    return this._visible;
  }

  this._visible = visible;
  this._parent && (this._parent._children_ts = Cut._TS++);
  this._pin_ts = Cut._TS++;
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

Cut.prototype.next = function(all) {
  var next = this._next;
  while (next && !all && !next._visible) {
    next = next._next;
  }
  return next;
};

Cut.prototype.prev = function(all) {
  var prev = this._prev;
  while (prev && !all && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Cut.prototype.first = function(all) {
  var next = this._first;
  while (next && !all && !next._visible) {
    next = next._next;
  }
  return next;
};

Cut.prototype.last = function(all) {
  var prev = this._last;
  while (prev && !all && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};

Cut.prototype.appendTo = function(parent) {
  parent.append(this);
  return this;
};

Cut.prototype.prependTo = function(parent) {
  parent.prepend(this);
  return this;
};

Cut.prototype.append = function() {
  for ( var i = 0; i < arguments.length; i++) {
    arguments[i]._insert(this, this._last, null);
  }
  this._children_ts = Cut._TS++;
  this.touch();
  return this;
};

Cut.prototype.prepend = function() {
  for ( var i = 0; i < arguments.length; i++) {
    arguments[i]._insert(this, null, this._first);
  }
  this._children_ts = Cut._TS++;
  this.touch();
  return this;
};

Cut.prototype._insert = function(parent, prev, next) {

  if (prev && prev._parent != parent || next && next._parent != parent) {
    return;
  }

  this.remove();

  prev = prev || (next ? next._prev : parent._last);
  next = next || (prev ? prev._next : null);

  if (prev) {
    prev._next = this;
  } else {
    parent._first = this;
  }
  if (next) {
    next._prev = this;
  } else {
    parent._last = this;
  }

  this._parent = parent;
  this._prev = prev;
  this._next = next;

  this._parent_ts = Cut._TS++;
  this.touch();
};

Cut.prototype.removeChild = function(child) {
  child && child.remove();
};

Cut.prototype.remove = function() {
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
  }

  if (this._parent) {
    this._parent._children_ts = Cut._TS++;
    this._parent.touch();
  }

  this._prev = this._next = this._parent = null;
  this._parent_ts = Cut._TS++;
  // this._parent.touch();

  return this;
};

Cut.prototype.empty = function() {
  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child._prev = child._next = child._parent = null;
  }

  this._first = this._last = null;

  this._children_ts = Cut._TS++;
  this.touch();
  return this;
};

Cut.prototype.touch = function() {
  this._parent && this._parent.touch();
};

Cut.prototype.spy = function(spy) {
  if (!arguments.length) {
    return this._spy;
  }
  this._spy = spy ? true : false;
  return this;
};

Cut.prototype.pin = function() {
  if (!arguments.length) {
    return this._pin;
  }
  var obj = this._pin.update.apply(this._pin, arguments);
  return obj === this._pin ? this : obj;
};

Cut.prototype.matrix = function() {
  return this._pin
      .absoluteMatrix(this, this._parent ? this._parent._pin : null);
};

Cut.image = function(selector) {
  return new Cut.Image().setImage(selector);
};

Cut.Image = function() {
  Cut.Image.prototype._super.apply(this, arguments);
  if (arguments[0] === Cut.Proto)
    return;
};

Cut.Image.prototype = new Cut(Cut.Proto);
Cut.Image.prototype._super = Cut;
Cut.Image.prototype.constructor = Cut.Image;

Cut.Image.prototype.setImage = function(selector) {
  var out = Cut.Out._select(selector);
  this._outs[0] = out;
  this.pin({
    width : this._outs[0] ? this._outs[0].width() : 0,
    height : this._outs[0] ? this._outs[0].height() : 0
  });

  return this;
};

Cut.Image.prototype.cropX = function(w, x) {
  return this.setImage(this._outs[0].cropX(w, x));
};

Cut.Image.prototype.cropY = function(h, y) {
  return this.setImage(this._outs[0].cropY(h, y));
};

Cut.anim = function(selector, fps) {
  var anim = new Cut.Anim().setFrames(selector).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};

Cut.Anim = function() {
  Cut.Anim.prototype._super.apply(this, arguments);
  if (arguments[0] === Cut.Proto)
    return;

  this._fps = Cut.Anim.FPS;
  this._ft = 1000 / this._fps;

  this._time = 0;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  this.addTicker(function() {
    if (this._time && this._frames.length > 1) {
      var t = +new Date() - this._time;
      if (t >= this._ft) {
        var n = t < 2 * this._ft ? 1 : Math.floor(t / this._ft);
        this._time += n * this._ft;
        this.moveFrame(n);
        if (this._repeat && (this._repeat -= n) <= 0) {
          this.stop();
          this._callback && this._callback();
        }
      }
      this.touch();
    }
  }, false);
};

Cut.Anim.prototype = new Cut(Cut.Proto);
Cut.Anim.prototype._super = Cut;
Cut.Anim.prototype.constructor = Cut.Anim;

Cut.Anim.FPS = 22;

Cut.Anim.prototype.fps = function(fps) {
  if (!arguments.length) {
    return this._fps;
  }
  this._fps = fps || Cut.Anim.FPS;
  this._ft = 1000 / this._fps;
  return this;
};

Cut.Anim.prototype.setFrames = function(selector) {
  this._time = this._time || 0;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  var outs = Cut.Out._select(selector, true);
  if (outs && outs.length) {
    for ( var i = 0; i < outs.length; i++) {
      var out = outs[i];
      this._frames.push(out);
      this._labels[outs[i].name] = i;
    }
  }
  return this;
};

Cut.Anim.prototype.gotoFrame = function(frame, resize) {
  frame = Cut.Math.rotate(frame, this._frames.length);
  this._frame = frame;
  resize = resize || !this._outs[0];
  this._outs[0] = this._frames[this._frame];
  if (resize) {
    this.pin({
      width : this._outs[0].width(),
      height : this._outs[0].height()
    });
  }
  this._frame_ts = Cut._TS++;
  this.touch();
  return this;
};

Cut.Anim.prototype.randomFrame = function() {
  return this.gotoFrame(Math.floor(Math.random() * this._frames.length));
};

Cut.Anim.prototype.moveFrame = function(frame) {
  return this.gotoFrame(this._frame + frame);
};

Cut.Anim.prototype.gotoLabel = function(label, resize) {
  return this.gotoFrame(this._labels[label] || 0, resize);
};

Cut.Anim.prototype.repeat = function(repeat, callback) {
  this._repeat = repeat * this._frames.length - 1;
  this._callback = callback;
  return this;
};

Cut.Anim.prototype.play = function(reset) {
  if (!this._time || reset) {
    this._time = +new Date();
    this.gotoFrame(0);
  }
  return this;
};

Cut.Anim.prototype.stop = function(frame) {
  this._time = null;
  if (Cut._isNum(frame)) {
    this.gotoFrame(frame);
  }
  return this;
};

Cut.string = function(selector) {
  return new Cut.String().setFont(selector);
};

Cut.String = function() {
  Cut.String.prototype._super.apply(this, arguments);
  if (arguments[0] === Cut.Proto)
    return;
  this.row();
};

Cut.String.prototype = new Cut(Cut.Proto);
Cut.String.prototype._super = Cut;
Cut.String.prototype.constructor = Cut.String;

Cut.String.prototype.setFont = function(selector) {
  this._font = selector;
  selector = selector.split(":", 2);
  this.prefix = selector.length > 1 ? selector[1] : selector[0];
  return this;
};

Cut.String.prototype.setValue = function(value) {
  if (this.value === value)
    return this;
  this.value = value;

  if (!value.length) {
    value = value + "";
  }

  var child = this._first;
  for ( var i = 0; i < value.length; i++) {
    child = child || Cut.anim(this._font).appendTo(this);
    child.gotoLabel(this.prefix + value[i], true).show();
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
  this.box().pinChildren({
    alignY : align,
    prevX : 1,
    handleX : 0
  });
  this.spacing = function(space) {
    return this.pinChildren({
      alignY : align,
      prevX : 1,
      handleX : 0,
      offsetX : space
    }, {
      offsetX : 0
    });
  };
  return this;
};

Cut.column = function(align) {
  return Cut.create().column(align);
};

Cut.prototype.column = function(align) {
  this.box().pinChildren({
    alignX : align,
    prevY : 1,
    handleY : 0
  });
  this.spacing = function(space) {
    return this.pinChildren({
      alignX : align,
      prevY : 1,
      handleY : 0,
      offsetY : space
    }, {
      offsetY : 0
    });
  };
  return this;
};

Cut.prototype.pinChildren = function(all, first, last) {
  all && Cut._copy(this._pinAll = this._pinAll || {}, all);
  first && Cut._copy(this._pinFirst = this._pinFirst || {}, first);
  last && Cut._copy(this._pinLast = this._pinLast || {}, last);

  this._flowTicker || this.addTicker(this._flowTicker = function() {
    if (this._row_mo == this._children_ts) {
      return;
    }
    this._row_mo = this._children_ts;

    var child;
    if (this._pinAll) {
      var next = this.first();
      while (child = next) {
        next = child.next();
        child.pin(this._pinAll);
      }
    }
    if (this._pinFirst && (child = this.first())) {
      child.pin(this._pinFirst);
    }
    if (this._pinLast && (child = this.last())) {
      child.pin(this._pinLast);
    }
  }, true);
  return this;
};

Cut.box = function() {
  return new Cut.create().box();
};

Cut.prototype.box = function() {
  if (this._boxTicker)
    return this;

  var touched = false;

  var touch = this.touch;
  this.touch = function() {
    touched = true;
    touch.apply(this, arguments);
  };

  this.addTicker(this._boxTicker = function() {
    if (!touched)
      return;
    touched = false;

    this._xMax = -(this._xMin = Infinity);
    this._yMax = -(this._yMin = Infinity);

    var v = false;
    var child, next = this.first();
    while (child = next) {
      next = child.next();
      child.matrix();
      if (this._xMin > (v = child._pin._x)) {
        this._xMin = v;
      }
      if (this._xMax < (v = child._pin._x + child._pin._boxWidth)) {
        this._xMax = v;
      }
      if (this._yMin > (v = child._pin._y)) {
        this._yMin = v;
      }
      if (this._yMax < (v = child._pin._y + child._pin._boxHeight)) {
        this._yMax = v;
      }
      v = true;
    }

    if (v) {
      // avoid cyclic update
      if (this.pin("width") != this._xMax - this._xMin) {
        this.pin("width", this._xMax - this._xMin);
      }
      if (this.pin("height") != this._yMax - this._yMin) {
        this.pin("height", this._yMax - this._yMin);
      }
    }
  });
  return this;
};

Cut.ninePatch = function(selector) {
  return new Cut.NinePatch().setImage(selector);
};

Cut.NinePatch = function() {
  Cut.NinePatch.prototype._super.apply(this, arguments);
  if (arguments[0] === Cut.Proto)
    return;
};

Cut.NinePatch.prototype = new Cut(Cut.Proto);
Cut.NinePatch.prototype._super = Cut;
Cut.NinePatch.prototype.constructor = Cut.NinePatch;

Cut.NinePatch.prototype.setImage = function(selector) {
  this._out = Cut.Out._select(selector);
  this._columns = [];
  this._rows = [];
  this.outer(this._out.width(), this._out.height());
  return this;
};

Cut.NinePatch.prototype.inner = function(width, height) {
  return this.outer(width + this._out.left + this._out.right, height
      + this._out.top + this._out.bottom);
};

Cut.NinePatch.prototype.outer = function(width, height) {

  if (Cut._isNum(width)) {
    var left = this._out.left;
    var right = this._out.right;
    width = Math.max(width, left + right);
    this._columns.length = 0;
    var maxw = this._out.width();
    var x, rx, l, r, w;
    x = 0, l = 0, r = right;
    while (x < width) {
      rx = width - x;
      w = maxw - l;
      if (w < rx) {
        w -= right;
      } else if (rx < w) {
        if (!right) { // no right: left
          w = rx, l = 0;
        } else if (!left) { // no left: right
          w = rx, l = maxw - w;
        } else if (l == 0) { // left & right & first: left & -right
          w = rx - right;
        } else { // left & right & !first: right
          w = rx, l = maxw - w;
        }
        w = rx - r;
      }
      this._columns.push([ w, l, x ]);
      x += w, l = left, r = 0;
    }
    this.pin("width", width);
  }

  if (Cut._isNum(height)) {
    var top = this._out.top;
    var bottom = this._out.bottom;
    height = Math.max(height, top + bottom);
    this._rows.length = 0;
    var maxh = this._out.height();
    var y, ry, t, b, h;
    y = 0, t = 0, b = bottom;
    while (y < height) {
      ry = height - y;
      h = maxh - t;
      if (h < ry) {
        h -= bottom;
      } else if (ry < h) {
        if (!bottom) {
          h = ry, t = 0;
        } else if (!top) {
          h = ry, t = maxh - h;
        } else if (t == 0) {
          h = ry - bottom;
        } else {
          h = ry, t = maxh - h;
        }
        h = ry - b;
      }
      this._rows.push([ h, t, y ]);
      y += h, t = top, b = 0;
    }
    this.pin("height", height);
  }

  var c = 0;
  for ( var i = 0; i < this._columns.length; i++) {
    var col = this._columns[i];
    for ( var j = 0; j < this._rows.length; j++) {
      var row = this._rows[j];
      this._outs[c] = this._outs[c] || this._out.clone();
      this._outs[c].cropX(col[0], col[1]).cropY(row[0], row[1]).offset(col[2],
          row[2]);
      c++;
    }
  }

  return this;
};

Cut._images = {};

Cut.loadImages = function(loader, callback) {
  var loading = 0;

  var textures = Cut._textures;
  for ( var texture in textures) {
    if (textures[texture].imagePath) {
      loading++;
      var src = textures[texture].imagePath;
      var image = loader(src, complete, error);
      Cut.addImage(image, src);
    }
  }

  function complete() {
    DEBUG && console.log("Loading image completed.");
    done();
  }

  function error(msg) {
    DEBUG && console.log("Error loading image: " + msg);
    done();
  }

  function done() {
    if (--loading <= 0) {
      callback && callback();
    }
  }
};

Cut.getImage = function(src) {
  return Cut._images[src];
};

Cut.addImage = function(image, src) {
  Cut._images[src] = image;
  return this;
};

Cut._textures = {};

Cut.addTexture = function() {
  for ( var i = 0; i < arguments.length; i++) {
    var texture = arguments[i];
    Cut._textures[texture.name] = texture;
    Cut.Out._cache[texture.name] = {};

    texture.getImage = function() {
      if (!this._image) {
        this._image = Cut.getImage(this.imagePath);
      }
      return this._image;
    };

    var ratio = texture.ratio || 1;
    var sprite;
    if (texture.filter) {
      for ( var c = texture.sprites.length - 1; c >= 0; c--) {
        if (sprite = texture.filter(texture.sprites[c])) {
          texture.sprites[c] = sprite;
          sprite.x *= ratio, sprite.y *= ratio;
          sprite.w *= ratio, sprite.h *= ratio;
          sprite.width *= ratio, sprite.height *= ratio;
          sprite.top *= ratio, sprite.bottom *= ratio;
          sprite.left *= ratio, sprite.right *= ratio;
        } else {
          texture.sprites.splice(c, 1);
        }
      }
    }
  }
  return this;
};

Cut.Out = function(texture, sprite) {

  this.texture = texture;
  this.sprite = sprite;
  this.ratio = texture.imageRatio || 1;
  this.name = sprite.name;

  sprite.w = sprite.w || sprite.width;
  sprite.h = sprite.h || sprite.height;

  this.sx = sprite.x * this.ratio;
  this.sy = sprite.y * this.ratio;

  this.sw = sprite.w * this.ratio;
  this.sh = sprite.h * this.ratio;

  this.dx = 0;
  this.dy = 0;

  this.dw = sprite.w;
  this.dh = sprite.h;

  this.top = (sprite.top || 0);
  this.bottom = (sprite.bottom || 0);

  this.left = (sprite.left || 0);
  this.right = (sprite.right || 0);
};

Cut.Out.prototype.clone = function() {
  return new Cut.Out(this.texture, this.sprite);
};

Cut.Out.prototype.width = function() {
  return this.dw;
};

Cut.Out.prototype.height = function() {
  return this.dh;
};

Cut.Out.prototype.cropX = function(w, x) {
  x = x || 0;
  this.sx = (this.sprite.x + x) * this.ratio;
  this.dw = Math.min(this.sprite.w - x, w);
  this.sw = this.dw * this.ratio;
  return this;
};

Cut.Out.prototype.cropY = function(h, y) {
  y = y || 0;
  this.sy = (this.sprite.y + y) * this.ratio;
  this.dh = Math.min(this.sprite.h - y, h);
  this.sh = this.dh * this.ratio;
  return this;
};

Cut.Out.prototype.offset = function(x, y) {
  this.dx = x;
  this.dy = y;
  return this;
};

Cut.Out.prototype.paste = function(context) {
  Cut.PASTED++;
  context.drawImage(this.texture.getImage(), // source
  this.sx, this.sy, this.sw, this.sh, // cut
  this.dx, this.dy, this.dw, this.dh // position
  );
};

Cut.Out.prototype.toString = function() {
  return "[" + this.name + ": " + this.dw + "x" + this.dh + "]";
};

Cut.Out._cache = {};

Cut.Out._select = function(selector, prefix) {

  if (typeof selector !== "string") {
    return selector;
  }

  selector = selector.split(":", 2);
  if (selector.length < 2) {
    return null;
  }

  var texture = selector[0];
  var name = selector[1];

  texture = Cut._textures[texture];
  if (texture == null) {
    return !prefix ? null : [];
  }

  var sprites = texture.sprites;

  if (!prefix) {
    var selected = Cut.Out._cache[texture.name][name + "$"];
    if (typeof selected === "undefined") {
      for ( var i = 0; i < sprites.length; i++) {
        if (sprites[i].name == name) {
          selected = sprites[i];
          break;
        }
      }
      Cut.Out._cache[texture.name][name + "$"] = selected;
    }
    return selected ? new Cut.Out(texture, selected) : null;

  } else {
    var selected = Cut.Out._cache[texture.name][name + "*"];
    if (typeof selected === "undefined") {
      selected = [];
      var length = name.length;
      for ( var i = 0; i < sprites.length; i++) {
        var cut = sprites[i];
        if (cut.name && cut.name.substring(0, length) == name) {
          selected.push(sprites[i]);
        }
      }
      Cut.Out._cache[texture.name][name + "*"] = selected;
    }
    var result = [];
    for ( var i = 0; i < selected.length; i++) {
      result.push(new Cut.Out(texture, selected[i]));
    }
    return result;
  }
};

Cut.Pin = function() {

  this._owner = null;
  this._parent = null;

  // relative to parent
  this._relativeMatrix = new Cut.Matrix();

  // relative to root
  this._absoluteMatrix = new Cut.Matrix();

  // no-translation
  this._boxMatrix = new Cut.Matrix();

  this.reset();
};

Cut.Pin.EMPTY = {};

Cut.Pin.prototype.reset = function() {

  this._textureAlpha = 1;
  this._alpha = 1;

  this._width = 0;
  this._height = 0;

  this._scaleX = 1;
  this._scaleY = 1;
  this._skewX = 0;
  this._skewX = 0;
  this._rotation = 0;

  // scale/skew/rotate center %
  this._pivoted = false;
  this._pivotX = null;
  this._pivotY = null;

  // positioning center %
  this._handled = false;
  this._handleX = 0;
  this._handleY = 0;

  // alignment to parent %
  this._aligned = false;
  this._alignX = 0;
  this._alignY = 0;
  this._alignToX = null;
  this._alignToY = null;

  // as seen by parent px
  this._offsetX = 0;
  this._offsetY = 0;

  // calculated bounding box as seen by parent
  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;

  this._translate_ts = Cut._TS++;
  this._transform_ts = Cut._TS++;
  this._matrix_ts = Cut._TS++;
};

Cut.Pin.prototype.tick = function(owner) {
  this._owner = owner;
  this._parent = owner._parent && owner._parent._pin;

  if (this._handled && this._handle_mo != this._transform_ts) {
    this._handle_mo = this._transform_ts;
    this._translate_ts = Cut._TS++;
  }

  if (this._aligned) {
    this._baseX = this._parent;
    if (!this._alignToX) {
    } else if (this._alignToX == "next") {
      if (this._baseX = owner.next()) {
        this._baseX = this._baseX._pin;
      }
    } else if (this._alignToX == "prev") {
      if (this._baseX = owner.prev()) {
        this._baseX = this._baseX._pin;
      }
    }

    this._baseY = this._parent;
    if (!this._alignToY) {
    } else if (this._alignToY == "next") {
      if (this._baseY = owner.next()) {
        this._baseY = this._baseY._pin;
      }
    } else if (this._alignToY == "prev") {
      if (this._baseY = owner.prev()) {
        this._baseY = this._baseY._pin;
      }
    }

    var ts;

    if (this._baseX) {
      ts = Math.max(this._baseX._translate_ts, this._baseX._transform_ts);
      if (this._alignX_mo != ts) {
        this._alignX_mo = ts;
        this._translate_ts = Cut._TS++;
      }
    }

    if (this._baseY) {
      ts = Math.max(this._baseY._translate_ts, this._baseY._transform_ts);
      if (this._alignY_mo != ts) {
        this._alignY_mo = ts;
        this._translate_ts = Cut._TS++;
      }
    }
  }

  return this;
};

Cut.Pin.prototype.toString = function() {
  return this._owner.id() + " [" + this._alignX + ", " + this._alignY + "] ["
      + this._handleX + ", " + this._handleY + "] ["
      + (this._baseX ? (this._baseX._owner.id()) : null) + ", "
      + (this._baseY ? (this._baseY._owner.id()) : null) + "]";
};

Cut.Pin.prototype.absoluteMatrix = function() {
  var ts = Math.max(this._transform_ts, this._translate_ts,
      this._parent ? this._parent._matrix_ts : 0);
  if (this._abs_mo == ts) {
    return this._absoluteMatrix;
  }
  this._abs_mo = ts;

  var abs = this._absoluteMatrix;
  abs.copyFrom(this.relativeMatrix());

  this._parent && abs.concat(this._parent._absoluteMatrix);

  this._matrix_ts = Cut._TS++;

  return abs;
};

Cut.Pin.prototype.relativeMatrix = function() {
  var ts = Math.max(this._transform_ts, this._translate_ts);
  if (this._rel_mo == ts) {
    return this._relativeMatrix;
  }
  this._rel_mo = ts;

  var rel = this._relativeMatrix;

  rel.identity();
  if (this._pivoted) {
    rel.translate(-this._pivotX * this._width, -this._pivotY * this._height);
  }
  rel.scale(this._scaleX, this._scaleY);
  rel.rotate(this._rotation);
  rel.skew(this._skewX, this._skewX);
  if (this._pivoted) {
    rel.translate(this._pivotX * this._width, this._pivotY * this._height);
  }

  this.boxMatrix();

  this._x = this._offsetX - this._boxX;
  this._y = this._offsetY - this._boxY;

  if (this._handled) {
    this._x -= this._handleX * this._boxWidth;
    this._y -= this._handleY * this._boxHeight;
  }

  if (this._aligned && this._baseX) {
    this._baseX.relativeMatrix();
    this._x += this._alignX * this._baseX._width;
    if (this._baseX !== this._parent) {
      this._x += this._baseX._x;
    }
  }

  if (this._aligned && this._baseY) {
    this._baseY.relativeMatrix();
    this._y += this._alignY * this._baseY._height;
    if (this._baseY !== this._parent) {
      this._y += this._baseY._y;
    }
  }

  rel.translate(this._x, this._y);

  return this._relativeMatrix;
};

Cut.Pin.prototype.boxMatrix = function() {
  if (this._box_mo == this._transform_ts) {
    return;
  }
  this._box_mo = this._transform_ts;

  if (this._pivoted) {
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;
    return;
  }

  var m = this._boxMatrix;
  m.identity();
  m.scale(this._scaleX, this._scaleY);
  m.rotate(this._rotation);
  m.skew(this._skewX, this._skewX);

  var p, q;
  if (m.a > 0 && m.c > 0 || m.a < 0 && m.c < 0) {
    p = 0, q = m.a * this._width + m.c * this._height;
  } else {
    p = m.a * this._width, q = m.c * this._height;
  }
  this._boxX = Math.min(p, q);
  this._boxWidth = Math.abs(p - q);

  if (m.b > 0 && m.d > 0 || m.b < 0 && m.d < 0) {
    p = 0, q = m.b * this._width + m.d * this._height;
  } else {
    p = m.b * this._width, q = m.d * this._height;
  }
  this._boxY = Math.min(p, q);
  this._boxHeight = Math.abs(p - q);
};

Cut.Pin.prototype.update = function() {
  this._transformed = false;
  this._translated = false;

  if (arguments.length == 1) {
    var pin = arguments[0];
    if (typeof pin === "string") {
      return this["_" + pin];
    }

    if (typeof pin === "object") {
      var value;
      for ( var key in pin) {
        value = pin[key];
        var setter = Cut.Pin._setters[key];
        if (setter) {
          if (value || value === 0)
            setter.call(Cut.Pin._setters, this, value, pin);
        } else {
          DEBUG && console.log("Invalid pin: " + key + "/" + value);
        }
      }
    }

  } else if (arguments.length == 2) {
    var key = arguments[0];
    var value = arguments[1];
    var setter = Cut.Pin._setters[key];
    if (setter) {
      if (value || value === 0)
        setter.call(Cut.Pin._setters, this, value, Cut.Pin.EMPTY);
    } else {
      DEBUG && console.log("Invalid pin: " + key + "/" + value);
    }
  }

  if (this._translated) {
    this._translated = false;
    this._translate_ts = Cut._TS++;
  }
  if (this._transformed) {
    this._transformed = false;
    this._transform_ts = Cut._TS++;
    if (this._owner) {
      this._owner._pin_ts = Cut._TS++;
      this._owner.touch();
    }
  }

  return this;
};

Cut.Pin._setters = {
  alpha : function(pin, value, set) {
    pin._alpha = value;
  },

  textureAlpha : function(pin, value, set) {
    pin._textureAlpha = value;
  },

  width : function(pin, value, set) {
    pin._width_ = value;
    pin._width = value;
    pin._transformed = true;
  },

  height : function(pin, value, set) {
    pin._height_ = value;
    pin._height = value;
    pin._transformed = true;
  },

  scale : function(pin, value, set) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._transformed = true;
  },

  scaleX : function(pin, value, set) {
    pin._scaleX = value;
    pin._transformed = true;
  },

  scaleY : function(pin, value, set) {
    pin._scaleY = value;
    pin._transformed = true;
  },

  skew : function(pin, value, set) {
    pin._skewX = value;
    pin._skewY = value;
    pin._transformed = true;
  },

  skewX : function(pin, value, set) {
    pin._skewX = value;
    pin._transformed = true;
  },

  skewY : function(pin, value, set) {
    pin._skewY = value;
    pin._transformed = true;
  },

  rotation : function(pin, value, set) {
    pin._rotation = value;
    pin._transformed = true;
  },

  pivot : function(pin, value, set) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._transformed = true;
  },

  pivotX : function(pin, value, set) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._transformed = true;
  },

  pivotY : function(pin, value, set) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._transformed = true;
  },

  offset : function(pin, value, set) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._translated = true;
  },

  offsetX : function(pin, value, set) {
    pin._offsetX = value;
    pin._translated = true;
  },

  offsetY : function(pin, value, set) {
    pin._offsetY = value;
    pin._translated = true;
  },

  resizeMode : function(pin, value, set) {
    if (Cut._isNum(set.resizeWidth) && Cut._isNum(set.resizeHeight)) {
      this.resizeWidth(pin, set.resizeWidth, set, true);
      this.resizeHeight(pin, set.resizeHeight, set, true);
      if (value == "out") {
        pin._scaleX = pin._scaleY = Math.max(pin._scaleX, pin._scaleY);
        pin._width = obj.resizeWidth / pin._scaleX;
        pin._height = obj.resizeHeight / pin._scaleY;
      } else if (value == "in") {
        pin._scaleX = pin._scaleY = Math.min(pin._scaleX, pin._scaleY);
        pin._width = obj.resizeWidth / pin._scaleX;
        pin._height = obj.resizeHeight / pin._scaleY;
      }
    }
  },

  resizeWidth : function(pin, value, set, force) {
    if (set.resizeMode && !force) {
      return;
    }
    pin._scaleX = value / pin._width_;
    pin._width = value / pin._scaleX;
    pin._transformed = true;
  },

  resizeHeight : function(pin, value, set, force) {
    if (set.resizeMode && !force) {
      return;
    }
    pin._scaleY = value / pin._height_;
    pin._height = value / pin._scaleY;
    pin._transformed = true;
  },

  scaleMode : function(pin, value, set) {
    if (Cut._isNum(set.scaleWidth) && Cut._isNum(set.scaleHeight)) {
      this.scaleWidth(pin, set.scaleWidth, set, true);
      this.scaleHeight(pin, set.scaleHeight, set, true);
      if (value == "out") {
        pin._scaleX = pin._scaleY = Math.max(pin._scaleX, pin._scaleY);
      } else if (value == "in") {
        pin._scaleX = pin._scaleY = Math.min(pin._scaleX, pin._scaleY);
      }
    }
  },

  scaleWidth : function(pin, value, set, force) {
    if (set.scaleMode && !force) {
      return;
    }
    pin._scaleX = value / pin._width_;
    pin._transformed = true;
  },

  scaleHeight : function(pin, value, set, force) {
    if (set.scaleMode && !force) {
      return;
    }
    pin._scaleY = value / pin._height_;
    pin._transformed = true;
  },

  resizeMode : function(pin, value, obj) {

  },

  resizeHeight : function(pin, value, obj) {

  },

  resizeWidth : function(pin, value, obj) {
    if (!Cut._isNum(obj.resizeWidth) || !Cut._isNum(obj.resizeHeight)) {
      return;
    }
    var w = obj.resizeWidth, h = obj.resizeHeight, mode = obj.resizeMode;
    if (mode == "out") {
      pin._scaleX = pin._scaleY = Math.max(w / pin._width, h / pin._height);
    } else if (mode == "in") {
      pin._scaleX = pin._scaleY = Math.min(w / pin._width, h / pin._height);
    } else {
      pin._scaleX = w / pin._width;
      pin._scaleY = h / pin._height;
    }
    pin._width = w / pin._scaleX;
    pin._height = h / pin._scaleY;

    pin._transformed = true;
  },

  next : function(pin, value, set) {
    return this.align.apply(this, Array.prototype.slice.cset(arguments).concat(
        [ "next" ]));
  },

  nextX : function(pin, value, set) {
    return this.alignX.apply(this, Array.prototype.slice.call(arguments)
        .concat([ "next" ]));
  },

  nextY : function(pin, value, set) {
    return this.alignY.apply(this, Array.prototype.slice.call(arguments)
        .concat([ "next" ]));
  },

  prev : function(pin, value, set) {
    return this.align.apply(this, Array.prototype.slice.call(arguments).concat(
        [ "prev" ]));
  },

  prevX : function(pin, value, set) {
    return this.alignX.apply(this, Array.prototype.slice.call(arguments)
        .concat([ "prev" ]));
  },

  prevY : function(pin, value, set) {
    return this.alignY.apply(this, Array.prototype.slice.call(arguments)
        .concat([ "prev" ]));
  },

  parent : function(pin, value, set) {
    return this.align.apply(this, arguments);
  },

  parentX : function(pin, value, all) {
    return this.alignX.apply(this, arguments);
  },

  parentY : function(pin, value, set) {
    return this.alignY.apply(this, arguments);
  },

  align : function(pin, value, set, to) {
    this.alignX.apply(this, arguments);
    this.alignY.apply(this, arguments);
  },

  alignX : function(pin, value, set, to) {
    pin._alignToX = to;
    pin._alignX = value;
    pin._aligned = true;
    pin._translated = true;

    this.handleX(pin, value, set);
  },

  alignY : function(pin, value, set, to) {
    pin._alignToY = to;
    pin._alignY = value;
    pin._aligned = true;
    pin._translated = true;

    this.handleY(pin, value, set);
  },

  handle : function(pin, value, set) {
    this.handleX(pin, value, set);
    this.handleY(pin, value, set);
  },

  handleX : function(pin, value, set) {
    pin._handleX = value;
    pin._handled = true;
    pin._translated = true;
  },

  handleY : function(pin, value, set) {
    pin._handleY = value;
    pin._handled = true;
    pin._translated = true;
  }

};

Cut.Matrix = function(a, b, c, d, tx, ty) {
  this.changed = true;
  this.a = a || 1;
  this.b = b || 0;
  this.c = c || 0;
  this.d = d || 1;
  this.tx = tx || 0;
  this.ty = ty || 0;
};

Cut.Matrix.prototype.toString = function() {
  return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", "
      + this.tx + ", " + this.ty + "]";
};

Cut.Matrix.prototype.clone = function() {
  return new Cut.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
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
  this.tx = m.tx;
  this.ty = m.ty;
  return this;
};

Cut.Matrix.prototype.identity = function() {
  this.changed = true;
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.tx = 0;
  this.ty = 0;
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
  var tx = u * this.tx - v * this.ty;
  var ty = u * this.ty + v * this.tx;

  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.tx = tx;
  this.ty = ty;

  return this;
};

Cut.Matrix.prototype.translate = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this.changed = true;
  this.tx += x;
  this.ty += y;
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
  this.tx *= x;
  this.ty *= y;
  return this;
};

Cut.Matrix.prototype.skew = function(b, c) {
  if (!b && !c) {
    return this;
  }
  this.changed = true;
  this.a += this.b * c;
  this.d += this.c * b;
  this.b += this.a * b;
  this.c += this.d * c;
  this.tx += this.ty * c;
  this.ty += this.tx * b;
  return this;
};

Cut.Matrix.prototype.concat = function(m) {
  this.changed = true;

  var a = this.a * m.a + this.b * m.c;
  var b = this.b * m.d + this.a * m.b;
  var c = this.c * m.a + this.d * m.c;
  var d = this.d * m.d + this.c * m.b;
  var tx = this.tx * m.a + m.tx + this.ty * m.c;
  var ty = this.ty * m.d + m.ty + this.tx * m.b;

  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.tx = tx;
  this.ty = ty;

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
    this.reversed.tx = (this.c * this.ty - this.tx * this.d) / z;
    this.reversed.ty = (this.tx * this.b - this.a * this.ty) / z;
  }
  return this.reversed;
};

Cut.Matrix.prototype.map = function(p, q) {
  q = q || {};
  q.x = this.a * p.x + this.c * p.y + this.tx;
  q.y = this.b * p.x + this.d * p.y + this.ty;
  return q;
};

Cut.Matrix.prototype.mapX = function(x, y) {
  return this.a * x + this.c * y + this.tx;
};

Cut.Matrix.prototype.mapY = function(x, y) {
  return this.b * x + this.d * y + this.ty;
};

Cut.Player = {
  play : function(root, render, request) {

    var paused = true, touched = false;

    root.touch = function() {
      touched = true;
      resume();
    };

    function tick() {
      if (paused === true) {
        return;
      }
      touched = false;
      render(root);
      request(tick);
      if (!touched) {
        pause();
      }
    }

    function pause() {
      paused = true;
    }

    function resume(force) {
      if (paused || force) {
        paused = false;
        request(tick);
      }
    }

    resume();

    return {
      pause : pause,
      resume : resume
    };
  }
};

Cut.Math = {};

Cut.Math.random = function(min, max) {
  if (arguments.length == 0) {
    max = 1, min = 0;
  } else if (arguments.length == 1) {
    max = min, min = 0;
  }
  if (min == max) {
    return min;
  }
  return Math.random() * (max - min) + min;
};

Cut.Math.rotate = function(num, min, max) {
  max = max || 0;
  if (max > min) {
    return (num - min) % (max - min) + (num < min ? max : min);
  } else {
    return (num - max) % (min - max) + (num < max ? min : max);
  }
};

Cut.Math.length = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

Cut._TS = 0;

Cut._isNum = function(x) {
  return typeof x === "number";
};

Cut._isFunc = function(x) {
  return typeof x === "function";
};

Cut._copy = function(to, from, attribs) {

  if (attribs) {
    for ( var i = 0; i < attribs.length; i++) {
      var attr = attribs[i];
      to[attr] = from[attr];
    }
  } else {
    for ( var attr in from) {
      to[attr] = from[attr];
    }
  }
  return to;
};
