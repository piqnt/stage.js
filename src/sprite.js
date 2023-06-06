import { texture } from './atlas';
import { Stage } from './core';

export const sprite = function(query) {
  var sprite = new Sprite();
  query && sprite.image(query);
  return sprite;
};

Sprite._super = Stage;
Sprite.prototype = Object.create(Sprite._super.prototype);

export function Sprite() {
  Sprite._super.call(this);
  this.label('Sprite');
  this._textures = [];
  this._image = null;
};

Sprite.prototype.image = function(frame) {
  this._image = texture(frame).one();
  this.pin('width', this._image ? this._image.width : 0);
  this.pin('height', this._image ? this._image.height : 0);
  this._textures[0] = this._image.pipe();
  this._textures.length = 1;
  return this;
};

Sprite.prototype.tile = function(inner) {
  this._repeat(false, inner);
  return this;
};

Sprite.prototype.stretch = function(inner) {
  this._repeat(true, inner);
  return this;
};

Sprite.prototype._repeat = function(stretch, inner) {
  var self = this;
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    if (this._mo_stretch == this._pin._ts_transform) {
      return;
    }
    this._mo_stretch = this._pin._ts_transform;
    var width = this.pin('width');
    var height = this.pin('height');
    this._textures.length = repeat(this._image, width, height, stretch, inner, insert);
  });

  function insert(i, sx, sy, sw, sh, dx, dy, dw, dh) {
    var repeat = self._textures.length > i ? self._textures[i]
        : self._textures[i] = self._image.pipe();
    repeat.src(sx, sy, sw, sh);
    repeat.dest(dx, dy, dw, dh);
  }
};

function repeat(img, owidth, oheight, stretch, inner, insert) {

  var width = img.width;
  var height = img.height;
  var left = img.left;
  var right = img.right;
  var top = img.top;
  var bottom = img.bottom;

  left = typeof left === 'number' && left === left ? left : 0;
  right = typeof right === 'number' && right === right ? right : 0;
  top = typeof top === 'number' && top === top ? top : 0;
  bottom = typeof bottom === 'number' && bottom === bottom ? bottom : 0;

  width = width - left - right;
  height = height - top - bottom;

  if (!inner) {
    owidth = Math.max(owidth - left - right, 0);
    oheight = Math.max(oheight - top - bottom, 0);
  }

  var i = 0;

  if (top > 0 && left > 0)
    insert(i++, 0, 0, left, top, 0, 0, left, top);
  if (bottom > 0 && left > 0)
    insert(i++, 0, height + top, left, bottom, 0, oheight + top, left, bottom);
  if (top > 0 && right > 0)
    insert(i++, width + left, 0, right, top, owidth + left, 0, right, top);
  if (bottom > 0 && right > 0)
    insert(i++, width + left, height + top, right, bottom, owidth + left,
        oheight + top, right, bottom);

  if (stretch) {
    if (top > 0)
      insert(i++, left, 0, width, top, left, 0, owidth, top);
    if (bottom > 0)
      insert(i++, left, height + top, width, bottom, left, oheight + top,
          owidth, bottom);
    if (left > 0)
      insert(i++, 0, top, left, height, 0, top, left, oheight);
    if (right > 0)
      insert(i++, width + left, top, right, height, owidth + left, top, right,
          oheight);
    // center
    insert(i++, left, top, width, height, left, top, owidth, oheight);

  } else { // tile
    var l = left, r = owidth, w;
    while (r > 0) {
      w = Math.min(width, r), r -= width;
      var t = top, b = oheight, h;
      while (b > 0) {
        h = Math.min(height, b), b -= height;
        insert(i++, left, top, w, h, l, t, w, h);
        if (r <= 0) {
          if (left)
            insert(i++, 0, top, left, h, 0, t, left, h);
          if (right)
            insert(i++, width + left, top, right, h, l + w, t, right, h);
        }
        t += h;
      }
      if (top)
        insert(i++, left, 0, w, top, l, 0, w, top);
      if (bottom)
        insert(i++, left, height + top, w, bottom, l, t, w, bottom);
      l += w;
    }
  }

  return i;
};