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
var is = require('./util/is');

var string = require('./util/string');

// name : atlas
var _atlases_map = {};
// [atlas]
var _atlases_arr = [];

// TODO: return entire atlas as texture
// TODO: select atlas itself, call texture function

Cut.atlas = function(def) {
  var atlas = is.fn(def.draw) ? def : new Atlas(def);
  if (def.name) {
    _atlases_map[def.name] = atlas;
  }
  _atlases_arr.push(atlas);

  depricated(def, 'imagePath');
  depricated(def, 'imageRatio');

  var url = def.imagePath;
  var ratio = def.imageRatio || 1;
  if (is.string(def.image)) {
    url = def.image;
  } else if (is.hash(def.image)) {
    url = def.image.url;
    ratio = def.image.ratio || ratio;
  }
  url && Cut.preload(function(done) {
    DEBUG && console.log('Loading image: ' + url);
    var imageloader = Cut.config('image-loader');

    imageloader(url, function(image) {
      DEBUG && console.log('Image loaded: ' + url);
      atlas.src(image, ratio);
      done();

    }, function(msg) {
      DEBUG && console.log('Error loading image: ' + url, msg);
      done();
    });
  });

  return atlas;
};

Atlas._super = Texture;
Atlas.prototype = create(Atlas._super.prototype);

function Atlas(def) {
  Atlas._super.call(this);

  var atlas = this;

  depricated(def, 'filter');
  depricated(def, 'cutouts');
  depricated(def, 'sprites');
  depricated(def, 'factory');

  var map = def.map || def.filter;
  var ppu = def.ppu || def.ratio || 1;
  var trim = def.trim || 0;

  function make(def) {
    if (!def || is.fn(def.draw)) {
      return def;
    }

    def = extend({}, def);

    if (is.fn(map)) {
      def = map(def);
    }

    if (ppu != 1) {
      def.x *= ppu, def.y *= ppu;
      def.width *= ppu, def.height *= ppu;
      def.top *= ppu, def.bottom *= ppu;
      def.left *= ppu, def.right *= ppu;
    }

    if (trim != 0) {
      def.x += trim, def.y += trim;
      def.width -= 2 * trim, def.height -= 2 * trim;
      def.top -= trim, def.bottom -= trim;
      def.left -= trim, def.right -= trim;
    }

    var texture = atlas.pipe();

    texture.top = def.top;
    texture.bottom = def.bottom;
    texture.left = def.left;
    texture.right = def.right;

    texture.src(def.x, def.y, def.width, def.height);
    return texture;
  }

  var textures = def.textures || {};
  var factory = def.factory;
  var cutouts = def.cutouts || def.sprites;

  function link(selected) {
    if (!selected) {
      return selected;

    } else if (is.array(selected)) {
      for (var i = 0; i < selected.length; i++) {
        selected[i] = link(selected[i]);
      }
      return selected;

    } else if (is.fn(selected)) {
      return link(selected());

    } else if (is.string(selected)) {
      return link(find(selected));

    } else if (is.fn(selected.draw)) {
      return selected;

    } else if (is.number(selected.width) && is.number(selected.height)) {
      return make(selected);
    }
  }

  function find(query, subquery) {
    if (is.fn(textures)) {
      return textures(query, subquery);

    } else if (is.hash(textures)) {
      var entry = textures[query];
      if (!entry) {
        return null;

      } else if (is.number(entry.width) && is.number(entry.height)) {
        return entry;

      } else if (is.hash(entry)) {
        return subquery ? entry[subquery] : null;

      } else if (is.object(entry)) {
        return entry;

      } else if (is.fn(entry)) {
        return entry(subquery);

      } else if (is.array(entry)) {
        return entry;
      }
    }
  }

  this.select = function(query, subquery, prefix) {
    if (textures) {
      return link(find(query, subquery));
    }

    if (cutouts) {
      if (multi) {
        var results = [];
        for (var i = 0; i < cutouts.length; i++) {
          if (string.startsWith(cutouts[i].name, query)) {
            results.push(link(cutouts[i]));
          }
        }
        if (results.length) {
          return results;
        }

      } else {
        for (var i = 0; i < cutouts.length; i++) {
          if (cutouts[i].name == query) {
            return link(cutouts[i]);
          }
        }
        if (is.fn(factory)) {
          return link(factory(query));
        }
      }
    }
  };

};

Cut.texture = function(query, qualifier) {
  if (!is.string(query)) {
    if (is.fn(query)) {
      return Cut.texture(query(), qualifier);
    } else if (is.array(query)) {
      for (var i = 0; i < query.length; i++)
        query[i] = Cut.texture(query[i]);
    } else if (is.hash(query)) {
      // TODO: convert hash to texture
      return query;
    } else if (is.object(query)) {
      // TODO: convert object to texture
      return query;
    } else {
      return query;
    }
  }

  var result = null;
  // var cache = mod ? _cache_one : _cache_mod;
  // var result = cache[query];
  //
  // if (!result) {

  // TODO: cache and clone

  var sub = is.string(qualifier) ? qualifier : '';

  var i = query.indexOf(':');
  if (i > 0 && query.length > i + 1) {
    var atlas = _atlases_map[query.slice(0, i)];
    result = atlas && atlas.select(query.slice(i + 1), sub);
  }

  for (var i = 0; !result && i < _atlases_arr.length; i++) {
    result = _atlases_arr[i].select(query, sub);
  }

  // cache[query] = result || null;
  // }

  if (!result) {
    throw 'Texture not found: \'' + query + (sub ? '+' + sub : '') + '\'';
  }

  var reqisarr = is.array(qualifier);
  var resisarr = is.array(result);
  if (reqisarr && resisarr) {
    for (var i = 0, n = result.length; i < n; i++)
      qualifier[i] = result[i];
    result = qualifier;
  } else if (reqisarr) {
    qualifier[0] = result;
    result = qualifier;
  } else if (resisarr) {
    result = result[0];
  }

  return result;
};

function depricated(hash, name, msg) {
  if (name in hash)
    console.log(msg ? msg.replace('%name', name) : '\'' + name
        + '\' field of texture atlas is depricated.');
};

module.exports = Atlas;
