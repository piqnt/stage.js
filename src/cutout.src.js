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

  this.width = 0;
  this.height = 0;

  this.scaleX = 1;
  this.scaleY = 1;
  this.skewX = 0;
  this.skewY = 0;
  this.rotation = 0;

  this.cx = null;
  this.cy = null;

  this.tx = 0;
  this.ty = 0;

  this.outH = 0;
  this.outV = 0;
  this.inH = 0;
  this.inV = 0;

  this.matrix = new Cutout.Matrix();

  this.transedWidth = this.width;
  this.transedHeight = this.height;

  this.visible = true;

  this.children = [];
  this.parent = null;

  this.notifs = {};
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

Cutout.prototype.render = function(context) {
  this.validate();
  this.tick(context);
};

Cutout.prototype.tick = function(context) {
  if (!this.visible) {
    return;
  }

  context.save();

  var m = this.getMatrix();
  context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);

  this.paint(context);

  for ( var i = 0; i < this.children.length; i++) {
    this.children[i].tick(context, false);
  }

  context.restore();
};

Cutout.prototype.paint = function(context) {
};

Cutout.prototype.validate = function() {
  if (!this.visible) {
    return;
  }

  this.validateDown();
  for ( var i = 0; i < this.children.length; i++) {
    this.children[i].validate();
  }
  this.validateUp();
};

Cutout.prototype.validateDown = function() {
};

Cutout.prototype.validateUp = function() {
};

Cutout.prototype.getMatrix = function() {
  if (this.transformed) {
    this.transformed = false;

    var m = this.matrix;

    this.matrix.identity();

    if (this.cx !== null && this.cy != null) {
      // pivot
      this.matrix.translate(-this.cx * this.width, -this.cy * this.height);
    }

    this.matrix.scale(this.scaleX, this.scaleY);
    this.matrix.rotate(this.rotation);
    this.matrix.skew(this.skewX, this.skewY);

    if (this.cx !== null && this.cy != null) {
      // pivot
      this.matrix.translate(this.cx * this.width, this.cy * this.height);

      this.transedWidth = this.width;
      this.transedHeight = this.height;

    } else {
      // new box
      var x = this.width;
      var y = this.height;
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

      this.transedWidth = xMax - xMin;
      this.transedHeight = yMax - yMin;

      this.matrix.translate(-xMin, -yMin);
    }

    this.matrix.translate(-this.inH * this.transedWidth, -this.inV
        * this.transedHeight);

    var x = this.tx;
    var y = this.ty;
    if (this.parent) {
      this.outH && (x += this.outH * this.parent.width);
      this.outV && (y += this.outV * this.parent.height);
    }
    this.matrix.translate(x, y);
  }
  return this.matrix;
};

Cutout.prototype.toString = function() {
  return "[" + this._id + ": " + this.width + "x" + this.height + " scale("
      + this.scaleX + ", " + this.scaleY + ") rotate(" + this.rotation
      + ") skew(" + this.skewX + ", " + this.skewY + ") " + this.transedWidth
      + "x" + this.transedHeight + "]";
};

Cutout.prototype.notif = function(name) {
  this.notifs[name] = true;
  if (this.parent) {
    this.parent.notifs["child." + name] = true;
  }
  for ( var i = 0; i < this.children.length; i++) {
    this.children[i].notifs["parent." + name] = true;
  }
};

Cutout.prototype.check = function() {
  var found = false;
  for ( var i = 0; i < arguments.length; i++) {
    var name = arguments[i];
    if (this.notifs[name]) {
      found = true;
      delete this.notifs[name];
    }
  }
  return found;
};

Cutout.prototype.append = function() {
  for ( var i = 0; i < arguments.length; i++) {
    var child = arguments[i];
    child.remove();
    this.children.push(child);
    child.parent = this;
    child.notif(Cutout.on_parent);
  }

  this.notif(Cutout.on_children);
  return this;
};

