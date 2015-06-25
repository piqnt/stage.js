var Class = require('./core');
require('./pin');
require('./loop');

var create = require('./util/create');
var is = require('./util/is');

Class.string = function(frames) {
  return new Str().frames(frames);
};

Str._super = Class;
Str.prototype = create(Str._super.prototype);

function Str() {
  Str._super.call(this);
  this.label('String');
  this._textures = [];
};

/**
 * @deprecated Use frames
 */
Str.prototype.setFont = function(a, b, c) {
  return this.frames(a, b, c);
};

Str.prototype.frames = function(frames) {
  this._textures = [];
  if (typeof frames == 'string') {
    frames = Class.texture(frames);
    this._item = function(value) {
      return frames.one(value);
    };
  } else if (typeof frames === 'object') {
    this._item = function(value) {
      return frames[value];
    };
  } else if (typeof frames === 'function') {
    this._item = frames;
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
    var image = this._textures[i] = this._item(value[i]);
    width += i > 0 ? this._spacing : 0;
    image.dest(width, 0);
    width = width + image.width;
    height = Math.max(height, image.height);
  }
  this.pin('width', width);
  this.pin('height', height);
  this._textures.length = value.length;
  return this;
};
