import stats from './util/stats';
import { math } from './util/math';

const DEBUG = true;

const isFn = function (value) {
  var str = Object.prototype.toString.call(value);
  return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
};

const isHash = function (value) {
  return Object.prototype.toString.call(value) === '[object Object]' && value.constructor === Object;
  // return value && typeof value === 'object' && !Array.isArray(value) && !isFn(value);
}

export class Texture {
  constructor(texture, ratio) {
    if (typeof texture === 'object') {
      this.src(texture, ratio);
    }
  }
  pipe() {
    return new Texture(this);
  }
  /**
   * Signatures: (texture), (x, y, w, h), (w, h)
   */
  src(x, y, w, h) {
    if (typeof x === 'object') {
      var drawable = x, ratio = y || 1;

      this._image = drawable;
      this._sx = this._dx = 0;
      this._sy = this._dy = 0;
      this._sw = this._dw = drawable.width / ratio;
      this._sh = this._dh = drawable.height / ratio;

      this.width = drawable.width / ratio;
      this.height = drawable.height / ratio;

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
  }
  /**
   * Signatures: (x, y, w, h), (x, y)
   */
  dest(x, y, w, h) {
    this._dx = x, this._dy = y;
    this._dx = x, this._dy = y;
    if (typeof w !== 'undefined') {
      this._dw = w, this._dh = h;
      this.width = w, this.height = h;
    }
    return this;
  }
  draw(context, x1, y1, x2, y2, x3, y3, x4, y4) {
    var drawable = this._image;
    if (drawable === null || typeof drawable !== 'object') {
      return;
    }

    var sx = this._sx, sy = this._sy;
    var sw = this._sw, sh = this._sh;
    var dx = this._dx, dy = this._dy;
    var dw = this._dw, dh = this._dh;

    if (typeof x3 !== 'undefined') {
      x1 = math.clamp(x1, 0, this._sw), x2 = math.clamp(x2, 0, this._sw - x1);
      y1 = math.clamp(y1, 0, this._sh), y2 = math.clamp(y2, 0, this._sh - y1);
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
      if (typeof drawable.draw === 'function') {
        drawable.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        stats.draw++;
        context.drawImage(drawable, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    } catch (ex) {
      if (!drawable._draw_failed) {
        console.log('Unable to draw: ', drawable);
        console.log(ex);
        drawable._draw_failed = true;
      }
    }
  }
}

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
    const img = new Image();
    img.onload = function() {
      DEBUG && console.log('Image loaded: ' + src);
      resolve(img);
    };
    img.onerror = function(error) {
      DEBUG && console.log('Loading failed: ' + src);
      reject(error);
    };
    img.src = src;
  });
}

// name : atlas
var _atlases_map = {};
// [atlas]
var _atlases_arr = [];

// TODO: print subquery not found error
// TODO: index textures

export const atlas = async function(def) {
  var atlas = isFn(def.draw) ? def : new Atlas(def);
  if (def.name) {
    _atlases_map[def.name] = atlas;
  }
  _atlases_arr.push(atlas);

  deprecated(def, 'imagePath');
  deprecated(def, 'imageRatio');

  var url = def.imagePath;
  var ratio = def.imageRatio || 1;
  if (('string' === typeof def.image)) {
    url = def.image;
  } else if (isHash(def.image)) {
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
      if (!def || isFn(def.draw)) {
        return def;
      }

      def = Object.assign({}, def);

      if (isFn(map)) {
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
        if (isFn(textures)) {
          return textures(query);
        } else if (isHash(textures)) {
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
        if (n === 0 && isFn(factory)) {
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

    } else if (isFn(result.draw)) {
      return result;

    } else if (isHash(result) && ('number' === typeof result.width)
      && ('number' === typeof result.height) && isFn(make)) {
      return make(result);

    } else if (isHash(result) && ('undefined' !== typeof subquery)) {
      return link(result[subquery]);

    } else if (isFn(result)) {
      return link(result(subquery));

    } else if (Array.isArray(result)) {
      return link(result[0]);

    } else if (('string' === typeof result) && isFn(find)) {
      return link(find(result));
    }
  }

  this.one = function(subquery) {
    return link(result, subquery);
  };

  this.array = function(arr) {
    var array = Array.isArray(arr) ? arr : [];
    if (Array.isArray(result)) {
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
  if (!('string' === typeof query)) {
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

// todo: merge with memoizeDraw
export const canvas = function(type, attributes, plotter) {
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

  // this updates the drawing
  texture.canvas = function(fn) {
    if (typeof fn === 'function') {
      fn.call(this, context);
    } else if (typeof fn === 'undefined' && typeof plotter === 'function') {
      plotter.call(this, context);
    }
    return this;
  };

  if (typeof plotter === 'function') {
    plotter.call(texture, context);
  }

  return texture;
};

const PIXEL_RATIO = (window.devicePixelRatio || 1);

let M;
// todo: merge with canvas, probably use Texture.draw parameters to memoize
// the wrapper sprite is used for ticking and centering the texture
export function memoizeDraw(callback, memoKey = () => null) {
  let lastRatio = 0;
  let lastSelection = undefined;
  let texture = Stage.canvas();
  let sprite = Stage.sprite();
  let first = true;
  sprite.tick(function() {
    let m = this._parent.matrix();
    if (first) {
      // hack: parent matrix is not available in the first call
      first = false;
      if (!(m = M)) {
        return;
      }
    }
    M = m;
    let newRatio = Math.max(Math.abs(m.a), Math.abs(m.b));
    let rationChange = lastRatio / newRatio;
    if (lastRatio === 0 || rationChange > 1.25 || rationChange < 0.8) {
      const newSelection = memoKey();
      if (lastSelection !== newSelection) {
        lastSelection === newSelection;
        lastRatio = newRatio;
        callback(2.5 * newRatio / PIXEL_RATIO, texture, sprite);
        sprite.texture(texture);
        sprite.__timestamp = Date.now();
      }
    }
  }, false);
  return sprite;
}
