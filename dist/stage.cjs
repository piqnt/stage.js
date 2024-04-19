"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const math_random = Math.random;
const math_sqrt = Math.sqrt;
function random(min, max) {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  return min == max ? min : math_random() * (max - min) + min;
}
function wrap(num, min, max) {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
}
function clamp(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
}
function length(x, y) {
  return math_sqrt(x * x + y * y);
}
const math = Object.create(Math);
math.random = random;
math.wrap = wrap;
math.clamp = clamp;
math.length = length;
math.rotate = wrap;
math.limit = clamp;
class Matrix {
  constructor(a, b, c, d, e, f) {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    if (typeof a === "object") {
      this.reset(a);
    } else {
      this.reset(a, b, c, d, e, f);
    }
  }
  toString() {
    return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.e + ", " + this.f + "]";
  }
  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
  }
  reset(a, b, c, d, e, f) {
    this._dirty = true;
    if (typeof a === "object") {
      this.a = a.a;
      this.d = a.d;
      this.b = a.b;
      this.c = a.c;
      this.e = a.e;
      this.f = a.f;
    } else {
      this.a = typeof a === "number" ? a : 1;
      this.b = typeof b === "number" ? b : 0;
      this.c = typeof c === "number" ? c : 0;
      this.d = typeof d === "number" ? d : 1;
      this.e = typeof e === "number" ? e : 0;
      this.f = typeof f === "number" ? f : 0;
    }
    return this;
  }
  identity() {
    this._dirty = true;
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }
  rotate(angle) {
    if (!angle) {
      return this;
    }
    this._dirty = true;
    const u = angle ? Math.cos(angle) : 1;
    const v = angle ? Math.sin(angle) : 0;
    const a = u * this.a - v * this.b;
    const b = u * this.b + v * this.a;
    const c = u * this.c - v * this.d;
    const d = u * this.d + v * this.c;
    const e = u * this.e - v * this.f;
    const f = u * this.f + v * this.e;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  translate(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;
    this.e += x;
    this.f += y;
    return this;
  }
  scale(x, y) {
    if (!(x - 1) && !(y - 1)) {
      return this;
    }
    this._dirty = true;
    this.a *= x;
    this.b *= y;
    this.c *= x;
    this.d *= y;
    this.e *= x;
    this.f *= y;
    return this;
  }
  skew(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;
    const a = this.a + this.b * x;
    const b = this.b + this.a * y;
    const c = this.c + this.d * x;
    const d = this.d + this.c * y;
    const e = this.e + this.f * x;
    const f = this.f + this.e * y;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  concat(m) {
    this._dirty = true;
    const a = this.a * m.a + this.b * m.c;
    const b = this.b * m.d + this.a * m.b;
    const c = this.c * m.a + this.d * m.c;
    const d = this.d * m.d + this.c * m.b;
    const e = this.e * m.a + m.e + this.f * m.c;
    const f = this.f * m.d + m.f + this.e * m.b;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  inverse() {
    if (this._dirty) {
      this._dirty = false;
      if (!this.inverted) {
        this.inverted = new Matrix();
      }
      const z = this.a * this.d - this.b * this.c;
      this.inverted.a = this.d / z;
      this.inverted.b = -this.b / z;
      this.inverted.c = -this.c / z;
      this.inverted.d = this.a / z;
      this.inverted.e = (this.c * this.f - this.e * this.d) / z;
      this.inverted.f = (this.e * this.b - this.a * this.f) / z;
    }
    return this.inverted;
  }
  map(p, q) {
    q = q || { x: 0, y: 0 };
    q.x = this.a * p.x + this.c * p.y + this.e;
    q.y = this.b * p.x + this.d * p.y + this.f;
    return q;
  }
  mapX(x, y) {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    return this.a * x + this.c * y + this.e;
  }
  mapY(x, y) {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    return this.b * x + this.d * y + this.f;
  }
}
const objectToString = Object.prototype.toString;
function isFn(value) {
  const str = objectToString.call(value);
  return str === "[object Function]" || str === "[object GeneratorFunction]" || str === "[object AsyncFunction]";
}
function isHash(value) {
  return objectToString.call(value) === "[object Object]" && value.constructor === Object;
}
const stats = {
  create: 0,
  tick: 0,
  node: 0,
  draw: 0,
  fps: 0
};
class Texture {
  constructor(source, pixelRatio) {
    this._draw_failed = false;
    if (typeof source === "object") {
      this.setSourceImage(source, pixelRatio);
    }
  }
  pipe() {
    return new Texture(this);
  }
  /**
   * @internal
   * This is used by subclasses such as CanvasTexture to rerender offscreen texture if needed.
   */
  prerender(context) {
    if ("prerender" in this._source) {
      return this._source.prerender(context);
    }
  }
  /** @hidden @deprecated @internal */
  src(x, y, w, h) {
    if (typeof x === "object") {
      this.setSourceImage(x, y);
    } else {
      if (typeof w === "undefined") {
        this.setSourceDimension(x, y);
      } else {
        this.setSourceCoordinate(x, y);
        this.setSourceDimension(w, h);
      }
    }
    return this;
  }
  setSourceImage(image2, pixelRatio = 1) {
    this._source = image2;
    this._pixelRatio = pixelRatio;
    if ("width" in image2 && "height" in image2 && typeof image2.width === "number" && typeof image2.height === "number") {
      const pixelWidth = image2.width;
      const pixelHeight = image2.height;
      const geoWidth = pixelWidth / pixelRatio;
      const geoHeight = pixelHeight / pixelRatio;
      this.setSourceCoordinate(0, 0);
      this.setSourceDimension(geoWidth, geoHeight);
      this.setDestinationCoordinate(0, 0);
      this.setDestinationDimension(geoWidth, geoHeight);
    }
  }
  // Geometrical values
  setSourceCoordinate(x, y) {
    this._sx = x;
    this._sy = y;
  }
  // Geometrical values
  setSourceDimension(w, h) {
    this._sw = w;
    this._sh = h;
    this.setDestinationDimension(w, h);
  }
  /** @hidden @deprecated @internal */
  dest(x, y, w, h) {
    this.setDestinationCoordinate(x, y);
    if (typeof w !== "undefined") {
      this.setDestinationDimension(w, h);
    }
    return this;
  }
  // Geometrical values
  setDestinationCoordinate(x, y) {
    this._dx = x;
    this._dy = y;
  }
  // Geometrical values
  setDestinationDimension(w, h) {
    this._dw = w;
    this._dh = h;
    this.width = w;
    this.height = h;
  }
  draw(context, x1, y1, w1, h1, x2, y2, w2, h2) {
    let sx = this._sx;
    let sy = this._sy;
    let sw = this._sw;
    let sh = this._sh;
    let dx = this._dx;
    let dy = this._dy;
    let dw = this._dw;
    let dh = this._dh;
    if (typeof x1 === "number" && typeof y1 === "number" && typeof w1 === "number" && typeof h1 === "number") {
      if (typeof x2 === "number" && typeof y2 === "number" && typeof w2 === "number" && typeof h2 === "number") {
        x1 = clamp(x1, 0, this._sw);
        w1 = clamp(w1, 0, this._sw - x1);
        y1 = clamp(y1, 0, this._sh);
        h1 = clamp(h1, 0, this._sh - y1);
        sx += x1;
        sy += y1;
        sw = w1;
        sh = h1;
        dx = x2;
        dy = y2;
        dw = w2;
        dh = h2;
      } else {
        dx = x1;
        dy = y1;
        dw = w1;
        dh = h1;
      }
    }
    const pixelRatio = this._pixelRatio || 1;
    const spx = sx * pixelRatio;
    const spy = sy * pixelRatio;
    const spw = sw * pixelRatio;
    const sph = sh * pixelRatio;
    this.draw0(context, spx, spy, spw, sph, dx, dy, dw, dh);
  }
  /** @internal */
  draw0(context, sx, sy, sw, sh, dx, dy, dw, dh) {
    const drawable = this._source;
    if (drawable === null || typeof drawable !== "object") {
      return;
    }
    try {
      if ("draw" in drawable && typeof drawable.draw === "function") {
        drawable.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        stats.draw++;
        context.drawImage(drawable, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    } catch (ex) {
      if (!this._draw_failed) {
        console.log("Unable to draw: ", drawable);
        console.log(ex);
        this._draw_failed = true;
      }
    }
  }
}
function isAtlasSpriteDefinition(selection) {
  return typeof selection === "object" && isHash(selection) && "number" === typeof selection.width && "number" === typeof selection.height;
}
class TextureSelection {
  constructor(selection, atlas2) {
    this.selection = selection;
    this.atlas = atlas2;
  }
  /**
   * @internal
   * Resolves the selection to a texture.
   */
  resolve(selection, subquery) {
    if (!selection) {
      return NO_TEXTURE;
    } else if (Array.isArray(selection)) {
      return this.resolve(selection[0]);
    } else if (selection instanceof Texture) {
      return selection;
    } else if (isAtlasSpriteDefinition(selection)) {
      if (!this.atlas) {
        return NO_TEXTURE;
      }
      return this.atlas.pipeSpriteTexture(selection);
    } else if (typeof selection === "object" && isHash(selection) && typeof subquery !== "undefined") {
      return this.resolve(selection[subquery]);
    } else if (typeof selection === "function" && isFn(selection)) {
      return this.resolve(selection(subquery));
    } else if (typeof selection === "string") {
      if (!this.atlas) {
        return NO_TEXTURE;
      }
      return this.resolve(this.atlas.findSpriteDefinition(selection));
    }
  }
  one(subquery) {
    return this.resolve(this.selection, subquery);
  }
  array(arr) {
    const array = Array.isArray(arr) ? arr : [];
    if (Array.isArray(this.selection)) {
      for (let i = 0; i < this.selection.length; i++) {
        array[i] = this.resolve(this.selection[i]);
      }
    } else {
      array[0] = this.resolve(this.selection);
    }
    return array;
  }
}
const NO_TEXTURE = new class extends Texture {
  constructor() {
    super();
    this.setSourceDimension(0, 0);
  }
  pipe() {
    return this;
  }
  setSourceImage(image2, pixelRatio) {
  }
  setSourceCoordinate(x, y) {
  }
  setSourceDimension(w, h) {
  }
  setDestinationCoordinate(x, y) {
  }
  setDestinationDimension(w, h) {
  }
  draw() {
  }
}();
const NO_SELECTION = new TextureSelection(NO_TEXTURE);
const ATLAS_MEMO_BY_NAME = {};
const ATLAS_ARRAY = [];
const atlas = async function(def) {
  let atlas2;
  if (def instanceof Atlas) {
    atlas2 = def;
  } else {
    atlas2 = new Atlas(def);
  }
  if (atlas2._name) {
    ATLAS_MEMO_BY_NAME[atlas2._name] = atlas2;
  }
  ATLAS_ARRAY.push(atlas2);
  await atlas2.load();
  return atlas2;
};
const texture = function(query) {
  if ("string" !== typeof query) {
    return new TextureSelection(query);
  }
  let result = null;
  const colonIndex = query.indexOf(":");
  if (colonIndex > 0 && query.length > colonIndex + 1) {
    const atlas2 = ATLAS_MEMO_BY_NAME[query.slice(0, colonIndex)];
    result = atlas2 && atlas2.select(query.slice(colonIndex + 1));
  }
  if (!result) {
    const atlas2 = ATLAS_MEMO_BY_NAME[query];
    result = atlas2 && atlas2.select();
  }
  if (!result) {
    for (let i = 0; i < ATLAS_ARRAY.length; i++) {
      result = ATLAS_ARRAY[i].select(query);
      if (result) {
        break;
      }
    }
  }
  if (!result) {
    console.error("Texture not found: " + query);
    result = NO_SELECTION;
  }
  return result;
};
class Atlas extends Texture {
  constructor(def = {}) {
    super();
    this._imagePixelRatio = 1;
    this.pipeSpriteTexture = (def2) => {
      const map = this._map;
      const ppu = this._ppu;
      const trim = this._trim;
      if (!def2) {
        return void 0;
      }
      def2 = Object.assign({}, def2);
      if (isFn(map)) {
        def2 = map(def2);
      }
      if (ppu != 1) {
        def2.x *= ppu;
        def2.y *= ppu;
        def2.width *= ppu;
        def2.height *= ppu;
        def2.top *= ppu;
        def2.bottom *= ppu;
        def2.left *= ppu;
        def2.right *= ppu;
      }
      if (trim != 0) {
        def2.x += trim;
        def2.y += trim;
        def2.width -= 2 * trim;
        def2.height -= 2 * trim;
        def2.top -= trim;
        def2.bottom -= trim;
        def2.left -= trim;
        def2.right -= trim;
      }
      const texture2 = this.pipe();
      texture2.top = def2.top;
      texture2.bottom = def2.bottom;
      texture2.left = def2.left;
      texture2.right = def2.right;
      texture2.setSourceCoordinate(def2.x, def2.y);
      texture2.setSourceDimension(def2.width, def2.height);
      return texture2;
    };
    this.findSpriteDefinition = (query) => {
      const textures = this._textures;
      if (textures) {
        if (isFn(textures)) {
          return textures(query);
        } else if (isHash(textures)) {
          return textures[query];
        }
      }
    };
    this.select = (query) => {
      if (!query) {
        return new TextureSelection(this.pipe());
      }
      const textureDefinition = this.findSpriteDefinition(query);
      if (textureDefinition) {
        return new TextureSelection(textureDefinition, this);
      }
    };
    this._name = def.name;
    this._ppu = def.ppu || def.ratio || 1;
    this._trim = def.trim || 0;
    this._map = def.map || def.filter;
    this._textures = def.textures;
    if (typeof def.image === "object" && isHash(def.image)) {
      this._imageSrc = def.image.src || def.image.url;
      if (typeof def.image.ratio === "number") {
        this._imagePixelRatio = def.image.ratio;
      }
    } else {
      if (typeof def.imagePath === "string") {
        this._imageSrc = def.imagePath;
      } else if (typeof def.image === "string") {
        this._imageSrc = def.image;
      }
      if (typeof def.imageRatio === "number") {
        this._imagePixelRatio = def.imageRatio;
      }
    }
    this.deprecatedWarning(def);
  }
  /** @internal */
  deprecatedWarning(def) {
    if ("filter" in def)
      console.warn("'filter' field of atlas definition is deprecated");
    if ("cutouts" in def)
      console.warn("'cutouts' field of atlas definition is deprecated");
    if ("sprites" in def)
      console.warn("'sprites' field of atlas definition is deprecated");
    if ("factory" in def)
      console.warn("'factory' field of atlas definition is deprecated");
    if ("ratio" in def)
      console.warn("'ratio' field of atlas definition is deprecated");
    if ("imagePath" in def)
      console.warn("'imagePath' field of atlas definition is deprecated");
    if ("imageRatio" in def)
      console.warn("'imageRatio' field of atlas definition is deprecated");
    if (typeof def.image === "object" && "url" in def.image)
      console.warn("'image.url' field of atlas definition is deprecated");
  }
  async load() {
    if (this._imageSrc) {
      const image2 = await asyncLoadImage(this._imageSrc);
      this.setSourceImage(image2, this._imagePixelRatio);
    }
  }
}
function asyncLoadImage(src) {
  console.log("Loading image: " + src);
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      console.log("Image loaded: " + src);
      resolve(img);
    };
    img.onerror = function(error) {
      console.log("Loading failed: " + src);
      reject(error);
    };
    img.src = src;
  });
}
const uid = function() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};
let iid$1 = 0;
class Pin {
  /** @internal */
  constructor(owner) {
    this.uid = "pin:" + uid();
    this.scaleTo = function(width, height, mode) {
      scaleTo(this, width, height, mode);
    };
    this._owner = owner;
    this._parent = null;
    this._relativeMatrix = new Matrix();
    this._absoluteMatrix = new Matrix();
    this.reset();
  }
  reset() {
    this._textureAlpha = 1;
    this._alpha = 1;
    this._width = 0;
    this._height = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._skewX = 0;
    this._skewY = 0;
    this._rotation = 0;
    this._pivoted = false;
    this._pivotX = 0;
    this._pivotY = 0;
    this._handled = false;
    this._handleX = 0;
    this._handleY = 0;
    this._aligned = false;
    this._alignX = 0;
    this._alignY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;
    this._ts_translate = ++iid$1;
    this._ts_transform = ++iid$1;
    this._ts_matrix = ++iid$1;
  }
  /** @internal */
  _update() {
    this._parent = this._owner._parent && this._owner._parent._pin;
    if (this._handled && this._mo_handle != this._ts_transform) {
      this._mo_handle = this._ts_transform;
      this._ts_translate = ++iid$1;
    }
    if (this._aligned && this._parent && this._mo_align != this._parent._ts_transform) {
      this._mo_align = this._parent._ts_transform;
      this._ts_translate = ++iid$1;
    }
    return this;
  }
  toString() {
    return this._owner + " (" + (this._parent ? this._parent._owner : null) + ")";
  }
  // TODO: ts fields require refactoring
  absoluteMatrix() {
    this._update();
    const ts = Math.max(
      this._ts_transform,
      this._ts_translate,
      this._parent ? this._parent._ts_matrix : 0
    );
    if (this._mo_abs == ts) {
      return this._absoluteMatrix;
    }
    this._mo_abs = ts;
    const abs = this._absoluteMatrix;
    abs.reset(this.relativeMatrix());
    this._parent && abs.concat(this._parent._absoluteMatrix);
    this._ts_matrix = ++iid$1;
    return abs;
  }
  relativeMatrix() {
    this._update();
    const ts = Math.max(
      this._ts_transform,
      this._ts_translate,
      this._parent ? this._parent._ts_transform : 0
    );
    if (this._mo_rel == ts) {
      return this._relativeMatrix;
    }
    this._mo_rel = ts;
    const rel = this._relativeMatrix;
    rel.identity();
    if (this._pivoted) {
      rel.translate(-this._pivotX * this._width, -this._pivotY * this._height);
    }
    rel.scale(this._scaleX, this._scaleY);
    rel.skew(this._skewX, this._skewY);
    rel.rotate(this._rotation);
    if (this._pivoted) {
      rel.translate(this._pivotX * this._width, this._pivotY * this._height);
    }
    if (this._pivoted) {
      this._boxX = 0;
      this._boxY = 0;
      this._boxWidth = this._width;
      this._boxHeight = this._height;
    } else {
      let p;
      let q;
      if (rel.a > 0 && rel.c > 0 || rel.a < 0 && rel.c < 0) {
        p = 0, q = rel.a * this._width + rel.c * this._height;
      } else {
        p = rel.a * this._width, q = rel.c * this._height;
      }
      if (p > q) {
        this._boxX = q;
        this._boxWidth = p - q;
      } else {
        this._boxX = p;
        this._boxWidth = q - p;
      }
      if (rel.b > 0 && rel.d > 0 || rel.b < 0 && rel.d < 0) {
        p = 0, q = rel.b * this._width + rel.d * this._height;
      } else {
        p = rel.b * this._width, q = rel.d * this._height;
      }
      if (p > q) {
        this._boxY = q;
        this._boxHeight = p - q;
      } else {
        this._boxY = p;
        this._boxHeight = q - p;
      }
    }
    this._x = this._offsetX;
    this._y = this._offsetY;
    this._x -= this._boxX + this._handleX * this._boxWidth;
    this._y -= this._boxY + this._handleY * this._boxHeight;
    if (this._aligned && this._parent) {
      this._parent.relativeMatrix();
      this._x += this._alignX * this._parent._width;
      this._y += this._alignY * this._parent._height;
    }
    rel.translate(this._x, this._y);
    return this._relativeMatrix;
  }
  /** @internal */
  get(key) {
    if (typeof getters[key] === "function") {
      return getters[key](this);
    }
  }
  // TODO: Use defineProperty instead? What about multi-field pinning?
  /** @internal */
  set(a, b) {
    if (typeof a === "string") {
      if (typeof setters[a] === "function" && typeof b !== "undefined") {
        setters[a](this, b);
      }
    } else if (typeof a === "object") {
      for (b in a) {
        if (typeof setters[b] === "function" && typeof a[b] !== "undefined") {
          setters[b](this, a[b], a);
        }
      }
    }
    if (this._owner) {
      this._owner._ts_pin = ++iid$1;
      this._owner.touch();
    }
    return this;
  }
}
const getters = {
  alpha: function(pin) {
    return pin._alpha;
  },
  textureAlpha: function(pin) {
    return pin._textureAlpha;
  },
  width: function(pin) {
    return pin._width;
  },
  height: function(pin) {
    return pin._height;
  },
  boxWidth: function(pin) {
    return pin._boxWidth;
  },
  boxHeight: function(pin) {
    return pin._boxHeight;
  },
  // scale : function(pin: Pin) {
  // },
  scaleX: function(pin) {
    return pin._scaleX;
  },
  scaleY: function(pin) {
    return pin._scaleY;
  },
  // skew : function(pin: Pin) {
  // },
  skewX: function(pin) {
    return pin._skewX;
  },
  skewY: function(pin) {
    return pin._skewY;
  },
  rotation: function(pin) {
    return pin._rotation;
  },
  // pivot : function(pin: Pin) {
  // },
  pivotX: function(pin) {
    return pin._pivotX;
  },
  pivotY: function(pin) {
    return pin._pivotY;
  },
  // offset : function(pin: Pin) {
  // },
  offsetX: function(pin) {
    return pin._offsetX;
  },
  offsetY: function(pin) {
    return pin._offsetY;
  },
  // align : function(pin: Pin) {
  // },
  alignX: function(pin) {
    return pin._alignX;
  },
  alignY: function(pin) {
    return pin._alignY;
  },
  // handle : function(pin: Pin) {
  // },
  handleX: function(pin) {
    return pin._handleX;
  },
  handleY: function(pin) {
    return pin._handleY;
  }
};
const setters = {
  alpha: function(pin, value) {
    pin._alpha = value;
  },
  textureAlpha: function(pin, value) {
    pin._textureAlpha = value;
  },
  width: function(pin, value) {
    pin._unscaled_width = value;
    pin._width = value;
    pin._ts_transform = ++iid$1;
  },
  height: function(pin, value) {
    pin._height_ = value;
    pin._height = value;
    pin._ts_transform = ++iid$1;
  },
  scale: function(pin, value) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = ++iid$1;
  },
  scaleX: function(pin, value) {
    pin._scaleX = value;
    pin._ts_transform = ++iid$1;
  },
  scaleY: function(pin, value) {
    pin._scaleY = value;
    pin._ts_transform = ++iid$1;
  },
  skew: function(pin, value) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = ++iid$1;
  },
  skewX: function(pin, value) {
    pin._skewX = value;
    pin._ts_transform = ++iid$1;
  },
  skewY: function(pin, value) {
    pin._skewY = value;
    pin._ts_transform = ++iid$1;
  },
  rotation: function(pin, value) {
    pin._rotation = value;
    pin._ts_transform = ++iid$1;
  },
  pivot: function(pin, value) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  pivotX: function(pin, value) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  pivotY: function(pin, value) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid$1;
  },
  offset: function(pin, value) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = ++iid$1;
  },
  offsetX: function(pin, value) {
    pin._offsetX = value;
    pin._ts_translate = ++iid$1;
  },
  offsetY: function(pin, value) {
    pin._offsetY = value;
    pin._ts_translate = ++iid$1;
  },
  align: function(pin, value) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },
  alignX: function(pin, value) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = ++iid$1;
    this.handleX(pin, value);
  },
  alignY: function(pin, value) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = ++iid$1;
    this.handleY(pin, value);
  },
  handle: function(pin, value) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },
  handleX: function(pin, value) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = ++iid$1;
  },
  handleY: function(pin, value) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = ++iid$1;
  },
  resizeMode: function(pin, value, all) {
    if (all) {
      if (value == "in") {
        value = "in-pad";
      } else if (value == "out") {
        value = "out-crop";
      }
      scaleTo(pin, all.resizeWidth, all.resizeHeight, value);
    }
  },
  resizeWidth: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, value, null);
    }
  },
  resizeHeight: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      scaleTo(pin, null, value);
    }
  },
  scaleMode: function(pin, value, all) {
    if (all) {
      scaleTo(pin, all.scaleWidth, all.scaleHeight, value);
    }
  },
  scaleWidth: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, value, null);
    }
  },
  scaleHeight: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      scaleTo(pin, null, value);
    }
  },
  matrix: function(pin, value) {
    this.scaleX(pin, value.a);
    this.skewX(pin, value.c / value.d);
    this.skewY(pin, value.b / value.a);
    this.scaleY(pin, value.d);
    this.offsetX(pin, value.e);
    this.offsetY(pin, value.f);
    this.rotation(pin, 0);
  }
};
function scaleTo(pin, width, height, mode) {
  pin._ts_transform = ++iid$1;
  if (typeof width === "number") {
    pin._scaleX = width / pin._unscaled_width;
    pin._width = pin._unscaled_width;
  }
  if (typeof height === "number") {
    pin._scaleY = height / pin._height_;
    pin._height = pin._height_;
  }
  if (typeof width === "number" && typeof height === "number" && typeof mode === "string") {
    if (mode == "out" || mode == "out-crop") {
      pin._scaleX = pin._scaleY = Math.max(pin._scaleX, pin._scaleY);
    } else if (mode == "in" || mode == "in-pad") {
      pin._scaleX = pin._scaleY = Math.min(pin._scaleX, pin._scaleY);
    }
    if (mode == "out-crop" || mode == "in-pad") {
      pin._width = width / pin._scaleX;
      pin._height = height / pin._scaleY;
    }
  }
}
function IDENTITY(x) {
  return x;
}
const LOOKUP_CACHE = {};
const MODE_BY_NAME = {};
const EASE_BY_NAME = {};
class Easing {
  static get(token, fallback) {
    fallback = fallback || IDENTITY;
    if (typeof token === "function") {
      return token;
    }
    if (typeof token !== "string") {
      return fallback;
    }
    let easeFn = LOOKUP_CACHE[token];
    if (easeFn) {
      return easeFn;
    }
    const tokens = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
    if (!tokens || !tokens.length) {
      return fallback;
    }
    const easeName = tokens[1];
    const easing = EASE_BY_NAME[easeName];
    const modeName = tokens[3];
    const modeFn = MODE_BY_NAME[modeName];
    const params = tokens[5];
    if (!easing) {
      easeFn = fallback;
    } else if ("fn" in easing && typeof easing.fn === "function") {
      easeFn = easing.fn;
    } else if ("fc" in easing && typeof easing.fc === "function") {
      const args = params ? params.replace(/\s+/, "").split(",") : void 0;
      easeFn = easing.fc.apply(easing.fc, args);
    } else {
      easeFn = fallback;
    }
    if (modeFn) {
      easeFn = modeFn(easeFn);
    }
    LOOKUP_CACHE[token] = easeFn;
    return easeFn;
  }
}
function addMode(name, fn) {
  MODE_BY_NAME[name] = fn;
}
function addEaseFn(data) {
  const names = data.name.split(/\s+/);
  for (let i = 0; i < names.length; i++) {
    const key = names[i];
    if (key) {
      EASE_BY_NAME[key] = data;
    }
  }
}
addMode("in", function(f) {
  return f;
});
addMode("out", function(f) {
  return function(t) {
    return 1 - f(1 - t);
  };
});
addMode("in-out", function(f) {
  return function(t) {
    return t < 0.5 ? f(2 * t) / 2 : 1 - f(2 * (1 - t)) / 2;
  };
});
addMode("out-in", function(f) {
  return function(t) {
    return t < 0.5 ? 1 - f(2 * (1 - t)) / 2 : f(2 * t) / 2;
  };
});
addEaseFn({
  name: "linear",
  fn: function(t) {
    return t;
  }
});
addEaseFn({
  name: "quad",
  fn: function(t) {
    return t * t;
  }
});
addEaseFn({
  name: "cubic",
  fn: function(t) {
    return t * t * t;
  }
});
addEaseFn({
  name: "quart",
  fn: function(t) {
    return t * t * t * t;
  }
});
addEaseFn({
  name: "quint",
  fn: function(t) {
    return t * t * t * t * t;
  }
});
addEaseFn({
  name: "sin sine",
  fn: function(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
});
addEaseFn({
  name: "exp expo",
  fn: function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
});
addEaseFn({
  name: "circle circ",
  fn: function(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
});
addEaseFn({
  name: "bounce",
  fn: function(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
});
addEaseFn({
  name: "poly",
  fc: function(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
});
addEaseFn({
  name: "elastic",
  fc: function(a, p) {
    p = p || 0.45;
    a = a || 1;
    const s = p / (2 * Math.PI) * Math.asin(1 / a);
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p);
    };
  }
});
addEaseFn({
  name: "back",
  fc: function(s) {
    s = typeof s !== "undefined" ? s : 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
});
class Transition {
  constructor(owner, options = {}) {
    this.uid = "transition:" + uid();
    this._ending = [];
    this._end = {};
    this._duration = options.duration || 400;
    this._delay = options.delay || 0;
    this._owner = owner;
    this._time = 0;
  }
  /** @internal */
  tick(node, elapsed, now, last) {
    this._time += elapsed;
    if (this._time < this._delay) {
      return;
    }
    const time = this._time - this._delay;
    if (!this._start) {
      this._start = {};
      for (const key in this._end) {
        this._start[key] = this._owner.pin(key);
      }
    }
    let p = Math.min(time / this._duration, 1);
    const ended = p >= 1;
    if (typeof this._easing == "function") {
      p = this._easing(p);
    }
    const q = 1 - p;
    for (const key in this._end) {
      this._owner.pin(key, this._start[key] * q + this._end[key] * p);
    }
    return ended;
  }
  /** @internal */
  finish() {
    this._ending.forEach((callback) => {
      try {
        callback.call(this._owner);
      } catch (e) {
        console.error(e);
      }
    });
    return this._next;
  }
  tween(a, b) {
    let options;
    if (typeof a === "object" && a !== null) {
      options = a;
    } else {
      options = {};
      if (typeof a === "number") {
        options.duration = a;
        if (typeof b === "number") {
          options.delay = b;
        }
      }
    }
    return this._next = new Transition(this._owner, options);
  }
  duration(duration) {
    this._duration = duration;
    return this;
  }
  delay(delay) {
    this._delay = delay;
    return this;
  }
  ease(easing) {
    this._easing = Easing.get(easing);
    return this;
  }
  done(fn) {
    this._ending.push(fn);
    return this;
  }
  hide() {
    this._ending.push(function() {
      this.hide();
    });
    this._hide = true;
    return this;
  }
  remove() {
    this._ending.push(function() {
      this.remove();
    });
    this._remove = true;
    return this;
  }
  pin(a, b) {
    if (typeof a === "object") {
      for (const attr in a) {
        pinning(this._owner, this._end, attr, a[attr]);
      }
    } else if (typeof b !== "undefined") {
      pinning(this._owner, this._end, a, b);
    }
    return this;
  }
  /**
   * @deprecated Use .done(fn) instead.
   */
  then(fn) {
    this.done(fn);
    return this;
  }
  /**
   * @deprecated this doesn't do anything anymore, call transition on the node instead.
   */
  clear(forward) {
    return this;
  }
  size(w, h) {
    this.pin("width", w);
    this.pin("height", h);
    return this;
  }
  width(w) {
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  }
  height(h) {
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  }
  offset(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  }
  rotate(a) {
    this.pin("rotation", a);
    return this;
  }
  skew(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  }
  scale(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  }
  alpha(a, ta) {
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  }
}
function pinning(node, map, key, value) {
  if (typeof node.pin(key) === "number") {
    map[key] = value;
  } else if (typeof node.pin(key + "X") === "number" && typeof node.pin(key + "Y") === "number") {
    map[key + "X"] = value;
    map[key + "Y"] = value;
  }
}
let iid = 0;
stats.create = 0;
function assertType(obj) {
  if (obj && obj instanceof Node) {
    return obj;
  }
  throw "Invalid node: " + obj;
}
const create = function() {
  return layout();
};
const layer = function() {
  return maximize();
};
const box = function() {
  return minimize();
};
const layout = function() {
  return new Node();
};
const row = function(align) {
  return layout().row(align).label("Row");
};
const column = function(align) {
  return layout().column(align).label("Column");
};
const minimize = function() {
  return layout().minimize().label("Minimize");
};
const maximize = function() {
  return layout().maximize().label("Maximize");
};
class Node {
  constructor() {
    this.uid = "node:" + uid();
    this._label = "";
    this._parent = null;
    this._next = null;
    this._prev = null;
    this._first = null;
    this._last = null;
    this._visible = true;
    this._alpha = 1;
    this._padding = 0;
    this._spacing = 0;
    this._pin = new Pin(this);
    this._listeners = {};
    this._attrs = {};
    this._flags = {};
    this._transitions = [];
    this._tickBefore = [];
    this._tickAfter = [];
    this.MAX_ELAPSE = Infinity;
    this._transitionTickInitied = false;
    this._transitionTickLastTime = 0;
    this._transitionTick = (elapsed, now, last) => {
      if (!this._transitions.length) {
        return false;
      }
      const ignore = this._transitionTickLastTime !== last;
      this._transitionTickLastTime = now;
      if (ignore) {
        return true;
      }
      const head = this._transitions[0];
      const ended = head.tick(this, elapsed, now, last);
      if (ended) {
        if (head === this._transitions[0]) {
          this._transitions.shift();
        }
        const next = head.finish();
        if (next) {
          this._transitions.unshift(next);
        }
      }
      return true;
    };
    stats.create++;
  }
  matrix(relative = false) {
    if (relative === true) {
      return this._pin.relativeMatrix();
    }
    return this._pin.absoluteMatrix();
  }
  pin(a, b) {
    if (typeof a === "object") {
      this._pin.set(a);
      return this;
    } else if (typeof a === "string") {
      if (typeof b === "undefined") {
        return this._pin.get(a);
      } else {
        this._pin.set(a, b);
        return this;
      }
    } else if (typeof a === "undefined") {
      return this._pin;
    }
  }
  scaleTo(a, b, c) {
    if (typeof a === "object") {
      c = b;
      b = a.y;
      a = a.x;
    }
    this._pin.scaleTo(a, b, c);
    return this;
  }
  toString() {
    return "[" + this._label + "]";
  }
  /** @deprecated Use label() */
  id(id) {
    return this.label(id);
  }
  label(label) {
    if (typeof label === "undefined") {
      return this._label;
    }
    this._label = label;
    return this;
  }
  attr(name, value) {
    if (typeof value === "undefined") {
      return this._attrs !== null ? this._attrs[name] : void 0;
    }
    (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
    return this;
  }
  visible(visible) {
    if (typeof visible === "undefined") {
      return this._visible;
    }
    this._visible = visible;
    this._parent && (this._parent._ts_children = ++iid);
    this._ts_pin = ++iid;
    this.touch();
    return this;
  }
  hide() {
    this.visible(false);
    return this;
  }
  show() {
    this.visible(true);
    return this;
  }
  parent() {
    return this._parent;
  }
  next(visible) {
    let next = this._next;
    while (next && visible && !next._visible) {
      next = next._next;
    }
    return next;
  }
  prev(visible) {
    let prev = this._prev;
    while (prev && visible && !prev._visible) {
      prev = prev._prev;
    }
    return prev;
  }
  first(visible) {
    let next = this._first;
    while (next && visible && !next._visible) {
      next = next._next;
    }
    return next;
  }
  last(visible) {
    let prev = this._last;
    while (prev && visible && !prev._visible) {
      prev = prev._prev;
    }
    return prev;
  }
  visit(visitor, payload) {
    const reverse = visitor.reverse;
    const visible = visitor.visible;
    if (visitor.start && visitor.start(this, payload)) {
      return;
    }
    let child;
    let next = reverse ? this.last(visible) : this.first(visible);
    while (child = next) {
      next = reverse ? child.prev(visible) : child.next(visible);
      if (child.visit(visitor, payload)) {
        return true;
      }
    }
    return visitor.end && visitor.end(this, payload);
  }
  append(child, more) {
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        Node.append(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      for (let i = 0; i < arguments.length; i++) {
        Node.append(this, arguments[i]);
      }
    } else if (typeof child !== "undefined")
      Node.append(this, child);
    return this;
  }
  prepend(child, more) {
    if (Array.isArray(child)) {
      for (let i = child.length - 1; i >= 0; i--) {
        Node.prepend(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      for (let i = arguments.length - 1; i >= 0; i--) {
        Node.prepend(this, arguments[i]);
      }
    } else if (typeof child !== "undefined")
      Node.prepend(this, child);
    return this;
  }
  appendTo(parent) {
    Node.append(parent, this);
    return this;
  }
  prependTo(parent) {
    Node.prepend(parent, this);
    return this;
  }
  insertNext(sibling, more) {
    if (Array.isArray(sibling)) {
      for (let i = 0; i < sibling.length; i++) {
        Node.insertAfter(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      for (let i = 0; i < arguments.length; i++) {
        Node.insertAfter(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      Node.insertAfter(sibling, this);
    }
    return this;
  }
  insertPrev(sibling, more) {
    if (Array.isArray(sibling)) {
      for (let i = sibling.length - 1; i >= 0; i--) {
        Node.insertBefore(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      for (let i = arguments.length - 1; i >= 0; i--) {
        Node.insertBefore(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      Node.insertBefore(sibling, this);
    }
    return this;
  }
  insertAfter(prev) {
    Node.insertAfter(this, prev);
    return this;
  }
  insertBefore(next) {
    Node.insertBefore(this, next);
    return this;
  }
  /** @internal */
  static append(parent, child) {
    assertType(child);
    assertType(parent);
    child.remove();
    if (parent._last) {
      parent._last._next = child;
      child._prev = parent._last;
    }
    child._parent = parent;
    parent._last = child;
    if (!parent._first) {
      parent._first = child;
    }
    child._parent._flag(child, true);
    child._ts_parent = ++iid;
    parent._ts_children = ++iid;
    parent.touch();
  }
  /** @internal */
  static prepend(parent, child) {
    assertType(child);
    assertType(parent);
    child.remove();
    if (parent._first) {
      parent._first._prev = child;
      child._next = parent._first;
    }
    child._parent = parent;
    parent._first = child;
    if (!parent._last) {
      parent._last = child;
    }
    child._parent._flag(child, true);
    child._ts_parent = ++iid;
    parent._ts_children = ++iid;
    parent.touch();
  }
  /** @internal */
  static insertBefore(self, next) {
    assertType(self);
    assertType(next);
    self.remove();
    const parent = next._parent;
    const prev = next._prev;
    if (!parent) {
      return;
    }
    next._prev = self;
    prev && (prev._next = self) || parent && (parent._first = self);
    self._parent = parent;
    self._prev = prev;
    self._next = next;
    self._parent._flag(self, true);
    self._ts_parent = ++iid;
    self.touch();
  }
  /** @internal */
  static insertAfter(self, prev) {
    assertType(self);
    assertType(prev);
    self.remove();
    const parent = prev._parent;
    const next = prev._next;
    if (!parent) {
      return;
    }
    prev._next = self;
    next && (next._prev = self) || parent && (parent._last = self);
    self._parent = parent;
    self._prev = prev;
    self._next = next;
    self._parent._flag(self, true);
    self._ts_parent = ++iid;
    self.touch();
  }
  remove(child, more) {
    if (typeof child !== "undefined") {
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          assertType(child[i]).remove();
        }
      } else if (typeof more !== "undefined") {
        for (let i = 0; i < arguments.length; i++) {
          assertType(arguments[i]).remove();
        }
      } else {
        assertType(child).remove();
      }
      return this;
    }
    if (this._prev) {
      this._prev._next = this._next;
    }
    if (this._next) {
      this._next._prev = this._prev;
    }
    if (this._parent) {
      if (this._parent._first === this) {
        this._parent._first = this._next;
      }
      if (this._parent._last === this) {
        this._parent._last = this._prev;
      }
      this._parent._flag(this, false);
      this._parent._ts_children = ++iid;
      this._parent.touch();
    }
    this._prev = this._next = this._parent = null;
    this._ts_parent = ++iid;
    return this;
  }
  empty() {
    let child = null;
    let next = this._first;
    while (child = next) {
      next = child._next;
      child._prev = child._next = child._parent = null;
      this._flag(child, false);
    }
    this._first = this._last = null;
    this._ts_children = ++iid;
    this.touch();
    return this;
  }
  touch() {
    this._ts_touch = ++iid;
    this._parent && this._parent.touch();
    return this;
  }
  /** @internal Deep flag, used for optimizing event distribution. */
  _flag(key, value) {
    if (typeof value === "undefined") {
      return this._flags !== null && this._flags[key] || 0;
    }
    if (typeof key === "string") {
      if (value) {
        this._flags = this._flags || {};
        if (!this._flags[key] && this._parent) {
          this._parent._flag(key, true);
        }
        this._flags[key] = (this._flags[key] || 0) + 1;
      } else if (this._flags && this._flags[key] > 0) {
        if (this._flags[key] == 1 && this._parent) {
          this._parent._flag(key, false);
        }
        this._flags[key] = this._flags[key] - 1;
      }
    }
    if (typeof key === "object") {
      if (key._flags) {
        for (const type in key._flags) {
          if (key._flags[type] > 0) {
            this._flag(type, value);
          }
        }
      }
    }
    return this;
  }
  /** @internal */
  hitTest(hit) {
    const width = this._pin._width;
    const height = this._pin._height;
    return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
  }
  prerender() {
    if (!this._visible) {
      return;
    }
    let child;
    let next = this._first;
    while (child = next) {
      next = child._next;
      child.prerender();
    }
  }
  render(context) {
    if (!this._visible) {
      return;
    }
    stats.node++;
    const m = this.matrix();
    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
    this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
    const alpha = this._pin._textureAlpha * this._alpha;
    if (context.globalAlpha != alpha) {
      context.globalAlpha = alpha;
    }
    if (this._textures) {
      for (let i = 0, n = this._textures.length; i < n; i++) {
        this._textures[i].draw(context);
      }
    }
    if (context.globalAlpha != this._alpha) {
      context.globalAlpha = this._alpha;
    }
    let child;
    let next = this._first;
    while (child = next) {
      next = child._next;
      child.render(context);
    }
  }
  /** @internal */
  _tick(elapsed, now, last) {
    if (!this._visible) {
      return;
    }
    if (elapsed > this.MAX_ELAPSE) {
      elapsed = this.MAX_ELAPSE;
    }
    let ticked = false;
    if (this._tickBefore !== null) {
      for (let i = 0; i < this._tickBefore.length; i++) {
        stats.tick++;
        const tickFn = this._tickBefore[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }
    let child;
    let next = this._first;
    while (child = next) {
      next = child._next;
      if (child._flag("_tick")) {
        ticked = child._tick(elapsed, now, last) === true ? true : ticked;
      }
    }
    if (this._tickAfter !== null) {
      for (let i = 0; i < this._tickAfter.length; i++) {
        stats.tick++;
        const tickFn = this._tickAfter[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }
    return ticked;
  }
  tick(callback, before = false) {
    var _a, _b;
    if (typeof callback !== "function") {
      return;
    }
    if (before) {
      if (this._tickBefore === null) {
        this._tickBefore = [];
      }
      this._tickBefore.push(callback);
    } else {
      if (this._tickAfter === null) {
        this._tickAfter = [];
      }
      this._tickAfter.push(callback);
    }
    const hasTickListener = ((_a = this._tickAfter) == null ? void 0 : _a.length) > 0 || ((_b = this._tickBefore) == null ? void 0 : _b.length) > 0;
    this._flag("_tick", hasTickListener);
  }
  untick(callback) {
    if (typeof callback !== "function") {
      return;
    }
    let i;
    if (this._tickBefore !== null && (i = this._tickBefore.indexOf(callback)) >= 0) {
      this._tickBefore.splice(i, 1);
    }
    if (this._tickAfter !== null && (i = this._tickAfter.indexOf(callback)) >= 0) {
      this._tickAfter.splice(i, 1);
    }
  }
  timeout(callback, time) {
    this.setTimeout(callback, time);
  }
  setTimeout(callback, time) {
    function timer(t) {
      if ((time -= t) < 0) {
        this.untick(timer);
        callback.call(this);
      } else {
        return true;
      }
    }
    this.tick(timer);
    return timer;
  }
  clearTimeout(timer) {
    this.untick(timer);
  }
  on(type, listener) {
    if (!type || !type.length || typeof listener !== "function") {
      return this;
    }
    if (typeof type !== "string" && typeof type.join === "function") {
      for (let i = 0; i < type.length; i++) {
        this.on(type[i], listener);
      }
    } else if (typeof type === "string" && type.indexOf(" ") > -1) {
      type = type.match(/\S+/g);
      for (let i = 0; i < type.length; i++) {
        this._on(type[i], listener);
      }
    } else if (typeof type === "string") {
      this._on(type, listener);
    } else
      ;
    return this;
  }
  /** @internal */
  _on(type, listener) {
    if (typeof type !== "string" && typeof listener !== "function") {
      return;
    }
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(listener);
    this._flag(type, true);
  }
  off(type, listener) {
    if (!type || !type.length || typeof listener !== "function") {
      return this;
    }
    if (typeof type !== "string" && typeof type.join === "function") {
      for (let i = 0; i < type.length; i++) {
        this.off(type[i], listener);
      }
    } else if (typeof type === "string" && type.indexOf(" ") > -1) {
      type = type.match(/\S+/g);
      for (let i = 0; i < type.length; i++) {
        this._off(type[i], listener);
      }
    } else if (typeof type === "string") {
      this._off(type, listener);
    } else
      ;
    return this;
  }
  /** @internal */
  _off(type, listener) {
    if (typeof type !== "string" && typeof listener !== "function") {
      return;
    }
    const listeners = this._listeners[type];
    if (!listeners || !listeners.length) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
      this._flag(type, false);
    }
  }
  listeners(type) {
    return this._listeners[type];
  }
  publish(name, args) {
    const listeners = this.listeners(name);
    if (!listeners || !listeners.length) {
      return 0;
    }
    for (let l = 0; l < listeners.length; l++) {
      listeners[l].apply(this, args);
    }
    return listeners.length;
  }
  /** @hidden @deprecated @internal */
  trigger(name, args) {
    this.publish(name, args);
    return this;
  }
  size(w, h) {
    this.pin("width", w);
    this.pin("height", h);
    return this;
  }
  width(w) {
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  }
  height(h) {
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  }
  offset(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  }
  rotate(a) {
    this.pin("rotation", a);
    return this;
  }
  skew(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  }
  scale(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  }
  alpha(a, ta) {
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  }
  tween(a, b, c) {
    let options;
    if (typeof a === "object" && a !== null) {
      options = a;
    } else {
      options = {};
      if (typeof a === "number") {
        options.duration = a;
        if (typeof b === "number") {
          options.delay = b;
          if (typeof c === "boolean") {
            options.append = c;
          }
        } else if (typeof b === "boolean") {
          options.append = b;
        }
      } else if (typeof a === "boolean") {
        options.append = a;
      }
    }
    if (!this._transitionTickInitied) {
      this.tick(this._transitionTick, true);
      this._transitionTickInitied = true;
    }
    this.touch();
    if (!options.append) {
      this._transitions.length = 0;
    }
    const transition = new Transition(this, options);
    this._transitions.push(transition);
    return transition;
  }
  row(align) {
    this.align("row", align);
    return this;
  }
  column(align) {
    this.align("column", align);
    return this;
  }
  align(type, align) {
    this._padding = this._padding;
    this._spacing = this._spacing;
    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      this._layoutTicker = () => {
        if (this._mo_seq == this._ts_touch) {
          return;
        }
        this._mo_seq = this._ts_touch;
        const alignChildren = this._mo_seqAlign != this._ts_children;
        this._mo_seqAlign = this._ts_children;
        let width = 0;
        let height = 0;
        let child;
        let next = this.first(true);
        let first = true;
        while (child = next) {
          next = child.next(true);
          child.matrix(true);
          const w = child.pin("boxWidth");
          const h = child.pin("boxHeight");
          if (type == "column") {
            !first && (height += this._spacing);
            child.pin("offsetY") != height && child.pin("offsetY", height);
            width = Math.max(width, w);
            height = height + h;
            alignChildren && child.pin("alignX", align);
          } else if (type == "row") {
            !first && (width += this._spacing);
            child.pin("offsetX") != width && child.pin("offsetX", width);
            width = width + w;
            height = Math.max(height, h);
            alignChildren && child.pin("alignY", align);
          }
          first = false;
        }
        width += 2 * this._padding;
        height += 2 * this._padding;
        this.pin("width") != width && this.pin("width", width);
        this.pin("height") != height && this.pin("height", height);
      }
    );
    return this;
  }
  /** @deprecated Use minimize() */
  box() {
    return this.minimize();
  }
  /** @deprecated Use minimize() */
  layer() {
    return this.maximize();
  }
  /**
   * Set size to match largest child size.
   */
  minimize() {
    this._padding = this._padding;
    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      this._layoutTicker = () => {
        if (this._mo_box == this._ts_touch) {
          return;
        }
        this._mo_box = this._ts_touch;
        let width = 0;
        let height = 0;
        let child;
        let next = this.first(true);
        while (child = next) {
          next = child.next(true);
          child.matrix(true);
          const w = child.pin("boxWidth");
          const h = child.pin("boxHeight");
          width = Math.max(width, w);
          height = Math.max(height, h);
        }
        width += 2 * this._padding;
        height += 2 * this._padding;
        this.pin("width") != width && this.pin("width", width);
        this.pin("height") != height && this.pin("height", height);
      }
    );
    return this;
  }
  /**
   * Set size to match parent size.
   */
  maximize() {
    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      this._layoutTicker = () => {
        const parent = this.parent();
        if (parent) {
          const width = parent.pin("width");
          if (this.pin("width") != width) {
            this.pin("width", width);
          }
          const height = parent.pin("height");
          if (this.pin("height") != height) {
            this.pin("height", height);
          }
        }
      },
      true
    );
    return this;
  }
  // TODO: move padding to pin
  /**
   * Set cell spacing for layout.
   */
  padding(pad) {
    this._padding = pad;
    return this;
  }
  /**
   * Set cell spacing for row and column layout.
   */
  spacing(space) {
    this._spacing = space;
    return this;
  }
}
const POINTER_CLICK = "click";
const POINTER_START = "touchstart mousedown";
const POINTER_MOVE = "touchmove mousemove";
const POINTER_END = "touchend mouseup";
const POINTER_CANCEL = "touchcancel mousecancel";
class EventPoint {
  clone(obj) {
    if (obj) {
      obj.x = this.x;
      obj.y = this.y;
    } else {
      obj = {
        x: this.x,
        y: this.y
      };
    }
    return obj;
  }
  toString() {
    return (this.x | 0) + "x" + (this.y | 0);
  }
}
class PointerSyntheticEvent {
  constructor() {
    this.abs = new EventPoint();
  }
  clone(obj) {
    if (obj) {
      obj.x = this.x;
      obj.y = this.y;
    } else {
      obj = {
        x: this.x,
        y: this.y
      };
    }
    return obj;
  }
  toString() {
    return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
  }
}
class VisitPayload {
  constructor() {
    this.type = "";
    this.x = 0;
    this.y = 0;
    this.timeStamp = -1;
    this.event = null;
    this.root = null;
    this.collected = null;
  }
  toString() {
    return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
  }
}
const syntheticEvent = new PointerSyntheticEvent();
const PAYLOAD = new VisitPayload();
class Pointer {
  constructor() {
    this.ratio = 1;
    this.clickList = [];
    this.cancelList = [];
    this.handleStart = (event) => {
      console.log("pointer-start", event.type);
      event.preventDefault();
      this.localPoint(event);
      this.dispatchEvent(event.type, event);
      this.findTargets("click", this.clickList);
      this.findTargets("mousecancel", this.cancelList);
    };
    this.handleMove = (event) => {
      event.preventDefault();
      this.localPoint(event);
      this.dispatchEvent(event.type, event);
    };
    this.handleEnd = (event) => {
      event.preventDefault();
      this.dispatchEvent(event.type, event);
      if (this.clickList.length) {
        this.dispatchEvent("click", event, this.clickList);
      }
      this.cancelList.length = 0;
    };
    this.handleCancel = (event) => {
      if (this.cancelList.length) {
        this.dispatchEvent("mousecancel", event, this.cancelList);
      }
      this.clickList.length = 0;
    };
    this.visitStart = (node, payload) => {
      return !node._flag(payload.type);
    };
    this.visitEnd = (node, payload) => {
      syntheticEvent.raw = payload.event;
      syntheticEvent.type = payload.type;
      syntheticEvent.timeStamp = payload.timeStamp;
      syntheticEvent.abs.x = payload.x;
      syntheticEvent.abs.y = payload.y;
      const listeners = node.listeners(payload.type);
      if (!listeners) {
        return;
      }
      node.matrix().inverse().map(payload, syntheticEvent);
      const isEventTarget = node === payload.root || node.attr("spy") || node.hitTest(syntheticEvent);
      if (!isEventTarget) {
        return;
      }
      if (payload.collected) {
        payload.collected.push(node);
      }
      if (payload.event) {
        let cancel = false;
        for (let l = 0; l < listeners.length; l++) {
          cancel = listeners[l].call(node, syntheticEvent) ? true : cancel;
        }
        return cancel;
      }
    };
  }
  mount(stage, elem) {
    this.stage = stage;
    this.elem = elem;
    this.ratio = stage.viewport().ratio || 1;
    stage.on("viewport", (viewport) => {
      this.ratio = viewport.ratio ?? this.ratio;
    });
    elem.addEventListener("touchstart", this.handleStart);
    elem.addEventListener("touchend", this.handleEnd);
    elem.addEventListener("touchmove", this.handleMove);
    elem.addEventListener("touchcancel", this.handleCancel);
    elem.addEventListener("mousedown", this.handleStart);
    elem.addEventListener("mouseup", this.handleEnd);
    elem.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleCancel);
    window.addEventListener("blur", this.handleCancel);
    return this;
  }
  unmount() {
    const elem = this.elem;
    elem.removeEventListener("touchstart", this.handleStart);
    elem.removeEventListener("touchend", this.handleEnd);
    elem.removeEventListener("touchmove", this.handleMove);
    elem.removeEventListener("touchcancel", this.handleCancel);
    elem.removeEventListener("mousedown", this.handleStart);
    elem.removeEventListener("mouseup", this.handleEnd);
    elem.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleCancel);
    window.removeEventListener("blur", this.handleCancel);
    return this;
  }
  /**
   * Computer the location of the pointer event in the canvas coordination
   */
  localPoint(event) {
    var _a;
    const elem = this.elem;
    let x;
    let y;
    if ((_a = event.touches) == null ? void 0 : _a.length) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    const rect = elem.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    x -= elem.clientLeft | 0;
    y -= elem.clientTop | 0;
    PAYLOAD.x = x * this.ratio;
    PAYLOAD.y = y * this.ratio;
  }
  /**
   * Find eligible target for and event type, used to keep trace nodes to dispatch click event
   */
  findTargets(type, result) {
    const payload = PAYLOAD;
    payload.type = type;
    payload.root = this.stage;
    payload.event = null;
    payload.collected = result;
    payload.collected.length = 0;
    this.stage.visit(
      {
        reverse: true,
        visible: true,
        start: this.visitStart,
        end: this.visitEnd
      },
      payload
    );
  }
  dispatchEvent(type, event, targets) {
    const payload = PAYLOAD;
    payload.type = type;
    payload.root = this.stage;
    payload.event = event;
    payload.timeStamp = Date.now();
    payload.collected = null;
    if (type !== "mousemove" && type !== "touchmove") {
      console.log("pointer:dispatchEvent", payload, targets == null ? void 0 : targets.length);
    }
    if (targets) {
      while (targets.length) {
        const node = targets.shift();
        if (this.visitEnd(node, payload)) {
          break;
        }
      }
      targets.length = 0;
    } else {
      this.stage.visit(
        {
          reverse: true,
          visible: true,
          start: this.visitStart,
          end: this.visitEnd
        },
        payload
      );
    }
  }
}
const Mouse = {
  CLICK: "click",
  START: "touchstart mousedown",
  MOVE: "touchmove mousemove",
  END: "touchend mouseup",
  CANCEL: "touchcancel mousecancel"
};
const ROOTS = [];
const pause = function() {
  for (let i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].pause();
  }
};
const resume = function() {
  for (let i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].resume();
  }
};
const mount = function(configs = {}) {
  const root = new Root();
  root.mount(configs);
  root.pointer = new Pointer().mount(root, root.dom);
  return root;
};
class Root extends Node {
  constructor() {
    super();
    this.canvas = null;
    this.dom = null;
    this.context = null;
    this.pixelWidth = -1;
    this.pixelHeight = -1;
    this.pixelRatio = 1;
    this.drawingWidth = 0;
    this.drawingHeight = 0;
    this.mounted = false;
    this.paused = false;
    this.sleep = false;
    this.mount = (configs = {}) => {
      if (typeof configs.canvas === "string") {
        this.canvas = document.getElementById(configs.canvas);
      } else if (configs.canvas instanceof HTMLCanvasElement) {
        this.canvas = configs.canvas;
      } else if (configs.canvas)
        ;
      if (!this.canvas) {
        this.canvas = document.getElementById("cutjs") || document.getElementById("stage");
      }
      if (!this.canvas) {
        console.log("Creating Canvas...");
        this.canvas = document.createElement("canvas");
        Object.assign(this.canvas.style, {
          position: "absolute",
          display: "block",
          top: "0",
          left: "0",
          bottom: "0",
          right: "0",
          width: "100%",
          height: "100%"
        });
        const body = document.body;
        body.insertBefore(this.canvas, body.firstChild);
      }
      this.dom = this.canvas;
      this.context = this.canvas.getContext("2d");
      const devicePixelRatio = window.devicePixelRatio || 1;
      const backingStorePixelRatio = (
        // @ts-ignore
        this.context.webkitBackingStorePixelRatio || // @ts-ignore
        this.context.mozBackingStorePixelRatio || // @ts-ignore
        this.context.msBackingStorePixelRatio || // @ts-ignore
        this.context.oBackingStorePixelRatio || // @ts-ignore
        this.context.backingStorePixelRatio || 1
      );
      this.devicePixelRatio = devicePixelRatio;
      this.backingStoreRatio = backingStorePixelRatio;
      this.pixelRatio = this.devicePixelRatio / this.backingStoreRatio;
      this.mounted = true;
      ROOTS.push(this);
      this.requestFrame();
    };
    this.frameRequested = false;
    this.requestFrame = () => {
      if (!this.frameRequested) {
        this.frameRequested = true;
        requestAnimationFrame(this.onFrame);
      }
    };
    this.lastTime = 0;
    this._mo_touch = null;
    this.onFrame = (now) => {
      this.frameRequested = false;
      if (!this.mounted || !this.canvas || !this.context) {
        return;
      }
      this.requestFrame();
      const newPixelWidth = this.canvas.clientWidth;
      const newPixelHeight = this.canvas.clientHeight;
      if (this.pixelWidth !== newPixelWidth || this.pixelHeight !== newPixelHeight) {
        this.pixelWidth = newPixelWidth;
        this.pixelHeight = newPixelHeight;
        this.drawingWidth = newPixelWidth * this.pixelRatio;
        this.drawingHeight = newPixelHeight * this.pixelRatio;
        if (this.canvas.width !== this.drawingWidth || this.canvas.height !== this.drawingHeight) {
          this.canvas.width = this.drawingWidth;
          this.canvas.height = this.drawingHeight;
          console.log(
            "Resize: [" + this.drawingWidth + ", " + this.drawingHeight + "] = " + this.pixelRatio + " x [" + this.pixelWidth + ", " + this.pixelHeight + "]"
          );
          this.viewport({
            width: this.drawingWidth,
            height: this.drawingHeight,
            ratio: this.pixelRatio
          });
        }
      }
      const last = this.lastTime || now;
      const elapsed = now - last;
      if (!this.mounted || this.paused || this.sleep) {
        return;
      }
      this.lastTime = now;
      this.prerender();
      const tickRequest = this._tick(elapsed, now, last);
      if (this._mo_touch != this._ts_touch) {
        this._mo_touch = this._ts_touch;
        this.sleep = false;
        if (this.drawingWidth > 0 && this.drawingHeight > 0) {
          this.context.setTransform(1, 0, 0, 1, 0, 0);
          this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);
          this.render(this.context);
        }
      } else if (tickRequest) {
        this.sleep = false;
      } else {
        this.sleep = true;
      }
      stats.fps = elapsed ? 1e3 / elapsed : 0;
    };
    this.label("Root");
  }
  resume() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.paused = false;
    this.sleep = false;
    this.publish("resume");
    return this;
  }
  pause() {
    if (!this.paused) {
      this.publish("pause");
    }
    this.paused = true;
    return this;
  }
  /** @internal */
  touch() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.sleep = false;
    return super.touch();
  }
  unmount() {
    var _a;
    this.mounted = false;
    const index = ROOTS.indexOf(this);
    if (index >= 0) {
      ROOTS.splice(index, 1);
    }
    (_a = this.pointer) == null ? void 0 : _a.unmount();
    return this;
  }
  background(color) {
    if (this.dom) {
      this.dom.style.backgroundColor = color;
    }
    return this;
  }
  viewport(width, height, ratio) {
    if (typeof width === "undefined") {
      return Object.assign({}, this._viewport);
    }
    if (typeof width === "object") {
      const options = width;
      width = options.width;
      height = options.height;
      ratio = options.ratio;
    }
    if (typeof width === "number" && typeof height === "number") {
      this._viewport = {
        width,
        height,
        ratio: typeof ratio === "number" ? ratio : 1
      };
      this.viewbox();
      const data = Object.assign({}, this._viewport);
      this.visit({
        start: function(node) {
          if (!node._flag("viewport")) {
            return true;
          }
          node.publish("viewport", [data]);
        }
      });
    }
    return this;
  }
  viewbox(width, height, mode) {
    if (typeof width === "number" && typeof height === "number") {
      this._viewbox = {
        width,
        height,
        mode
      };
    } else if (typeof width === "object" && width !== null) {
      this._viewbox = {
        ...width
      };
    }
    this.rescale();
    return this;
  }
  camera(matrix) {
    this._camera = matrix;
    this.rescale();
    return this;
  }
  /** @internal */
  rescale() {
    const viewbox = this._viewbox;
    const viewport = this._viewport;
    const camera = this._camera;
    if (viewport && viewbox) {
      const viewportWidth = viewport.width;
      const viewportHeight = viewport.height;
      const viewboxMode = viewbox.mode && /^(in|out|in-pad|out-crop)$/.test(viewbox.mode) ? viewbox.mode : "in-pad";
      const viewboxWidth = viewbox.width;
      const viewboxHeight = viewbox.height;
      this.pin({
        width: viewboxWidth,
        height: viewboxHeight
      });
      this.scaleTo(viewportWidth, viewportHeight, viewboxMode);
      const viewboxX = viewbox.x || 0;
      const viewboxY = viewbox.y || 0;
      const cameraZoom = (camera == null ? void 0 : camera.a) || 1;
      const cameraX = (camera == null ? void 0 : camera.e) || 0;
      const cameraY = (camera == null ? void 0 : camera.f) || 0;
      const scaleX = this.pin("scaleX");
      const scaleY = this.pin("scaleY");
      this.pin("scaleX", scaleX * cameraZoom);
      this.pin("scaleY", scaleY * cameraZoom);
      this.pin("offsetX", cameraX - viewboxX * scaleX * cameraZoom);
      this.pin("offsetY", cameraY - viewboxY * scaleY * cameraZoom);
    } else if (viewport) {
      this.pin({
        width: viewport.width,
        height: viewport.height
      });
    }
    return this;
  }
}
function getPixelRatio() {
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}
const sprite = function(frame) {
  const sprite2 = new Sprite();
  frame && sprite2.texture(frame);
  return sprite2;
};
class Sprite extends Node {
  constructor() {
    super();
    this.prerenderContext = {};
    this.label("Sprite");
    this._textures = [];
    this._image = null;
  }
  texture(frame) {
    this._image = texture(frame).one();
    if (this._image) {
      this.pin("width", this._image.width);
      this.pin("height", this._image.height);
      this._textures[0] = this._image.pipe();
      this._textures.length = 1;
    } else {
      this.pin("width", 0);
      this.pin("height", 0);
      this._textures.length = 0;
    }
    return this;
  }
  /** @deprecated */
  image(frame) {
    return this.texture(frame);
  }
  tile(inner) {
    this._repeat(false, inner);
    return this;
  }
  stretch(inner) {
    this._repeat(true, inner);
    return this;
  }
  /** @internal */
  _repeat(stretch, inner) {
    const insert = (i, sx, sy, sw, sh, dx, dy, dw, dh) => {
      if (!this._image) {
        return;
      }
      const repeat2 = this._textures.length > i ? this._textures[i] : this._textures[i] = this._image.pipe();
      repeat2.setSourceCoordinate(sx, sy);
      repeat2.setSourceDimension(sw, sh);
      repeat2.setDestinationCoordinate(dx, dy);
      repeat2.setDestinationDimension(dw, dh);
    };
    this.untick(this._repeatTicker);
    this.tick(
      this._repeatTicker = () => {
        if (this._mo_stretch == this._pin._ts_transform) {
          return;
        }
        this._mo_stretch = this._pin._ts_transform;
        const width = this.pin("width");
        const height = this.pin("height");
        this._textures.length = repeat(this._image, width, height, stretch, inner, insert);
      }
    );
  }
  prerender() {
    var _a;
    if (!this._visible) {
      return;
    }
    if (this._image) {
      const m = (_a = this._parent) == null ? void 0 : _a.matrix();
      const pixelRatio = !m ? 1 : Math.max(Math.abs(m.a), Math.abs(m.b)) / getPixelRatio();
      this.prerenderContext.pixelRatio = pixelRatio;
      const updated = this._image.prerender(this.prerenderContext);
      if (updated === true) {
        this.texture(this._image);
      }
    }
    super.prerender();
  }
}
function repeat(img, owidth, oheight, stretch, inner, insert) {
  let width = img.width;
  let height = img.height;
  let left = img.left;
  let right = img.right;
  let top = img.top;
  let bottom = img.bottom;
  left = typeof left === "number" && left === left ? left : 0;
  right = typeof right === "number" && right === right ? right : 0;
  top = typeof top === "number" && top === top ? top : 0;
  bottom = typeof bottom === "number" && bottom === bottom ? bottom : 0;
  width = width - left - right;
  height = height - top - bottom;
  if (!inner) {
    owidth = Math.max(owidth - left - right, 0);
    oheight = Math.max(oheight - top - bottom, 0);
  }
  let i = 0;
  if (top > 0 && left > 0) {
    insert(i++, 0, 0, left, top, 0, 0, left, top);
  }
  if (bottom > 0 && left > 0) {
    insert(i++, 0, height + top, left, bottom, 0, oheight + top, left, bottom);
  }
  if (top > 0 && right > 0) {
    insert(i++, width + left, 0, right, top, owidth + left, 0, right, top);
  }
  if (bottom > 0 && right > 0) {
    insert(
      i++,
      width + left,
      height + top,
      right,
      bottom,
      owidth + left,
      oheight + top,
      right,
      bottom
    );
  }
  if (stretch) {
    if (top > 0) {
      insert(i++, left, 0, width, top, left, 0, owidth, top);
    }
    if (bottom > 0) {
      insert(i++, left, height + top, width, bottom, left, oheight + top, owidth, bottom);
    }
    if (left > 0) {
      insert(i++, 0, top, left, height, 0, top, left, oheight);
    }
    if (right > 0) {
      insert(i++, width + left, top, right, height, owidth + left, top, right, oheight);
    }
    insert(i++, left, top, width, height, left, top, owidth, oheight);
  } else {
    let l = left;
    let r = owidth;
    let w;
    while (r > 0) {
      w = Math.min(width, r);
      r -= width;
      let t = top;
      let b = oheight;
      let h;
      while (b > 0) {
        h = Math.min(height, b);
        b -= height;
        insert(i++, left, top, w, h, l, t, w, h);
        if (r <= 0) {
          if (left) {
            insert(i++, 0, top, left, h, 0, t, left, h);
          }
          if (right) {
            insert(i++, width + left, top, right, h, l + w, t, right, h);
          }
        }
        t += h;
      }
      if (top) {
        insert(i++, left, 0, w, top, l, 0, w, top);
      }
      if (bottom) {
        insert(i++, left, height + top, w, bottom, l, t, w, bottom);
      }
      l += w;
    }
  }
  return i;
}
const image = sprite;
const Image$1 = Sprite;
class CanvasTexture extends Texture {
  constructor(type = "2d", attributes) {
    super();
    this._lastPixelRatio = 0;
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext(type, attributes);
    this.setSourceImage(this._canvas);
  }
  /**
   * Note: texture size is set to width and height, and canvas size is texture size multiply by pixelRatio.
   */
  setSize(width, height, pixelRatio = 1) {
    this._canvas.width = width * pixelRatio;
    this._canvas.height = height * pixelRatio;
    this._pixelRatio = pixelRatio;
    this.setSourceDimension(width, height);
    this.setDestinationDimension(width, height);
  }
  getContext() {
    return this._context;
  }
  setMemoizer(memoizer) {
    this._memoizer = memoizer;
  }
  setDrawer(drawer) {
    this._drawer = drawer;
  }
  /** @internal */
  prerender(context) {
    const newPixelRatio = context.pixelRatio;
    const lastPixelRatio = this._lastPixelRatio;
    const pixelRationChange = lastPixelRatio / newPixelRatio;
    const pixelRatioChanged = lastPixelRatio === 0 || pixelRationChange > 1.25 || pixelRationChange < 0.8;
    if (pixelRatioChanged) {
      this._lastPixelRatio = newPixelRatio;
    }
    const newMemoKey = this._memoizer ? this._memoizer.call(this) : null;
    const memoKeyChanged = this._lastMemoKey !== newMemoKey;
    if (pixelRatioChanged || memoKeyChanged) {
      this._lastMemoKey = newMemoKey;
      this._lastPixelRatio = newPixelRatio;
      this._drawer.call(this);
      return true;
    }
  }
  /** @hidden @deprecated @internal */
  size(width, height, pixelRatio) {
    this.setSize(width, height, pixelRatio);
    return this;
  }
  /** @hidden @deprecated @internal */
  context() {
    return this.getContext();
  }
  /** @hidden @deprecated @internal */
  canvas(legacyTextureDrawer) {
    if (typeof legacyTextureDrawer === "function") {
      legacyTextureDrawer.call(this, this.getContext());
    } else if (typeof legacyTextureDrawer === "undefined") {
      if (typeof this._drawer === "function") {
        this._drawer.call(this);
      }
    }
    return this;
  }
}
function canvas(type, attributes, legacyTextureDrawer) {
  if (typeof type === "function") {
    const texture2 = new CanvasTexture();
    legacyTextureDrawer = type;
    texture2.setDrawer(function() {
      legacyTextureDrawer.call(texture2, texture2.getContext());
    });
    return texture2;
  } else if (typeof attributes === "function") {
    const texture2 = new CanvasTexture(type);
    legacyTextureDrawer = attributes;
    texture2.setDrawer(function() {
      legacyTextureDrawer.call(texture2, texture2.getContext());
    });
    return texture2;
  } else if (typeof legacyTextureDrawer === "function") {
    const texture2 = new CanvasTexture(type, attributes);
    texture2.setDrawer(function() {
      legacyTextureDrawer.call(texture2, texture2.getContext());
    });
    return texture2;
  } else {
    const texture2 = new CanvasTexture(type, attributes);
    return texture2;
  }
}
function memoizeDraw(legacySpriteDrawer, legacySpriteMemoizer = () => null) {
  const sprite2 = new Sprite();
  const texture2 = new CanvasTexture();
  sprite2.texture(texture2);
  texture2.setDrawer(function() {
    legacySpriteDrawer(2.5 * texture2._lastPixelRatio, texture2, sprite2);
  });
  texture2.setMemoizer(legacySpriteMemoizer);
  return sprite2;
}
const anim = function(frames, fps) {
  const anim2 = new Anim();
  anim2.frames(frames).gotoFrame(0);
  fps && anim2.fps(fps);
  return anim2;
};
const FPS = 15;
class Anim extends Node {
  constructor() {
    super();
    this.label("Anim");
    this._textures = [];
    this._fps = FPS;
    this._ft = 1e3 / this._fps;
    this._time = -1;
    this._repeat = 0;
    this._index = 0;
    this._frames = [];
    let lastTime = 0;
    this.tick(function(t, now, last) {
      if (this._time < 0 || this._frames.length <= 1) {
        return;
      }
      const ignore = lastTime != last;
      lastTime = now;
      if (ignore) {
        return true;
      }
      this._time += t;
      if (this._time < this._ft) {
        return true;
      }
      const n = this._time / this._ft | 0;
      this._time -= n * this._ft;
      this.moveFrame(n);
      if (this._repeat > 0 && (this._repeat -= n) <= 0) {
        this.stop();
        this._callback && this._callback();
        return false;
      }
      return true;
    }, false);
  }
  fps(fps) {
    if (typeof fps === "undefined") {
      return this._fps;
    }
    this._fps = fps > 0 ? fps : FPS;
    this._ft = 1e3 / this._fps;
    return this;
  }
  /** @deprecated Use frames */
  setFrames(frames) {
    return this.frames(frames);
  }
  frames(frames) {
    this._index = 0;
    this._frames = texture(frames).array();
    this.touch();
    return this;
  }
  length() {
    return this._frames ? this._frames.length : 0;
  }
  gotoFrame(frame, resize = false) {
    this._index = math.wrap(frame, this._frames.length) | 0;
    resize = resize || !this._textures[0];
    this._textures[0] = this._frames[this._index];
    if (resize) {
      this.pin("width", this._textures[0].width);
      this.pin("height", this._textures[0].height);
    }
    this.touch();
    return this;
  }
  moveFrame(move) {
    return this.gotoFrame(this._index + move);
  }
  repeat(repeat2, callback) {
    this._repeat = repeat2 * this._frames.length - 1;
    this._callback = callback;
    this.play();
    return this;
  }
  play(frame) {
    if (typeof frame !== "undefined") {
      this.gotoFrame(frame);
      this._time = 0;
    } else if (this._time < 0) {
      this._time = 0;
    }
    this.touch();
    return this;
  }
  stop(frame) {
    this._time = -1;
    if (typeof frame !== "undefined") {
      this.gotoFrame(frame);
    }
    return this;
  }
}
const string = function(chars) {
  return new Str().frames(chars);
};
class Str extends Node {
  constructor() {
    super();
    this.label("String");
    this._textures = [];
  }
  /** @deprecated Use frames */
  setFont(frames) {
    return this.frames(frames);
  }
  frames(frames) {
    this._textures = [];
    if (typeof frames == "string") {
      const selection = texture(frames);
      this._font = function(value) {
        return selection.one(value);
      };
    } else if (typeof frames === "object") {
      this._font = function(value) {
        return frames[value];
      };
    } else if (typeof frames === "function") {
      this._font = frames;
    }
    return this;
  }
  /** @deprecated Use value */
  setValue(value) {
    return this.value(value);
  }
  value(value) {
    if (typeof value === "undefined") {
      return this._value;
    }
    if (this._value === value) {
      return this;
    }
    this._value = value;
    if (value === null) {
      value = "";
    } else if (typeof value !== "string" && !Array.isArray(value)) {
      value = value.toString();
    }
    this._spacing = this._spacing || 0;
    let width = 0;
    let height = 0;
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const texture2 = this._textures[i] = this._font(typeof v === "string" ? v : v + "");
      width += i > 0 ? this._spacing : 0;
      texture2.setDestinationCoordinate(width, 0);
      width = width + texture2.width;
      height = Math.max(height, texture2.height);
    }
    this.pin("width", width);
    this.pin("height", height);
    this._textures.length = value.length;
    return this;
  }
}
const Stage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Anim,
  Atlas,
  CanvasTexture,
  Image: Image$1,
  Math: math,
  Matrix,
  Mouse,
  Node,
  POINTER_CANCEL,
  POINTER_CLICK,
  POINTER_END,
  POINTER_MOVE,
  POINTER_START,
  Pin,
  Pointer,
  Root,
  Sprite,
  Str,
  Texture,
  TextureSelection,
  Transition,
  anim,
  atlas,
  box,
  canvas,
  clamp,
  column,
  create,
  getPixelRatio,
  image,
  layer,
  layout,
  length,
  math,
  maximize,
  memoizeDraw,
  minimize,
  mount,
  pause,
  random,
  resume,
  row,
  sprite,
  string,
  texture,
  wrap
}, Symbol.toStringTag, { value: "Module" }));
exports.Anim = Anim;
exports.Atlas = Atlas;
exports.CanvasTexture = CanvasTexture;
exports.Image = Image$1;
exports.Math = math;
exports.Matrix = Matrix;
exports.Mouse = Mouse;
exports.Node = Node;
exports.POINTER_CANCEL = POINTER_CANCEL;
exports.POINTER_CLICK = POINTER_CLICK;
exports.POINTER_END = POINTER_END;
exports.POINTER_MOVE = POINTER_MOVE;
exports.POINTER_START = POINTER_START;
exports.Pin = Pin;
exports.Pointer = Pointer;
exports.Root = Root;
exports.Sprite = Sprite;
exports.Str = Str;
exports.Texture = Texture;
exports.TextureSelection = TextureSelection;
exports.Transition = Transition;
exports.anim = anim;
exports.atlas = atlas;
exports.box = box;
exports.canvas = canvas;
exports.clamp = clamp;
exports.column = column;
exports.create = create;
exports.default = Stage;
exports.getPixelRatio = getPixelRatio;
exports.image = image;
exports.layer = layer;
exports.layout = layout;
exports.length = length;
exports.math = math;
exports.maximize = maximize;
exports.memoizeDraw = memoizeDraw;
exports.minimize = minimize;
exports.mount = mount;
exports.pause = pause;
exports.random = random;
exports.resume = resume;
exports.row = row;
exports.sprite = sprite;
exports.string = string;
exports.texture = texture;
exports.wrap = wrap;
