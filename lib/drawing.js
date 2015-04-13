/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
var Texture = require('./texture');

// TODO

Cut.draw = function(type, attributes, callback) {
  if (typeof type === 'string') {
    if (typeof attributes === 'object') {
    } else {
      if (typeof attributes === 'function') {
        callback = attributes;
      }
      attributes = {};
    }
  } else {
    if (typeof type === 'function') {
      callback = type;
    }
    attributes = {};
    type = '2d';
  }

  var canvas = document.createElement('canvas');
  var context = canvas.getContext(type, attributes);
  var texture = new Texture(canvas);

  texture.draw = function(callback) {
    callback.call(this, context);
    return this;
  };

  texture.size = function(width, height, ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    this.src(0, 0, w * r, h * r);
    this.dest(0, 0, w, h);
    this.width = width;
    this.height = height;
    return this;
  };

  if (typeof callback === 'function') {
    texture.draw(callback);
  }

  return texture;
};