Cutout.prototype.prepend = function() {
  for ( var i = arguments.length - 1; i >= 0; i--) {
    var child = arguments[i];
    child.remove();
    this.children.unshift(child);
    child.parent = this;
    child.notif(Cutout.on_parent);
  }

  this.notif(Cutout.on_children);
  return this;
};

Cutout.prototype.removeChild = function(child) {
  var index = this.children.indexOf(child);
  if (index > -1) {
    this.children.splice(index, 1);
    child.parent = null;
  }
  this.notif(Cutout.on_children);
};

Cutout.prototype.empty = function() {
  var children = this.children.splice(0);
  for ( var i = 0; i < children.length; i++) {
    children[i].parent = null;
  }
  this.notif(Cutout.on_children);
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
  this.parent && this.parent.removeChild(this);
  return this;
};

Cutout.prototype.hide = function() {
  this.visible = false;

  this.notif(Cutout.on_size);
  return this;
};

Cutout.prototype.show = function() {
  this.visible = true;

  this.notif(Cutout.on_size);
  return this;
};

Cutout.prototype.publish = function(name, event, point) {
  point = this.getMatrix().reverse().map(point);

  if (!this.spy && !this.isInside(point)) {
    return;
  }

  var handler = this[name];
  if (U.isFunction(handler)) {
    if (handler.call(this, event, point)) {
      return true;
    }
  }

  for ( var i = this.children.length - 1; i >= 0; i--) {
    var child = this.children[i];
    if (child.visible && child.publish(name, event, point)) {
      return true;
    }
  }

  return false;
};

Cutout.prototype.isInside = function(p) {
  return p.x >= 0 && p.x <= this.width && p.y >= 0 && p.y <= this.height;
};

Cutout.prototype.scaleTo = function(width, height, mode) {
  if (mode == "slice") {
    this.scale(Math.max(width / this.width, height / this.height));
  } else if (mode == "fit") {
    this.scale(Math.min(width / this.width, height / this.height));
  }
  return this;
};

Cutout.prototype.scale = function(x, y) {
  y = typeof y === "undefined" ? x : y;

  this.scaleX = x;
  this.scaleY = y;

  this.transformed = true;
  this.notif(Cutout.on_size);
  return this;
};

Cutout.prototype.skew = function(x, y) {
  y = typeof y === "undefined" ? x : y;

  this.skewX = x;
  this.skewY = y;

  this.transformed = true;
  this.notif(Cutout.on_size);
  return this;
};

Cutout.prototype.rotate = function(angle) {
  this.rotation = angle;

  this.transformed = true;
  this.notif(Cutout.on_size);
  return this;
};

Cutout.prototype.translate = function(x, y) {
  this.tx = x;
  this.ty = y;

  this.transformed = true;
  return this;
};

Cutout.prototype.pivot = function(x, y) {
  y = typeof y === "undefined" ? x : y;
  this.cx = U.isNum(x) ? (x / 2 + 0.5) : x;
  this.cy = U.isNum(y) ? (y / 2 + 0.5) : y;

  this.transformed = true;
  return this;
};

Cutout.prototype.align = function(outH, outV, inH, inV) {

  outV = typeof outV !== "undefined" ? outV : outH;
  inH = typeof inH !== "undefined" ? inH : outH;
  inV = typeof inV !== "undefined" ? inV : outV;

  U.isNum(outH) && (this.outH = outH / 2 + 0.5);
  U.isNum(outV) && (this.outV = outV / 2 + 0.5);
  U.isNum(inH) && (this.inH = inH / 2 + 0.5);
  U.isNum(inV) && (this.inV = inV / 2 + 0.5);

  this.validateDown = function() {
    if (!this.check(Cutout.on_size, Cutout.on_parent, Cutout.on_parent_size)) {
      return;
    }
    this.transformed = true;
  }.bind(this);

  this.transformed = true;
  return this;
};

// Static

Cutout.on_children = "children";
Cutout.on_child_children = "child.children";
Cutout.on_parent_children = "parent.children";

Cutout.on_parent = "parent";
Cutout.on_child_parent = "child.parent";
Cutout.on_parent_parent = "parent.parent";

