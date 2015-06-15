var stats = require('./util/stats');
var math = require('./util/math');

function Texture(image, ratio) {
  if (typeof image === 'object') {
    this.src(image, ratio);
  }
}

Texture.prototype.pipe = function() {
  return new Texture(this);
};

/**
 * Signatures: (image), (x, y, w, h), (w, h)
 */
Texture.prototype.src = function(x, y, w, h) {
  if (typeof x === 'object') {
    var image = x, ratio = y || 1;

    this._image = image;
    this._sx = this._dx = 0;
    this._sy = this._dy = 0;
    this._sw = this._dw = image.width / ratio;
    this._sh = this._dh = image.height / ratio;

    this.width = image.width / ratio;
    this.height = image.height / ratio;

    this.ratio = ratio;

  } else {
    if (typeof w === 'undefined') {
      w = x, h = y;
    } else {
      this._sx = x, this._sy = y;
    }
    this._sw = this._dw = w;
    this._sh = this._dh = h;

    this.width = w;
    this.height = h;
  }
  return this;
};

/**
 * Signatures: (x, y, w, h), (x, y)
 */
Texture.prototype.dest = function(x, y, w, h) {
  this._dx = x, this._dy = y;
  this._dx = x, this._dy = y;
  if (typeof w !== 'undefined') {
    this._dw = w, this._dh = h;
    this.width = w, this.height = h;
  }
  return this;
};

Texture.prototype.draw = function(context, x1, y1, x2, y2, x3, y3, x4, y4) {
  var image = this._image;
  if (image === null || typeof image !== 'object') {
    return;
  }

  var sx = this._sx, sy = this._sy;
  var sw = this._sw, sh = this._sh;
  var dx = this._dx, dy = this._dy;
  var dw = this._dw, dh = this._dh;

  if (typeof x3 !== 'undefined') {
    x1 = math.limit(x1, 0, this._sw), x2 = math.limit(x2, 0, this._sw - x1);
    y1 = math.limit(y1, 0, this._sh), y2 = math.limit(y2, 0, this._sh - y1);
    sx += x1, sy += y1, sw = x2, sh = y2;
    dx = x3, dy = y3, dw = x4, dh = y4;

  } else if (typeof x2 !== 'undefined') {
    dx = x1, dy = y1, dw = x2, dh = y2;

  } else if (typeof x1 !== 'undefined') {
    dw = x1, dh = y1;
  }

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
