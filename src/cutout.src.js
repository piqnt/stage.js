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

  this._width = 0;
  this._height = 0;

  this._scaleX = 1;
  this._scaleY = 1;
  this._skewX = 0;
  this._skewX = 0;
  this._rotation = 0;

  // scale/skew/rotate center
  this._pivoted = false;
  this._pivotX = null;
  this._pivotY = null;

  // positioning center
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
  this._absoluteMatrix._time = 0;
  this._absoluteMatrix._parentTime = -1;

  // no-translation
  this._boxMatrix = new Cutout.Matrix();

  // rect box as seen by parent (read only)
  this._boxX = 0;
  this._boxY = 0;
  this._boxWidth = this._width;
  this._boxHeight = this._height;

  this._visible = true;

  this._children = [];
  this._parent = null;

  this._notifs = {};

  this._spy = false;

  this._tickersCapture = [];
  this._tickersBubble = [];
};

Cutout.prototype.start = function(render, request) {

  var paused = true;

  var tick = function() {
    if (paused === true) {
      return;
    }
    this._touched = false;
    render(this);
    request(tick);
    if (!this._touched) {
      pause();
    }
  }.bind(this);

  var pause = function() {
    paused = true;
  }.bind(this);

  var resume = function(force) {
    if (paused || force) {
      paused = false;
      request(tick);
    }
  }.bind(this);

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

  var m = this.absoluteMatrix();

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

Cutout.prototype.absoluteMatrix = function() {
  var m = this._absoluteMatrix;
  if (this._parent) {
    var pm = this._parent._absoluteMatrix;
    if (this._transformed || pm._time !== m._parentTime) {
      m.copyFrom(this.relativeMatrix()).concat(pm);
      m._parentTime = pm._time;
      m._time += 1;
    }
  } else {
    if (this._transformed) {
      m.copyFrom(this.relativeMatrix());
      m._time += 1;
    }
  }
  return m;
};

Cutout.prototype.relativeMatrix = function() {
  if (!this._transformed) {
    return this._relativeMatrix;
  }
  this._transformed = false;

  var m = this._relativeMatrix;

  m.identity();
  if (this._pivoted) {
    m.translate(-this._pivotX * this._width, -this._pivotY * this._height);
  }
  m.scale(this._scaleX, this._scaleY);
  m.rotate(this._rotation);
  m.skew(this._skewX, this._skewX);
  if (this._pivoted) {
    m.translate(this._pivotX * this._width, this._pivotY * this._height);
  }

  this.boxMatrix(true);

  var x = this._offsetX - this._boxX - this._handleX * this._boxWidth;
  var y = this._offsetY - this._boxY - this._handleY * this._boxHeight;

  if (this._parent) {
    this._alignX && (x += this._alignX * this._parent._width);
    this._alignY && (y += this._alignY * this._parent._height);
  }

  m.translate(x, y);

  return m;
};

Cutout.prototype.boxMatrix = function(force) {
  if (!force && !this._transformed) {
    return;
  }

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

  var x = this._width;
  var y = this._height;
  var x00 = 0;
  var x01 = m.a * x;
  var x10 = m.c * y;
  var x11 = m.a * x + m.c * y;
  var xMin = Math.min(x00, x01, x10, x11);
  var xMax = Math.max(x00, x01, x10, x11);

  var y00 = 0;
  var y01 = m.b * x;
  var y10 = m.d * y;
  var y11 = m.b * x + m.d * y;
  var yMin = Math.min(y00, y01, y10, y11);
  var yMax = Math.max(y00, y01, y10, y11);

  this._boxX = xMin;
  this._boxY = yMin;
  this._boxWidth = xMax - xMin;
  this._boxHeight = yMax - yMin;
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
  return "[" + this._id + ": " + this._width + "x" + this._height + " scale("
      + this._scaleX + ", " + this._scaleY + ") rotate(" + this._rotation
      + ") skew(" + this._skewX + ", " + this._skewX + ") " + this._boxWidth
      + "x" + this._boxHeight + "]";
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
    point = this.relativeMatrix().reverse().map(point);

    if (!this._spy
        && !(point.x >= 0 && point.x <= this._width && point.y >= 0 && point.y <= this._height)) {
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

  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.show = function() {
  this._visible = true;

  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.size = function(x, y) {
  if (typeof x !== "undefined") {
    this._width = x;
  }
  if (typeof y !== "undefined") {
    this._height = y;
  }

  // this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.width = function(x) {
  return !arguments.length ? this._width : this.size(x, this._height);
};

Cutout.prototype.height = function(y) {
  return !arguments.length ? this._height : this.size(this._width, y);
};

Cutout.prototype.scaleTo = function(width, height, mode, resize) {
  if (mode == Cutout.scale.slice) {
    this.scale(Math.max(width / this._width, height / this._height));
  } else if (mode == Cutout.scale.fit) {
    this.scale(Math.min(width / this._width, height / this._height));
  } else {
    this.scale(width / this._width, height / this._height);
  }
  resize && this.size(width / this._scaleX, height / this._scaleY);
  return this;
};

Cutout.prototype.scale = function(x, y) {
  y = typeof y === "undefined" ? x : y;

  this._scaleX = x;
  this._scaleY = y;

  this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.scaleX = function(x) {
  return !arguments.length ? this._scaleX : this.scale(x, this._scaleY);
};

Cutout.prototype.scaleY = function(y) {
  return !arguments.length ? this._scaleY : this.scale(this._scaleX, y);
};

Cutout.prototype.skew = function(x, y) {
  y = typeof y === "undefined" ? x : y;

  this._skewX = x;
  this._skewX = y;

  this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.skewX = function(x) {
  return !arguments.length ? this._skewX : this.skew(x, this._skewY);
};

Cutout.prototype.skewY = function(y) {
  return !arguments.length ? this._skewY : this.skew(this._skewX, y);
};

Cutout.prototype.rotate = function(angle) {
  if (!arguments.length) {
    return this._rotation;
  }
  this._rotation = angle;
  this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.offset = function(x, y) {
  y = typeof y === "undefined" ? x : y;
  this._offsetX = x;
  this._offsetY = y;

  this._transformed = true;
  return this;
};

Cutout.prototype.offsetX = function(x) {
  return !arguments.length ? this._offsetX : this.offset(x, this._offsetY);
};

Cutout.prototype.offsetY = function(y) {
  return !arguments.length ? this._offsetY : this.offset(this._offsetX, y);
};

Cutout.prototype.pivot = function(x, y) {
  y = typeof y === "undefined" ? x : y;
  this._pivotX = CutoutUtils.isNum(x) ? (x / 2 + 0.5) : x;
  this._pivotY = CutoutUtils.isNum(y) ? (y / 2 + 0.5) : y;

  this._pivoted = CutoutUtils.isNum(this._pivotX)
      && CutoutUtils.isNum(this._pivotY);

  this._transformed = true;
  return this;
};

Cutout.prototype.pivotX = function(x) {
  return !arguments.length ? this._pivotX : this.pivot(x, this._pivotY);
};

Cutout.prototype.pivotY = function(y) {
  return !arguments.length ? this._pivotY : this.pivot(this._pivotX, y);
};

Cutout.prototype.align = function(x, y, cx, cy) {
  y = typeof y !== "undefined" ? y : x;

  CutoutUtils.isNum(x) && (this._alignX = x / 2 + 0.5);
  CutoutUtils.isNum(y) && (this._alignY = y / 2 + 0.5);

  this._alignTicker
      || this.addTicker(this._alignTicker = function() {
        if (this._aligned
            && this.clearNotif(Cutout.notif.parent, Cutout.notif.parent_size)) {
          this._transformed = true;
        }
      }, true);

  this._aligned = !!(this._alignX || this._alignY);

  this.handle(typeof cx !== "undefined" ? cx : x,
      typeof cy !== "undefined" ? cy : y);

  this._transformed = true;
  return this;
};

Cutout.prototype.alignX = function(x, cx) {
  return !arguments.length ? this._alignX : this.align(x, this._alignY, cx,
      this._handleY);
};

Cutout.prototype.alignY = function(y, cy) {
  return !arguments.length ? this._alignY : this.align(this._alignX, y,
      this._handleX, cy);
};

Cutout.prototype.handle = function(x, y) {
  y = typeof y !== "undefined" ? y : x;

  CutoutUtils.isNum(x) && (this._handleX = x / 2 + 0.5);
  CutoutUtils.isNum(y) && (this._handleY = y / 2 + 0.5);

  this._handleTicker || this.addTicker(this._handleTicker = function() {
    if (this._handled && this.clearNotif(Cutout.notif.size)) {
      this._transformed = true;
    }
  }, true);

  this._handled = !!(this._handleX || this._handleY);
  this._transformed = true;
  return this;
};

Cutout.prototype.handleX = function(x) {
  return !arguments.length ? this._handleX : this.handle(x, this._handleY);
};

Cutout.prototype.handleY = function(y) {
  return !arguments.length ? this._handleY : this.handle(this._handleX, y);
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
  if (this._cut) {
    this.size(this._cut.width(), this._cut.height());
  } else {
    this.size(0, 0);
  }
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

  this._startTime = null;
  this._fps = null;

  this._frame = 0;
  this._frames = [];
  this._labels = {};
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
  this._cut = this._frames[this._frame];
  if (this._cut) {
    this._width = this._cut.width();
    this._height = this._cut.height();
  }
  resize && this.postNotif(Cutout.notif.size);
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
  return new Cutout.String().setPrefix(selector);
};

Cutout.String = function() {
  Cutout.String.prototype._super.apply(this, arguments);
};

Cutout.String.prototype = new Cutout(true);
Cutout.String.prototype._super = Cutout;
Cutout.String.prototype.constructor = Cutout.String;

Cutout.String.prototype.setPrefix = function(selector) {
  this.selector = selector;
  selector = selector.split(":", 2);
  this.prefix = selector.length > 1 ? selector[1] : selector[0];
  return this;
};

Cutout.String.prototype.setValue = function(value) {
  if (!value.length) {
    value = value + "";
  }
  var oldwidth = this._width;
  var oldheight = this._height;

  this._width = 0;
  for ( var i = 0; i < Math.max(this._children.length, value.length); i++) {
    var digit = i < this._children.length ? this._children[i] : Cutout.anim(
        this.selector).appendTo(this);

    // call if changed
    if (digit._offsetX != this._width) {
      digit.offset(this._width, null);
    }

    if (i < value.length) {
      digit.gotoLabel(this.prefix + value[i], true).show();
      this._width += digit._width;
      this._height = digit._height;
    } else {
      digit.hide();
    }
  }
  if (oldwidth !== this._width || oldheight !== this._height) {
    this.postNotif(Cutout.notif.size);
  }
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
    this.postNotif(Cutout.notif.size);
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
    this.postNotif(Cutout.notif.size);
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

Cutout.row = function(valign, spy) {
  return new Cutout().row(valign, spy);
};

Cutout.prototype.row = function(valign, spy) {
  this.spy(spy ? true : false);
  this._spacing = 0;
  this.spacing = function(spacing) {
    this._spacing = CutoutUtils.isNum(spacing) ? spacing : 0;
    return this;
  };
  this._rowTicker || this.addTicker(this._rowTicker = function() {
    if (!this.clearNotif(Cutout.notif.child_size, Cutout.notif.children)) {
      return;
    }

    var oldwidth = this._width;
    var oldheight = this._height;

    this._width = 0;
    this._height = 0;

    for ( var i = 0; i < this._children.length; i++) {
      var child = this._children[i];

      // TODO: only call on changed
      child.align(null, valign);
      child.offset(this._width + this._spacing, null);

      if (child._visible) {
        child.boxMatrix();
        this._width += child._boxWidth;
        if (this._width > 0) {
          this._width += this._spacing;
        }
      }
      this._height = Math.max(this._height, child._boxHeight);
    }
    if (this._width > 0) {
      this._width -= this._spacing;
    }

    if (oldwidth !== this._width || oldheight !== this._height) {
      this.postNotif(Cutout.notif.size);
      this._transformed = true;
    }
  }, false);
  return this;
};

Cutout.column = function(halign, spy) {
  return new Cutout().column(halign, spy);
};

Cutout.prototype.column = function(halign, spy) {
  this.spy(spy ? true : false);
  this._spacing = 0;
  this.spacing = function(spacing) {
    this._spacing = CutoutUtils.isNum(spacing) ? spacing : 0;
    return this;
  };

  this._columnTicker || this.addTicker(this._columnTicker = function() {
    if (!this.clearNotif(Cutout.notif.child_size, Cutout.notif.children)) {
      return;
    }

    var oldwidth = this._width;
    var oldheight = this._height;

    this._width = 0;
    this._height = 0;

    for ( var i = 0; i < this._children.length; i++) {
      var child = this._children[i];

      // TODO: only call on changed
      child.align(halign, null);
      child.offset(null, this._height);

      if (child._visible) {
        child.boxMatrix();
        this._height += child._boxHeight;
        if (this._height > 0) {
          this._height += this._spacing;
        }
      }
      this._width = Math.max(this._width, child._boxWidth);
    }
    if (this._height > 0) {
      this._height -= this._spacing;
    }

    if (oldwidth !== this._width || oldheight !== this._height) {
      this._transformed = true;
      this.postNotif(Cutout.notif.size);
    }
  }, false);
  return this;
};

// Static

Cutout.scale = {
  fit : "fit",
  slice : "slice"
};

Cutout.align = {
  start : -1,
  end : +1,
  center : 0
};

Cutout.notif = {
  children : "children",
  child_children : "child.children",
  parent_children : "parent.children",

  parent : "parent",
  child_parent : "child.parent",
  parent_parent : "parent.parent",

  size : "size",
  child_size : "child.size",
  parent_size : "parent.size",

  frame : "frame",
  child_frame : "child.frame",
  parent_frame : "parent.frame",
};

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

  var img = Cutout.getImage(texture.imagePath);

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

  var img = Cutout.getImage(texture.imagePath);

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
  context.drawImage(this.image, // source
  this.sx, this.sy, this.sw, this.sh, // cut
  this.dx, this.dy, this.dw, this.dh // position
  );
};

Cutout.Cut.prototype.toString = function() {
  return "[" + this.name + ": " + this.dw + "x" + this.dh + "]";
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
  this.changed = true;
  this.tx += x;
  this.ty += y;
  return this;
};

Cutout.Matrix.prototype.scale = function(x, y) {
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
  if (min == undefined) {
    min = 1;
  }
  if (max == undefined) {
    max = min;
    min = 0;
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