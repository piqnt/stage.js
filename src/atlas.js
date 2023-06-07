import is from 'is';
import { Texture } from './texture';

if (typeof DEBUG === 'undefined')
  DEBUG = true;

var NO_TEXTURE = new class extends Texture {
  constructor() {
    super();
    this.x = this.y = this.width = this.height = 0
  }
  pipe = function() {
    return this;
  };
  src = function() {
    return this;
  };
  dest = function() {
    return this;
  };
  draw = function() {
  };
};

var NO_SELECTION = new Selection(NO_TEXTURE);

function preloadImage(src) {
  DEBUG && console.log('Loading image: ' + src);
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.onload = function() {
      resolve(image);
    };
    image.onerror = function(error) {
      reject(error);
    };
    image.src = src;
  });
}

// name : atlas
var _atlases_map = {};
// [atlas]
var _atlases_arr = [];

// TODO: print subquery not found error
// TODO: index textures

export const atlas = async function(def) {
  var atlas = is.fn(def.draw) ? def : new Atlas(def);
  if (def.name) {
    _atlases_map[def.name] = atlas;
  }
  _atlases_arr.push(atlas);

  deprecated(def, 'imagePath');
  deprecated(def, 'imageRatio');

  var url = def.imagePath;
  var ratio = def.imageRatio || 1;
  if (is.string(def.image)) {
    url = def.image;
  } else if (is.hash(def.image)) {
    url = def.image.src || def.image.url;
    ratio = def.image.ratio || ratio;
  }
  if (url) {
    const image = await preloadImage(url);
    atlas.src(image, ratio);
  }

  return atlas;
};

export class Atlas extends Texture {
  constructor(def) {
    super();

    var atlas = this;

    deprecated(def, 'filter');
    deprecated(def, 'cutouts');
    deprecated(def, 'sprites');
    deprecated(def, 'factory');

    var map = def.map || def.filter;
    var ppu = def.ppu || def.ratio || 1;
    var trim = def.trim || 0;
    var textures = def.textures;
    var factory = def.factory;
    var cutouts = def.cutouts || def.sprites;

    function make(def) {
      if (!def || is.fn(def.draw)) {
        return def;
      }

      def = Object.assign({}, def);

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
      texture.top = def.top, texture.bottom = def.bottom;
      texture.left = def.left, texture.right = def.right;
      texture.src(def.x, def.y, def.width, def.height);
      return texture;
    }

    function find(query) {
      if (textures) {
        if (is.fn(textures)) {
          return textures(query);
        } else if (is.hash(textures)) {
          return textures[query];
        }
      }
      if (cutouts) { // deprecated
        var result = null, n = 0;
        for (var i = 0; i < cutouts.length; i++) {
          if (string.startsWith(cutouts[i].name, query)) {
            if (n === 0) {
              result = cutouts[i];
            } else if (n === 1) {
              result = [result, cutouts[i]];
            } else {
              result.push(cutouts[i]);
            }
            n++;
          }
        }
        if (n === 0 && is.fn(factory)) {
          result = function (subquery) {
            return factory(query + (subquery ? subquery : ''));
          };
        }
        return result;
      }
    }

    this.select = function (query) {
      if (!query) {
        // TODO: if `textures` is texture def, map or fn?
        return new Selection(this.pipe());
      }
      var found = find(query);
      if (found) {
        return new Selection(found, find, make);
      }
    };
  }
};

function Selection(result, find, make) {
  function link(result, subquery) {
    if (!result) {
      return NO_TEXTURE;

    } else if (is.fn(result.draw)) {
      return result;

    } else if (is.hash(result) && is.number(result.width)
      && is.number(result.height) && is.fn(make)) {
      return make(result);

    } else if (is.hash(result) && is.defined(subquery)) {
      return link(result[subquery]);

    } else if (is.fn(result)) {
      return link(result(subquery));

    } else if (is.array(result)) {
      return link(result[0]);

    } else if (is.string(result) && is.fn(find)) {
      return link(find(result));
    }
  }

  this.one = function(subquery) {
    return link(result, subquery);
  };

  this.array = function(arr) {
    var array = is.array(arr) ? arr : [];
    if (is.array(result)) {
      for (var i = 0; i < result.length; i++) {
        array[i] = link(result[i]);
      }
    } else {
      array[0] = link(result);
    }
    return array;
  };
}

export const texture = function(query) {
  if (!is.string(query)) {
    return new Selection(query);
  }

  var result = null, atlas, i;

  if ((i = query.indexOf(':')) > 0 && query.length > i + 1) {
    atlas = _atlases_map[query.slice(0, i)];
    result = atlas && atlas.select(query.slice(i + 1));
  }

  if (!result && (atlas = _atlases_map[query])) {
    result = atlas.select();
  }

  for (i = 0; !result && i < _atlases_arr.length; i++) {
    result = _atlases_arr[i].select(query);
  }

  if (!result) {
    console.error('Texture not found: ' + query);
    result = NO_SELECTION;
  }

  return result;
};

function deprecated(hash, name, msg) {
  if (name in hash)
    console.log(msg ? msg.replace('%name', name) : '\'' + name
        + '\' field of texture atlas is deprecated.');
};