Cutout.on_size = "size";
Cutout.on_child_size = "child.size";
Cutout.on_parent_size = "parent.size";

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

  var textures = Cutout.textures[tex];
  if (textures == null) {
    return null;
  }

  var img = Cutout.getImage(textures.imagePath);

  var cuts = textures.cuts;
  for ( var i = 0; i < cuts.length; i++) {
    if (cuts[i].name == name) {
      return new Cutout.Cut(img, cuts[i]);
    }
  }

  return null;
};

Cutout.byPrefix = function(tex, prefix) {
  if (typeof tex !== "string" || typeof prefix !== "string") {
    return null;
  }

  var result = [];
  var textures = Cutout.textures[tex];
  if (textures == null) {
    return result;
  }

  var img = Cutout.getImage(textures.imagePath);

  var prefLen = prefix.length;
  var cuts = textures.cuts;
  for ( var i = 0; i < cuts.length; i++) {
    var texture = cuts[i];
    if (texture.name && texture.name.substring(0, prefLen) == prefix) {
      result.push(new Cutout.Cut(img, cuts[i]));
    }
  }

  return result;
};

Cutout.addTexture = function() {
  for ( var i = 0; i < arguments.length; i++) {
    data = arguments[i];
    if (data.imageRatio) {
      for ( var i = 0; i < data.cuts.length; i++) {
        var cut = data.cuts[i];
        cut.x *= data.imageRatio;
        cut.y *= data.imageRatio;
        cut.width *= data.imageRatio;
        cut.height *= data.imageRatio;
      }
    }
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

Cutout.Cut = function(image, cut) {

  this.image = image;
  this.name = cut.name;

  this.cutX = cut.x;
  this.cutY = cut.y;
  this.cutWidth = cut.width;
  this.cutHeight = cut.height;

  this.x = 0;
  this.y = 0;
  this.width = cut.width;
  this.height = cut.height;
};

Cutout.Cut.prototype.toString = function() {
  return "[" + this.name + ": " + this.x + "x" + this.y + ", " + this.width
      + "x" + this.height + "]";
};

Cutout.Cut.prototype.paint = function(context) {
  context.drawImage(this.image, // source
  this.cutX, this.cutY, this.cutWidth, this.cutHeight, // cut
  this.x, this.y, this.width, this.height // position
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
  this.texture = texture;
  this.name = name;
  this.setImage(Cutout.byName(texture, name));
};

Cutout.Image.prototype = new Cutout();
Cutout.Image.prototype._super = Cutout;
Cutout.Image.prototype.constructor = Cutout.Image;

Cutout.Image.prototype.setImage = function(cut) {
  this.cut = cut;
  this.width = this.cut.width;
  this.height = this.cut.height;
  return this;
};

Cutout.Image.prototype.paint = function(context) {
  this.cut && this.cut.paint(context);
};

Cutout.anim = function(texture, prefix, fps) {
  return new Cutout.Anim(texture, prefix).gotoFrame(0).setFPS(fps);
};

Cutout.Anim = function(texture, prefix) {
  Cutout.Anim.prototype._super.call(this);

  this.frame = 0;
  this.frames = [];
  this.labels = {};

  this.texture = texture;
  this.prefix = prefix;
  this.setFrames(Cutout.byPrefix(texture, prefix));
};

Cutout.Anim.prototype = new Cutout();
Cutout.Anim.prototype._super = Cutout;
Cutout.Anim.prototype.constructor = Cutout.Anim;

Cutout.Anim.prototype.paint = function(context) {
  if (this.fps && this.startTime && this.frames.length > 1) {
    var totalTime = +new Date() - this.startTime;
    var frame = Math.floor(this.fps * (totalTime ? totalTime / 1000 : 0));
    this.gotoFrame(frame);
  }
  this.cut && this.cut.paint(context);
};

Cutout.Anim.prototype.setValue = function(value) {
  this.gotoLabel(this.prefix + value);
  this.notif(Cutout.on_size);
  return this;
};

Cutout.Anim.prototype.setFPS = function(fps) {
  this.fps = fps;
  return this;
};

Cutout.Anim.prototype.setFrames = function(cuts) {
  if (cuts && cuts.length) {
    for ( var i = 0; i < cuts.length; i++) {
      var cut = cuts[i];
      this.frames.push(cut);
      this.labels[cuts[i].name] = i;
    }
  }
  return this;
};

Cutout.Anim.prototype.gotoFrame = function(frame) {
  this.frame = U.rotate(frame, this.frames.length);
  this.cut = this.frames[this.frame];
  this.width = this.cut.width;
  this.height = this.cut.height;
  return this;
};

Cutout.Anim.prototype.randomFrame = function() {
  this.gotoFrame(Math.floor(Math.random() * this.frames.length));
};

Cutout.Anim.prototype.forwardFrame = function(frame) {
  this.gotoFrame(this.frame + frame);
};

Cutout.Anim.prototype.backwardFrame = function(frame) {
  this.gotoFrame(this.frame - frame);
};

Cutout.Anim.prototype.gotoLabel = function(name) {
  return this.gotoFrame(this.labels[name] || 0);
};

Cutout.Anim.prototype.play = function(reset) {
  this.startTime = reset || !this.startTime ? +new Date() : this.startTime;
  return this;
};

Cutout.Anim.prototype.stop = function(frame) {
  this.startTime = null;
  if (U.isNum(frame)) {
    this.gotoFrame(frame);
  }
  return this;
};

Cutout.string = function(texture, prefix) {
  return new Cutout.String(texture, prefix);
};

Cutout.String = function(texture, prefix) {
  Cutout.String.prototype._super.call(this);
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
  this.width = 0;
  for ( var i = 0; i < Math.max(this.children.length, value.length); i++) {
    var digit = i < this.children.length ? this.children[i] : Cutout.anim(
        this.texture, this.prefix).appendTo(this);

    digit.translate(this.width, null);
    if (i < value.length) {
      digit.setValue(value[i]).show();
      this.width += digit.width;
      this.height = digit.height;
    } else {
      digit.hide();
    }
  }

  this.notif(Cutout.on_size);
  return this;
};

Cutout.row = function(valign) {
  var co = new Cutout();
  co.spy = true;
  co.validateUp = function() {
    if (!this.check(Cutout.on_child_size, Cutout.on_children)) {
      return;
    }
    this.width = 0;
    // this.height = 0;

    for ( var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.align(null, valign);
      child.translate(this.width, null);
      child.getMatrix();
      // console.log(child.toString());
      if (child.visible) {
        this.width += child.transedWidth;
      }
      // this.height = Math.max(this.height, child.transedHeight);
    }

    this.notif(Cutout.on_size);
    return this;
  };
  return co;
};

Cutout.column = function(halign) {
  var co = new Cutout();
  co.spy = true;
  co.validateUp = function() {
    if (!this.check(Cutout.on_child_size, Cutout.on_children)) {
      return;
    }
    // this.width = 0;
    this.height = 0;

    for ( var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.align(halign, null);
      child.translate(null, this.height);
      child.getMatrix();
      // console.log(child.toString());
      if (child.visible) {
        this.height += child.transedHeight;
      }
      // this.width = Math.max(this.width, child.transedWidth);
    }

    this.notif(Cutout.on_size);
    return this;
  };
  return co;
};

// Utilities

function U() {

}

U.rad2deg = function(rad) {
  return rad / Math.PI * 180.0;
};

U.deg2rad = function(deg) {
  return deg / 180.0 * Math.PI;
};

U.random = function(min, max) {
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

U.rotate = function(num, min, max) {
  max = max || 0;
  if (max > min) {
    return (num - min) % (max - min) + (num < 0 ? max : min);
  } else {
    return (num - max) % (min - max) + (num < 0 ? min : max);
  }
};

U.size = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

U.isNum = function(x) {
  return typeof x === "number";
};

U.isFunction = function(x) {
  return typeof x === "function";
};