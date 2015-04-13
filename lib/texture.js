/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var stats = require('./util/stats');
var math = require('./util/math');
var is = require('./util/is');

function Texture(image) {
  image && this.src(image);
}

Texture.prototype.clone = function() {
  return new Texture(this);
};

/**
 * Signatures: (image), (x, y, w, h), (w, h)
 */
Texture.prototype.src = function(x, y, w, h) {
  if (typeof x === 'object') {
    var image = x;
    this._image = image;
    this.sx = this.dx = 0;
    this.sy = this.dy = 0;
    this.sw = this.dw = image.width;
    this.sh = this.dh = image.height;

    if (is.number(y)) {
      this.ratio = y;
    }

  } else {
    if (typeof w === 'undefined') {
      w = x, h = y;
    } else {
      this.sx = x, this.sy = y;
    }
    this.sw = w, this.sh = h;
    this.dw = w, this.dh = h;
    this.width = w, this.height = h;
  }
  return this;
};

/**
 * Signatures: (x, y, w, h), (x, y)
 */
Texture.prototype.dest = function(x, y, w, h) {
  this.dx = x, this.dy = y;
  this.dx = x, this.dy = y;
  if (typeof w !== 'undefined') {
    this.dw = w, this.dh = h;
    this.width = w, this.height = h;
  }
  return this;
};

Texture.prototype.draw = function(context, x1, y1, x2, y2, x3, y3, x4, y4) {
  var image = this._image;
  if (image === null || typeof image !== 'object') {
    return;
  }

  var sx = this.sx, sy = this.sy;
  var sw = this.sw, sh = this.sh;
  var dx = this.dx, dy = this.dy;
  var dw = this.dw, dh = this.dh;
  if (typeof x3 !== 'undefined') {
    sx += x1, sy += y1, sw = x2, sh = y2;
    dx = x3, dy = y3, dw = x4, dh = y4;
  } else if (typeof x2 !== 'undefined') {
    dx = x1, dy = y1, dw = x2, dh = y2;
  } else if (typeof x1 !== 'undefined') {
    dw = x1, dh = y1;
  }
  // sx = math.limit(sx, 0, this._width);
  // sy = math.limit(sy, 0, this._height);
  // sw = math.limit(sw, 0, this._width - sx);
  // sh = math.limit(sh, 0, this._height - sy);

  var ratio = this.ratio || 1;
  sx *= ratio, sy *= ratio, sw *= ratio, sh *= ratio;

  try {
    if (typeof image.draw === 'function') {
      image.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
      stats.draw++;
      context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  } catch (ex) {
    if (!image._draw_failed) {
      console.log('Unable to draw: ', image);
      console.log(ex);
      image._draw_failed = true;
    }
  }
};

module.exports = Texture;
