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

function Cut(proto) {
  if (proto)
    return;
  this._id = "";
  this._visible = true;
  this._parent = null;
  this._pin = new Cut.Pin().tick(this);
  this._children = [];
  this._outs = [];
  this._tickBefore = [];
  this._tickAfter = [];
  this._notifs = {};
  this._spy = false;
};

Cut.TS = 0;

Cut.prototype.start = function(render, request) {

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

Cut.prototype.render = function(context) {
  this.tick();
  this.paint(context);
};

Cut.prototype.tick = function() {
  if (!this._visible) {
    return;
  }
  this._pin.tick(this, this._parent && this._parent._pin);

  var length = this._tickBefore.length;
  for ( var i = 0; i < length; i++) {
    this._tickBefore[i].call(this);
  }

  var length = this._children.length;
  for ( var i = 0; i < length; i++) {
    this._children[i].tick();
  }

  var length = this._tickAfter.length;
  for ( var i = 0; i < length; i++) {
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

Cut.prototype.paint = function(context) {
  if (!this._visible) {
    return;
  }

  var m = this.matrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

  var length = this._outs.length;
  for ( var i = 0; i < length; i++) {
    this._outs[i].paste(context);
  }

  var length = this._children.length;
  for ( var i = 0; i < length; i++) {
    this._children[i].paint(context);
  }
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
    return this[name];
  }
  this[name] = value;
  return this;
};

Cut.prototype.toString = function() {
  return "[" + this._id + "]";
};

Cut.prototype.children = function(i) {
  return !arguments.length ? this._children : this._children[i];
};

Cut.prototype.parent = function() {
  return this._parent;
};

Cut.prototype.append = function() {
  for ( var i = 0; i < arguments.length; i++) {
    var child = arguments[i];
    child.remove();
    this._children.push(child);
    child._parent = this;
    child.postNotif(Cut.notif.parent);
  }

  this.postNotif(Cut.notif.children);
  return this;
};

Cut.prototype.appendTo = function(parent) {
  parent.append(this);
  return this;
};

Cut.prototype.prepend = function() {
  for ( var i = arguments.length - 1; i >= 0; i--) {
    var child = arguments[i];
    child.remove();
    this._children.unshift(child);
    child._parent = this;
    child.postNotif(Cut.notif.parent);
  }

  this.postNotif(Cut.notif.children);
  return this;
};

Cut.prototype.prependTo = function(parent) {
  parent.prepend(this);
  return this;
};

Cut.prototype.removeChild = function(child) {
  var index = this._children.indexOf(child);
  if (index > -1) {
    this._children.splice(index, 1);
    child._parent = null;
  }
  this.postNotif(Cut.notif.children);
};

Cut.prototype.remove = function() {
  this._parent && this._parent.removeChild(this);
  return this;
};

Cut.prototype.empty = function() {
  var children = this._children.splice(0);
  for ( var i = 0; i < children.length; i++) {
    children[i]._parent = null;
  }
  this.postNotif(Cut.notif.children);
  return this;
};

Cut.prototype.touch = function() {
  this._parent && this._parent.touch();
};

Cut.notif = {
  children : "children",
  children_child : "child.children",
  children_parent : "parent.children",

  parent : "parent",
  parent_child : "child.parent",
  parent_parent : "parent.parent",

  pin : "pin",
  pin_child : "child.pin",
  pin_parent : "parent.pin",

  frame : "frame",
  frame_child : "child.frame",
  frame_parent : "parent.frame",
};

Cut.prototype.postNotif = function(name) {
  this._notifs[name] = true;
  if (this._parent) {
    this._parent._notifs["child." + name] = true;
  }
  for ( var i = 0; i < this._children.length; i++) {
    this._children[i]._notifs["parent." + name] = true;
  }
  this.touch();
};

Cut.prototype.clearNotif = function() {
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

Cut.prototype.publish = function(name, event, point) {
  if (point) {
    point = point.__origin ? point : {
      __origin : point,
      toString : point.toString
    };

    point = this.matrix().reverse().map(point.__origin, point);

    if (!(this._spy || (point.x >= 0 && point.x <= this._pin._width
        && point.y >= 0 && point.y <= this._pin._height))) {
      return;
    }
  }

  var handler = this[name];
  if (Cut.Utils.isFunction(handler)) {
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

Cut.prototype.spy = function(spy) {
  this._spy = spy ? true : false;
  return this;
};

Cut.prototype.hide = function() {
  this._visible = false;

  this.postNotif(Cut.notif.pin);
  return this;
};

Cut.prototype.show = function() {
  this._visible = true;

  this.postNotif(Cut.notif.pin);
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

Cut.create = function() {
  return new Cut();
};

Cut.image = function(selector) {
  return new Cut.Image().setImage(selector);
};

Cut.Image = function(proto) {
  Cut.Image.prototype._super.apply(this, arguments);
  if (proto)
    return;
};

Cut.Image.prototype = new Cut(true);
Cut.Image.prototype._super = Cut;
Cut.Image.prototype.constructor = Cut.Image;

Cut.Image.prototype.setImage = function(selector) {
  var out = Cut._select(selector);
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
  if (typeof fps !== "undefined") {
    anim.fps(fps);
  }
  return anim;
};

Cut.Anim = function(proto) {
  Cut.Anim.prototype._super.apply(this, arguments);
  if (proto)
    return;
  this.addTicker(function() {
    if (this._fps && this._time && this._frames.length > 1) {
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

Cut.Anim.prototype = new Cut(true);
Cut.Anim.prototype._super = Cut;
Cut.Anim.prototype.constructor = Cut.Anim;

Cut.Anim.prototype.fps = function(fps) {
  if (!arguments.length) {
    return this._fps;
  }
  this._fps = fps;
  this._ft = 1000 / this._fps;
  return this;
};

Cut.Anim.prototype.setFrames = function(selector) {
  this._time = this._time || 0;
  this._fps = this._fps || 0;
  this._ft = 1000 / this._fps;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  var outs = Cut._select(selector, true);
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
  frame = Cut.Utils.rotate(frame, this._frames.length);
  this._frame = frame;
  resize = resize || !this._outs[0];
  this._outs[0] = this._frames[this._frame];
  if (resize) {
    this.pin({
      width : this._outs[0].width(),
      height : this._outs[0].height()
    });
  }
  this.postNotif(Cut.notif.frame);
  return this;
};

Cut.Anim.prototype.randomFrame = function() {
  this.gotoFrame(Math.floor(Math.random() * this._frames.length));
};

Cut.Anim.prototype.moveFrame = function(frame) {
  this.gotoFrame(this._frame + frame);
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
  if (Cut.Utils.isNum(frame)) {
    this.gotoFrame(frame);
  }
  return this;
};

Cut.string = function(selector) {
  return new Cut.String().setFont(selector);
};

Cut.String = function(proto) {
  Cut.String.prototype._super.apply(this, arguments);
  if (proto)
    return;
  this.row();
};

Cut.String.prototype = new Cut(true);
Cut.String.prototype._super = Cut;
Cut.String.prototype.constructor = Cut.String;

Cut.String.prototype.setFont = function(selector) {
  this.selector = selector;
  selector = selector.split(":", 2);
  this.prefix = selector.length > 1 ? selector[1] : selector[0];
  return this;
};

Cut.String.prototype.setValue = function(value) {
  if (this.value === value)
    return;
  this.value = value;

  if (!value.length) {
    value = value + "";
  }
  for ( var i = 0; i < Math.max(this._children.length, value.length); i++) {
    var char = i < this._children.length ? this._children[i] : Cut.anim(
        this.selector).appendTo(this);

    if (i < value.length) {
      char.gotoLabel(this.prefix + value[i], true).show();
    } else {
      char.hide();
    }
  }
  return this;
};

Cut.row = function(valign, spy) {
  return Cut.create().row(valign, spy);
};

Cut.prototype.row = function(valign, spy) {
  return this.flow(true, valign, spy);
};

Cut.column = function(halign, spy) {
  return Cut.create().column(halign, spy);
};

Cut.prototype.column = function(halign, spy) {
  return this.flow(false, halign, spy);
};

Cut.prototype.flow = function(row, align, spy) {
  this.spy(spy ? true : false);
  this._spacing = 0;
  this.spacing = function(spacing) {
    this._spacing = Cut.Utils.isNum(spacing) ? spacing : 0;
    return this;
  };

  this._columnTicker || this.addTicker(this._columnTicker = function() {
    if (!this.clearNotif(Cut.notif.pin_child, Cut.notif.children)) {
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
        child.pin({
          alignY : align,
          offsetX : width
        });

        child.pin().boxMatrix();
        width += child.pin()._boxWidth;
        height = Math.max(height, child.pin()._boxHeight);

      } else {
        !first && (height += this._spacing);

        child.pin({
          alignX : align,
          offsetY : height
        });

        child.pin().boxMatrix();
        height += child.pin()._boxHeight;
        width = Math.max(width, child.pin()._boxWidth);
      }

      first = false;
    }

    this.pin({
      width : width,
      height : height
    });

  }, false);
  return this;
};

Cut.ninePatch = function(selector) {
  return new Cut.NinePatch().setImage(selector);
};

Cut.NinePatch = function(proto) {
  Cut.NinePatch.prototype._super.apply(this, arguments);
  if (proto)
    return;
};

Cut.NinePatch.prototype = new Cut(true);
Cut.NinePatch.prototype._super = Cut;
Cut.NinePatch.prototype.constructor = Cut.NinePatch;

Cut.NinePatch.prototype.setImage = function(selector) {
  this._out = Cut._select(selector);
  this._columns = [];
  this._rows = [];
  return this;
};

Cut.NinePatch.prototype.resize = function(width, height) {

  if (Cut.Utils.isNum(width)) {
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

  if (Cut.Utils.isNum(height)) {
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

Cut.loadImages = function(imageLoader, completeCallback) {
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

  var textures = Cut._textures;
  for ( var texture in textures) {
    if (textures[texture].imagePath) {
      imageCount++;
      var src = textures[texture].imagePath;
      var image = imageLoader(src, handleComplete, handleError);
      Cut.addImage(image, src);
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

    texture.getImage = function() {
      if (!this._image) {
        this._image = Cut.getImage(this.imagePath);
      }
      return this._image;
    };

    if (texture.filter) {
      for ( var c = texture.cuts.length - 1; c >= 0; c--) {
        texture.cuts[c] = texture.filter(texture.cuts[c]);
        texture.cuts[c] || texture.cuts.splice(c, 1);
      }
    }
  }
  return this;
};

Cut._select = function(selector, prefix) {

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

  var cuts = texture.cuts;

  if (!prefix) {
    for ( var i = 0; i < cuts.length; i++) {
      if (cuts[i].name == name) {
        return new Cut.Out(texture, cuts[i]);
      }
    }
    return null;

  } else {
    var length = name.length;
    var result = [];
    for ( var i = 0; i < cuts.length; i++) {
      var cut = cuts[i];
      if (cut.name && cut.name.substring(0, length) == name) {
        result.push(new Cut.Out(texture, cuts[i]));
      }
    }
    return result;
  }
};

Cut.Out = function(texture, cut) {

  this.texture = texture;
  this.cut = cut;
  this.ratio = texture.imageRatio || 1;

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

Cut.Out.prototype.clone = function() {
  return new Cut.Out(this.texture, this.cut);
};

Cut.Out.prototype.width = function() {
  return this.dw;
};

Cut.Out.prototype.height = function() {
  return this.dh;
};

Cut.Out.prototype.cropX = function(w, x) {
  x = x || 0;
  this.sx = (this.cut.x + x) * this.ratio;
  this.dw = Math.min(this.cut.w - x, w);
  this.sw = this.dw * this.ratio;
  return this;
};

Cut.Out.prototype.cropY = function(h, y) {
  y = y || 0;
  this.sy = (this.cut.y + y) * this.ratio;
  this.dh = Math.min(this.cut.h - y, h);
  this.sh = this.dh * this.ratio;
  return this;
};

Cut.Out.prototype.offset = function(x, y) {
  this.dx = x;
  this.dy = y;
  return this;
};

Cut.Out.prototype.paste = function(context) {
  context.drawImage(this.texture.getImage(), // source
  this.sx, this.sy, this.sw, this.sh, // cut
  this.dx, this.dy, this.dw, this.dh // position
  );
};

Cut.Out.prototype.toString = function() {
  return "[" + this.cut.name + ": " + this.dw + "x" + this.dh + "]";
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

  // calculated bounding box as seen by parent
  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;

  this._translated = Cut.TS++;
  this._transformed = Cut.TS++;
  this._matrixed = Cut.TS++;
};

Cut.Pin.prototype.update = function() {
  this._transformed_flag = false;
  this._translated_flag = false;

  var value, setter, key;
  if (arguments.length == 1) {
    var pin = arguments[0];
    if (typeof pin === "string") {
      return this["_" + pin];
    }

    if (typeof pin === "object") {
      for (key in pin) {
        value = pin[key];
        setter = Cut.Pin.setters[key];
        if (setter) {
          if (value || value === 0)
            setter(this, value, pin);
        } else {
          DEBUG && console.log("Invalid pin: " + key + "/" + value);
        }
      }
    }

  } else if (arguments.length == 2) {
    key = arguments[0];
    value = arguments[1];
    setter = Cut.Pin.setters[key];
    if (setter) {
      if (value || value === 0)
        setter(this, value, Cut.Pin.EMPTY);
    } else {
      DEBUG && console.log("Invalid pin: " + key + "/" + value);
    }
  }

  if (this._translated_flag) {
    this._translated_flag = false;
    this._translated = Cut.TS++;
  }
  if (this._transformed_flag) {
    this._transformed_flag = false;
    this._transformed = Cut.TS++;
    this._owner && this._owner.postNotif(Cut.notif.pin);
  }

  return this;
};

Cut.Pin.setters = {
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

  resizeMode : function(target, value, pin) {

  },

  resizeHeight : function(target, value, pin) {

  },

  resizeWidth : function(target, value, pin) {
    if (!Cut.Utils.isNum(pin.resizeWidth) || !Cut.Utils.isNum(pin.resizeHeight)) {
      return;
    }
    var w = pin.resizeWidth, h = pin.resizeHeight, mode = pin.resizeMode;
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

  scaleMode : function() {

  },

  scaleHeight : function() {

  },

  scaleWidth : function(target, value, obj) {
    if (!Cut.Utils.isNum(obj.scaleWidth) || !Cut.Utils.isNum(obj.scaleHeight)) {
      return;
    }
    var w = obj.scaleWidth, h = obj.scaleHeight, mode = obj.scaleMode;
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

Cut.Pin.prototype.tick = function(owner, parent) {
  this._owner = owner;
  this._parent = parent;
  if (this._handled && this._handle_transformed != this._transformed) {
    this._handle_transformed = this._transformed;
    this._translated = Cut.TS++;
  }
  if (this._aligned && this._parent
      && this._align_transformed != this._parent._transformed) {
    this._align_transformed = this._parent._transformed;
    this._translated = Cut.TS++;
  }
  return this;
};

Cut.Pin.prototype.absoluteMatrix = function() {
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

  this._matrixed = Cut.TS++;

  return abs;
};

Cut.Pin.prototype.relativeMatrix = function() {
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

Cut.Pin.prototype.boxMatrix = function() {
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

// Utilities

Cut.Utils = {};

Cut.Utils.rad2deg = function(rad) {
  return rad / Math.PI * 180.0;
};

Cut.Utils.deg2rad = function(deg) {
  return deg / 180.0 * Math.PI;
};

Cut.Utils.random = function(min, max) {
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

Cut.Utils.zigzag = function(t) {
  t = Cut.Utils.rotate(t, -Math.PI, Math.PI) / Math.PI * 2;
  if (t > 1) {
    t = 2 - t;
  } else if (t < -1) {
    t = -2 - t;
  }
  return t;
};

Cut.Utils.rotate = function(num, min, max) {
  max = max || 0;
  if (max > min) {
    return (num - min) % (max - min) + (num < min ? max : min);
  } else {
    return (num - max) % (min - max) + (num < max ? min : max);
  }
};

Cut.Utils.size = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

Cut.Utils.isNum = function(x) {
  return typeof x === "number";
};

Cut.Utils.isFunction = function(x) {
  return typeof x === "function";
};

Cut.Utils.extend = function(target, souce, attribs) {
  for ( var i = 0; i < attribs.length; i++) {
    var attr = attribs[i];
    target[attr] = source[attr];
  }
  return target;
};