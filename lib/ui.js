/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
var Pin = require('./pin');

var stats = require('./util/stats');
var repeat = require('./util/repeat');
var create = require('./util/create');
var extend = require('./util/extend');
var math = require('./util/math');
var is = require('./util/is');

Cut.prototype._textures = null;
Cut.prototype._tickBefore = null;
Cut.prototype._tickAfter = null;
Cut.prototype._alpha = 1;

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

  if (this._tickBefore !== null) {
    for (var i = 0, n = this._tickBefore.length; i < n; i++) {
      stats.tick++;
      ticked = this._tickBefore[i].call(this, elapsed, now, last) === true
          || ticked;
    }
  }

  var child, next = this._first;
  while (child = next) {
    next = child._next;
    ticked = child._tick(elapsed, now, last) === true ? true : ticked;
  }

  if (this._tickAfter !== null) {
    for (var i = 0, n = this._tickAfter.length; i < n; i++) {
      stats.tick++;
      ticked = this._tickAfter[i].call(this, elapsed, now, last) === true
          || ticked;
    }
  }

  return ticked;
};

Cut.prototype.tick = function(ticker, before) {
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
};

Cut.prototype.untick = function(ticker) {
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

Cut.prototype.render = function(context) {
  if (!this._visible) {
    return;
  }
  stats.node++;

  var m = this._pin.absoluteMatrix();
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

Root._super = Cut;
Root.prototype = create(Root._super.prototype);

Cut.root = function(request, render) {
  return new Root(request, render);
};

function Root(request, render) {
  Root._super.call(this);

  this._paused = true;

  var self = this;
  var lastTime = 0;
  var loop = function(now) {
    if (self._paused === true) {
      return;
    }

    stats.tick = stats.node = stats.draw = 0;

    var last = lastTime || now;
    var elapsed = now - last;
    lastTime = now;

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

    stats.fps = elapsed ? 1000 / elapsed : 0;
  };

  this.request = function() {
    request(loop);
  };
};

Root.prototype.start = function() {
  return this.resume();
};

Root.prototype.resume = function(force) {
  if (this._paused || force) {
    this._paused = false;
    this.request();
  }
  return this;
};

Root.prototype.pause = function() {
  this._paused = true;
  return this;
};

Root.prototype.touch = function() {
  this.resume();
  return Root._super.prototype.touch.call(this);
};

Root.prototype.background = function(color) {
  // to be implemented by loaders
  return this;
};

Root.prototype.viewport = function(width, height, ratio) {
  if (typeof width === 'undefined') {
    return extend({}, this._viewport);
  }
  this._viewport = {
    width : width,
    height : height,
    ratio : ratio || 1
  };
  this._updateViewbox();
  var data = extend({}, this._viewport);
  this.visit({
    start : function(node) {
      if (!node._flag('viewport')) {
        return true;
      }
      node.publish('viewport', [ data ]);
    }
  });
  return this;
};

// TODO: static/fixed viewbox
Root.prototype.viewbox = function(width, height, mode) {
  this._viewbox = {
    width : width,
    height : height,
    mode : /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
  };
  this._updateViewbox();
  return this;
};

Root.prototype._updateViewbox = function() {
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

Cut.image = function(image) {
  var img = new Image();
  image && img.image(image);
  return img;
};

Image._super = Cut;
Image.prototype = create(Image._super.prototype);

function Image() {
  Image._super.call(this);
  this._textures = [];
  this._image = null;
};

/**
 * @deprecated Use image
 */
Image.prototype.setImage = function(a, b, c) {
  return this.image(a, b, c);
};

Image.prototype.image = function(image) {
  this._image = Cut.texture(image);
  this.pin('width', this._image ? this._image.width : 0);
  this.pin('height', this._image ? this._image.height : 0);
  this._textures[0] = this._image.pipe();
  this._textures.length = 1;
  return this;
};

Image.prototype.tile = function(inner) {
  this._repeat(false, inner);
  return this;
};

Image.prototype.stretch = function(inner) {
  this._repeat(true, inner);
  return this;
};

Image.prototype._repeat = function(stretch, inner) {
  var self = this;
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    if (this._mo_stretch == this._pin._ts_transform) {
      return;
    }
    this._mo_stretch = this._pin._ts_transform;
    var width = this.pin('width');
    var height = this.pin('height');
    this._textures.length = repeat(this._image, width, height, stretch, inner,
        insert);
  });

  function insert(i, sx, sy, sw, sh, dx, dy, dw, dh) {
    var repeat = self._textures.length > i ? self._textures[i]
        : self._textures[i] = self._image.pipe();
    repeat.src(sx, sy, sw, sh);
    repeat.dest(dx, dy, dw, dh);
  }
};

Cut.anim = function(frames, fps) {
  var anim = new Anim();
  anim.frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};

Anim._super = Cut;
Anim.prototype = create(Anim._super.prototype);

Anim.FPS = 12;

function Anim() {
  Anim._super.call(this);

  this._textures = [];

  this._fps = Anim.FPS;
  this._ft = 1000 / this._fps;

  this._time = -1;
  this._repeat = 0;

  this._index = 0;
  this._frames = [];

  var lastTime = 0;
  this.tick(function(t, now, last) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }

    // ignore old elapsed
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
};

Anim.prototype.fps = function(fps) {
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
Anim.prototype.setFrames = function(a, b, c) {
  return this.frames(a, b, c);
};

Anim.prototype.frames = function(frames) {
  this._index = 0;
  this._frames = Cut.texture(frames, []);
  this.touch();
  return this;
};

Anim.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};

Anim.prototype.gotoFrame = function(frame, resize) {
  this._index = math.rotate(frame, this._frames.length) | 0;
  resize = resize || !this._textures[0];
  this._textures[0] = this._frames[this._index];
  if (resize) {
    this.pin('width', this._textures[0].width);
    this.pin('height', this._textures[0].height);
  }
  this.touch();
  return this;
};

Anim.prototype.moveFrame = function(move) {
  return this.gotoFrame(this._index + move);
};

Anim.prototype.repeat = function(repeat, callback) {
  this._repeat = repeat * this._frames.length - 1;
  this._callback = callback;
  this.play();
  return this;
};

Anim.prototype.play = function(frame) {
  if (typeof frame !== 'undefined') {
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
  if (typeof frame !== 'undefined') {
    this.gotoFrame(frame);
  }
  return this;
};

Cut.string = function(frames) {
  return new Str().frames(frames);
};

Str._super = Cut;
Str.prototype = create(Str._super.prototype);

function Str() {
  Str._super.call(this);
  this._textures = [];
};

/**
 * @deprecated Use frames
 */
Str.prototype.setFont = function(a, b, c) {
  return this.frames(a, b, c);
};

Str.prototype.frames = function(frames) {
  if (typeof frames == 'string') {
    this._frames = function(value) {
      return Cut.texture(frames, value);
    };
  } else if (typeof frames === 'object') {
    this._frames = function(value) {
      return frames[value];
    };
  } else if (typeof frames === 'function') {
    this._frames = frames;
  }
  return this;
};

/**
 * @deprecated Use value
 */
Str.prototype.setValue = function(a, b, c) {
  return this.value(a, b, c);
};

Str.prototype.value = function(value) {
  if (typeof value === 'undefined') {
    return this._value;
  }
  if (this._value === value) {
    return this;
  }
  this._value = value;

  if (value === null) {
    value = '';
  } else if (typeof value !== 'string' && !is.array(value)) {
    value = value.toString();
  }

  this._spacing = this._spacing || 0;

  var width = 0, height = 0;
  for (var i = 0; i < value.length; i++) {
    var image = this._frames(value[i]);
    var repeat = this._textures.length > i ? this._textures[i]
        : this._textures[i] = image.pipe();
    width += i > 0 ? this._spacing : 0;
    repeat.src(image.width, image.height);
    repeat.dest(width, 0);
    width = width + image.width;
    height = Math.max(height, image.height);
  }
  this.pin('width', width);
  this.pin('height', height);
  this._textures.length = value.length;
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
  return Cut.create().sequence(type, align);
};

Cut.prototype.sequence = function(type, align) {

  this._padding = this._padding || 0;
  this._spacing = this._spacing || 0;

  this.untick(this._sequenceTicker);
  this.tick(this._sequenceTicker = function() {
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
      var w = child.pin('boxWidth');
      var h = child.pin('boxHeight');

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
  });
  return this;
};

Cut.box = function() {
  return Cut.create().box();
};

Cut.prototype.box = function() {
  if (this._boxTicker)
    return this;

  this._padding = this._padding || 0;

  this.tick(this._boxTicker = function() {
    if (this._mo_box == this._ts_touch) {
      return;
    }
    this._mo_box = this._ts_touch;

    var width = 0, height = 0;
    var child, next = this.first(true);
    while (child = next) {
      next = child.next(true);
      child._pin.relativeMatrix();
      var w = child.pin('boxWidth');
      var h = child.pin('boxHeight');
      width = Math.max(width, w);
      height = Math.max(height, h);
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin('width') != width && this.pin('width', width);
    this.pin('height') != height && this.pin('height', height);
  });
  return this;
};

// TODO: move padding to pin
Cut.prototype.padding = function(pad) {
  this._padding = pad;
  return this;
};

Cut.prototype.spacing = function(space) {
  this._spacing = space;
  return this;
};
