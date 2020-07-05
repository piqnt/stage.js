var Class = require('./core');
var Texture = require('./texture');

Class.canvas = function(type, attributes, drawFn) {
  if (typeof type === 'string') {
    if (typeof attributes === 'object') {
    } else {
      if (typeof attributes === 'function') {
        drawFn = attributes;
      }
      attributes = {};
    }
  } else {
    if (typeof type === 'function') {
      drawFn = type;
    }
    attributes = {};
    type = '2d';
  }

  var canvas = document.createElement('canvas');
  var context = canvas.getContext(type, attributes);
  var texture = new Texture(canvas);

  texture.context = function() {
    return context;
  };

  texture.size = function(width, height, ratio) {
    ratio = ratio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    this.src(canvas, ratio);
    return this;
  };

  texture.canvas = function(fn) {
    if (typeof fn === 'function') {
      fn.call(this, context);
    } else if (typeof fn === 'undefined' && typeof drawFn === 'function') {
      drawFn.call(this, context);
    }
    return this;
  };

  if (typeof drawFn === 'function') {
    drawFn.call(texture, context);
  }

  return texture;
};