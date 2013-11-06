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

function Cutout() {
  this._id = "";

  this._width = 0;
  this._height = 0;

  this._scaleX = 1;
  this._scaleY = 1;
  this._skewX = 0;
  this._skewX = 0;
  this._rotation = 0;

  this._pivotX = null;
  this._pivotY = null;

  this._aligned = false;
  this._outH = 0;
  this._outV = 0;
  this._inH = 0;
  this._inV = 0;

  this._offsetX = 0;
  this._offsetY = 0;

  this._matrix = new Cutout.Matrix();

  this._boxWidth = this._width;
  this._boxHeight = this._height;

  this._visible = true;

  this._children = [];
  this._parent = null;

  this._notifs = {};
};

Cutout.prototype.attr = function(name, value) {
  if (typeof value === "undefined") {
    return this[name];
  } else {
    this[name] = value;
    return this;
  }
};

Cutout.prototype.id = function(id) {
  if (typeof id === "undefined") {
    return this._id;
  } else {
    this._id = id;
    return this;
  }
};

Cutout.prototype.traverse = function(callback, reverse) {
  callback.call(this, function() {
    var length = this._children.length;
    for ( var i = 0; i < length; i++) {
      this._children[reverse ? length - 1 - i : i].traverse(callback);
    }
  }.bind(this));
};

Cutout.prototype.render = function(context) {

  // validate
  this.traverse(function(children) {
    if (!this._visible) {
      return;
    }
    this.validateDown();
    children();
    this.validateUp();
  });

  // paint
  this.traverse(function(children) {
    if (!this._visible) {
      return;
    }

    context.save();

    var m = this.matrix();
    context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);

    this.paint(context);

    children();

    context.restore();
  });
};

Cutout.prototype.paint = function(context) {
};

Cutout.prototype.validateDown = function() {
  if (this._aligned
      && this.clearNotif(Cutout.notif.size, Cutout.notif.parent,
          Cutout.notif.parent_size)) {
    this._transformed = true;
  }
};

Cutout.prototype.validateUp = function() {
};

Cutout.prototype.matrix = function() {
  if (this._transformed) {
    this._transformed = false;

    var m = this._matrix;

    this._matrix.identity();

    if (this._pivotX !== null && this._pivotY != null) {
      // pivot
      this._matrix.translate(-this._pivotX * this._width, -this._pivotY
          * this._height);
    }

    this._matrix.scale(this._scaleX, this._scaleY);
    this._matrix.rotate(this._rotation);
    this._matrix.skew(this._skewX, this._skewX);

    if (this._pivotX !== null && this._pivotY != null) {
      // pivot
      this._matrix.translate(this._pivotX * this._width, this._pivotY
          * this._height);

      this._boxWidth = this._width;
      this._boxHeight = this._height;

    } else {
      // box
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

      this._boxWidth = xMax - xMin;
      this._boxHeight = yMax - yMin;

      this._matrix.translate(-xMin, -yMin);
    }

    this._matrix.translate(-this._inH * this._boxWidth, -this._inV
        * this._boxHeight);

    var x = this._offsetX;
    var y = this._offsetY;
    if (this._parent) {
      this._outH && (x += this._outH * this._parent._width);
      this._outV && (y += this._outV * this._parent._height);
    }
    this._matrix.translate(x, y);
  }
  return this._matrix;
};

Cutout.prototype.toString = function() {
  return "[" + this._id + ": " + this._width + "x" + this._height + " scale("
      + this._scaleX + ", " + this._scaleY + ") rotate(" + this._rotation
      + ") skew(" + this._skewX + ", " + this._skewX + ") " + this._boxWidth
      + "x" + this._boxHeight + "]";
};

