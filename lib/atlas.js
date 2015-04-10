/*
 * CutJS
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Cut = require('./core');
var Texture = require('./texture');
var extend = require('./util/extend');
var create = require('./util/create');

var iid = 0;

Atlas._super = Texture;
Atlas.prototype = create(Atlas._super.prototype);

function Atlas(data) {
  Atlas._super.call(this);
  this.isAtlas = true;
  this.name = data.name || (++iid) + '' + (Math.random() * 100000 | 0);
  this._imagePath = data.imagePath || data.imageUrl;
  this._imageRatio = data.imageRatio || 1;
  this._cutouts = data.cutouts || [];
  this._factory = data.factory;
  this._map = data.filter || data.map;
  this._ppu = data.ppu || data.ratio || 1;
  this._trim = data.trim || 0;
};

Atlas.prototype._cutout = function(def) {
  if (!def || typeof def.draw === 'function') {
    return def;
  }

  def = extend({}, def);

  if (typeof this._map === 'function') {
    def = this._map(def);
  }

  var ppu = this._ppu;
  if (ppu != 1) {
    def.x *= ppu, def.y *= ppu;
    def.width *= ppu, def.height *= ppu;
    def.top *= ppu, def.bottom *= ppu;
    def.left *= ppu, def.right *= ppu;
  }

  var trim = this._trim;
  if (trim != 0) {
    def.x += trim, def.y += trim;
    def.width -= 2 * trim, def.height -= 2 * trim;
    def.top -= trim, def.bottom -= trim;
    def.left -= trim, def.right -= trim;
  }

  var texture = this.clone();
  texture.name = def.name;

  texture.top = def.top;
  texture.bottom = def.bottom;
  texture.left = def.left;
  texture.right = def.right;

  texture.src(def.x, def.y, def.width, def.height);
  return texture;
};

Atlas.prototype.select = function(selector, multi) {
  if (!multi) {// one
    for (var i = 0; i < this._cutouts.length; i++) {
      var cutout = this._cutouts[i];
      if (cutout.name == selector) {
        return this._cutout(cutout);
      }
    }
    if (this._factory) {
      return this._cutout(this._factory(selector));
    }

  } else {// multi
    var results = [];
    var length = selector.length;
    for (var i = 0; i < this._cutouts.length; i++) {
      var cutout = this._cutouts[i];
      if (cutout.name && cutout.name.substring(0, length) == selector) {
        results.push(this._cutout(cutout));
      }
    }
    if (results.length) {
      return results;
    }
  }
};

Atlas.prototype.load = function(done) {
  var self = this, url = this._imagePath;
  if (!url)
    return done();
  var imageloader = Cut.config('image-loader');
  DEBUG && console.log('Loading image: ' + url);
  imageloader(url, function(image) {
    DEBUG && console.log('Image loaded: ' + url);
    self.src(image);
    done();
  }, function(msg) {
    DEBUG && console.log('Error loading image: ' + url, msg);
    done();
  });
};

// name : atlas
var _atlases = {};

// TODO: invalidate cache on change
var _textures = {
  // query : texture
  one : {},
  // query : [texture]
  multi : {}
};

/**
 * @deprecated Use `Cut(atlas)` instead.
 */
Cut.addTexture = function() {
  for (var i = 0; i < arguments.length; i++) {
    Cut.atlas(arguments[i]);
  }
};

Cut.atlas = function(atlas) {
  atlas = atlas.isAtlas ? atlas : new Atlas(atlas);
  _atlases[atlas.name] = atlas;
  Cut.preload(function(done) {
    atlas.load(done);
  });
  return atlas;
};

Cut.texture = function(query, multi) {
  if (typeof query === 'function') {
    return Cut.texture(query(), multi);
  }
  if (typeof query !== 'string') {
    return query;
  }

  var i = query.indexOf(':');
  var left = i < 1 ? null : query.slice(0, i);
  var right = i < 0 ? query : query.slice(i + 1);

  var cache = multi ? _textures.multi : _textures.one;
  var result = cache[query];

  if (result) {
    return result;
  } else if (result === null) {
    throw 'Texture not found: \'' + query + '\'';
  }

  if (left) {
    var atlas = _atlases[left];
    if (atlas) {
      result = atlas.select(right, multi);
    } else {
      throw 'Atlas not found: \'' + query + '\'';
    }
  } else {
    for (left in _atlases) {
      if (result = _atlases[left].select(right, multi)) {
        break;
      }
    }
  }

  if (result) {
    cache[query] = result;
    return result;
  } else {
    cache[query] = null;
    throw 'Texture not found: \'' + query + '\'';
  }
};

module.exports = Atlas;
