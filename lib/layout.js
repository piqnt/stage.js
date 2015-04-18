/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
require('./pin');
require('./render');

var create = require('./util/create');

Cut.row = function(align) {
  return Cut.create().row(align);
};

Cut.prototype.row = function(align) {
  this.sequence('row', align);
  return this;
};

Cut.column = function(align) {
  return Cut.create().column(align);
};

Cut.prototype.column = function(align) {
  this.sequence('column', align);
  return this;
};

Cut.sequence = function(type, align) {
  return Cut.create().sequence(type, align);
};

Cut.prototype.sequence = function(type, align) {

  this._padding = this._padding || 0;
  this._spacing = this._spacing || 0;

  this.untick(this._sequenceTicker);
  this.tick(this._sequenceTicker = function() {
    if (this._mo_seq == this._ts_touch) {
      return;
    }
    this._mo_seq = this._ts_touch;

    var alignChildren = (this._mo_seqAlign != this._ts_children);
    this._mo_seqAlign = this._ts_children;

    var width = 0, height = 0;

    var child, next = this.first(true);
    var first = true;
    while (child = next) {
      next = child.next(true);

      child._pin.relativeMatrix();
      var w = child.pin('boxWidth');
      var h = child.pin('boxHeight');

      if (type == 'column') {
        !first && (height += this._spacing);
        child.pin('offsetY') != height && child.pin('offsetY', height);
        width = Math.max(width, w);
        height = height + h;
        alignChildren && child.pin('alignX', align);

      } else if (type == 'row') {
        !first && (width += this._spacing);
        child.pin('offsetX') != width && child.pin('offsetX', width);
        width = width + w;
        height = Math.max(height, h);
        alignChildren && child.pin('alignY', align);
      }
      first = false;
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin('width') != width && this.pin('width', width);
    this.pin('height') != height && this.pin('height', height);
  });
  return this;
};

Cut.box = function() {
  return Cut.create().box();
};

Cut.prototype.box = function() {
  if (this._boxTicker)
    return this;

  this._padding = this._padding || 0;

  this.tick(this._boxTicker = function() {
    if (this._mo_box == this._ts_touch) {
      return;
    }
    this._mo_box = this._ts_touch;

    var width = 0, height = 0;
    var child, next = this.first(true);
    while (child = next) {
      next = child.next(true);
      child._pin.relativeMatrix();
      var w = child.pin('boxWidth');
      var h = child.pin('boxHeight');
      width = Math.max(width, w);
      height = Math.max(height, h);
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin('width') != width && this.pin('width', width);
    this.pin('height') != height && this.pin('height', height);
  });
  return this;
};

// TODO: move padding to pin
Cut.prototype.padding = function(pad) {
  this._padding = pad;
  return this;
};

Cut.prototype.spacing = function(space) {
  this._spacing = space;
  return this;
};
