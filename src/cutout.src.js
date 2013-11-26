/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

function Cutout(prototype) {
  if (prototype) {
    return;
  }

  this._id = "";

  this._visible = true;

  this._children = [];
  this._parent = null;

  this._notifs = {};

  this._spy = false;

  this._tickersCapture = [];
  this._tickersBubble = [];

  this._style = new Cutout.Style().tick(this);
};

Cutout.TS = 0;

Cutout.prototype.start = function(render, request) {

  var paused = true;
  var root = this;

  function tick() {
    if (paused === true) {
      return;
    }
    root._touched = false;
    render(root);
    request(tick);
    if (!root._touched) {
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

  this.touch = function() {
    this._touched = true;
    resume();
  };

  resume();

  return {
    pause : pause,
    resume : resume
  };
};

Cutout.prototype.render = function(context) {
  this.tick();
  this.traversePaint(context);
};

Cutout.prototype.tick = function() {
  if (!this._visible) {
    return;
  }
  this._style.tick(this, this._parent && this._parent._style);

  var length = this._tickersCapture.length;
  for ( var i = 0; i < length; i++) {
    this._tickersCapture[i].call(this);
  }

  var length = this._children.length;
  for ( var i = 0; i < length; i++) {
    this._children[i].tick();
  }

  var length = this._tickersBubble.length;
  for ( var i = 0; i < length; i++) {
    this._tickersBubble[i].call(this);
  }
};

Cutout.prototype.addTicker = function(ticker, capture) {
  if (capture) {
    this._tickersCapture.push(ticker);
  } else {
    this._tickersBubble.push(ticker);
  }
};

Cutout.prototype.traversePaint = function(context) {
  if (!this._visible) {
    return;
  }

  var m = this.matrix();

  context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

  this.paint(context);

  var length = this._children.length;
  for ( var i = 0; i < length; i++) {
    this._children[i].traversePaint(context);
  }

};

Cutout.prototype.paint = function(context) {
  // To be extended by subclasses.
};

Cutout.prototype.id = function(id) {
  if (!arguments.length) {
    return this._id;
  }
  this._id = id;
  return this;
};

Cutout.prototype.attr = function(name, value) {
  if (arguments.length < 2) {
    return this[name];
  }
  this[name] = value;
  return this;
};

Cutout.prototype.toString = function() {
  return "[" + this._id + "]";
};

Cutout.prototype.children = function(i) {
  return !arguments.length ? this._children : this._children[i];
};

Cutout.prototype.append = function() {
  for ( var i = 0; i < arguments.length; i++) {
    var child = arguments[i];
    child.remove();
    this._children.push(child);
    child._parent = this;
    child.postNotif(Cutout.notif.parent);
  }

  this.postNotif(Cutout.notif.children);
  return this;
};

Cutout.prototype.appendTo = function(parent) {
  parent.append(this);
  return this;
};

Cutout.prototype.prepend = function() {
  for ( var i = arguments.length - 1; i >= 0; i--) {
    var child = arguments[i];
    child.remove();
    this._children.unshift(child);
    child._parent = this;
    child.postNotif(Cutout.notif.parent);
  }

  this.postNotif(Cutout.notif.children);
  return this;
};

Cutout.prototype.prependTo = function(parent) {
  parent.prepend(this);
  return this;
};

Cutout.prototype.removeChild = function(child) {
  var index = this._children.indexOf(child);
  if (index > -1) {
    this._children.splice(index, 1);
    child._parent = null;
  }
  this.postNotif(Cutout.notif.children);
};

Cutout.prototype.remove = function() {
  this._parent && this._parent.removeChild(this);
  return this;
};

Cutout.prototype.empty = function() {
  var children = this._children.splice(0);
  for ( var i = 0; i < children.length; i++) {
    children[i]._parent = null;
  }
  this.postNotif(Cutout.notif.children);
  return this;
};

Cutout.prototype.touch = function() {
  this._parent && this._parent.touch();
};

Cutout.notif = {
  children : "children",
  children_child : "child.children",
  children_parent : "parent.children",

  parent : "parent",
  parent_child : "child.parent",
  parent_parent : "parent.parent",

  style : "style",
  style_child : "child.style",
  style_parent : "parent.style",

  frame : "frame",
  frame_child : "child.frame",
  frame_parent : "parent.frame",
};

Cutout.prototype.postNotif = function(name) {
  this._notifs[name] = true;
  if (this._parent) {
    this._parent._notifs["child." + name] = true;
  }
  for ( var i = 0; i < this._children.length; i++) {
    this._children[i]._notifs["parent." + name] = true;
  }
  this.touch();
};

Cutout.prototype.clearNotif = function() {
  var found = false;
  for ( var i = 0; i < arguments.length; i++) {
    var name = arguments[i];
    if (this._notifs[name]) {
      found = true;
      delete this._notifs[name];
    }
  }
  return found;
};

Cutout.prototype.publish = function(name, event, point) {
  if (point) {
    point = point.__origin ? point : {
      __origin : point,
      toString : point.toString
    };

    point = this.matrix().reverse().map(point.__origin, point);

    if (!(this._spy || (point.x >= 0 && point.x <= this._style._width
        && point.y >= 0 && point.y <= this._style._height))) {
      return;
    }
  }

  var handler = this[name];
  if (CutoutUtils.isFunction(handler)) {
    if (handler.call(this, event, point)) {
      return true;
    }
  }

  if (point) {
    for ( var i = this._children.length - 1; i >= 0; i--) {
      var child = this._children[i];
      if (child._visible && child.publish(name, event, point)) {
        return true;
      }
    }
  }

  return false;
};

Cutout.prototype.spy = function(spy) {
  this._spy = spy ? true : false;
  return this;
};

Cutout.prototype.hide = function() {
  this._visible = false;

  this.postNotif(Cutout.notif.style);
  return this;
};

Cutout.prototype.show = function() {
  this._visible = true;

  this.postNotif(Cutout.notif.style);
  return this;
};

Cutout.prototype.style = function() {
  if (!arguments.length) {
    return this._style;
  }
  this._style.update.apply(this._style, arguments);
  return this;
};

Cutout.prototype.matrix = function() {
  return this._style.absoluteMatrix(this, this._parent ? this._parent._style
      : null);
};

Cutout.image = function(selector) {
  return new Cutout.Image().setImage(selector);
};

Cutout.Image = function() {
  Cutout.Image.prototype._super.apply(this, arguments);
};

Cutout.Image.prototype = new Cutout(true);
Cutout.Image.prototype._super = Cutout;
Cutout.Image.prototype.constructor = Cutout.Image;

Cutout.Image.prototype.setImage = function(selector) {
  var cut = Cutout.byName(selector);
  this._cut = cut;
  this.style({
    width : this._cut ? this._cut.width() : 0,
    height : this._cut ? this._cut.height() : 0
  });

  return this;
};

Cutout.Image.prototype.cropX = function(w, x) {
  return this.setImage(this._cut.cropX(w, x));
};

Cutout.Image.prototype.cropY = function(h, y) {
  return this.setImage(this._cut.cropY(h, y));
};

Cutout.Image.prototype.paint = function(context) {
  this._cut && this._cut.paint(context);
};

Cutout.anim = function(selector, fps) {
  var anim = new Cutout.Anim().setFrames(selector).gotoFrame(0);
  if (typeof fps !== "undefined") {
    anim.fps(fps);
  }
  return anim;
};

Cutout.Anim = function() {
  Cutout.Anim.prototype._super.apply(this, arguments);

};

Cutout.Anim.prototype = new Cutout(true);
Cutout.Anim.prototype._super = Cutout;
Cutout.Anim.prototype.constructor = Cutout.Anim;

Cutout.Anim.prototype.fps = function(fps) {
  if (!arguments.length) {
    return this._fps;
  }
  this._fps = fps;
  return this;
};

Cutout.Anim.prototype.setFrames = function(selector) {
  this._startTime = this._startTime || 0;
  this._fps = this._fps || 0;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  var cuts = Cutout.byPrefix(selector);
  if (cuts && cuts.length) {
    for ( var i = 0; i < cuts.length; i++) {
      var cut = cuts[i];
      this._frames.push(cut);
      this._labels[cuts[i].name] = i;
    }
  }
  return this;
};

Cutout.Anim.prototype.gotoFrame = function(frame, resize) {
  frame = CutoutUtils.rotate(frame, this._frames.length);
  this._frame = frame;
  resize = resize || !this._cut;
  this._cut = this._frames[this._frame];
  if (resize) {
    this.style({
      width : this._cut.width(),
      height : this._cut.height()
    });
  }
  this.postNotif(Cutout.notif.frame);
  return this;
};

Cutout.Anim.prototype.randomFrame = function() {
  this.gotoFrame(Math.floor(Math.random() * this._frames.length));
};

Cutout.Anim.prototype.moveFrame = function(frame) {
  this.gotoFrame(this._frame + frame);
};

Cutout.Anim.prototype.gotoLabel = function(label, resize) {
  return this.gotoFrame(this._labels[label] || 0, resize);
};

Cutout.Anim.prototype.play = function(reset) {
  this._startTime = reset || !this._startTime ? +new Date() : this._startTime;
  return this;
};

Cutout.Anim.prototype.stop = function(frame) {
  this._startTime = null;
  if (CutoutUtils.isNum(frame)) {
    this.gotoFrame(frame);
  }
  return this;
};

Cutout.Anim.prototype.paint = function(context) {
  if (this._fps && this._startTime && this._frames.length > 1) {
    var totalTime = +new Date() - this._startTime;
    var frame = Math.floor(this._fps * (totalTime ? totalTime / 1000 : 0));
    this.gotoFrame(frame);
  }
  this._cut && this._cut.paint(context);
};

Cutout.string = function(selector) {
  return new Cutout.String().setFont(selector);
};

Cutout.String = function() {
  Cutout.String.prototype._super.apply(this, arguments);
  this.row();
};

Cutout.String.prototype = new Cutout(true);
Cutout.String.prototype._super = Cutout;
Cutout.String.prototype.constructor = Cutout.String;

Cutout.String.prototype.setFont = function(selector) {
  this.selector = selector;
  selector = selector.split(":", 2);
  this.prefix = selector.length > 1 ? selector[1] : selector[0];
  return this;
};

Cutout.String.prototype.setValue = function(value) {
  if (!value.length) {
    value = value + "";
  }
  for ( var i = 0; i < Math.max(this._children.length, value.length); i++) {
    var char = i < this._children.length ? this._children[i] : Cutout.anim(
        this.selector).appendTo(this);

    if (i < value.length) {
      char.gotoLabel(this.prefix + value[i], true).show();
    } else {
      char.hide();
    }
  }
  return this;
};

Cutout.row = function(valign, spy) {
  return new Cutout().row(valign, spy);
};

Cutout.prototype.row = function(valign, spy) {
  return this.flow(true, valign, spy);
};

Cutout.column = function(halign, spy) {
  return new Cutout().column(halign, spy);
};

Cutout.prototype.column = function(halign, spy) {
  return this.flow(false, halign, spy);
};

Cutout.prototype.flow = function(row, align, spy) {
  this.spy(spy ? true : false);
  this._spacing = 0;
  this.spacing = function(spacing) {
    this._spacing = CutoutUtils.isNum(spacing) ? spacing : 0;
    return this;
  };

  this._columnTicker || this.addTicker(this._columnTicker = function() {
    if (!this.clearNotif(Cutout.notif.style_child, Cutout.notif.children)) {
      return;
    }

    var width = 0, height = 0, first = true;

    for ( var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      if (!child._visible) {
        continue;
      }

      if (row) {
        !first && (width += this._spacing);

        // TODO: only call on changed
        child.style({
          alignY : align,
          offsetX : width
        });

        child.style().boxMatrix();
        width += child.style()._boxWidth;
        height = Math.max(height, child.style()._boxHeight);

      } else {
        !first && (height += this._spacing);

        child.style({
          alignX : align,
          offsetY : height
        });

        child.style().boxMatrix();
        height += child.style()._boxHeight;
        width = Math.max(width, child.style()._boxWidth);
      }

      first = false;
    }

    this.style({
      width : width,
      height : height
    });

  }, false);
  return this;
};

Cutout.ninePatch = function(selector) {
  return new Cutout.NinePatch().setImage(selector);
};

Cutout.NinePatch = function() {
  Cutout.NinePatch.prototype._super.apply(this, arguments);
  this._cut = null;
  this._patches = [];
  this._columns = [];
  this._rows = [];
};

Cutout.NinePatch.prototype = new Cutout(true);
Cutout.NinePatch.prototype._super = Cutout;
Cutout.NinePatch.prototype.constructor = Cutout.String;

Cutout.NinePatch.prototype.setImage = function(selector) {
  this._cut = Cutout.byName(selector);
  return this;
};

Cutout.NinePatch.prototype.size = function(width, height) {

  if (width != this._width) {
    var left = this._cut.left;
    var right = this._cut.right;
    this._width = Math.max(width, left + right);
    this._columns = [];
    var maxw = this._cut.width();
    var x, rx, l, r, w;
    x = 0, l = 0, r = right;
    while (x < this._width) {
      rx = this._width - x;
      w = maxw - l;
      if (w < rx) {
        w -= right;
      } else if (rx < w) {
        if (!right) {// no right: left
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
    this._transformed = true;
    this.postNotif(Cutout.notif.style);
  }

  if (height != this._height) {
    var top = this._cut.top;
    var bottom = this._cut.bottom;
    this._height = Math.max(height, top + bottom);
    this._rows = [];
    var maxh = this._cut.height();
    var y, ry, t, b, h;
    y = 0, t = 0, b = bottom;
    while (y < this._height) {
      ry = this._height - y;
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
    this._transformed = true;
    this.postNotif(Cutout.notif.style);
  }

  return this;
};

Cutout.NinePatch.prototype.paint = function(context) {
  var c = 0;
  for ( var i = 0; i < this._columns.length; i++) {
    var col = this._columns[i];
    for ( var j = 0; j < this._rows.length; j++) {
      var row = this._rows[j];
      this._patches[c] = this._patches[c] || this._cut.clone();
      this._patches[c].cropX(col[0], col[1]).cropY(row[0], row[1]).offset(
          col[2], row[2]).paint(context);
      c++;
    }
  }
};

// Static

Cutout.textures = {};
Cutout.images = {};

Cutout.loadImages = function(imageLoader, completeCallback) {
  var imageCount = 0;
  var handleComplete = function() {
    DEBUG && console.log("Loading image completed.");
    checkComplete();
  };

  var handleError = function(msg) {
    DEBUG && console.log("Error loading image: " + msg);
    checkComplete();
  };

  var checkComplete = function() {
    if (--imageCount <= 0) {
      completeCallback && completeCallback();
    }
  };

  var textures = Cutout.textures;
  for ( var texture in textures) {
    if (textures[texture].imagePath) {
      imageCount++;
      var src = textures[texture].imagePath;
      var image = imageLoader(src, handleComplete, handleError);
      Cutout.addImage(image, src);
    }
  }
};

Cutout.getImageRef = function(src) {
  return function() {
    return Cutout.images[src];
  };
};

Cutout.getImage = function(src) {
  return Cutout.images[src];
};

Cutout.addImage = function(image, src) {
  Cutout.images[src] = image;
  return this;
};

Cutout.addTexture = function() {
  for ( var i = 0; i < arguments.length; i++) {
    data = arguments[i];
    Cutout.textures[data.name] = data;
  }
  return this;
};

Cutout.byName = function(selector) {

  if (typeof selector !== "string") {
    return selector;
  }

  selector = selector.split(":", 2);
  if (selector.length < 2) {
    return null;
  }

  var texture = selector[0];
  var name = selector[1];

  texture = Cutout.textures[texture];
  if (texture == null) {
    return null;
  }

  var img = Cutout.getImageRef(texture.imagePath);

  var cuts = texture.cuts;
  for ( var i = 0; i < cuts.length; i++) {
    if (cuts[i].name == name) {
      return new Cutout.Cut(img, cuts[i], texture.imageRatio);
    }
  }

  return null;
};

Cutout.byPrefix = function(selector) {

  if (typeof selector !== "string") {
    return selector;
  }

  selector = selector.split(":", 2);
  if (selector.length < 2) {
    return null;
  }

  var texture = selector[0];
  var prefix = selector[1];

  var result = [];
  texture = Cutout.textures[texture];
  if (texture == null) {
    return result;
  }

  var img = Cutout.getImageRef(texture.imagePath);

  var prefLen = prefix.length;
  var cuts = texture.cuts;
  for ( var i = 0; i < cuts.length; i++) {
    var cut = cuts[i];
    if (cut.name && cut.name.substring(0, prefLen) == prefix) {
      result.push(new Cutout.Cut(img, cuts[i], texture.imageRatio));
    }
  }

  return result;
};

Cutout.Cut = function(image, cut, ratio) {

  this.image = image;
  this.name = cut.name;
  this.cut = cut;
  this.ratio = ratio || 1;

  cut.w = cut.w || cut.width;
  cut.h = cut.h || cut.height;

  this.sx = cut.x * this.ratio;
  this.sy = cut.y * this.ratio;

  this.sw = cut.w * this.ratio;
  this.sh = cut.h * this.ratio;

  this.dx = 0;
  this.dy = 0;

  this.dw = cut.w;
  this.dh = cut.h;

  this.top = (cut.top || 0);
  this.bottom = (cut.bottom || 0);

  this.left = (cut.left || 0);
  this.right = (cut.right || 0);
};

Cutout.Cut.prototype.clone = function() {
  return new Cutout.Cut(this.image, this.cut, this.ratio);
};

Cutout.Cut.prototype.width = function() {
  return this.dw;
};

Cutout.Cut.prototype.height = function() {
  return this.dh;
};

Cutout.Cut.prototype.cropX = function(w, x) {
  x = x || 0;
  this.sx = (this.cut.x + x) * this.ratio;
  this.dw = Math.min(this.cut.w - x, w);
  this.sw = this.dw * this.ratio;
  return this;
};

Cutout.Cut.prototype.cropY = function(h, y) {
  y = y || 0;
  this.sy = (this.cut.y + y) * this.ratio;
  this.dh = Math.min(this.cut.h - y, h);
  this.sh = this.dh * this.ratio;
  return this;
};

Cutout.Cut.prototype.offset = function(x, y) {
  this.dx = x;
  this.dy = y;
  return this;
};

Cutout.Cut.prototype.paint = function(context) {
  context.drawImage(this.image(), // source
  this.sx, this.sy, this.sw, this.sh, // cut
  this.dx, this.dy, this.dw, this.dh // position
  );
};

Cutout.Cut.prototype.toString = function() {
  return "[" + this.name + ": " + this.dw + "x" + this.dh + "]";
};

Cutout.Style = function() {

  this._owner = null;
  this._parent = null;

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

  // as seen by parent px
  this._offsetX = 0;
  this._offsetY = 0;

  // relative to parent
  this._relativeMatrix = new Cutout.Matrix();

  // relative to root
  this._absoluteMatrix = new Cutout.Matrix();

  // no-translation
  this._boxMatrix = new Cutout.Matrix();

  // calculated bounding box as seen by parent
  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;

  this._translated = Cutout.TS++;
  this._transformed = Cutout.TS++;
  this._matrixed = Cutout.TS++;
};

Cutout.Style.prototype.update = function() {
  this._transformed_flag = false;
  this._translated_flag = false;

  var value, setter, key;
  if (arguments.length == 1) {
    style = arguments[0];
    for (key in style) {
      value = style[key];
      setter = Cutout.Style.setters[key];
      if (setter) {
        if (value || value === 0)
          setter(this, value, style);
      } else {
        DEBUG && console.log("Invalid style: " + key + "/" + value);
      }
    }
  } else if (arguments.length == 2) {
    key = arguments[0];
    value = arguments[1];
    setter = Cutout.Style.setters[key];
    if (setter) {
      if (value || value === 0)
        setter.call(this, value, style);
    } else {
      DEBUG && console.log("Invalid style: " + key + "/" + value);
    }

  }

  if (this._translated_flag) {
    this._translated_flag = false;
    this._translated = Cutout.TS++;
  }
  if (this._transformed_flag) {
    this._transformed_flag = false;
    this._transformed = Cutout.TS++;
    this._owner && this._owner.postNotif(Cutout.notif.style);
  }

  return this;
};

Cutout.Style.setters = {
  width : function(target, value) {
    target._width = value;
    target._transformed_flag = true;
  },

  height : function(target, value) {
    target._height = value;
    target._transformed_flag = true;
  },

  scale : function(target, value) {
    target._scaleX = value;
    target._scaleY = value;
    target._transformed_flag = true;
  },

  scaleX : function(target, value) {
    target._scaleX = value;
    target._transformed_flag = true;
  },

  scaleY : function(target, value) {
    target._scaleY = value;
    target._transformed_flag = true;
  },

  skew : function(target, value) {
    target._skewX = value;
    target._skewY = value;
    target._transformed_flag = true;
  },

  skewX : function(target, value) {
    target._skewX = value;
    target._transformed_flag = true;
  },

  skewY : function(target, value) {
    target._skewY = value;
    target._transformed_flag = true;
  },

  rotation : function(target, value) {
    target._rotation = value;
    target._transformed_flag = true;
  },

  pivot : function(target, value) {
    target._pivotX = value;
    target._pivotY = value;
    target._pivoted = true;
    target._transformed_flag = true;
  },

  pivotX : function(target, value) {
    target._pivotX = value;
    target._pivoted = true;
    target._transformed_flag = true;
  },

  pivotY : function(target, value) {
    target._pivotY = value;
    target._pivoted = true;
    target._transformed_flag = true;
  },

  offset : function(target, value) {
    target._offsetX = value;
    target._offsetY = value;
    target._translated_flag = true;
  },

  offsetX : function(target, value) {
    target._offsetX = value;
    target._translated_flag = true;
  },

  offsetY : function(target, value) {
    target._offsetY = value;
    target._translated_flag = true;
  },

  resizeMode : function(target, value, style) {

  },

  resizeHeight : function(target, value, style) {

  },

  resizeWidth : function(target, value, style) {
    if (!CutoutUtils.isNum(style.resizeWidth)
        || !CutoutUtils.isNum(style.resizeHeight)) {
      return;
    }
    var w = style.resizeWidth, h = style.resizeHeight, mode = style.resizeMode;
    if (mode == "out") {
      target._scaleX = target._scaleY = Math.max(w / target._width, h
          / target._height);
    } else if (mode == "in") {
      target._scaleX = target._scaleY = Math.min(w / target._width, h
          / target._height);
    } else {
      target._scaleX = w / target._width;
      target._scaleY = h / target._height;
    }
    target._width = w / target._scaleX;
    target._height = h / target._scaleY;

    target._transformed_flag = true;
  },

  scaleMode : function(target, value, style) {

  },

  scaleHeight : function(target, value, style) {

  },

  scaleWidth : function(target, value, style) {
    if (!CutoutUtils.isNum(style.scaleWidth)
        || !CutoutUtils.isNum(style.scaleHeight)) {
      return;
    }
    var w = style.scaleWidth, h = style.scaleHeight, mode = style.scaleMode;
    if (mode == "out") {
      target._scaleX = target._scaleY = Math.max(w / target._width, h
          / target._height);
    } else if (mode == "in") {
      target._scaleX = target._scaleY = Math.min(w / target._width, h
          / target._height);
    } else {
      target._scaleX = w / target._width;
      target._scaleY = h / target._height;
    }

    target._transformed_flag = true;
  },

  align : function(target, value) {
    target._alignX = value;
    target._alignY = value;
    target._aligned = true;

    target._handleX = value;
    target._handleY = value;
    target._handled = true;

    target._translated_flag = true;
  },

  alignX : function(target, value) {
    target._alignX = value;
    target._aligned = true;

    target._handleX = value;
    target._handled = true;

    target._translated_flag = true;
  },

  alignY : function(target, value) {
    target._alignY = value;
    target._aligned = true;

    target._handleY = value;
    target._handled = true;

    target._translated_flag = true;
  },

  handle : function(target, value) {
    target._handleX = value;
    target._handleY = value;
    target._handled = true;
    target._translated_flag = true;
  },

  handleX : function(target, value) {
    target._handleX = value;
    target._handled = true;
    target._translated_flag = true;
  },

  handleY : function(target, value) {
    target._handleY = value;
    target._handled = true;
    target._translated_flag = true;
  }

};

Cutout.Style.prototype.tick = function(owner, parent) {
  this._owner = owner;
  this._parent = parent;
  if (this._handled && this._handle_transformed != this._transformed) {
    this._handle_transformed = this._transformed;
    this._translated = Cutout.TS++;
  }
  if (this._aligned && this._parent
      && this._align_transformed != this._parent._transformed) {
    this._align_transformed = this._parent._transformed;
    this._translated = Cutout.TS++;
  }
  return this;
};

Cutout.Style.prototype.absoluteMatrix = function() {
  var parent_matrixed = this._parent ? this._parent._matrixed : 0;
  if (this._abs_transformed == this._transformed
      && this._abs_translated == this._translated
      && this._parent_matrixed == parent_matrixed) {
    return this._absoluteMatrix;
  }

  this._abs_transformed = this._transformed;
  this._abs_translated = this._translated;
  this._parent_matrixed = parent_matrixed;

  var abs = this._absoluteMatrix;
  abs.copyFrom(this.relativeMatrix());

  if (this._parent) {
    abs.concat(this._parent._absoluteMatrix);
  }

  this._matrixed = Cutout.TS++;

  return abs;
};

Cutout.Style.prototype.relativeMatrix = function() {
  if (this._rel_transformed == this._transformed
      && this._rel_translated == this._translated) {
    return this._relativeMatrix;
  }
  this._rel_transformed = this._transformed;
  this._rel_translated = this._translated;

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

  var x = this._offsetX - this._boxX;
  var y = this._offsetY - this._boxY;

  if (this._handled) {
    x -= this._handleX * this._boxWidth;
    y -= this._handleY * this._boxHeight;
  }

  if (this._parent && this._aligned) {
    x += this._alignX * this._parent._width;
    y += this._alignY * this._parent._height;
  }

  rel.translate(x, y);

  return this._relativeMatrix;
};

Cutout.Style.prototype.boxMatrix = function() {
  if (this._box_transformed == this._transformed) {
    return;
  }
  this._box_transformed = this._transformed;

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

Cutout.Matrix = function(a, b, c, d, tx, ty) {
  this.changed = true;
  this.a = a || 1;
  this.b = b || 0;
  this.c = c || 0;
  this.d = d || 1;
  this.tx = tx || 0;
  this.ty = ty || 0;
};

Cutout.Matrix.prototype.toString = function() {
  return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", "
      + this.tx + ", " + this.ty + "]";
};

Cutout.Matrix.prototype.clone = function() {
  return new Cutout.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
};

Cutout.Matrix.prototype.copyTo = function(m) {
  m.copyFrom(this);
  return this;
};

Cutout.Matrix.prototype.copyFrom = function(m) {
  this.changed = true;
  this.a = m.a;
  this.b = m.b;
  this.c = m.c;
  this.d = m.d;
  this.tx = m.tx;
  this.ty = m.ty;
  return this;
};

Cutout.Matrix.prototype.identity = function() {
  this.changed = true;
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.tx = 0;
  this.ty = 0;
  return this;
};

Cutout.Matrix.prototype.rotate = function(angle) {
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

Cutout.Matrix.prototype.translate = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this.changed = true;
  this.tx += x;
  this.ty += y;
  return this;
};

Cutout.Matrix.prototype.scale = function(x, y) {
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

Cutout.Matrix.prototype.skew = function(b, c) {
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

Cutout.Matrix.prototype.concat = function(m) {
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

Cutout.Matrix.prototype.reverse = function() {
  if (this.changed) {
    this.changed = false;
    this.reversed = this.reversed || new Cutout.Matrix();
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

Cutout.Matrix.prototype.map = function(p, q) {
  q = q || {};
  q.x = this.a * p.x + this.c * p.y + this.tx;
  q.y = this.b * p.x + this.d * p.y + this.ty;
  return q;
};

Cutout.Matrix.prototype.mapX = function(x, y) {
  return this.a * x + this.c * y + this.tx;
};

Cutout.Matrix.prototype.mapY = function(x, y) {
  return this.b * x + this.d * y + this.ty;
};

// Utilities

function CutoutUtils() {

}

CutoutUtils.rad2deg = function(rad) {
  return rad / Math.PI * 180.0;
};

CutoutUtils.deg2rad = function(deg) {
  return deg / 180.0 * Math.PI;
};

CutoutUtils.random = function(min, max) {
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

CutoutUtils.rotate = function(num, min, max) {
  max = max || 0;
  if (max > min) {
    return (num - min) % (max - min) + (num < min ? max : min);
  } else {
    return (num - max) % (min - max) + (num < max ? min : max);
  }
};

CutoutUtils.size = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

CutoutUtils.isNum = function(x) {
  return typeof x === "number";
};

CutoutUtils.isFunction = function(x) {
  return typeof x === "function";
};

CutoutUtils.extend = function(target, souce, attribs) {
  for ( var i = 0; i < attribs.length; i++) {
    var attr = attribs[i];
    target[attr] = source[attr];
  }
  return target;
};