Cutout.prototype.postNotif = function(name) {
  this._notifs[name] = true;
  if (this._parent) {
    this._parent._notifs["child." + name] = true;
  }
  for ( var i = 0; i < this._children.length; i++) {
    this._children[i]._notifs["parent." + name] = true;
  }
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

Cutout.prototype.removeChild = function(child) {
  var index = this._children.indexOf(child);
  if (index > -1) {
    this._children.splice(index, 1);
    child._parent = null;
  }
  this.postNotif(Cutout.notif.children);
};

Cutout.prototype.empty = function() {
  var children = this._children.splice(0);
  for ( var i = 0; i < children.length; i++) {
    children[i]._parent = null;
  }
  this.postNotif(Cutout.notif.children);
  return this;
};

Cutout.prototype.appendTo = function(parent) {
  parent.append(this);
  return this;
};

Cutout.prototype.prependTo = function(parent) {
  parent.prepend(this);
  return this;
};

Cutout.prototype.remove = function() {
  this._parent && this._parent.removeChild(this);
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

Cutout.prototype.publish = function(name, event, point) {
  if (point) {
    point = this.matrix().reverse().map(point);

    if (!this.spy && !this.isInside(point)) {
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

Cutout.prototype.isInside = function(p) {
  return p.x >= 0 && p.x <= this._width && p.y >= 0 && p.y <= this._height;
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
  if (typeof x !== "undefined") {
    return this.size(x, this._height);
  }
  return this._width;
};

Cutout.prototype.height = function(y) {
  if (typeof y !== "undefined") {
    return this.size(this._width, y);
  }
  return this._height;
};

Cutout.prototype.scaleTo = function(width, height, mode) {
  if (mode == Cutout.scale.slice) {
    this.scale(Math.max(width / this._width, height / this._height));
  } else if (mode == Cutout.scale.fit) {
    this.scale(Math.min(width / this._width, height / this._height));
  }
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

Cutout.prototype.skew = function(x, y) {
  y = typeof y === "undefined" ? x : y;

  this._skewX = x;
  this._skewX = y;

  this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.rotate = function(angle) {
  this._rotation = angle;

  this._transformed = true;
  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.prototype.offset = function(x, y) {
  this._offsetX = x;
  this._offsetY = y;

  this._transformed = true;
  return this;
};

Cutout.prototype.pivot = function(x, y) {
  y = typeof y === "undefined" ? x : y;
  this._pivotX = CutoutUtils.isNum(x) ? (x / 2 + 0.5) : x;
  this._pivotY = CutoutUtils.isNum(y) ? (y / 2 + 0.5) : y;

  this._transformed = true;
  return this;
};

Cutout.prototype.align = function(outH, outV, inH, inV) {

  outV = typeof outV !== "undefined" ? outV : outH;
  inH = typeof inH !== "undefined" ? inH : outH;
  inV = typeof inV !== "undefined" ? inV : outV;

  CutoutUtils.isNum(outH) && (this._outH = outH / 2 + 0.5);
  CutoutUtils.isNum(outV) && (this._outV = outV / 2 + 0.5);
  CutoutUtils.isNum(inH) && (this._inH = inH / 2 + 0.5);
  CutoutUtils.isNum(inV) && (this._inV = inV / 2 + 0.5);

  this._aligned = true;
  this._transformed = true;
  return this;
};

// Static

Cutout.scale = {
  fit : "fit",
  slice : "slice"
};

Cutout.align = {
  start: -1,
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
};

Cutout.textures = {};
Cutout.images = {};

Cutout.loadImages = function(imageLoader, completeCallback) {
  var imageCount = 0;
  var handleComplete = function() {
    console.log("Loading image completed.");
    checkComplete();
  };

  var handleError = function(msg) {
    console.log("Error loading image: " + msg);
    checkComplete();
  };

  var checkComplete = function() {
    if (--imageCount <= 0) {
      completeCallback && completeCallback();
    }
  };

  var textures = Cutout.textures;
  for ( var tex in textures) {
    if (textures[tex].imagePath) {
      imageCount++;
      var src = textures[tex].imagePath;
      var image = imageLoader(src, handleComplete, handleError);
      Cutout.addImage(image, src);
    }
  }
};

Cutout.byName = function(tex, name) {
  if (typeof tex !== "string" || typeof name !== "string") {
    return null;
  }

  var texture = Cutout.textures[tex];
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

Cutout.byPrefix = function(tex, prefix) {
  if (typeof tex !== "string" || typeof prefix !== "string") {
    return null;
  }

  var result = [];
  var texture = Cutout.textures[tex];
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

Cutout.addTexture = function() {
  for ( var i = 0; i < arguments.length; i++) {
    data = arguments[i];
    Cutout.textures[data.name] = data;
  }
  return this;
};

Cutout.getImage = function(src) {
  return Cutout.images[src];
};

Cutout.addImage = function(image, src) {
  Cutout.images[src] = image;
  return this;
};

Cutout.Cut = function(image, cut, ratio) {

  ratio = ratio || 1;
  cut.w = cut.w || cut.width;
  cut.h = cut.h || cut.height;

  this.image = image;
  this.name = cut.name;

  this.sx = cut.x * ratio;
  this.sy = cut.y * ratio;
  this.sw = cut.w * ratio;
  this.sh = cut.h * ratio;

  this.dx = 0;
  this.dy = 0;
  this.dw = cut.w;
  this.dh = cut.h;
};

Cutout.Cut.prototype.toString = function() {
  return "[" + this.name + ": " + this.dx + "x" + this.dy + ", " + this.dw
      + "x" + this.dh + "]";
};

Cutout.Cut.prototype.paint = function(context) {
  context.drawImage(this.image, // source
  this.sx, this.sy, this.sw, this.sh, // cut
  this.dx, this.dy, this.dw, this.dh // position
  );
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

Cutout.Matrix.prototype.clone = function(m) {
  return new Cutout.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
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

Cutout.image = function(texture, name) {
  return new Cutout.Image(texture, name);
};

Cutout.Image = function(texture, name) {
  Cutout.Image.prototype._super.call(this);

  if (!arguments.length)
    return;

  this.texture = texture;
  this.name = name;
  this.setImage(Cutout.byName(texture, name));
};

Cutout.Image.prototype = new Cutout();
Cutout.Image.prototype._super = Cutout;
Cutout.Image.prototype.constructor = Cutout.Image;

Cutout.Image.prototype.setImage = function(cut) {
  this._cut = cut;
  this._width = this._cut.dw;
  this._height = this._cut.dh;
  return this;
};

Cutout.Image.prototype.paint = function(context) {
  this._cut && this._cut.paint(context);
};

Cutout.anim = function(texture, prefix, fps) {
  return new Cutout.Anim(texture, prefix).gotoFrame(0).fps(fps);
};

Cutout.Anim = function(texture, prefix) {
  Cutout.Anim.prototype._super.call(this);

  this._startTime = null;
  this._fps = null;

  this._frame = 0;
  this._frames = [];
  this._labels = {};

  if (!arguments.length)
    return;

  this.texture = texture;
  this.prefix = prefix;
  this.setFrames(Cutout.byPrefix(texture, prefix));
};

Cutout.Anim.prototype = new Cutout();
Cutout.Anim.prototype._super = Cutout;
Cutout.Anim.prototype.constructor = Cutout.Anim;

Cutout.Anim.prototype.fps = function(fps) {
  this._fps = fps;
  return this;
};

Cutout.Anim.prototype.setFrames = function(cuts) {
  if (cuts && cuts.length) {
    for ( var i = 0; i < cuts.length; i++) {
      var cut = cuts[i];
      this._frames.push(cut);
      this._labels[cuts[i].name] = i;
    }
  }
  return this;
};

Cutout.Anim.prototype.gotoFrame = function(frame) {
  this._frame = CutoutUtils.rotate(frame, this._frames.length);
  this._cut = this._frames[this._frame];
  this._width = this._cut.dw;
  this._height = this._cut.dh;
  return this;
};

Cutout.Anim.prototype.randomFrame = function() {
  this.gotoFrame(Math.floor(Math.random() * this._frames.length));
};

Cutout.Anim.prototype.forwardFrame = function(frame) {
  this.gotoFrame(this._frame + frame);
};

Cutout.Anim.prototype.backwardFrame = function(frame) {
  this.gotoFrame(this._frame - frame);
};

Cutout.Anim.prototype.gotoLabel = function(name) {
  return this.gotoFrame(this._labels[name] || 0);
};

Cutout.Anim.prototype.setValue = function(value) {
  this.gotoLabel(this.prefix + value);
  this.postNotif(Cutout.notif.size);
  return this;
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

Cutout.string = function(texture, prefix) {
  return new Cutout.String(texture, prefix);
};

Cutout.String = function(texture, prefix) {
  Cutout.String.prototype._super.call(this);

  if (!arguments.length)
    return;

  this.texture = texture;
  this.prefix = prefix;
};

Cutout.String.prototype = new Cutout();
Cutout.String.prototype._super = Cutout;
Cutout.String.prototype.constructor = Cutout.String;

Cutout.String.prototype.setValue = function(value) {
  if (!value.length) {
    value = value + "";
  }
  this._width = 0;
  for ( var i = 0; i < Math.max(this._children.length, value.length); i++) {
    var digit = i < this._children.length ? this._children[i] : Cutout.anim(
        this.texture, this.prefix).appendTo(this);

    digit.offset(this._width, null);
    if (i < value.length) {
      digit.setValue(value[i]).show();
      this._width += digit._width;
      this._height = digit._height;
    } else {
      digit.hide();
    }
  }

  this.postNotif(Cutout.notif.size);
  return this;
};

Cutout.row = function(valign) {
  var co = new Cutout();
  co.spy = true;
  co.validateUp = function() {
    Cutout.prototype.validateUp.call(this);

    if (!this.clearNotif(Cutout.notif.child_size, Cutout.notif.children)) {
      return;
    }

    this._width = 0;
    this._height = 0;

    for ( var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      child.align(null, valign);
      child.offset(this._width, null);
      if (child._visible) {
        child.matrix();
        child._transformed = true;
        this._width += child._boxWidth;
      }

      this._height = Math.max(this._height, child._boxHeight);
    }

    this.postNotif(Cutout.notif.size);
    return this;
  };
  return co;
};

Cutout.column = function(halign) {
  var co = new Cutout();
  co.spy = true;
  co.validateUp = function() {
    Cutout.prototype.validateUp.call(this);
    if (!this.clearNotif(Cutout.notif.child_size, Cutout.notif.children)) {
      return;
    }

    this._width = 0;
    this._height = 0;

    for ( var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      child.align(halign, null);
      child.offset(null, this._height);
      if (child._visible) {
        child.matrix();
        child._transformed = true;
        this._height += child._boxHeight;
      }
      this._width = Math.max(this._width, child._boxWidth);
    }

    this.postNotif(Cutout.notif.size);
    return this;
  };
  return co;
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
    return (num - min) % (max - min) + (num < 0 ? max : min);
  } else {
    return (num - max) % (min - max) + (num < 0 ? min : max);
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