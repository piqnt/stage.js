import Stage from './core';
import Texture from './texture';

Stage.canvas = function(type, attributes, plotter) {
  if (typeof type === 'string') {
    if (typeof attributes === 'object') {
    } else {
      if (typeof attributes === 'function') {
        plotter = attributes;
      }
      attributes = {};
    }
  } else {
    if (typeof type === 'function') {
      plotter = type;
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

  // texture.canvas = function(fn) {
  //   if (typeof fn === 'function') {
  //     fn.call(this, context);
  //   } else if (typeof fn === 'undefined' && typeof plotter === 'function') {
  //     plotter.call(this, context);
  //   }
  //   return this;
  // };

  if (typeof plotter === 'function') {
    plotter.call(texture, context);
  }

  return texture;
};