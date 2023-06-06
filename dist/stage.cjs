"use strict";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */
var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === "function") {
  symbolValueOf = Symbol.prototype.valueOf;
}
var bigIntValueOf;
if (typeof BigInt === "function") {
  bigIntValueOf = BigInt.prototype.valueOf;
}
var isActualNaN = function(value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  "boolean": 1,
  number: 1,
  string: 1,
  undefined: 1
};
var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;
var is = {};
is.a = is.type = function(value, type) {
  return typeof value === type;
};
is.defined = function(value) {
  return typeof value !== "undefined";
};
is.empty = function(value) {
  var type = toStr.call(value);
  var key;
  if (type === "[object Array]" || type === "[object Arguments]" || type === "[object String]") {
    return value.length === 0;
  }
  if (type === "[object Object]") {
    for (key in value) {
      if (owns.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  return !value;
};
is.equal = function equal(value, other) {
  if (value === other) {
    return true;
  }
  var type = toStr.call(value);
  var key;
  if (type !== toStr.call(other)) {
    return false;
  }
  if (type === "[object Object]") {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }
  if (type === "[object Array]") {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (key--) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }
  if (type === "[object Function]") {
    return value.prototype === other.prototype;
  }
  if (type === "[object Date]") {
    return value.getTime() === other.getTime();
  }
  return false;
};
is.hosted = function(value, host) {
  var type = typeof host[value];
  return type === "object" ? !!host[value] : !NON_HOST_TYPES[type];
};
is.instance = is["instanceof"] = function(value, constructor) {
  return value instanceof constructor;
};
is.nil = is["null"] = function(value) {
  return value === null;
};
is.undef = is.undefined = function(value) {
  return typeof value === "undefined";
};
is.args = is.arguments = function(value) {
  var isStandardArguments = toStr.call(value) === "[object Arguments]";
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};
is.array = Array.isArray || function(value) {
  return toStr.call(value) === "[object Array]";
};
is.args.empty = function(value) {
  return is.args(value) && value.length === 0;
};
is.array.empty = function(value) {
  return is.array(value) && value.length === 0;
};
is.arraylike = function(value) {
  return !!value && !is.bool(value) && owns.call(value, "length") && isFinite(value.length) && is.number(value.length) && value.length >= 0;
};
is.bool = is["boolean"] = function(value) {
  return toStr.call(value) === "[object Boolean]";
};
is["false"] = function(value) {
  return is.bool(value) && Boolean(Number(value)) === false;
};
is["true"] = function(value) {
  return is.bool(value) && Boolean(Number(value)) === true;
};
is.date = function(value) {
  return toStr.call(value) === "[object Date]";
};
is.date.valid = function(value) {
  return is.date(value) && !isNaN(Number(value));
};
is.element = function(value) {
  return value !== void 0 && typeof HTMLElement !== "undefined" && value instanceof HTMLElement && value.nodeType === 1;
};
is.error = function(value) {
  return toStr.call(value) === "[object Error]";
};
is.fn = is["function"] = function(value) {
  var isAlert = typeof window !== "undefined" && value === window.alert;
  if (isAlert) {
    return true;
  }
  var str = toStr.call(value);
  return str === "[object Function]" || str === "[object GeneratorFunction]" || str === "[object AsyncFunction]";
};
is.number = function(value) {
  return toStr.call(value) === "[object Number]";
};
is.infinite = function(value) {
  return value === Infinity || value === -Infinity;
};
is.decimal = function(value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};
is.divisibleBy = function(value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || isNonZeroNumber && value % n === 0;
};
is.integer = is["int"] = function(value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};
is.maximum = function(value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!is.arraylike(others)) {
    throw new TypeError("second argument must be array-like");
  }
  var len = others.length;
  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }
  return true;
};
is.minimum = function(value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!is.arraylike(others)) {
    throw new TypeError("second argument must be array-like");
  }
  var len = others.length;
  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }
  return true;
};
is.nan = function(value) {
  return !is.number(value) || value !== value;
};
is.even = function(value) {
  return is.infinite(value) || is.number(value) && value === value && value % 2 === 0;
};
is.odd = function(value) {
  return is.infinite(value) || is.number(value) && value === value && value % 2 !== 0;
};
is.ge = function(value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};
is.gt = function(value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};
is.le = function(value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};
is.lt = function(value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};
is.within = function(value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError("all arguments must be numbers");
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || value >= start && value <= finish;
};
is.object = function(value) {
  return toStr.call(value) === "[object Object]";
};
is.primitive = function isPrimitive(value) {
  if (!value) {
    return true;
  }
  if (typeof value === "object" || is.object(value) || is.fn(value) || is.array(value)) {
    return false;
  }
  return true;
};
is.hash = function(value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};
is.regexp = function(value) {
  return toStr.call(value) === "[object RegExp]";
};
is.string = function(value) {
  return toStr.call(value) === "[object String]";
};
is.base64 = function(value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};
is.hex = function(value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};
is.symbol = function(value) {
  return typeof Symbol === "function" && toStr.call(value) === "[object Symbol]" && typeof symbolValueOf.call(value) === "symbol";
};
is.bigint = function(value) {
  return typeof BigInt === "function" && toStr.call(value) === "[object BigInt]" && typeof bigIntValueOf.call(value) === "bigint";
};
var is_1 = is;
const is$1 = /* @__PURE__ */ getDefaultExportFromCjs(is_1);
const stats = {};
function _await() {
  var count = 0;
  function fork(fn, n) {
    count += n = typeof n === "number" && n >= 1 ? n : 1;
    return function() {
      fn && fn.apply(this, arguments);
      if (n > 0) {
        n--, count--, call();
      }
    };
  }
  var then = [];
  function call() {
    if (count === 0) {
      while (then.length) {
        setTimeout(then.shift(), 0);
      }
    }
  }
  fork.then = function(fn) {
    if (count === 0) {
      setTimeout(fn, 0);
    } else {
      then.push(fn);
    }
  };
  return fork;
}
stats.create = 0;
function Stage(arg) {
  if (!(this instanceof Stage)) {
    if (is$1.fn(arg)) {
      return Stage.app.apply(Stage, arguments);
    } else if (is$1.object(arg)) {
      return Stage.atlas.apply(Stage, arguments);
    } else {
      return arg;
    }
  }
  stats.create++;
  for (var i = 0; i < _init.length; i++) {
    _init[i].call(this);
  }
}
var _init = [];
Stage._init = function(fn) {
  _init.push(fn);
};
var _load = [];
Stage._load = function(fn) {
  _load.push(fn);
};
var _config = {};
Stage.config = function() {
  if (arguments.length === 1 && is$1.string(arguments[0])) {
    return _config[arguments[0]];
  }
  if (arguments.length === 1 && is$1.object(arguments[0])) {
    Object.assign(_config, arguments[0]);
  }
  if (arguments.length === 2 && is$1.string(arguments[0])) {
    _config[arguments[1]];
  }
};
var _app_queue = [];
var _stages = [];
var _loaded = false;
var _paused = false;
Stage.app = function(app, opts) {
  if (!_loaded) {
    _app_queue.push(arguments);
    return;
  }
  console.log("Creating app...");
  var loader = Stage.config("app-loader");
  loader(function(stage, canvas) {
    console.log("Initing app...");
    for (var i = 0; i < _load.length; i++) {
      _load[i].call(this, stage, canvas);
    }
    app(stage, canvas);
    _stages.push(stage);
    console.log("Starting app...");
    stage.start();
  }, opts);
};
var loading = _await();
Stage.preload = function(load) {
  if (typeof load !== "function") {
    return;
  }
  load(loading());
};
Stage.start = function(config) {
  console.log("Starting...");
  Stage.config(config);
  loading.then(function() {
    console.log("Loading apps...");
    _loaded = true;
    while (_app_queue.length) {
      var args = _app_queue.shift();
      Stage.app.apply(Stage, args);
    }
  });
};
Stage.pause = function() {
  if (!_paused) {
    _paused = true;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].pause();
    }
  }
};
Stage.resume = function() {
  if (_paused) {
    _paused = false;
    for (var i = _stages.length - 1; i >= 0; i--) {
      _stages[i].resume();
    }
  }
};
Stage.create = function() {
  return new Stage();
};
function Matrix(a, b, c, d, e, f) {
  this.reset(a, b, c, d, e, f);
}
Matrix.prototype.toString = function() {
  return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.e + ", " + this.f + "]";
};
Matrix.prototype.clone = function() {
  return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
};
Matrix.prototype.reset = function(a, b, c, d, e, f) {
  this._dirty = true;
  if (typeof a === "object") {
    this.a = a.a, this.d = a.d;
    this.b = a.b, this.c = a.c;
    this.e = a.e, this.f = a.f;
  } else {
    this.a = a || 1, this.d = d || 1;
    this.b = b || 0, this.c = c || 0;
    this.e = e || 0, this.f = f || 0;
  }
  return this;
};
Matrix.prototype.identity = function() {
  this._dirty = true;
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.e = 0;
  this.f = 0;
  return this;
};
Matrix.prototype.rotate = function(angle) {
  if (!angle) {
    return this;
  }
  this._dirty = true;
  var u = angle ? Math.cos(angle) : 1;
  var v = angle ? Math.sin(angle) : 0;
  var a = u * this.a - v * this.b;
  var b = u * this.b + v * this.a;
  var c = u * this.c - v * this.d;
  var d = u * this.d + v * this.c;
  var e = u * this.e - v * this.f;
  var f = u * this.f + v * this.e;
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.e = e;
  this.f = f;
  return this;
};
Matrix.prototype.translate = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this._dirty = true;
  this.e += x;
  this.f += y;
  return this;
};
Matrix.prototype.scale = function(x, y) {
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
};
Matrix.prototype.skew = function(x, y) {
  if (!x && !y) {
    return this;
  }
  this._dirty = true;
  var a = this.a + this.b * x;
  var b = this.b + this.a * y;
  var c = this.c + this.d * x;
  var d = this.d + this.c * y;
  var e = this.e + this.f * x;
  var f = this.f + this.e * y;
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.e = e;
  this.f = f;
  return this;
};
Matrix.prototype.concat = function(m) {
  this._dirty = true;
  var n = this;
  var a = n.a * m.a + n.b * m.c;
  var b = n.b * m.d + n.a * m.b;
  var c = n.c * m.a + n.d * m.c;
  var d = n.d * m.d + n.c * m.b;
  var e = n.e * m.a + m.e + n.f * m.c;
  var f = n.f * m.d + m.f + n.e * m.b;
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.e = e;
  this.f = f;
  return this;
};
Matrix.prototype.inverse = Matrix.prototype.reverse = function() {
  if (this._dirty) {
    this._dirty = false;
    this.inversed = this.inversed || new Matrix();
    var z = this.a * this.d - this.b * this.c;
    this.inversed.a = this.d / z;
    this.inversed.b = -this.b / z;
    this.inversed.c = -this.c / z;
    this.inversed.d = this.a / z;
    this.inversed.e = (this.c * this.f - this.e * this.d) / z;
    this.inversed.f = (this.e * this.b - this.a * this.f) / z;
  }
  return this.inversed;
};
Matrix.prototype.map = function(p, q) {
  q = q || {};
  q.x = this.a * p.x + this.c * p.y + this.e;
  q.y = this.b * p.x + this.d * p.y + this.f;
  return q;
};
Matrix.prototype.mapX = function(x, y) {
  if (typeof x === "object")
    y = x.y, x = x.x;
  return this.a * x + this.c * y + this.e;
};
Matrix.prototype.mapY = function(x, y) {
  if (typeof x === "object")
    y = x.y, x = x.x;
  return this.b * x + this.d * y + this.f;
};
var native = Math;
const math = Object.create(Math);
math.random = function(min, max) {
  if (typeof min === "undefined") {
    max = 1, min = 0;
  } else if (typeof max === "undefined") {
    max = min, min = 0;
  }
  return min == max ? min : native.random() * (max - min) + min;
};
math.rotate = function(num, min, max) {
  if (typeof min === "undefined") {
    max = 1, min = 0;
  } else if (typeof max === "undefined") {
    max = min, min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};
math.limit = function(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};
math.length = function(x, y) {
  return native.sqrt(x * x + y * y);
};
function Texture(image, ratio) {
  if (typeof image === "object") {
    this.src(image, ratio);
  }
}
Texture.prototype.pipe = function() {
  return new Texture(this);
};
Texture.prototype.src = function(x, y, w, h) {
  if (typeof x === "object") {
    var image = x, ratio = y || 1;
    this._image = image;
    this._sx = this._dx = 0;
    this._sy = this._dy = 0;
    this._sw = this._dw = image.width / ratio;
    this._sh = this._dh = image.height / ratio;
    this.width = image.width / ratio;
    this.height = image.height / ratio;
    this.ratio = ratio;
  } else {
    if (typeof w === "undefined") {
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
};
Texture.prototype.dest = function(x, y, w, h) {
  this._dx = x, this._dy = y;
  this._dx = x, this._dy = y;
  if (typeof w !== "undefined") {
    this._dw = w, this._dh = h;
    this.width = w, this.height = h;
  }
  return this;
};
Texture.prototype.draw = function(context, x1, y1, x2, y2, x3, y3, x4, y4) {
  var image = this._image;
  if (image === null || typeof image !== "object") {
    return;
  }
  var sx = this._sx, sy = this._sy;
  var sw = this._sw, sh = this._sh;
  var dx = this._dx, dy = this._dy;
  var dw = this._dw, dh = this._dh;
  if (typeof x3 !== "undefined") {
    x1 = math.limit(x1, 0, this._sw), x2 = math.limit(x2, 0, this._sw - x1);
    y1 = math.limit(y1, 0, this._sh), y2 = math.limit(y2, 0, this._sh - y1);
    sx += x1, sy += y1, sw = x2, sh = y2;
    dx = x3, dy = y3, dw = x4, dh = y4;
  } else if (typeof x2 !== "undefined") {
    dx = x1, dy = y1, dw = x2, dh = y2;
  } else if (typeof x1 !== "undefined") {
    dw = x1, dh = y1;
  }
  var ratio = this.ratio || 1;
  sx *= ratio, sy *= ratio, sw *= ratio, sh *= ratio;
  try {
    if (typeof image.draw === "function") {
      image.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
      stats.draw++;
      context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  } catch (ex) {
    if (!image._draw_failed) {
      console.log("Unable to draw: ", image);
      console.log(ex);
      image._draw_failed = true;
    }
  }
};
var _atlases_map = {};
var _atlases_arr = [];
Stage.atlas = function(def) {
  var atlas = is$1.fn(def.draw) ? def : new Atlas(def);
  if (def.name) {
    _atlases_map[def.name] = atlas;
  }
  _atlases_arr.push(atlas);
  deprecated(def, "imagePath");
  deprecated(def, "imageRatio");
  var url = def.imagePath;
  var ratio = def.imageRatio || 1;
  if (is$1.string(def.image)) {
    url = def.image;
  } else if (is$1.hash(def.image)) {
    url = def.image.src || def.image.url;
    ratio = def.image.ratio || ratio;
  }
  url && Stage.preload(function(done) {
    console.log("Loading atlas: " + url);
    var imageloader = Stage.config("image-loader");
    imageloader(url, function(image) {
      console.log("Image loaded: " + url);
      atlas.src(image, ratio);
      done();
    }, function(err) {
      console.log("Error loading atlas: " + url, err);
      done();
    });
  });
  return atlas;
};
Atlas._super = Texture;
Atlas.prototype = Object.create(Atlas._super.prototype);
function Atlas(def) {
  Atlas._super.call(this);
  var atlas = this;
  deprecated(def, "filter");
  deprecated(def, "cutouts");
  deprecated(def, "sprites");
  deprecated(def, "factory");
  var map = def.map || def.filter;
  var ppu = def.ppu || def.ratio || 1;
  var trim = def.trim || 0;
  var textures = def.textures;
  var factory = def.factory;
  var cutouts = def.cutouts || def.sprites;
  function make(def2) {
    if (!def2 || is$1.fn(def2.draw)) {
      return def2;
    }
    def2 = Object.assign({}, def2);
    if (is$1.fn(map)) {
      def2 = map(def2);
    }
    if (ppu != 1) {
      def2.x *= ppu, def2.y *= ppu;
      def2.width *= ppu, def2.height *= ppu;
      def2.top *= ppu, def2.bottom *= ppu;
      def2.left *= ppu, def2.right *= ppu;
    }
    if (trim != 0) {
      def2.x += trim, def2.y += trim;
      def2.width -= 2 * trim, def2.height -= 2 * trim;
      def2.top -= trim, def2.bottom -= trim;
      def2.left -= trim, def2.right -= trim;
    }
    var texture = atlas.pipe();
    texture.top = def2.top, texture.bottom = def2.bottom;
    texture.left = def2.left, texture.right = def2.right;
    texture.src(def2.x, def2.y, def2.width, def2.height);
    return texture;
  }
  function find(query) {
    if (textures) {
      if (is$1.fn(textures)) {
        return textures(query);
      } else if (is$1.hash(textures)) {
        return textures[query];
      }
    }
    if (cutouts) {
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
      if (n === 0 && is$1.fn(factory)) {
        result = function(subquery) {
          return factory(query + (subquery ? subquery : ""));
        };
      }
      return result;
    }
  }
  this.select = function(query) {
    if (!query) {
      return new Selection(this.pipe());
    }
    var found = find(query);
    if (found) {
      return new Selection(found, find, make);
    }
  };
}
var nfTexture = new Texture();
nfTexture.x = nfTexture.y = nfTexture.width = nfTexture.height = 0;
nfTexture.pipe = nfTexture.src = nfTexture.dest = function() {
  return this;
};
nfTexture.draw = function() {
};
var nfSelection = new Selection(nfTexture);
function Selection(result, find, make) {
  function link(result2, subquery) {
    if (!result2) {
      return nfTexture;
    } else if (is$1.fn(result2.draw)) {
      return result2;
    } else if (is$1.hash(result2) && is$1.number(result2.width) && is$1.number(result2.height) && is$1.fn(make)) {
      return make(result2);
    } else if (is$1.hash(result2) && is$1.defined(subquery)) {
      return link(result2[subquery]);
    } else if (is$1.fn(result2)) {
      return link(result2(subquery));
    } else if (is$1.array(result2)) {
      return link(result2[0]);
    } else if (is$1.string(result2) && is$1.fn(find)) {
      return link(find(result2));
    }
  }
  this.one = function(subquery) {
    return link(result, subquery);
  };
  this.array = function(arr) {
    var array = is$1.array(arr) ? arr : [];
    if (is$1.array(result)) {
      for (var i = 0; i < result.length; i++) {
        array[i] = link(result[i]);
      }
    } else {
      array[0] = link(result);
    }
    return array;
  };
}
Stage.texture = function(query) {
  if (!is$1.string(query)) {
    return new Selection(query);
  }
  var result = null, atlas, i;
  if ((i = query.indexOf(":")) > 0 && query.length > i + 1) {
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
    console.error("Texture not found: " + query);
    result = nfSelection;
  }
  return result;
};
function deprecated(hash, name, msg) {
  if (name in hash)
    console.log(msg ? msg.replace("%name", name) : "'" + name + "' field of texture atlas is deprecated.");
}
var iid$1 = 0;
Stage.prototype._label = "";
Stage.prototype._visible = true;
Stage.prototype._parent = null;
Stage.prototype._next = null;
Stage.prototype._prev = null;
Stage.prototype._first = null;
Stage.prototype._last = null;
Stage.prototype._attrs = null;
Stage.prototype._flags = null;
Stage.prototype.toString = function() {
  return "[" + this._label + "]";
};
Stage.prototype.id = function(id) {
  return this.label(id);
};
Stage.prototype.label = function(label) {
  if (typeof label === "undefined") {
    return this._label;
  }
  this._label = label;
  return this;
};
Stage.prototype.attr = function(name, value) {
  if (typeof value === "undefined") {
    return this._attrs !== null ? this._attrs[name] : void 0;
  }
  (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
  return this;
};
Stage.prototype.visible = function(visible) {
  if (typeof visible === "undefined") {
    return this._visible;
  }
  this._visible = visible;
  this._parent && (this._parent._ts_children = ++iid$1);
  this._ts_pin = ++iid$1;
  this.touch();
  return this;
};
Stage.prototype.hide = function() {
  return this.visible(false);
};
Stage.prototype.show = function() {
  return this.visible(true);
};
Stage.prototype.parent = function() {
  return this._parent;
};
Stage.prototype.next = function(visible) {
  var next = this._next;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};
Stage.prototype.prev = function(visible) {
  var prev = this._prev;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};
Stage.prototype.first = function(visible) {
  var next = this._first;
  while (next && visible && !next._visible) {
    next = next._next;
  }
  return next;
};
Stage.prototype.last = function(visible) {
  var prev = this._last;
  while (prev && visible && !prev._visible) {
    prev = prev._prev;
  }
  return prev;
};
Stage.prototype.visit = function(visitor, data) {
  var reverse = visitor.reverse;
  var visible = visitor.visible;
  if (visitor.start && visitor.start(this, data)) {
    return;
  }
  var child, next = reverse ? this.last(visible) : this.first(visible);
  while (child = next) {
    next = reverse ? child.prev(visible) : child.next(visible);
    if (child.visit(visitor, data)) {
      return true;
    }
  }
  return visitor.end && visitor.end(this, data);
};
Stage.prototype.append = function(child, more) {
  if (is$1.array(child))
    for (var i = 0; i < child.length; i++)
      append(this, child[i]);
  else if (typeof more !== "undefined")
    for (var i = 0; i < arguments.length; i++)
      append(this, arguments[i]);
  else if (typeof child !== "undefined")
    append(this, child);
  return this;
};
Stage.prototype.prepend = function(child, more) {
  if (is$1.array(child))
    for (var i = child.length - 1; i >= 0; i--)
      prepend(this, child[i]);
  else if (typeof more !== "undefined")
    for (var i = arguments.length - 1; i >= 0; i--)
      prepend(this, arguments[i]);
  else if (typeof child !== "undefined")
    prepend(this, child);
  return this;
};
Stage.prototype.appendTo = function(parent) {
  append(parent, this);
  return this;
};
Stage.prototype.prependTo = function(parent) {
  prepend(parent, this);
  return this;
};
Stage.prototype.insertNext = function(sibling, more) {
  if (is$1.array(sibling))
    for (var i = 0; i < sibling.length; i++)
      insertAfter(sibling[i], this);
  else if (typeof more !== "undefined")
    for (var i = 0; i < arguments.length; i++)
      insertAfter(arguments[i], this);
  else if (typeof sibling !== "undefined")
    insertAfter(sibling, this);
  return this;
};
Stage.prototype.insertPrev = function(sibling, more) {
  if (is$1.array(sibling))
    for (var i = sibling.length - 1; i >= 0; i--)
      insertBefore(sibling[i], this);
  else if (typeof more !== "undefined")
    for (var i = arguments.length - 1; i >= 0; i--)
      insertBefore(arguments[i], this);
  else if (typeof sibling !== "undefined")
    insertBefore(sibling, this);
  return this;
};
Stage.prototype.insertAfter = function(prev) {
  insertAfter(this, prev);
  return this;
};
Stage.prototype.insertBefore = function(next) {
  insertBefore(this, next);
  return this;
};
function append(parent, child) {
  _ensure(child);
  _ensure(parent);
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
  child._ts_parent = ++iid$1;
  parent._ts_children = ++iid$1;
  parent.touch();
}
function prepend(parent, child) {
  _ensure(child);
  _ensure(parent);
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
  child._ts_parent = ++iid$1;
  parent._ts_children = ++iid$1;
  parent.touch();
}
function insertBefore(self, next) {
  _ensure(self);
  _ensure(next);
  self.remove();
  var parent = next._parent;
  var prev = next._prev;
  next._prev = self;
  prev && (prev._next = self) || parent && (parent._first = self);
  self._parent = parent;
  self._prev = prev;
  self._next = next;
  self._parent._flag(self, true);
  self._ts_parent = ++iid$1;
  self.touch();
}
function insertAfter(self, prev) {
  _ensure(self);
  _ensure(prev);
  self.remove();
  var parent = prev._parent;
  var next = prev._next;
  prev._next = self;
  next && (next._prev = self) || parent && (parent._last = self);
  self._parent = parent;
  self._prev = prev;
  self._next = next;
  self._parent._flag(self, true);
  self._ts_parent = ++iid$1;
  self.touch();
}
Stage.prototype.remove = function(child, more) {
  if (typeof child !== "undefined") {
    if (is$1.array(child)) {
      for (var i = 0; i < child.length; i++)
        _ensure(child[i]).remove();
    } else if (typeof more !== "undefined") {
      for (var i = 0; i < arguments.length; i++)
        _ensure(arguments[i]).remove();
    } else {
      _ensure(child).remove();
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
    this._parent._ts_children = ++iid$1;
    this._parent.touch();
  }
  this._prev = this._next = this._parent = null;
  this._ts_parent = ++iid$1;
  return this;
};
Stage.prototype.empty = function() {
  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child._prev = child._next = child._parent = null;
    this._flag(child, false);
  }
  this._first = this._last = null;
  this._ts_children = ++iid$1;
  this.touch();
  return this;
};
Stage.prototype.touch = function() {
  this._ts_touch = ++iid$1;
  this._parent && this._parent.touch();
  return this;
};
Stage.prototype._flag = function(obj, name) {
  if (typeof name === "undefined") {
    return this._flags !== null && this._flags[obj] || 0;
  }
  if (typeof obj === "string") {
    if (name) {
      this._flags = this._flags || {};
      if (!this._flags[obj] && this._parent) {
        this._parent._flag(obj, true);
      }
      this._flags[obj] = (this._flags[obj] || 0) + 1;
    } else if (this._flags && this._flags[obj] > 0) {
      if (this._flags[obj] == 1 && this._parent) {
        this._parent._flag(obj, false);
      }
      this._flags[obj] = this._flags[obj] - 1;
    }
  }
  if (typeof obj === "object") {
    if (obj._flags) {
      for (var type in obj._flags) {
        if (obj._flags[type] > 0) {
          this._flag(type, name);
        }
      }
    }
  }
  return this;
};
Stage.prototype.hitTest = function(hit) {
  var width = this._pin._width;
  var height = this._pin._height;
  return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
};
function _ensure(obj) {
  if (obj && obj instanceof Stage) {
    return obj;
  }
  throw "Invalid node: " + obj;
}
function listenable(prototype, callback) {
  prototype._listeners = null;
  prototype.on = prototype.listen = function(types, listener) {
    if (!types || !types.length || typeof listener !== "function") {
      return this;
    }
    if (this._listeners === null) {
      this._listeners = {};
    }
    var isarray = typeof types !== "string" && typeof types.join === "function";
    if (types = (isarray ? types.join(" ") : types).match(/\S+/g)) {
      for (var i = 0; i < types.length; i++) {
        var type = types[i];
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].push(listener);
        if (typeof callback === "function") {
          callback(this, type, true);
        }
      }
    }
    return this;
  };
  prototype.off = function(types, listener) {
    if (!types || !types.length || typeof listener !== "function") {
      return this;
    }
    if (this._listeners === null) {
      return this;
    }
    var isarray = typeof types !== "string" && typeof types.join === "function";
    if (types = (isarray ? types.join(" ") : types).match(/\S+/g)) {
      for (var i = 0; i < types.length; i++) {
        var type = types[i], all = this._listeners[type], index;
        if (all && (index = all.indexOf(listener)) >= 0) {
          all.splice(index, 1);
          if (!all.length) {
            delete this._listeners[type];
          }
          if (typeof callback === "function") {
            callback(this, type, false);
          }
        }
      }
    }
    return this;
  };
  prototype.listeners = function(type) {
    return this._listeners && this._listeners[type];
  };
  prototype.publish = function(name, args) {
    var listeners = this.listeners(name);
    if (!listeners || !listeners.length) {
      return 0;
    }
    for (var l = 0; l < listeners.length; l++) {
      listeners[l].apply(this, args);
    }
    return listeners.length;
  };
  prototype.trigger = function(name, args) {
    this.publish(name, args);
    return this;
  };
}
var iid = 0;
Stage._init(function() {
  this._pin = new Pin(this);
});
Stage.prototype.matrix = function(relative) {
  if (relative === true) {
    return this._pin.relativeMatrix();
  }
  return this._pin.absoluteMatrix();
};
Stage.prototype.pin = function(a, b) {
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
};
function Pin(owner) {
  this._owner = owner;
  this._parent = null;
  this._relativeMatrix = new Matrix();
  this._absoluteMatrix = new Matrix();
  this.reset();
}
Pin.prototype.reset = function() {
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
  this._pivotX = null;
  this._pivotY = null;
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
  this._ts_translate = ++iid;
  this._ts_transform = ++iid;
  this._ts_matrix = ++iid;
};
Pin.prototype._update = function() {
  this._parent = this._owner._parent && this._owner._parent._pin;
  if (this._handled && this._mo_handle != this._ts_transform) {
    this._mo_handle = this._ts_transform;
    this._ts_translate = ++iid;
  }
  if (this._aligned && this._parent && this._mo_align != this._parent._ts_transform) {
    this._mo_align = this._parent._ts_transform;
    this._ts_translate = ++iid;
  }
  return this;
};
Pin.prototype.toString = function() {
  return this._owner + " (" + (this._parent ? this._parent._owner : null) + ")";
};
Pin.prototype.absoluteMatrix = function() {
  this._update();
  var ts = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_matrix : 0
  );
  if (this._mo_abs == ts) {
    return this._absoluteMatrix;
  }
  this._mo_abs = ts;
  var abs2 = this._absoluteMatrix;
  abs2.reset(this.relativeMatrix());
  this._parent && abs2.concat(this._parent._absoluteMatrix);
  this._ts_matrix = ++iid;
  return abs2;
};
Pin.prototype.relativeMatrix = function() {
  this._update();
  var ts = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_transform : 0
  );
  if (this._mo_rel == ts) {
    return this._relativeMatrix;
  }
  this._mo_rel = ts;
  var rel2 = this._relativeMatrix;
  rel2.identity();
  if (this._pivoted) {
    rel2.translate(-this._pivotX * this._width, -this._pivotY * this._height);
  }
  rel2.scale(this._scaleX, this._scaleY);
  rel2.skew(this._skewX, this._skewY);
  rel2.rotate(this._rotation);
  if (this._pivoted) {
    rel2.translate(this._pivotX * this._width, this._pivotY * this._height);
  }
  if (this._pivoted) {
    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;
  } else {
    var p, q;
    if (rel2.a > 0 && rel2.c > 0 || rel2.a < 0 && rel2.c < 0) {
      p = 0, q = rel2.a * this._width + rel2.c * this._height;
    } else {
      p = rel2.a * this._width, q = rel2.c * this._height;
    }
    if (p > q) {
      this._boxX = q;
      this._boxWidth = p - q;
    } else {
      this._boxX = p;
      this._boxWidth = q - p;
    }
    if (rel2.b > 0 && rel2.d > 0 || rel2.b < 0 && rel2.d < 0) {
      p = 0, q = rel2.b * this._width + rel2.d * this._height;
    } else {
      p = rel2.b * this._width, q = rel2.d * this._height;
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
  rel2.translate(this._x, this._y);
  return this._relativeMatrix;
};
Pin.prototype.get = function(key) {
  if (typeof getters[key] === "function") {
    return getters[key](this);
  }
};
Pin.prototype.set = function(a, b) {
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
    this._owner._ts_pin = ++iid;
    this._owner.touch();
  }
  return this;
};
var getters = {
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
  // scale : function(pin) {
  // },
  scaleX: function(pin) {
    return pin._scaleX;
  },
  scaleY: function(pin) {
    return pin._scaleY;
  },
  // skew : function(pin) {
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
  // pivot : function(pin) {
  // },
  pivotX: function(pin) {
    return pin._pivotX;
  },
  pivotY: function(pin) {
    return pin._pivotY;
  },
  // offset : function(pin) {
  // },
  offsetX: function(pin) {
    return pin._offsetX;
  },
  offsetY: function(pin) {
    return pin._offsetY;
  },
  // align : function(pin) {
  // },
  alignX: function(pin) {
    return pin._alignX;
  },
  alignY: function(pin) {
    return pin._alignY;
  },
  // handle : function(pin) {
  // },
  handleX: function(pin) {
    return pin._handleX;
  },
  handleY: function(pin) {
    return pin._handleY;
  }
};
var setters = {
  alpha: function(pin, value) {
    pin._alpha = value;
  },
  textureAlpha: function(pin, value) {
    pin._textureAlpha = value;
  },
  width: function(pin, value) {
    pin._width_ = value;
    pin._width = value;
    pin._ts_transform = ++iid;
  },
  height: function(pin, value) {
    pin._height_ = value;
    pin._height = value;
    pin._ts_transform = ++iid;
  },
  scale: function(pin, value) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },
  scaleX: function(pin, value) {
    pin._scaleX = value;
    pin._ts_transform = ++iid;
  },
  scaleY: function(pin, value) {
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },
  skew: function(pin, value) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },
  skewX: function(pin, value) {
    pin._skewX = value;
    pin._ts_transform = ++iid;
  },
  skewY: function(pin, value) {
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },
  rotation: function(pin, value) {
    pin._rotation = value;
    pin._ts_transform = ++iid;
  },
  pivot: function(pin, value) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },
  pivotX: function(pin, value) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },
  pivotY: function(pin, value) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },
  offset: function(pin, value) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },
  offsetX: function(pin, value) {
    pin._offsetX = value;
    pin._ts_translate = ++iid;
  },
  offsetY: function(pin, value) {
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },
  align: function(pin, value) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },
  alignX: function(pin, value) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;
    this.handleX(pin, value);
  },
  alignY: function(pin, value) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;
    this.handleY(pin, value);
  },
  handle: function(pin, value) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },
  handleX: function(pin, value) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
  },
  handleY: function(pin, value) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
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
  var w = typeof width === "number";
  var h = typeof height === "number";
  var m = typeof mode === "string";
  pin._ts_transform = ++iid;
  if (w) {
    pin._scaleX = width / pin._width_;
    pin._width = pin._width_;
  }
  if (h) {
    pin._scaleY = height / pin._height_;
    pin._height = pin._height_;
  }
  if (w && h && m) {
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
Stage.prototype.scaleTo = function(a, b, c) {
  if (typeof a === "object")
    c = b, b = a.y, a = a.x;
  scaleTo(this._pin, a, b, c);
  return this;
};
Pin._add_shortcuts = function(Stage2) {
  Stage2.prototype.size = function(w, h) {
    this.pin("width", w);
    this.pin("height", h);
    return this;
  };
  Stage2.prototype.width = function(w) {
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  };
  Stage2.prototype.height = function(h) {
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  };
  Stage2.prototype.offset = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  };
  Stage2.prototype.rotate = function(a) {
    this.pin("rotation", a);
    return this;
  };
  Stage2.prototype.skew = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  };
  Stage2.prototype.scale = function(a, b) {
    if (typeof a === "object")
      b = a.y, a = a.x;
    else if (typeof b === "undefined")
      b = a;
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  };
  Stage2.prototype.alpha = function(a, ta) {
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  };
};
Pin._add_shortcuts(Stage);
Stage.prototype._textures = null;
Stage.prototype._alpha = 1;
Stage.prototype.render = function(context) {
  if (!this._visible) {
    return;
  }
  stats.node++;
  var m = this.matrix();
  context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
  var alpha = this._pin._textureAlpha * this._alpha;
  if (context.globalAlpha != alpha) {
    context.globalAlpha = alpha;
  }
  if (this._textures !== null) {
    for (var i = 0, n = this._textures.length; i < n; i++) {
      this._textures[i].draw(context);
    }
  }
  if (context.globalAlpha != this._alpha) {
    context.globalAlpha = this._alpha;
  }
  var child, next = this._first;
  while (child = next) {
    next = child._next;
    child.render(context);
  }
};
Stage.prototype._tickBefore = null;
Stage.prototype._tickAfter = null;
Stage.prototype.MAX_ELAPSE = Infinity;
Stage.prototype._tick = function(elapsed, now, last) {
  if (!this._visible) {
    return;
  }
  if (elapsed > this.MAX_ELAPSE) {
    elapsed = this.MAX_ELAPSE;
  }
  var ticked = false;
  if (this._tickBefore !== null) {
    for (var i = 0; i < this._tickBefore.length; i++) {
      stats.tick++;
      var tickFn = this._tickBefore[i];
      ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
    }
  }
  var child, next = this._first;
  while (child = next) {
    next = child._next;
    if (child._flag("_tick")) {
      ticked = child._tick(elapsed, now, last) === true ? true : ticked;
    }
  }
  if (this._tickAfter !== null) {
    for (var i = 0; i < this._tickAfter.length; i++) {
      stats.tick++;
      var tickFn = this._tickAfter[i];
      ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
    }
  }
  return ticked;
};
Stage.prototype.tick = function(ticker, before) {
  if (typeof ticker !== "function") {
    return;
  }
  if (before) {
    if (this._tickBefore === null) {
      this._tickBefore = [];
    }
    this._tickBefore.push(ticker);
  } else {
    if (this._tickAfter === null) {
      this._tickAfter = [];
    }
    this._tickAfter.push(ticker);
  }
  this._flag("_tick", this._tickAfter !== null && this._tickAfter.length > 0 || this._tickBefore !== null && this._tickBefore.length > 0);
};
Stage.prototype.untick = function(ticker) {
  if (typeof ticker !== "function") {
    return;
  }
  var i;
  if (this._tickBefore !== null && (i = this._tickBefore.indexOf(ticker)) >= 0) {
    this._tickBefore.splice(i, 1);
  }
  if (this._tickAfter !== null && (i = this._tickAfter.indexOf(ticker)) >= 0) {
    this._tickAfter.splice(i, 1);
  }
};
Stage.prototype.timeout = function(fn, time) {
  this.setTimeout(fn, time);
};
Stage.prototype.setTimeout = function(fn, time) {
  function timer(t) {
    if ((time -= t) < 0) {
      this.untick(timer);
      fn.call(this);
    } else {
      return true;
    }
  }
  this.tick(timer);
  return timer;
};
Stage.prototype.clearTimeout = function(timer) {
  this.untick(timer);
};
Root._super = Stage;
Root.prototype = Object.create(Root._super.prototype);
Stage.root = function(request, render) {
  return new Root(request, render);
};
function Root(request, render) {
  Root._super.call(this);
  this.label("Root");
  var paused = true;
  var stopped = true;
  var self = this;
  var lastTime = 0;
  var loop = function(now) {
    if (paused === true || stopped === true) {
      return;
    }
    stats.tick = stats.node = stats.draw = 0;
    var last = lastTime || now;
    var elapsed = now - last;
    lastTime = now;
    var ticked = self._tick(elapsed, now, last);
    if (self._mo_touch != self._ts_touch) {
      self._mo_touch = self._ts_touch;
      render(self);
      request(loop);
    } else if (ticked) {
      request(loop);
    } else {
      paused = true;
    }
    stats.fps = elapsed ? 1e3 / elapsed : 0;
  };
  this.start = function() {
    stopped = false;
    return this.resume();
  };
  this.resume = function() {
    if (paused) {
      this.publish("resume");
      paused = false;
      request(loop);
    }
    return this;
  };
  this.pause = function() {
    if (!paused) {
      this.publish("pause");
    }
    paused = true;
    return this;
  };
  this.touch_root = this.touch;
  this.touch = function() {
    this.resume();
    return this.touch_root();
  };
  this.stop = function() {
    stopped = true;
    return this;
  };
}
Root.prototype.background = function(color) {
  return this;
};
Root.prototype.viewport = function(width, height, ratio) {
  if (typeof width === "undefined") {
    return Object.assign({}, this._viewport);
  }
  this._viewport = {
    width,
    height,
    ratio: ratio || 1
  };
  this.viewbox();
  var data = Object.assign({}, this._viewport);
  this.visit({
    start: function(node) {
      if (!node._flag("viewport")) {
        return true;
      }
      node.publish("viewport", [data]);
    }
  });
  return this;
};
Root.prototype.viewbox = function(width, height, mode) {
  if (typeof width === "number" && typeof height === "number") {
    this._viewbox = {
      width,
      height,
      mode: /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : "in-pad"
    };
  }
  var box = this._viewbox;
  var size = this._viewport;
  if (size && box) {
    this.pin({
      width: box.width,
      height: box.height
    });
    this.scaleTo(size.width, size.height, box.mode);
  } else if (size) {
    this.pin({
      width: size.width,
      height: size.height
    });
  }
  return this;
};
Stage.canvas = function(type, attributes, drawFn) {
  if (typeof type === "string") {
    if (typeof attributes === "object")
      ;
    else {
      if (typeof attributes === "function") {
        drawFn = attributes;
      }
      attributes = {};
    }
  } else {
    if (typeof type === "function") {
      drawFn = type;
    }
    attributes = {};
    type = "2d";
  }
  var canvas = document.createElement("canvas");
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
    if (typeof fn === "function") {
      fn.call(this, context);
    } else if (typeof fn === "undefined" && typeof drawFn === "function") {
      drawFn.call(this, context);
    }
    return this;
  };
  if (typeof drawFn === "function") {
    drawFn.call(texture, context);
  }
  return texture;
};
function repeat(img, owidth, oheight, stretch, inner, insert) {
  var width = img.width;
  var height = img.height;
  var left = img.left;
  var right = img.right;
  var top = img.top;
  var bottom = img.bottom;
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
  var i = 0;
  if (top > 0 && left > 0)
    insert(i++, 0, 0, left, top, 0, 0, left, top);
  if (bottom > 0 && left > 0)
    insert(i++, 0, height + top, left, bottom, 0, oheight + top, left, bottom);
  if (top > 0 && right > 0)
    insert(i++, width + left, 0, right, top, owidth + left, 0, right, top);
  if (bottom > 0 && right > 0)
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
  if (stretch) {
    if (top > 0)
      insert(i++, left, 0, width, top, left, 0, owidth, top);
    if (bottom > 0)
      insert(
        i++,
        left,
        height + top,
        width,
        bottom,
        left,
        oheight + top,
        owidth,
        bottom
      );
    if (left > 0)
      insert(i++, 0, top, left, height, 0, top, left, oheight);
    if (right > 0)
      insert(
        i++,
        width + left,
        top,
        right,
        height,
        owidth + left,
        top,
        right,
        oheight
      );
    insert(i++, left, top, width, height, left, top, owidth, oheight);
  } else {
    var l = left, r = owidth, w;
    while (r > 0) {
      w = Math.min(width, r), r -= width;
      var t = top, b = oheight, h;
      while (b > 0) {
        h = Math.min(height, b), b -= height;
        insert(i++, left, top, w, h, l, t, w, h);
        if (r <= 0) {
          if (left)
            insert(i++, 0, top, left, h, 0, t, left, h);
          if (right)
            insert(i++, width + left, top, right, h, l + w, t, right, h);
        }
        t += h;
      }
      if (top)
        insert(i++, left, 0, w, top, l, 0, w, top);
      if (bottom)
        insert(i++, left, height + top, w, bottom, l, t, w, bottom);
      l += w;
    }
  }
  return i;
}
Stage.image = function(image) {
  var img = new Image$1();
  image && img.image(image);
  return img;
};
Image$1._super = Stage;
Image$1.prototype = Object.create(Image$1._super.prototype);
function Image$1() {
  Image$1._super.call(this);
  this.label("Image");
  this._textures = [];
  this._image = null;
}
Image$1.prototype.image = function(image) {
  this._image = Stage.texture(image).one();
  this.pin("width", this._image ? this._image.width : 0);
  this.pin("height", this._image ? this._image.height : 0);
  this._textures[0] = this._image.pipe();
  this._textures.length = 1;
  return this;
};
Image$1.prototype.tile = function(inner) {
  this._repeat(false, inner);
  return this;
};
Image$1.prototype.stretch = function(inner) {
  this._repeat(true, inner);
  return this;
};
Image$1.prototype._repeat = function(stretch, inner) {
  var self = this;
  this.untick(this._repeatTicker);
  this.tick(this._repeatTicker = function() {
    if (this._mo_stretch == this._pin._ts_transform) {
      return;
    }
    this._mo_stretch = this._pin._ts_transform;
    var width = this.pin("width");
    var height = this.pin("height");
    this._textures.length = repeat(this._image, width, height, stretch, inner, insert);
  });
  function insert(i, sx, sy, sw, sh, dx, dy, dw, dh) {
    var repeat2 = self._textures.length > i ? self._textures[i] : self._textures[i] = self._image.pipe();
    repeat2.src(sx, sy, sw, sh);
    repeat2.dest(dx, dy, dw, dh);
  }
};
Stage.anim = function(frames, fps) {
  var anim = new Anim();
  anim.frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};
Anim._super = Stage;
Anim.prototype = Object.create(Anim._super.prototype);
Stage.Anim = {
  FPS: 15
};
function Anim() {
  Anim._super.call(this);
  this.label("Anim");
  this._textures = [];
  this._fps = Stage.Anim.FPS;
  this._ft = 1e3 / this._fps;
  this._time = -1;
  this._repeat = 0;
  this._index = 0;
  this._frames = [];
  var lastTime = 0;
  this.tick(function(t, now, last) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }
    var ignore = lastTime != last;
    lastTime = now;
    if (ignore) {
      return true;
    }
    this._time += t;
    if (this._time < this._ft) {
      return true;
    }
    var n = this._time / this._ft | 0;
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
Anim.prototype.fps = function(fps) {
  if (typeof fps === "undefined") {
    return this._fps;
  }
  this._fps = fps > 0 ? fps : Stage.Anim.FPS;
  this._ft = 1e3 / this._fps;
  return this;
};
Anim.prototype.setFrames = function(a, b, c) {
  return this.frames(a, b, c);
};
Anim.prototype.frames = function(frames) {
  this._index = 0;
  this._frames = Stage.texture(frames).array();
  this.touch();
  return this;
};
Anim.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};
Anim.prototype.gotoFrame = function(frame, resize) {
  this._index = math.rotate(frame, this._frames.length) | 0;
  resize = resize || !this._textures[0];
  this._textures[0] = this._frames[this._index];
  if (resize) {
    this.pin("width", this._textures[0].width);
    this.pin("height", this._textures[0].height);
  }
  this.touch();
  return this;
};
Anim.prototype.moveFrame = function(move) {
  return this.gotoFrame(this._index + move);
};
Anim.prototype.repeat = function(repeat2, callback) {
  this._repeat = repeat2 * this._frames.length - 1;
  this._callback = callback;
  this.play();
  return this;
};
Anim.prototype.play = function(frame) {
  if (typeof frame !== "undefined") {
    this.gotoFrame(frame);
    this._time = 0;
  } else if (this._time < 0) {
    this._time = 0;
  }
  this.touch();
  return this;
};
Anim.prototype.stop = function(frame) {
  this._time = -1;
  if (typeof frame !== "undefined") {
    this.gotoFrame(frame);
  }
  return this;
};
Stage.string = function(frames) {
  return new Str().frames(frames);
};
Str._super = Stage;
Str.prototype = Object.create(Str._super.prototype);
function Str() {
  Str._super.call(this);
  this.label("String");
  this._textures = [];
}
Str.prototype.setFont = function(a, b, c) {
  return this.frames(a, b, c);
};
Str.prototype.frames = function(frames) {
  this._textures = [];
  if (typeof frames == "string") {
    frames = Stage.texture(frames);
    this._item = function(value) {
      return frames.one(value);
    };
  } else if (typeof frames === "object") {
    this._item = function(value) {
      return frames[value];
    };
  } else if (typeof frames === "function") {
    this._item = frames;
  }
  return this;
};
Str.prototype.setValue = function(a, b, c) {
  return this.value(a, b, c);
};
Str.prototype.value = function(value) {
  if (typeof value === "undefined") {
    return this._value;
  }
  if (this._value === value) {
    return this;
  }
  this._value = value;
  if (value === null) {
    value = "";
  } else if (typeof value !== "string" && !is$1.array(value)) {
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
  this.pin("width", width);
  this.pin("height", height);
  this._textures.length = value.length;
  return this;
};
Stage.row = function(align) {
  return Stage.create().row(align).label("Row");
};
Stage.prototype.row = function(align) {
  this.sequence("row", align);
  return this;
};
Stage.column = function(align) {
  return Stage.create().column(align).label("Row");
};
Stage.prototype.column = function(align) {
  this.sequence("column", align);
  return this;
};
Stage.sequence = function(type, align) {
  return Stage.create().sequence(type, align).label("Sequence");
};
Stage.prototype.sequence = function(type, align) {
  this._padding = this._padding || 0;
  this._spacing = this._spacing || 0;
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    if (this._mo_seq == this._ts_touch) {
      return;
    }
    this._mo_seq = this._ts_touch;
    var alignChildren = this._mo_seqAlign != this._ts_children;
    this._mo_seqAlign = this._ts_children;
    var width = 0, height = 0;
    var child, next = this.first(true);
    var first = true;
    while (child = next) {
      next = child.next(true);
      child.matrix(true);
      var w = child.pin("boxWidth");
      var h = child.pin("boxHeight");
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
  });
  return this;
};
Stage.box = function() {
  return Stage.create().box().label("Box");
};
Stage.prototype.box = function() {
  this._padding = this._padding || 0;
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    if (this._mo_box == this._ts_touch) {
      return;
    }
    this._mo_box = this._ts_touch;
    var width = 0, height = 0;
    var child, next = this.first(true);
    while (child = next) {
      next = child.next(true);
      child.matrix(true);
      var w = child.pin("boxWidth");
      var h = child.pin("boxHeight");
      width = Math.max(width, w);
      height = Math.max(height, h);
    }
    width += 2 * this._padding;
    height += 2 * this._padding;
    this.pin("width") != width && this.pin("width", width);
    this.pin("height") != height && this.pin("height", height);
  });
  return this;
};
Stage.layer = function() {
  return Stage.create().layer().label("Layer");
};
Stage.prototype.layer = function() {
  this.untick(this._layoutTiker);
  this.tick(this._layoutTiker = function() {
    var parent = this.parent();
    if (parent) {
      var width = parent.pin("width");
      if (this.pin("width") != width) {
        this.pin("width", width);
      }
      var height = parent.pin("height");
      if (this.pin("height") != height) {
        this.pin("height", height);
      }
    }
  }, true);
  return this;
};
Stage.prototype.padding = function(pad) {
  this._padding = pad;
  return this;
};
Stage.prototype.spacing = function(space) {
  this._spacing = space;
  return this;
};
function _identity(x) {
  return x;
}
var _cache = {};
var _modes = {};
var _easings = {};
function Easing(token) {
  if (typeof token === "function") {
    return token;
  }
  if (typeof token !== "string") {
    return _identity;
  }
  var fn = _cache[token];
  if (fn) {
    return fn;
  }
  var match = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
  if (!match || !match.length) {
    return _identity;
  }
  var easing = _easings[match[1]];
  var mode = _modes[match[3]];
  var params = match[5];
  if (easing && easing.fn) {
    fn = easing.fn;
  } else if (easing && easing.fc) {
    fn = easing.fc.apply(easing.fc, params && params.replace(/\s+/, "").split(","));
  } else {
    fn = _identity;
  }
  if (mode) {
    fn = mode.fn(fn);
  }
  _cache[token] = fn;
  return fn;
}
Easing.add = function(data) {
  var names = (data.name || data.mode).split(/\s+/);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (name) {
      (data.name ? _easings : _modes)[name] = data;
    }
  }
};
Easing.add({
  mode: "in",
  fn: function(f) {
    return f;
  }
});
Easing.add({
  mode: "out",
  fn: function(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
});
Easing.add({
  mode: "in-out",
  fn: function(f) {
    return function(t) {
      return t < 0.5 ? f(2 * t) / 2 : 1 - f(2 * (1 - t)) / 2;
    };
  }
});
Easing.add({
  mode: "out-in",
  fn: function(f) {
    return function(t) {
      return t < 0.5 ? 1 - f(2 * (1 - t)) / 2 : f(2 * t) / 2;
    };
  }
});
Easing.add({
  name: "linear",
  fn: function(t) {
    return t;
  }
});
Easing.add({
  name: "quad",
  fn: function(t) {
    return t * t;
  }
});
Easing.add({
  name: "cubic",
  fn: function(t) {
    return t * t * t;
  }
});
Easing.add({
  name: "quart",
  fn: function(t) {
    return t * t * t * t;
  }
});
Easing.add({
  name: "quint",
  fn: function(t) {
    return t * t * t * t * t;
  }
});
Easing.add({
  name: "sin sine",
  fn: function(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
});
Easing.add({
  name: "exp expo",
  fn: function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
});
Easing.add({
  name: "circle circ",
  fn: function(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
});
Easing.add({
  name: "bounce",
  fn: function(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
});
Easing.add({
  name: "poly",
  fc: function(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
});
Easing.add({
  name: "elastic",
  fc: function(a, p) {
    p = p || 0.45;
    a = a || 1;
    var s = p / (2 * Math.PI) * Math.asin(1 / a);
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p);
    };
  }
});
Easing.add({
  name: "back",
  fc: function(s) {
    s = typeof s !== "undefined" ? s : 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
});
Stage.prototype.tween = function(duration, delay, append2) {
  if (typeof duration !== "number") {
    append2 = duration, delay = 0, duration = 0;
  } else if (typeof delay !== "number") {
    append2 = delay, delay = 0;
  }
  if (!this._tweens) {
    this._tweens = [];
    var ticktime = 0;
    this.tick(function(elapsed, now, last) {
      if (!this._tweens.length) {
        return;
      }
      var ignore = ticktime != last;
      ticktime = now;
      if (ignore) {
        return true;
      }
      var head = this._tweens[0];
      var next = head.tick(this, elapsed, now, last);
      if (next && head === this._tweens[0]) {
        this._tweens.shift();
      }
      if (Array.isArray(next)) {
        for (var i = 0; i < next.length; i++) {
          try {
            next[i].call(this);
          } catch (e) {
            console.log(e);
          }
        }
      } else if (typeof next === "object") {
        this._tweens.unshift(next);
      }
      return true;
    }, true);
  }
  this.touch();
  if (!append2) {
    this._tweens.length = 0;
  }
  var tween = new Tween(this, duration, delay);
  this._tweens.push(tween);
  return tween;
};
function Tween(owner, duration, delay) {
  this._end = {};
  this._duration = duration || 400;
  this._delay = delay || 0;
  this._owner = owner;
  this._time = 0;
}
Tween.prototype.tick = function(node, elapsed, now, last) {
  this._time += elapsed;
  if (this._time < this._delay) {
    return;
  }
  var time = this._time - this._delay;
  if (!this._start) {
    this._start = {};
    for (var key in this._end) {
      this._start[key] = this._owner.pin(key);
    }
  }
  var p, over;
  if (time < this._duration) {
    p = time / this._duration;
    over = false;
  } else {
    p = 1;
    over = true;
  }
  if (typeof this._easing == "function") {
    p = this._easing(p);
  }
  var q = 1 - p;
  for (var key in this._end) {
    this._owner.pin(key, this._start[key] * q + this._end[key] * p);
  }
  if (over) {
    var actions = [this._hide, this._remove, this._done];
    actions = actions.filter(function(element) {
      return typeof element === "function";
    });
    return this._next || actions;
  }
};
Tween.prototype.tween = function(duration, delay) {
  return this._next = new Tween(this._owner, duration, delay);
};
Tween.prototype.duration = function(duration) {
  this._duration = duration;
  return this;
};
Tween.prototype.delay = function(delay) {
  this._delay = delay;
  return this;
};
Tween.prototype.ease = function(easing) {
  this._easing = Easing(easing);
  return this;
};
Tween.prototype.done = function(fn) {
  this._done = fn;
  return this;
};
Tween.prototype.hide = function() {
  this._hide = function() {
    this.hide();
  };
  return this;
};
Tween.prototype.remove = function() {
  this._remove = function() {
    this.remove();
  };
  return this;
};
Tween.prototype.pin = function(a, b) {
  if (typeof a === "object") {
    for (var attr in a) {
      pinning(this._owner, this._end, attr, a[attr]);
    }
  } else if (typeof b !== "undefined") {
    pinning(this._owner, this._end, a, b);
  }
  return this;
};
function pinning(node, map, key, value) {
  if (typeof node.pin(key) === "number") {
    map[key] = value;
  } else if (typeof node.pin(key + "X") === "number" && typeof node.pin(key + "Y") === "number") {
    map[key + "X"] = value;
    map[key + "Y"] = value;
  }
}
Pin._add_shortcuts(Tween);
Tween.prototype.then = function(fn) {
  this.done(fn);
  return this;
};
Tween.prototype.clear = function(forward) {
  return this;
};
Stage._load(function(stage, elem) {
  Mouse.subscribe(stage, elem);
});
Mouse.CLICK = "click";
Mouse.START = "touchstart mousedown";
Mouse.MOVE = "touchmove mousemove";
Mouse.END = "touchend mouseup";
Mouse.CANCEL = "touchcancel mousecancel";
Mouse.subscribe = function(stage, elem) {
  if (stage.mouse) {
    return;
  }
  stage.mouse = new Mouse(stage, elem);
  elem.addEventListener("touchstart", handleStart);
  elem.addEventListener("touchend", handleEnd);
  elem.addEventListener("touchmove", handleMove);
  elem.addEventListener("touchcancel", handleCancel);
  elem.addEventListener("mousedown", handleStart);
  elem.addEventListener("mouseup", handleEnd);
  elem.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleCancel);
  window.addEventListener("blur", handleCancel);
  var clicklist = [], cancellist = [];
  function handleStart(event) {
    event.preventDefault();
    stage.mouse.locate(event);
    stage.mouse.publish(event.type, event);
    stage.mouse.lookup("click", clicklist);
    stage.mouse.lookup("mousecancel", cancellist);
  }
  function handleMove(event) {
    event.preventDefault();
    stage.mouse.locate(event);
    stage.mouse.publish(event.type, event);
  }
  function handleEnd(event) {
    event.preventDefault();
    stage.mouse.publish(event.type, event);
    if (clicklist.length) {
      stage.mouse.publish("click", event, clicklist);
    }
    cancellist.length = 0;
  }
  function handleCancel(event) {
    if (cancellist.length) {
      stage.mouse.publish("mousecancel", event, cancellist);
    }
    clicklist.length = 0;
  }
};
function Mouse(stage, elem) {
  if (!(this instanceof Mouse)) {
    return;
  }
  var ratio = stage.viewport().ratio || 1;
  stage.on("viewport", function(size) {
    ratio = size.ratio || ratio;
  });
  this.x = 0;
  this.y = 0;
  this.toString = function() {
    return (this.x | 0) + "x" + (this.y | 0);
  };
  this.locate = function(event) {
    locateElevent(elem, event, this);
    this.x *= ratio;
    this.y *= ratio;
  };
  this.lookup = function(type, collect) {
    this.type = type;
    this.root = stage;
    this.event = null;
    collect.length = 0;
    this.collect = collect;
    this.root.visit(this.visitor, this);
  };
  this.publish = function(type, event, targets) {
    this.type = type;
    this.root = stage;
    this.event = event;
    this.collect = false;
    this.timeStamp = Date.now();
    if (type !== "mousemove" && type !== "touchmove") {
      console.log(this.type + " " + this);
    }
    if (targets) {
      while (targets.length)
        if (this.visitor.end(targets.shift(), this))
          break;
      targets.length = 0;
    } else {
      this.root.visit(this.visitor, this);
    }
  };
  this.visitor = {
    reverse: true,
    visible: true,
    start: function(node, mouse) {
      return !node._flag(mouse.type);
    },
    end: function(node, mouse) {
      rel.raw = mouse.event;
      rel.type = mouse.type;
      rel.timeStamp = mouse.timeStamp;
      rel.abs.x = mouse.x;
      rel.abs.y = mouse.y;
      var listeners = node.listeners(mouse.type);
      if (!listeners) {
        return;
      }
      node.matrix().inverse().map(mouse, rel);
      if (!(node === mouse.root || node.attr("spy") || node.hitTest(rel))) {
        return;
      }
      if (mouse.collect) {
        mouse.collect.push(node);
      }
      if (mouse.event) {
        var cancel = false;
        for (var l = 0; l < listeners.length; l++) {
          cancel = listeners[l].call(node, rel) ? true : cancel;
        }
        return cancel;
      }
    }
  };
}
var rel = {}, abs = {};
defineValue(rel, "clone", function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(rel, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0) + " (" + this.abs + ")";
});
defineValue(rel, "abs", abs);
defineValue(abs, "clone", function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(abs, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0);
});
function defineValue(obj, name, value) {
  Object.defineProperty(obj, name, {
    value
  });
}
function locateElevent(el, ev, loc) {
  if (ev.touches && ev.touches.length) {
    loc.x = ev.touches[0].clientX;
    loc.y = ev.touches[0].clientY;
  } else {
    loc.x = ev.clientX;
    loc.y = ev.clientY;
  }
  var rect = el.getBoundingClientRect();
  loc.x -= rect.left;
  loc.y -= rect.top;
  loc.x -= el.clientLeft | 0;
  loc.y -= el.clientTop | 0;
  return loc;
}
window.addEventListener("load", function() {
  console.log("On load.");
  Stage.start();
}, false);
Stage.config({
  "app-loader": AppLoader,
  "image-loader": ImageLoader
});
function AppLoader(app, configs) {
  configs = configs || {};
  var canvas = configs.canvas, context = null, full = false;
  var width = 0, height = 0, ratio = 1;
  if (typeof canvas === "string") {
    canvas = document.getElementById(canvas);
  }
  if (!canvas) {
    canvas = document.getElementById("cutjs") || document.getElementById("stage");
  }
  if (!canvas) {
    full = true;
    console.log("Creating Canvas...");
    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }
  context = canvas.getContext("2d");
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  ratio = devicePixelRatio / backingStoreRatio;
  var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1e3 / 60);
  };
  console.log("Creating stage...");
  var root = Stage.root(requestAnimationFrame, render);
  function render() {
    if (width > 0 && height > 0) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      root.render(context);
    }
  }
  root.background = function(color) {
    canvas.style.backgroundColor = color;
    return this;
  };
  app(root, canvas);
  var lastWidth = -1;
  var lastHeight = -1;
  (function resizeLoop() {
    var width2, height2;
    if (full) {
      width2 = window.innerWidth > 0 ? window.innerWidth : screen.width;
      height2 = window.innerHeight > 0 ? window.innerHeight : screen.height;
    } else {
      width2 = canvas.clientWidth;
      height2 = canvas.clientHeight;
    }
    if (lastWidth !== width2 || lastHeight !== height2) {
      lastWidth = width2;
      lastHeight = height2;
      resize();
    }
    requestAnimationFrame(resizeLoop);
  })();
  function resize() {
    if (full) {
      width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      height = window.innerHeight > 0 ? window.innerHeight : screen.height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    } else {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    }
    width *= ratio;
    height *= ratio;
    if (canvas.width === width && canvas.height === height) {
      return;
    }
    canvas.width = width;
    canvas.height = height;
    console.log("Resize: " + width + " x " + height + " / " + ratio);
    root.viewport(width, height, ratio);
    render();
  }
}
function ImageLoader(src, success, error) {
  console.log("Loading image: " + src);
  var image = new Image();
  image.onload = function() {
    success(image);
  };
  image.onerror = error;
  image.src = src;
}
listenable(Stage.prototype, function(obj, name, on) {
  obj._flag(name, on);
});
Stage.Matrix = Matrix;
Stage.Texture = Texture;
Stage.Mouse = Mouse;
Stage.Math = math;
Stage.Image = Image$1;
Stage.Tween = Tween;
Stage.Root = Root;
Stage.Pin = Pin;
Stage.Str = Str;
Stage.Anim = Anim;
module.exports = Stage;
