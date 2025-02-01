/**
 * Stage.js v1.0.0-alpha.17
 * @copyright Copyright 2025 Ali Shakiba
 * @license Licensed under the MIT (https://github.com/piqnt/stage.js/blob/main/LICENSE.md)
 */
var math_random = Math.random;
var math_sqrt = Math.sqrt;
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
var math = Object.create(Math);
math.random = random;
math.wrap = wrap;
math.clamp = clamp;
math.length = length;
math.rotate = wrap;
math.limit = clamp;
var Matrix = (
  /** @class */
  function() {
    function Matrix2(a, b, c, d, e, f) {
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
    Matrix2.prototype.toString = function() {
      return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.e + ", " + this.f + "]";
    };
    Matrix2.prototype.clone = function() {
      return new Matrix2(this.a, this.b, this.c, this.d, this.e, this.f);
    };
    Matrix2.prototype.reset = function(a, b, c, d, e, f) {
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
    };
    Matrix2.prototype.identity = function() {
      this._dirty = true;
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
      return this;
    };
    Matrix2.prototype.rotate = function(angle) {
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
    Matrix2.prototype.translate = function(x, y) {
      if (!x && !y) {
        return this;
      }
      this._dirty = true;
      this.e += x;
      this.f += y;
      return this;
    };
    Matrix2.prototype.scale = function(x, y) {
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
    Matrix2.prototype.skew = function(x, y) {
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
    Matrix2.prototype.concat = function(m) {
      this._dirty = true;
      var a = this.a * m.a + this.b * m.c;
      var b = this.b * m.d + this.a * m.b;
      var c = this.c * m.a + this.d * m.c;
      var d = this.d * m.d + this.c * m.b;
      var e = this.e * m.a + m.e + this.f * m.c;
      var f = this.f * m.d + m.f + this.e * m.b;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
      this.f = f;
      return this;
    };
    Matrix2.prototype.inverse = function() {
      if (this._dirty) {
        this._dirty = false;
        if (!this.inverted) {
          this.inverted = new Matrix2();
        }
        var z = this.a * this.d - this.b * this.c;
        this.inverted.a = this.d / z;
        this.inverted.b = -this.b / z;
        this.inverted.c = -this.c / z;
        this.inverted.d = this.a / z;
        this.inverted.e = (this.c * this.f - this.e * this.d) / z;
        this.inverted.f = (this.e * this.b - this.a * this.f) / z;
      }
      return this.inverted;
    };
    Matrix2.prototype.map = function(p, q) {
      q = q || { x: 0, y: 0 };
      q.x = this.a * p.x + this.c * p.y + this.e;
      q.y = this.b * p.x + this.d * p.y + this.f;
      return q;
    };
    Matrix2.prototype.mapX = function(x, y) {
      if (typeof x === "object") {
        y = x.y;
        x = x.x;
      }
      return this.a * x + this.c * y + this.e;
    };
    Matrix2.prototype.mapY = function(x, y) {
      if (typeof x === "object") {
        y = x.y;
        x = x.x;
      }
      return this.b * x + this.d * y + this.f;
    };
    return Matrix2;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
var objectToString = Object.prototype.toString;
function isFn(value) {
  var str = objectToString.call(value);
  return str === "[object Function]" || str === "[object GeneratorFunction]" || str === "[object AsyncFunction]";
}
function isHash(value) {
  return objectToString.call(value) === "[object Object]" && value.constructor === Object;
}
const stats = {
  create: 0,
  tick: 0,
  component: 0,
  draw: 0,
  fps: 0
};
var uid = function() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};
var Texture = (
  /** @class */
  function() {
    function Texture2() {
      this.uid = "texture:" + uid();
      this.sx = 0;
      this.sy = 0;
      this.dx = 0;
      this.dy = 0;
    }
    Texture2.prototype.setSourceCoordinate = function(x, y) {
      this.sx = x;
      this.sy = y;
    };
    Texture2.prototype.setSourceDimension = function(w, h) {
      this.sw = w;
      this.sh = h;
    };
    Texture2.prototype.setDestinationCoordinate = function(x, y) {
      this.dx = x;
      this.dy = y;
    };
    Texture2.prototype.setDestinationDimension = function(w, h) {
      this.dw = w;
      this.dh = h;
    };
    Texture2.prototype.draw = function(context, x1, y1, w1, h1, x2, y2, w2, h2) {
      var sx, sy, sw, sh;
      var dx, dy, dw, dh;
      if (arguments.length > 5) {
        sx = this.sx + x1;
        sy = this.sy + y1;
        sw = w1 !== null && w1 !== void 0 ? w1 : this.sw;
        sh = h1 !== null && h1 !== void 0 ? h1 : this.sh;
        dx = this.dx + x2;
        dy = this.dy + y2;
        dw = w2 !== null && w2 !== void 0 ? w2 : this.dw;
        dh = h2 !== null && h2 !== void 0 ? h2 : this.dh;
      } else if (arguments.length > 1) {
        sx = this.sx;
        sy = this.sy;
        sw = this.sw;
        sh = this.sh;
        dx = this.dx + x1;
        dy = this.dy + y1;
        dw = w1 !== null && w1 !== void 0 ? w1 : this.dw;
        dh = h1 !== null && h1 !== void 0 ? h1 : this.dh;
      } else {
        sx = this.sx;
        sy = this.sy;
        sw = this.sw;
        sh = this.sh;
        dx = this.dx;
        dy = this.dy;
        dw = this.dw;
        dh = this.dh;
      }
      this.drawWithNormalizedArgs(context, sx, sy, sw, sh, dx, dy, dw, dh);
    };
    return Texture2;
  }()
);
var ImageTexture = (
  /** @class */
  function(_super) {
    __extends(ImageTexture2, _super);
    function ImageTexture2(source, pixelRatio) {
      var _this = _super.call(this) || this;
      _this._pixelRatio = 1;
      _this.padding = 0;
      if (typeof source === "object") {
        _this.setSourceImage(source, pixelRatio);
      }
      return _this;
    }
    ImageTexture2.prototype.setSourceImage = function(image, pixelRatio) {
      if (pixelRatio === void 0) {
        pixelRatio = 1;
      }
      this._source = image;
      this._pixelRatio = pixelRatio;
    };
    ImageTexture2.prototype.setPadding = function(padding) {
      this.padding = padding;
    };
    ImageTexture2.prototype.getWidth = function() {
      return this._source.width / this._pixelRatio + (this.padding + this.padding);
    };
    ImageTexture2.prototype.getHeight = function() {
      return this._source.height / this._pixelRatio + (this.padding + this.padding);
    };
    ImageTexture2.prototype.prerender = function(context) {
      return false;
    };
    ImageTexture2.prototype.drawWithNormalizedArgs = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
      var image = this._source;
      if (image === null || typeof image !== "object") {
        return;
      }
      sw = sw !== null && sw !== void 0 ? sw : this._source.width / this._pixelRatio;
      sh = sh !== null && sh !== void 0 ? sh : this._source.height / this._pixelRatio;
      dw = dw !== null && dw !== void 0 ? dw : sw;
      dh = dh !== null && dh !== void 0 ? dh : sh;
      dx += this.padding;
      dy += this.padding;
      var ix = sx * this._pixelRatio;
      var iy = sy * this._pixelRatio;
      var iw = sw * this._pixelRatio;
      var ih = sh * this._pixelRatio;
      try {
        stats.draw++;
        context.drawImage(image, ix, iy, iw, ih, dx, dy, dw, dh);
      } catch (ex) {
        if (!this._draw_failed) {
          console.log("Unable to draw: ", image);
          console.log(ex);
          this._draw_failed = true;
        }
      }
    };
    return ImageTexture2;
  }(Texture)
);
var PipeTexture = (
  /** @class */
  function(_super) {
    __extends(PipeTexture2, _super);
    function PipeTexture2(source) {
      var _this = _super.call(this) || this;
      _this._source = source;
      return _this;
    }
    PipeTexture2.prototype.setSourceTexture = function(texture2) {
      this._source = texture2;
    };
    PipeTexture2.prototype.getWidth = function() {
      var _a, _b;
      return (_b = (_a = this.dw) !== null && _a !== void 0 ? _a : this.sw) !== null && _b !== void 0 ? _b : this._source.getWidth();
    };
    PipeTexture2.prototype.getHeight = function() {
      var _a, _b;
      return (_b = (_a = this.dh) !== null && _a !== void 0 ? _a : this.sh) !== null && _b !== void 0 ? _b : this._source.getHeight();
    };
    PipeTexture2.prototype.prerender = function(context) {
      return this._source.prerender(context);
    };
    PipeTexture2.prototype.drawWithNormalizedArgs = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
      var texture2 = this._source;
      if (texture2 === null || typeof texture2 !== "object") {
        return;
      }
      texture2.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
    };
    return PipeTexture2;
  }(Texture)
);
var Atlas = (
  /** @class */
  function(_super) {
    __extends(Atlas2, _super);
    function Atlas2(def) {
      if (def === void 0) {
        def = {};
      }
      var _this = _super.call(this) || this;
      _this.pipeSpriteTexture = function(def2) {
        var map = _this._map;
        var ppu = _this._ppu;
        var trim = _this._trim;
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
        var texture2 = new PipeTexture(_this);
        texture2.top = def2.top;
        texture2.bottom = def2.bottom;
        texture2.left = def2.left;
        texture2.right = def2.right;
        texture2.setSourceCoordinate(def2.x, def2.y);
        texture2.setSourceDimension(def2.width, def2.height);
        return texture2;
      };
      _this.findSpriteDefinition = function(query) {
        var textures = _this._textures;
        if (textures) {
          if (isFn(textures)) {
            return textures(query);
          } else if (isHash(textures)) {
            return textures[query];
          }
        }
      };
      _this.select = function(query) {
        if (!query) {
          return new TextureSelection(new PipeTexture(_this));
        }
        var textureDefinition = _this.findSpriteDefinition(query);
        if (textureDefinition) {
          return new TextureSelection(textureDefinition, _this);
        }
      };
      _this.name = def.name;
      _this._ppu = def.ppu || def.ratio || 1;
      _this._trim = def.trim || 0;
      _this._map = def.map || def.filter;
      _this._textures = def.textures;
      if (typeof def.image === "object" && isHash(def.image)) {
        if ("src" in def.image) {
          _this._imageSrc = def.image.src;
        } else if ("url" in def.image) {
          _this._imageSrc = def.image.url;
        }
        if (typeof def.image.ratio === "number") {
          _this._pixelRatio = def.image.ratio;
        }
      } else {
        if (typeof def.imagePath === "string") {
          _this._imageSrc = def.imagePath;
        } else if (typeof def.image === "string") {
          _this._imageSrc = def.image;
        }
        if (typeof def.imageRatio === "number") {
          _this._pixelRatio = def.imageRatio;
        }
      }
      deprecatedWarning(def);
      return _this;
    }
    Atlas2.prototype.load = function() {
      return __awaiter(this, void 0, void 0, function() {
        var image;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!this._imageSrc) return [3, 2];
              return [4, asyncLoadImage(this._imageSrc)];
            case 1:
              image = _a.sent();
              this.setSourceImage(image, this._pixelRatio);
              _a.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    return Atlas2;
  }(ImageTexture)
);
function asyncLoadImage(src) {
  console.debug && console.debug("Loading image: " + src);
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      console.debug && console.debug("Image loaded: " + src);
      resolve(img);
    };
    img.onerror = function(error) {
      console.error("Loading failed: " + src);
      reject(error);
    };
    img.src = src;
  });
}
function deprecatedWarning(def) {
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
function isAtlasSpriteDefinition(selection) {
  return typeof selection === "object" && isHash(selection) && "number" === typeof selection.width && "number" === typeof selection.height;
}
var TextureSelection = (
  /** @class */
  function() {
    function TextureSelection2(selection, atlas2) {
      this.selection = selection;
      this.atlas = atlas2;
    }
    TextureSelection2.prototype.resolve = function(selection, subquery) {
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
    };
    TextureSelection2.prototype.one = function(subquery) {
      return this.resolve(this.selection, subquery);
    };
    TextureSelection2.prototype.array = function(arr) {
      var array = Array.isArray(arr) ? arr : [];
      if (Array.isArray(this.selection)) {
        for (var i = 0; i < this.selection.length; i++) {
          array[i] = this.resolve(this.selection[i]);
        }
      } else {
        array[0] = this.resolve(this.selection);
      }
      return array;
    };
    return TextureSelection2;
  }()
);
var NO_TEXTURE = new /** @class */
(function(_super) {
  __extends(class_1, _super);
  function class_1() {
    var _this = _super.call(this) || this;
    _this.setSourceDimension(0, 0);
    return _this;
  }
  class_1.prototype.getWidth = function() {
    return 0;
  };
  class_1.prototype.getHeight = function() {
    return 0;
  };
  class_1.prototype.prerender = function(context) {
    return false;
  };
  class_1.prototype.drawWithNormalizedArgs = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
  };
  class_1.prototype.setSourceCoordinate = function(x, y) {
  };
  class_1.prototype.setSourceDimension = function(w, h) {
  };
  class_1.prototype.setDestinationCoordinate = function(x, y) {
  };
  class_1.prototype.setDestinationDimension = function(w, h) {
  };
  class_1.prototype.draw = function() {
  };
  return class_1;
}(Texture))();
var NO_SELECTION = new TextureSelection(NO_TEXTURE);
var ATLAS_MEMO_BY_NAME = {};
var ATLAS_ARRAY = [];
function atlas(def) {
  return __awaiter(this, void 0, void 0, function() {
    var atlas2;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (def instanceof Atlas) {
            atlas2 = def;
          } else {
            atlas2 = new Atlas(def);
          }
          if (atlas2.name) {
            ATLAS_MEMO_BY_NAME[atlas2.name] = atlas2;
          }
          ATLAS_ARRAY.push(atlas2);
          return [4, atlas2.load()];
        case 1:
          _a.sent();
          return [2, atlas2];
      }
    });
  });
}
function texture(query) {
  if ("string" !== typeof query) {
    return new TextureSelection(query);
  }
  var result = null;
  var colonIndex = query.indexOf(":");
  if (colonIndex > 0 && query.length > colonIndex + 1) {
    var atlas_1 = ATLAS_MEMO_BY_NAME[query.slice(0, colonIndex)];
    result = atlas_1 && atlas_1.select(query.slice(colonIndex + 1));
  }
  if (!result) {
    var atlas_2 = ATLAS_MEMO_BY_NAME[query];
    result = atlas_2 && atlas_2.select();
  }
  if (!result) {
    for (var i = 0; i < ATLAS_ARRAY.length; i++) {
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
}
var ResizableTexture = (
  /** @class */
  function(_super) {
    __extends(ResizableTexture2, _super);
    function ResizableTexture2(source, mode) {
      var _this = _super.call(this) || this;
      _this._source = source;
      _this._resizeMode = mode;
      return _this;
    }
    ResizableTexture2.prototype.getWidth = function() {
      var _a;
      return (_a = this.dw) !== null && _a !== void 0 ? _a : this._source.getWidth();
    };
    ResizableTexture2.prototype.getHeight = function() {
      var _a;
      return (_a = this.dh) !== null && _a !== void 0 ? _a : this._source.getHeight();
    };
    ResizableTexture2.prototype.prerender = function(context) {
      return false;
    };
    ResizableTexture2.prototype.drawWithNormalizedArgs = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
      var texture2 = this._source;
      if (texture2 === null || typeof texture2 !== "object") {
        return;
      }
      var outWidth = dw;
      var outHeight = dh;
      var left = Number.isFinite(texture2.left) ? texture2.left : 0;
      var right = Number.isFinite(texture2.right) ? texture2.right : 0;
      var top = Number.isFinite(texture2.top) ? texture2.top : 0;
      var bottom = Number.isFinite(texture2.bottom) ? texture2.bottom : 0;
      var width = texture2.getWidth() - left - right;
      var height = texture2.getHeight() - top - bottom;
      if (!this._innerSize) {
        outWidth = Math.max(outWidth - left - right, 0);
        outHeight = Math.max(outHeight - top - bottom, 0);
      }
      if (top > 0 && left > 0) {
        texture2.draw(context, 0, 0, left, top, 0, 0, left, top);
      }
      if (bottom > 0 && left > 0) {
        texture2.draw(context, 0, height + top, left, bottom, 0, outHeight + top, left, bottom);
      }
      if (top > 0 && right > 0) {
        texture2.draw(context, width + left, 0, right, top, outWidth + left, 0, right, top);
      }
      if (bottom > 0 && right > 0) {
        texture2.draw(context, width + left, height + top, right, bottom, outWidth + left, outHeight + top, right, bottom);
      }
      if (this._resizeMode === "stretch") {
        if (top > 0) {
          texture2.draw(context, left, 0, width, top, left, 0, outWidth, top);
        }
        if (bottom > 0) {
          texture2.draw(context, left, height + top, width, bottom, left, outHeight + top, outWidth, bottom);
        }
        if (left > 0) {
          texture2.draw(context, 0, top, left, height, 0, top, left, outHeight);
        }
        if (right > 0) {
          texture2.draw(context, width + left, top, right, height, outWidth + left, top, right, outHeight);
        }
        texture2.draw(context, left, top, width, height, left, top, outWidth, outHeight);
      } else if (this._resizeMode === "tile") {
        var l = left;
        var r = outWidth;
        var w = void 0;
        while (r > 0) {
          w = Math.min(width, r);
          r -= width;
          var t = top;
          var b = outHeight;
          var h = void 0;
          while (b > 0) {
            h = Math.min(height, b);
            b -= height;
            texture2.draw(context, left, top, w, h, l, t, w, h);
            if (r <= 0) {
              if (left) {
                texture2.draw(context, 0, top, left, h, 0, t, left, h);
              }
              if (right) {
                texture2.draw(context, width + left, top, right, h, l + w, t, right, h);
              }
            }
            t += h;
          }
          if (top) {
            texture2.draw(context, left, 0, w, top, l, 0, w, top);
          }
          if (bottom) {
            texture2.draw(context, left, height + top, w, bottom, l, t, w, bottom);
          }
          l += w;
        }
      }
    };
    return ResizableTexture2;
  }(Texture)
);
function getDevicePixelRatio() {
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}
function isValidFitMode(value) {
  return value && (value === "cover" || value === "contain" || value === "fill" || value === "in" || value === "in-pad" || value === "out" || value === "out-crop");
}
var iid$1 = 0;
var Pin = (
  /** @class */
  function() {
    function Pin2(owner) {
      this.uid = "pin:" + uid();
      this._directionX = 1;
      this._directionY = 1;
      this._owner = owner;
      this._parent = null;
      this._relativeMatrix = new Matrix();
      this._absoluteMatrix = new Matrix();
      this.reset();
    }
    Pin2.prototype.reset = function() {
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
    };
    Pin2.prototype._update = function() {
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
    };
    Pin2.prototype.toString = function() {
      return this._owner + " (" + (this._parent ? this._parent._owner : null) + ")";
    };
    Pin2.prototype.absoluteMatrix = function() {
      this._update();
      var ts = Math.max(this._ts_transform, this._ts_translate, this._parent ? this._parent._ts_matrix : 0);
      if (this._mo_abs == ts) {
        return this._absoluteMatrix;
      }
      this._mo_abs = ts;
      var abs = this._absoluteMatrix;
      abs.reset(this.relativeMatrix());
      this._parent && abs.concat(this._parent._absoluteMatrix);
      this._ts_matrix = ++iid$1;
      return abs;
    };
    Pin2.prototype.relativeMatrix = function() {
      this._update();
      var ts = Math.max(this._ts_transform, this._ts_translate, this._parent ? this._parent._ts_transform : 0);
      if (this._mo_rel == ts) {
        return this._relativeMatrix;
      }
      this._mo_rel = ts;
      var rel = this._relativeMatrix;
      rel.identity();
      if (this._pivoted) {
        rel.translate(-this._pivotX * this._width, -this._pivotY * this._height);
      }
      rel.scale(this._scaleX * this._directionX, this._scaleY * this._directionY);
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
        var p = void 0;
        var q = void 0;
        if (rel.a > 0 && rel.c > 0 || rel.a < 0 && rel.c < 0) {
          p = 0;
          q = rel.a * this._width + rel.c * this._height;
        } else {
          p = rel.a * this._width;
          q = rel.c * this._height;
        }
        if (p > q) {
          this._boxX = q;
          this._boxWidth = p - q;
        } else {
          this._boxX = p;
          this._boxWidth = q - p;
        }
        if (rel.b > 0 && rel.d > 0 || rel.b < 0 && rel.d < 0) {
          p = 0;
          q = rel.b * this._width + rel.d * this._height;
        } else {
          p = rel.b * this._width;
          q = rel.d * this._height;
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
      this._x -= this._boxX + this._handleX * this._boxWidth * this._directionX;
      this._y -= this._boxY + this._handleY * this._boxHeight * this._directionY;
      if (this._aligned && this._parent) {
        this._parent.relativeMatrix();
        this._x += this._alignX * this._parent._width;
        this._y += this._alignY * this._parent._height;
      }
      rel.translate(this._x, this._y);
      return this._relativeMatrix;
    };
    Pin2.prototype.get = function(key) {
      if (typeof getters[key] === "function") {
        return getters[key](this);
      }
    };
    Pin2.prototype.set = function(a, b) {
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
    };
    Pin2.prototype.fit = function(width, height, mode) {
      this._ts_transform = ++iid$1;
      if (mode === "contain") {
        mode = "in-pad";
      }
      if (mode === "cover") {
        mode = "out-crop";
      }
      if (typeof width === "number") {
        this._scaleX = width / this._unscaled_width;
        this._width = this._unscaled_width;
      }
      if (typeof height === "number") {
        this._scaleY = height / this._unscaled_height;
        this._height = this._unscaled_height;
      }
      if (typeof width === "number" && typeof height === "number" && typeof mode === "string") {
        if (mode === "fill") ;
        else if (mode === "out" || mode === "out-crop") {
          this._scaleX = this._scaleY = Math.max(this._scaleX, this._scaleY);
        } else if (mode === "in" || mode === "in-pad") {
          this._scaleX = this._scaleY = Math.min(this._scaleX, this._scaleY);
        }
        if (mode === "out-crop" || mode === "in-pad") {
          this._width = width / this._scaleX;
          this._height = height / this._scaleY;
        }
      }
    };
    return Pin2;
  }()
);
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
var setters = {
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
    pin._unscaled_height = value;
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
      pin.fit(all.resizeWidth, all.resizeHeight, value);
    }
  },
  resizeWidth: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      pin.fit(value, null);
    }
  },
  resizeHeight: function(pin, value, all) {
    if (!all || !all.resizeMode) {
      pin.fit(null, value);
    }
  },
  scaleMode: function(pin, value, all) {
    if (all) {
      pin.fit(all.scaleWidth, all.scaleHeight, value);
    }
  },
  scaleWidth: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      pin.fit(value, null);
    }
  },
  scaleHeight: function(pin, value, all) {
    if (!all || !all.scaleMode) {
      pin.fit(null, value);
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
function IDENTITY(x) {
  return x;
}
var LOOKUP_CACHE = {};
var MODE_BY_NAME = {};
var EASE_BY_NAME = {};
var Easing = (
  /** @class */
  function() {
    function Easing2() {
    }
    Easing2.get = function(token, fallback) {
      fallback = fallback || IDENTITY;
      if (typeof token === "function") {
        return token;
      }
      if (typeof token !== "string") {
        return fallback;
      }
      var easeFn = LOOKUP_CACHE[token];
      if (easeFn) {
        return easeFn;
      }
      var tokens = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
      if (!tokens || !tokens.length) {
        return fallback;
      }
      var easeName = tokens[1];
      var easing = EASE_BY_NAME[easeName];
      var modeName = tokens[3];
      var modeFn = MODE_BY_NAME[modeName];
      var params = tokens[5];
      if (!easing) {
        easeFn = fallback;
      } else if ("fn" in easing && typeof easing.fn === "function") {
        easeFn = easing.fn;
      } else if ("fc" in easing && typeof easing.fc === "function") {
        var args = params ? params.replace(/\s+/, "").split(",") : void 0;
        easeFn = easing.fc.apply(easing.fc, args);
      } else {
        easeFn = fallback;
      }
      if (modeFn) {
        easeFn = modeFn(easeFn);
      }
      LOOKUP_CACHE[token] = easeFn;
      return easeFn;
    };
    return Easing2;
  }()
);
function addMode(name, fn) {
  MODE_BY_NAME[name] = fn;
}
function addEaseFn(data) {
  var names = data.name.split(/\s+/);
  for (var i = 0; i < names.length; i++) {
    var key = names[i];
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
    var s = p / (2 * Math.PI) * Math.asin(1 / a);
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
var Transition = (
  /** @class */
  function() {
    function Transition2(owner, options) {
      if (options === void 0) {
        options = {};
      }
      this.uid = "transition:" + uid();
      this._ending = [];
      this._end = {};
      this._duration = options.duration || 400;
      this._delay = options.delay || 0;
      this._owner = owner;
      this._time = 0;
    }
    Transition2.prototype.tick = function(component2, elapsed, now, last) {
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
      var p = Math.min(time / this._duration, 1);
      var ended = p >= 1;
      if (typeof this._easing == "function") {
        p = this._easing(p);
      }
      var q = 1 - p;
      for (var key in this._end) {
        this._owner.pin(key, this._start[key] * q + this._end[key] * p);
      }
      return ended;
    };
    Transition2.prototype.finish = function() {
      var _this = this;
      this._ending.forEach(function(callback) {
        try {
          callback.call(_this._owner);
        } catch (e) {
          console.error(e);
        }
      });
      return this._next;
    };
    Transition2.prototype.tween = function(a, b) {
      var options;
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
      return this._next = new Transition2(this._owner, options);
    };
    Transition2.prototype.duration = function(duration) {
      this._duration = duration;
      return this;
    };
    Transition2.prototype.delay = function(delay) {
      this._delay = delay;
      return this;
    };
    Transition2.prototype.ease = function(easing) {
      this._easing = Easing.get(easing);
      return this;
    };
    Transition2.prototype.done = function(fn) {
      this._ending.push(fn);
      return this;
    };
    Transition2.prototype.hide = function() {
      this._ending.push(function() {
        this.hide();
      });
      this._hide = true;
      return this;
    };
    Transition2.prototype.remove = function() {
      this._ending.push(function() {
        this.remove();
      });
      this._remove = true;
      return this;
    };
    Transition2.prototype.pin = function(a, b) {
      if (typeof a === "object") {
        for (var attr in a) {
          pinning(this._owner, this._end, attr, a[attr]);
        }
      } else if (typeof b !== "undefined") {
        pinning(this._owner, this._end, a, b);
      }
      return this;
    };
    Transition2.prototype.then = function(fn) {
      this.done(fn);
      return this;
    };
    Transition2.prototype.clear = function(forward) {
      return this;
    };
    Transition2.prototype.size = function(w, h) {
      this.pin("width", w);
      this.pin("height", h);
      return this;
    };
    Transition2.prototype.width = function(w) {
      if (typeof w === "undefined") {
        return this.pin("width");
      }
      this.pin("width", w);
      return this;
    };
    Transition2.prototype.height = function(h) {
      if (typeof h === "undefined") {
        return this.pin("height");
      }
      this.pin("height", h);
      return this;
    };
    Transition2.prototype.offset = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      }
      this.pin("offsetX", a);
      this.pin("offsetY", b);
      return this;
    };
    Transition2.prototype.rotate = function(a) {
      this.pin("rotation", a);
      return this;
    };
    Transition2.prototype.skew = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      } else if (typeof b === "undefined") {
        b = a;
      }
      this.pin("skewX", a);
      this.pin("skewY", b);
      return this;
    };
    Transition2.prototype.scale = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      } else if (typeof b === "undefined") {
        b = a;
      }
      this.pin("scaleX", a);
      this.pin("scaleY", b);
      return this;
    };
    Transition2.prototype.alpha = function(a, ta) {
      this.pin("alpha", a);
      if (typeof ta !== "undefined") {
        this.pin("textureAlpha", ta);
      }
      return this;
    };
    return Transition2;
  }()
);
function pinning(component2, map, key, value) {
  if (typeof component2.pin(key) === "number") {
    map[key] = value;
  } else if (typeof component2.pin(key + "X") === "number" && typeof component2.pin(key + "Y") === "number") {
    map[key + "X"] = value;
    map[key + "Y"] = value;
  }
}
var iid = 0;
stats.create = 0;
function assertType(obj) {
  if (obj && obj instanceof Component) {
    return obj;
  }
  throw "Invalid component: " + obj;
}
function create() {
  return component();
}
function layer() {
  return maximize();
}
function box() {
  return minimize();
}
function layout() {
  return component();
}
function component() {
  return new Component();
}
function row(align) {
  return new Component().row(align).label("Row");
}
function column(align) {
  return new Component().column(align).label("Column");
}
function minimize() {
  return new Component().minimize().label("Minimize");
}
function maximize() {
  return new Component().maximize().label("Maximize");
}
var Component = (
  /** @class */
  function() {
    function Component2() {
      var _this = this;
      this.uid = "component:" + uid();
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
      this.renderedBefore = false;
      this._transitionTickInitied = false;
      this._transitionTickLastTime = 0;
      this._transitionTick = function(elapsed, now, last) {
        if (!_this._transitions.length) {
          return false;
        }
        var ignore = _this._transitionTickLastTime !== last;
        _this._transitionTickLastTime = now;
        if (ignore) {
          return true;
        }
        var head = _this._transitions[0];
        var ended = head.tick(_this, elapsed, now, last);
        if (ended) {
          if (head === _this._transitions[0]) {
            _this._transitions.shift();
          }
          var next = head.finish();
          if (next) {
            _this._transitions.unshift(next);
          }
        }
        return true;
      };
      stats.create++;
      if (this instanceof Component2) {
        this.label(this.constructor.name);
      }
    }
    Component2.prototype.matrix = function(relative) {
      if (relative === void 0) {
        relative = false;
      }
      if (relative === true) {
        return this._pin.relativeMatrix();
      }
      return this._pin.absoluteMatrix();
    };
    Component2.prototype.getPixelRatio = function() {
      var _a;
      var m = (_a = this._parent) === null || _a === void 0 ? void 0 : _a.matrix();
      var pixelRatio = !m ? 1 : Math.max(Math.abs(m.a), Math.abs(m.b)) / getDevicePixelRatio();
      return pixelRatio;
    };
    Component2.prototype.getDevicePixelRatio = function() {
      var _a;
      var parentMatrix = (_a = this._parent) === null || _a === void 0 ? void 0 : _a.matrix();
      var pixelRatio = !parentMatrix ? 1 : Math.max(Math.abs(parentMatrix.a), Math.abs(parentMatrix.b));
      return pixelRatio;
    };
    Component2.prototype.getLogicalPixelRatio = function() {
      return this.getDevicePixelRatio() / getDevicePixelRatio();
    };
    Component2.prototype.pin = function(a, b) {
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
    Component2.prototype.fit = function(a, b, c) {
      if (typeof a === "object") {
        c = b;
        b = a.y;
        a = a.x;
      }
      this._pin.fit(a, b, c);
      return this;
    };
    Component2.prototype.scaleTo = function(a, b, c) {
      return this.fit(a, b, c);
    };
    Component2.prototype.toString = function() {
      return "[" + this._label + "]";
    };
    Component2.prototype.id = function(label) {
      if (typeof label === "undefined") {
        return this._label;
      }
      this._label = label;
      return this;
    };
    Component2.prototype.label = function(label) {
      if (typeof label === "undefined") {
        return this._label;
      }
      this._label = label;
      return this;
    };
    Component2.prototype.attr = function(name, value) {
      if (typeof value === "undefined") {
        return this._attrs !== null ? this._attrs[name] : void 0;
      }
      (this._attrs !== null ? this._attrs : this._attrs = {})[name] = value;
      return this;
    };
    Component2.prototype.visible = function(visible) {
      if (typeof visible === "undefined") {
        return this._visible;
      }
      this._visible = visible;
      this._parent && (this._parent._ts_children = ++iid);
      this._ts_pin = ++iid;
      this.touch();
      return this;
    };
    Component2.prototype.hide = function() {
      this.visible(false);
      return this;
    };
    Component2.prototype.show = function() {
      this.visible(true);
      return this;
    };
    Component2.prototype.parent = function() {
      return this._parent;
    };
    Component2.prototype.next = function(visible) {
      var next = this._next;
      while (next && visible && !next._visible) {
        next = next._next;
      }
      return next;
    };
    Component2.prototype.prev = function(visible) {
      var prev = this._prev;
      while (prev && visible && !prev._visible) {
        prev = prev._prev;
      }
      return prev;
    };
    Component2.prototype.first = function(visible) {
      var next = this._first;
      while (next && visible && !next._visible) {
        next = next._next;
      }
      return next;
    };
    Component2.prototype.last = function(visible) {
      var prev = this._last;
      while (prev && visible && !prev._visible) {
        prev = prev._prev;
      }
      return prev;
    };
    Component2.prototype.visit = function(visitor, payload) {
      var reverse = visitor.reverse;
      var visible = visitor.visible;
      if (visitor.start && visitor.start(this, payload)) {
        return;
      }
      var child;
      var next = reverse ? this.last(visible) : this.first(visible);
      while (child = next) {
        next = reverse ? child.prev(visible) : child.next(visible);
        if (child.visit(visitor, payload)) {
          return true;
        }
      }
      return visitor.end && visitor.end(this, payload);
    };
    Component2.prototype.append = function(child, more) {
      if (Array.isArray(child)) {
        for (var i = 0; i < child.length; i++) {
          Component2.append(this, child[i]);
        }
      } else if (typeof more !== "undefined") {
        for (var i = 0; i < arguments.length; i++) {
          Component2.append(this, arguments[i]);
        }
      } else if (typeof child !== "undefined")
        Component2.append(this, child);
      return this;
    };
    Component2.prototype.prepend = function(child, more) {
      if (Array.isArray(child)) {
        for (var i = child.length - 1; i >= 0; i--) {
          Component2.prepend(this, child[i]);
        }
      } else if (typeof more !== "undefined") {
        for (var i = arguments.length - 1; i >= 0; i--) {
          Component2.prepend(this, arguments[i]);
        }
      } else if (typeof child !== "undefined")
        Component2.prepend(this, child);
      return this;
    };
    Component2.prototype.appendTo = function(parent) {
      Component2.append(parent, this);
      return this;
    };
    Component2.prototype.prependTo = function(parent) {
      Component2.prepend(parent, this);
      return this;
    };
    Component2.prototype.insertNext = function(sibling, more) {
      if (Array.isArray(sibling)) {
        for (var i = 0; i < sibling.length; i++) {
          Component2.insertAfter(sibling[i], this);
        }
      } else if (typeof more !== "undefined") {
        for (var i = 0; i < arguments.length; i++) {
          Component2.insertAfter(arguments[i], this);
        }
      } else if (typeof sibling !== "undefined") {
        Component2.insertAfter(sibling, this);
      }
      return this;
    };
    Component2.prototype.insertPrev = function(sibling, more) {
      if (Array.isArray(sibling)) {
        for (var i = sibling.length - 1; i >= 0; i--) {
          Component2.insertBefore(sibling[i], this);
        }
      } else if (typeof more !== "undefined") {
        for (var i = arguments.length - 1; i >= 0; i--) {
          Component2.insertBefore(arguments[i], this);
        }
      } else if (typeof sibling !== "undefined") {
        Component2.insertBefore(sibling, this);
      }
      return this;
    };
    Component2.prototype.insertAfter = function(prev) {
      Component2.insertAfter(this, prev);
      return this;
    };
    Component2.prototype.insertBefore = function(next) {
      Component2.insertBefore(this, next);
      return this;
    };
    Component2.append = function(parent, child) {
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
    };
    Component2.prepend = function(parent, child) {
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
    };
    Component2.insertBefore = function(self, next) {
      assertType(self);
      assertType(next);
      self.remove();
      var parent = next._parent;
      var prev = next._prev;
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
    };
    Component2.insertAfter = function(self, prev) {
      assertType(self);
      assertType(prev);
      self.remove();
      var parent = prev._parent;
      var next = prev._next;
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
    };
    Component2.prototype.remove = function(child, more) {
      if (typeof child !== "undefined") {
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i++) {
            assertType(child[i]).remove();
          }
        } else if (typeof more !== "undefined") {
          for (var i = 0; i < arguments.length; i++) {
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
    };
    Component2.prototype.empty = function() {
      var child = null;
      var next = this._first;
      while (child = next) {
        next = child._next;
        child._prev = child._next = child._parent = null;
        this._flag(child, false);
      }
      this._first = this._last = null;
      this._ts_children = ++iid;
      this.touch();
      return this;
    };
    Component2.prototype.touch = function() {
      this._ts_touch = ++iid;
      this._parent && this._parent.touch();
      return this;
    };
    Component2.prototype._flag = function(key, value) {
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
          for (var type in key._flags) {
            if (key._flags[type] > 0) {
              this._flag(type, value);
            }
          }
        }
      }
      return this;
    };
    Component2.prototype.hitTest = function(hit) {
      var width = this._pin._width;
      var height = this._pin._height;
      return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
    };
    Component2.prototype.prerender = function() {
      if (!this._visible) {
        return;
      }
      this.prerenderTexture();
      var child;
      var next = this._first;
      while (child = next) {
        next = child._next;
        child.prerender();
      }
    };
    Component2.prototype.prerenderTexture = function() {
    };
    Component2.prototype.render = function(context) {
      if (!this._visible) {
        return;
      }
      stats.component++;
      var m = this.matrix();
      context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
      this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
      var alpha = this._pin._textureAlpha * this._alpha;
      if (context.globalAlpha != alpha) {
        context.globalAlpha = alpha;
      }
      if (!this.renderedBefore) {
        this.prerenderTexture();
      }
      this.renderedBefore = true;
      this.renderTexture(context);
      if (context.globalAlpha != this._alpha) {
        context.globalAlpha = this._alpha;
      }
      var child;
      var next = this._first;
      while (child = next) {
        next = child._next;
        child.render(context);
      }
    };
    Component2.prototype.renderTexture = function(context) {
    };
    Component2.prototype._tick = function(elapsed, now, last) {
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
      var child;
      var next = this._first;
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
    Component2.prototype.tick = function(callback, before) {
      var _a, _b;
      if (before === void 0) {
        before = false;
      }
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
      var hasTickListener = ((_a = this._tickAfter) === null || _a === void 0 ? void 0 : _a.length) > 0 || ((_b = this._tickBefore) === null || _b === void 0 ? void 0 : _b.length) > 0;
      this._flag("_tick", hasTickListener);
    };
    Component2.prototype.untick = function(callback) {
      if (typeof callback !== "function") {
        return;
      }
      var i;
      if (this._tickBefore !== null && (i = this._tickBefore.indexOf(callback)) >= 0) {
        this._tickBefore.splice(i, 1);
      }
      if (this._tickAfter !== null && (i = this._tickAfter.indexOf(callback)) >= 0) {
        this._tickAfter.splice(i, 1);
      }
    };
    Component2.prototype.timeout = function(callback, time) {
      this.setTimeout(callback, time);
    };
    Component2.prototype.setTimeout = function(callback, time) {
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
    };
    Component2.prototype.clearTimeout = function(timer) {
      this.untick(timer);
    };
    Component2.prototype.on = function(type, listener) {
      if (!type || !type.length || typeof listener !== "function") {
        return this;
      }
      if (typeof type !== "string" && typeof type.join === "function") {
        for (var i = 0; i < type.length; i++) {
          this.on(type[i], listener);
        }
      } else if (typeof type === "string" && type.indexOf(" ") > -1) {
        type = type.match(/\S+/g);
        for (var i = 0; i < type.length; i++) {
          this._on(type[i], listener);
        }
      } else if (typeof type === "string") {
        this._on(type, listener);
      } else ;
      return this;
    };
    Component2.prototype._on = function(type, listener) {
      if (typeof type !== "string" && typeof listener !== "function") {
        return;
      }
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(listener);
      this._flag(type, true);
    };
    Component2.prototype.off = function(type, listener) {
      if (!type || !type.length || typeof listener !== "function") {
        return this;
      }
      if (typeof type !== "string" && typeof type.join === "function") {
        for (var i = 0; i < type.length; i++) {
          this.off(type[i], listener);
        }
      } else if (typeof type === "string" && type.indexOf(" ") > -1) {
        type = type.match(/\S+/g);
        for (var i = 0; i < type.length; i++) {
          this._off(type[i], listener);
        }
      } else if (typeof type === "string") {
        this._off(type, listener);
      } else ;
      return this;
    };
    Component2.prototype._off = function(type, listener) {
      if (typeof type !== "string" && typeof listener !== "function") {
        return;
      }
      var listeners = this._listeners[type];
      if (!listeners || !listeners.length) {
        return;
      }
      var index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
        this._flag(type, false);
      }
    };
    Component2.prototype.listeners = function(type) {
      return this._listeners[type];
    };
    Component2.prototype.publish = function(name, args) {
      var listeners = this.listeners(name);
      if (!listeners || !listeners.length) {
        return 0;
      }
      for (var l = 0; l < listeners.length; l++) {
        listeners[l].apply(this, args);
      }
      return listeners.length;
    };
    Component2.prototype.trigger = function(name, args) {
      this.publish(name, args);
      return this;
    };
    Component2.prototype.size = function(w, h) {
      this.pin("width", w);
      this.pin("height", h);
      return this;
    };
    Component2.prototype.width = function(w) {
      if (typeof w === "undefined") {
        return this.pin("width");
      }
      this.pin("width", w);
      return this;
    };
    Component2.prototype.height = function(h) {
      if (typeof h === "undefined") {
        return this.pin("height");
      }
      this.pin("height", h);
      return this;
    };
    Component2.prototype.offset = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      }
      this.pin("offsetX", a);
      this.pin("offsetY", b);
      return this;
    };
    Component2.prototype.rotate = function(a) {
      this.pin("rotation", a);
      return this;
    };
    Component2.prototype.skew = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      } else if (typeof b === "undefined")
        b = a;
      this.pin("skewX", a);
      this.pin("skewY", b);
      return this;
    };
    Component2.prototype.scale = function(a, b) {
      if (typeof a === "object") {
        b = a.y;
        a = a.x;
      } else if (typeof b === "undefined")
        b = a;
      this.pin("scaleX", a);
      this.pin("scaleY", b);
      return this;
    };
    Component2.prototype.alpha = function(a, ta) {
      this.pin("alpha", a);
      if (typeof ta !== "undefined") {
        this.pin("textureAlpha", ta);
      }
      return this;
    };
    Component2.prototype.tween = function(a, b, c) {
      var options;
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
      var transition = new Transition(this, options);
      this._transitions.push(transition);
      return transition;
    };
    Component2.prototype.row = function(align) {
      this.align("row", align);
      return this;
    };
    Component2.prototype.column = function(align) {
      this.align("column", align);
      return this;
    };
    Component2.prototype.align = function(type, align) {
      var _this = this;
      this._padding = this._padding;
      this._spacing = this._spacing;
      this._layoutTicker && this.untick(this._layoutTicker);
      this.tick(this._layoutTicker = function() {
        if (_this._mo_seq == _this._ts_touch) {
          return;
        }
        _this._mo_seq = _this._ts_touch;
        var alignChildren = _this._mo_seqAlign != _this._ts_children;
        _this._mo_seqAlign = _this._ts_children;
        var width = 0;
        var height = 0;
        var child;
        var next = _this.first(true);
        var first = true;
        while (child = next) {
          next = child.next(true);
          child.matrix(true);
          var w = child.pin("boxWidth");
          var h = child.pin("boxHeight");
          if (type == "column") {
            !first && (height += _this._spacing);
            child.pin("offsetY") != height && child.pin("offsetY", height);
            width = Math.max(width, w);
            height = height + h;
            alignChildren && child.pin("alignX", align);
          } else if (type == "row") {
            !first && (width += _this._spacing);
            child.pin("offsetX") != width && child.pin("offsetX", width);
            width = width + w;
            height = Math.max(height, h);
            alignChildren && child.pin("alignY", align);
          }
          first = false;
        }
        width += 2 * _this._padding;
        height += 2 * _this._padding;
        _this.pin("width") != width && _this.pin("width", width);
        _this.pin("height") != height && _this.pin("height", height);
      });
      return this;
    };
    Component2.prototype.box = function() {
      return this.minimize();
    };
    Component2.prototype.layer = function() {
      return this.maximize();
    };
    Component2.prototype.minimize = function() {
      var _this = this;
      this._padding = this._padding;
      this._layoutTicker && this.untick(this._layoutTicker);
      this.tick(this._layoutTicker = function() {
        if (_this._mo_box == _this._ts_touch) {
          return;
        }
        _this._mo_box = _this._ts_touch;
        var width = 0;
        var height = 0;
        var child;
        var next = _this.first(true);
        while (child = next) {
          next = child.next(true);
          child.matrix(true);
          var w = child.pin("boxWidth");
          var h = child.pin("boxHeight");
          width = Math.max(width, w);
          height = Math.max(height, h);
        }
        width += 2 * _this._padding;
        height += 2 * _this._padding;
        _this.pin("width") != width && _this.pin("width", width);
        _this.pin("height") != height && _this.pin("height", height);
      });
      return this;
    };
    Component2.prototype.maximize = function() {
      var _this = this;
      this._layoutTicker && this.untick(this._layoutTicker);
      this.tick(this._layoutTicker = function() {
        var parent = _this.parent();
        if (parent) {
          var width = parent.pin("width");
          if (_this.pin("width") != width) {
            _this.pin("width", width);
          }
          var height = parent.pin("height");
          if (_this.pin("height") != height) {
            _this.pin("height", height);
          }
        }
      }, true);
      return this;
    };
    Component2.prototype.padding = function(pad) {
      this._padding = pad;
      return this;
    };
    Component2.prototype.spacing = function(space) {
      this._spacing = space;
      return this;
    };
    return Component2;
  }()
);
function sprite(frame) {
  var sprite2 = new Sprite();
  frame && sprite2.texture(frame);
  return sprite2;
}
var Sprite = (
  /** @class */
  function(_super) {
    __extends(Sprite2, _super);
    function Sprite2() {
      var _this = _super.call(this) || this;
      _this._texture = null;
      _this._image = null;
      _this._tiled = false;
      _this._stretched = false;
      _this.prerenderContext = {};
      _this.label("Sprite");
      return _this;
    }
    Sprite2.prototype.texture = function(frame) {
      this._image = texture(frame).one();
      if (this._image) {
        this.pin("width", this._image.getWidth());
        this.pin("height", this._image.getHeight());
        if (this._tiled) {
          this._texture = new ResizableTexture(this._image, "tile");
        } else if (this._stretched) {
          this._texture = new ResizableTexture(this._image, "stretch");
        } else {
          this._texture = new PipeTexture(this._image);
        }
      } else {
        this.pin("width", 0);
        this.pin("height", 0);
        this._texture = null;
      }
      return this;
    };
    Sprite2.prototype.image = function(frame) {
      return this.texture(frame);
    };
    Sprite2.prototype.tile = function(inner) {
      this._tiled = true;
      var texture2 = new ResizableTexture(this._image, "tile");
      this._texture = texture2;
      return this;
    };
    Sprite2.prototype.stretch = function(inner) {
      this._stretched = true;
      var texture2 = new ResizableTexture(this._image, "stretch");
      this._texture = texture2;
      return this;
    };
    Sprite2.prototype.prerenderTexture = function() {
      if (!this._image)
        return;
      var pixelRatio = this.getDevicePixelRatio();
      this.prerenderContext.pixelRatio = pixelRatio;
      var updated = this._image.prerender(this.prerenderContext);
      if (updated === true) {
        var w = this._image.getWidth();
        var h = this._image.getHeight();
        this.size(w, h);
      }
    };
    Sprite2.prototype.renderTexture = function(context) {
      if (!this._texture)
        return;
      if (this._texture["_resizeMode"]) {
        this._texture.dw = this.pin("width");
        this._texture.dh = this.pin("height");
      }
      this._texture.draw(context);
    };
    return Sprite2;
  }(Component)
);
var CanvasTexture = (
  /** @class */
  function(_super) {
    __extends(CanvasTexture2, _super);
    function CanvasTexture2() {
      var _this = _super.call(this, document.createElement("canvas")) || this;
      _this._lastPixelRatio = 0;
      return _this;
    }
    CanvasTexture2.prototype.setSize = function(destWidth, destHeight, pixelRatio) {
      if (pixelRatio === void 0) {
        pixelRatio = 1;
      }
      this._source.width = destWidth * pixelRatio;
      this._source.height = destHeight * pixelRatio;
      this._pixelRatio = pixelRatio;
    };
    CanvasTexture2.prototype.getContext = function(type, attributes) {
      if (type === void 0) {
        type = "2d";
      }
      return this._source.getContext(type, attributes);
    };
    CanvasTexture2.prototype.getDevicePixelRatio = function() {
      return this._lastPixelRatio;
    };
    CanvasTexture2.prototype.getOptimalPixelRatio = function() {
      return this.getDevicePixelRatio();
    };
    CanvasTexture2.prototype.setMemoizer = function(memoizer) {
      this._memoizer = memoizer;
    };
    CanvasTexture2.prototype.setDrawer = function(drawer) {
      this._drawer = drawer;
    };
    CanvasTexture2.prototype.prerender = function(context) {
      var newPixelRatio = context.pixelRatio;
      var lastPixelRatio = this._lastPixelRatio;
      var pixelRationChange = lastPixelRatio / newPixelRatio;
      var pixelRatioChanged = lastPixelRatio === 0 || pixelRationChange > 1.25 || pixelRationChange < 0.8;
      if (pixelRatioChanged) {
        this._lastPixelRatio = newPixelRatio;
      }
      var newMemoKey = this._memoizer ? this._memoizer.call(this) : null;
      var memoKeyChanged = this._lastMemoKey !== newMemoKey;
      if (pixelRatioChanged || memoKeyChanged) {
        this._lastMemoKey = newMemoKey;
        this._lastPixelRatio = newPixelRatio;
        if (typeof this._drawer === "function") {
          this._drawer.call(this);
        }
        return true;
      }
    };
    CanvasTexture2.prototype.size = function(width, height, pixelRatio) {
      this.setSize(width, height, pixelRatio);
      return this;
    };
    CanvasTexture2.prototype.context = function(type, attributes) {
      if (type === void 0) {
        type = "2d";
      }
      return this.getContext(type, attributes);
    };
    CanvasTexture2.prototype.canvas = function(legacyTextureDrawer) {
      if (typeof legacyTextureDrawer === "function") {
        legacyTextureDrawer.call(this, this.getContext());
      } else if (typeof legacyTextureDrawer === "undefined") {
        if (typeof this._drawer === "function") {
          this._drawer.call(this);
        }
      }
      return this;
    };
    return CanvasTexture2;
  }(ImageTexture)
);
function canvas(type, attributes, legacyTextureDrawer) {
  if (typeof type === "function") {
    var texture_1 = new CanvasTexture();
    legacyTextureDrawer = type;
    texture_1.setDrawer(function() {
      legacyTextureDrawer.call(texture_1, texture_1.getContext());
    });
    return texture_1;
  } else if (typeof attributes === "function") {
    var texture_2 = new CanvasTexture();
    legacyTextureDrawer = attributes;
    texture_2.setDrawer(function() {
      legacyTextureDrawer.call(texture_2, texture_2.getContext(type));
    });
    return texture_2;
  } else if (typeof legacyTextureDrawer === "function") {
    var texture_3 = new CanvasTexture();
    texture_3.setDrawer(function() {
      legacyTextureDrawer.call(texture_3, texture_3.getContext(type, attributes));
    });
    return texture_3;
  } else {
    var texture2 = new CanvasTexture();
    return texture2;
  }
}
function memoizeDraw(legacySpriteDrawer, legacySpriteMemoizer) {
  if (legacySpriteMemoizer === void 0) {
    legacySpriteMemoizer = function() {
      return null;
    };
  }
  var sprite2 = new Sprite();
  var texture2 = new CanvasTexture();
  sprite2.texture(texture2);
  texture2.setDrawer(function() {
    legacySpriteDrawer(2.5 * texture2._lastPixelRatio, texture2, sprite2);
  });
  texture2.setMemoizer(legacySpriteMemoizer);
  return sprite2;
}
var POINTER_CLICK = "click";
var POINTER_DOWN = "touchstart mousedown";
var POINTER_MOVE = "touchmove mousemove";
var POINTER_UP = "touchend mouseup";
var POINTER_CANCEL = "touchcancel mousecancel";
var POINTER_START = "touchstart mousedown";
var POINTER_END = "touchend mouseup";
var EventPoint = (
  /** @class */
  function() {
    function EventPoint2() {
    }
    EventPoint2.prototype.clone = function(obj) {
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
    };
    EventPoint2.prototype.toString = function() {
      return (this.x | 0) + "x" + (this.y | 0);
    };
    return EventPoint2;
  }()
);
var PointerSyntheticEvent = (
  /** @class */
  function() {
    function PointerSyntheticEvent2() {
      this.abs = new EventPoint();
    }
    PointerSyntheticEvent2.prototype.clone = function(obj) {
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
    };
    PointerSyntheticEvent2.prototype.toString = function() {
      return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
    };
    return PointerSyntheticEvent2;
  }()
);
var VisitPayload = (
  /** @class */
  function() {
    function VisitPayload2() {
      this.type = "";
      this.x = 0;
      this.y = 0;
      this.timeStamp = -1;
      this.event = null;
      this.root = null;
      this.collected = null;
    }
    VisitPayload2.prototype.toString = function() {
      return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
    };
    return VisitPayload2;
  }()
);
var syntheticEvent = new PointerSyntheticEvent();
var PAYLOAD = new VisitPayload();
var Pointer = (
  /** @class */
  function() {
    function Pointer2() {
      var _this = this;
      this.ratio = 1;
      this.clickList = [];
      this.cancelList = [];
      this.handleStart = function(event) {
        Pointer2.DEBUG && console.debug && console.debug("pointer-start", event.type);
        event.preventDefault();
        _this.localPoint(event);
        _this.dispatchEvent(event.type, event);
        _this.findTargets("click", _this.clickList);
        _this.findTargets("mousecancel", _this.cancelList);
      };
      this.handleMove = function(event) {
        event.preventDefault();
        _this.localPoint(event);
        _this.dispatchEvent(event.type, event);
      };
      this.handleEnd = function(event) {
        var _a;
        event.preventDefault();
        Pointer2.DEBUG && console.debug && console.debug("pointer-end", event.type);
        _this.dispatchEvent(event.type, event);
        if (_this.clickList.length) {
          Pointer2.DEBUG && console.debug && console.debug("pointer-click: ", event.type, (_a = _this.clickList) === null || _a === void 0 ? void 0 : _a.length);
          _this.dispatchEvent("click", event, _this.clickList);
        }
        _this.cancelList.length = 0;
      };
      this.handleCancel = function(event) {
        var _a;
        if (_this.cancelList.length) {
          Pointer2.DEBUG && console.debug && console.debug("pointer-cancel", event.type, (_a = _this.clickList) === null || _a === void 0 ? void 0 : _a.length);
          _this.dispatchEvent("mousecancel", event, _this.cancelList);
        }
        _this.clickList.length = 0;
      };
      this.visitStart = function(component2, payload) {
        return !component2._flag(payload.type);
      };
      this.visitEnd = function(component2, payload) {
        syntheticEvent.raw = payload.event;
        syntheticEvent.type = payload.type;
        syntheticEvent.timeStamp = payload.timeStamp;
        syntheticEvent.abs.x = payload.x;
        syntheticEvent.abs.y = payload.y;
        var listeners = component2.listeners(payload.type);
        if (!listeners) {
          return;
        }
        component2.matrix().inverse().map(payload, syntheticEvent);
        var isEventTarget = component2 === payload.root || component2.attr("spy") || component2.hitTest(syntheticEvent);
        if (!isEventTarget) {
          return;
        }
        if (payload.collected) {
          payload.collected.push(component2);
        }
        if (payload.event) {
          var stop_1 = false;
          for (var l = 0; l < listeners.length; l++) {
            stop_1 = listeners[l].call(component2, syntheticEvent) ? true : stop_1;
          }
          return stop_1;
        }
      };
    }
    Pointer2.prototype.mount = function(stage, elem) {
      var _this = this;
      this.stage = stage;
      this.elem = elem;
      this.ratio = stage.viewport().ratio || 1;
      stage.on("viewport", function(viewport) {
        var _a;
        _this.ratio = (_a = viewport.ratio) !== null && _a !== void 0 ? _a : _this.ratio;
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
    };
    Pointer2.prototype.unmount = function() {
      var elem = this.elem;
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
    };
    Pointer2.prototype.localPoint = function(event) {
      var _a;
      var elem = this.elem;
      var x;
      var y;
      if ((_a = event.touches) === null || _a === void 0 ? void 0 : _a.length) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      var rect = elem.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
      x -= elem.clientLeft | 0;
      y -= elem.clientTop | 0;
      PAYLOAD.x = x * this.ratio;
      PAYLOAD.y = y * this.ratio;
    };
    Pointer2.prototype.findTargets = function(type, result) {
      var payload = PAYLOAD;
      payload.type = type;
      payload.root = this.stage;
      payload.event = null;
      payload.collected = result;
      payload.collected.length = 0;
      this.stage.visit({
        reverse: true,
        visible: true,
        start: this.visitStart,
        end: this.visitEnd
      }, payload);
    };
    Pointer2.prototype.dispatchEvent = function(type, event, targets) {
      var payload = PAYLOAD;
      payload.type = type;
      payload.root = this.stage;
      payload.event = event;
      payload.timeStamp = Date.now();
      payload.collected = null;
      if (type !== "mousemove" && type !== "touchmove") {
        Pointer2.DEBUG && console.debug && console.debug("pointer:dispatchEvent", payload, targets === null || targets === void 0 ? void 0 : targets.length);
      }
      if (targets) {
        while (targets.length) {
          var component2 = targets.shift();
          if (this.visitEnd(component2, payload)) {
            break;
          }
        }
        targets.length = 0;
      } else {
        this.stage.visit({
          reverse: true,
          visible: true,
          start: this.visitStart,
          end: this.visitEnd
        }, payload);
      }
    };
    Pointer2.DEBUG = false;
    return Pointer2;
  }()
);
var Mouse = {
  CLICK: "click",
  START: "touchstart mousedown",
  MOVE: "touchmove mousemove",
  END: "touchend mouseup",
  CANCEL: "touchcancel mousecancel"
};
var ROOTS = [];
function pause() {
  for (var i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].pause();
  }
}
function resume() {
  for (var i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].resume();
  }
}
function mount(configs) {
  if (configs === void 0) {
    configs = {};
  }
  var root = new Root();
  root.mount(configs);
  root.pointer = new Pointer().mount(root, root.dom);
  return root;
}
var Root = (
  /** @class */
  function(_super) {
    __extends(Root2, _super);
    function Root2() {
      var _this = _super.call(this) || this;
      _this.canvas = null;
      _this.dom = null;
      _this.context = null;
      _this.pixelWidth = -1;
      _this.pixelHeight = -1;
      _this.pixelRatio = 1;
      _this.drawingWidth = 0;
      _this.drawingHeight = 0;
      _this.mounted = false;
      _this.paused = false;
      _this.sleep = false;
      _this.mount = function(configs) {
        if (configs === void 0) {
          configs = {};
        }
        if (typeof configs.canvas === "string") {
          _this.canvas = document.getElementById(configs.canvas);
          if (!_this.canvas) {
            console.error("Canvas element not found: ", configs.canvas);
          }
        } else if (configs.canvas instanceof HTMLCanvasElement) {
          _this.canvas = configs.canvas;
        } else if (configs.canvas) {
          console.error("Unknown value for canvas:", configs.canvas);
        }
        if (!_this.canvas) {
          _this.canvas = document.getElementById("cutjs") || document.getElementById("stage");
        }
        if (!_this.canvas) {
          console.debug && console.debug("Creating canvas element...");
          _this.canvas = document.createElement("canvas");
          Object.assign(_this.canvas.style, {
            position: "absolute",
            display: "block",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            width: "100%",
            height: "100%"
          });
          var body = document.body;
          body.insertBefore(_this.canvas, body.firstChild);
        }
        _this.dom = _this.canvas;
        _this.context = _this.canvas.getContext("2d");
        _this.devicePixelRatio = window.devicePixelRatio || 1;
        _this.backingStoreRatio = _this.context["webkitBackingStorePixelRatio"] || _this.context["mozBackingStorePixelRatio"] || _this.context["msBackingStorePixelRatio"] || _this.context["oBackingStorePixelRatio"] || _this.context["backingStorePixelRatio"] || 1;
        _this.pixelRatio = _this.devicePixelRatio / _this.backingStoreRatio;
        _this.mounted = true;
        ROOTS.push(_this);
        _this.requestFrame();
      };
      _this.frameRequested = false;
      _this.requestFrame = function() {
        if (!_this.frameRequested) {
          _this.frameRequested = true;
          requestAnimationFrame(_this.onFrame);
        }
      };
      _this._lastFrameTime = 0;
      _this._mo_touch = null;
      _this.onFrame = function(now) {
        _this.frameRequested = false;
        if (!_this.mounted || !_this.canvas || !_this.context) {
          return;
        }
        _this.requestFrame();
        var newPixelWidth = _this.canvas.clientWidth;
        var newPixelHeight = _this.canvas.clientHeight;
        if (_this.pixelWidth !== newPixelWidth || _this.pixelHeight !== newPixelHeight) {
          _this.pixelWidth = newPixelWidth;
          _this.pixelHeight = newPixelHeight;
          _this.drawingWidth = newPixelWidth * _this.pixelRatio;
          _this.drawingHeight = newPixelHeight * _this.pixelRatio;
          if (_this.canvas.width !== _this.drawingWidth || _this.canvas.height !== _this.drawingHeight) {
            _this.canvas.width = _this.drawingWidth;
            _this.canvas.height = _this.drawingHeight;
            console.debug && console.debug("Resize: [" + _this.drawingWidth + ", " + _this.drawingHeight + "] = " + _this.pixelRatio + " x [" + _this.pixelWidth + ", " + _this.pixelHeight + "]");
            _this.viewport({
              width: _this.drawingWidth,
              height: _this.drawingHeight,
              ratio: _this.pixelRatio
            });
          }
        }
        var last = _this._lastFrameTime || now;
        var elapsed = now - last;
        if (!_this.mounted || _this.paused || _this.sleep) {
          return;
        }
        _this._lastFrameTime = now;
        _this.prerender();
        var tickRequest = _this._tick(elapsed, now, last);
        if (_this._mo_touch != _this._ts_touch) {
          _this._mo_touch = _this._ts_touch;
          _this.sleep = false;
          if (_this.drawingWidth > 0 && _this.drawingHeight > 0) {
            _this.context.setTransform(1, 0, 0, 1, 0, 0);
            _this.context.clearRect(0, 0, _this.drawingWidth, _this.drawingHeight);
            if (_this.debugDrawAxis > 0) {
              _this.renderDebug(_this.context);
            }
            _this.render(_this.context);
          }
        } else if (tickRequest) {
          _this.sleep = false;
        } else {
          _this.sleep = true;
        }
        stats.fps = elapsed ? 1e3 / elapsed : 0;
      };
      _this.debugDrawAxis = 0;
      _this.label("Root");
      return _this;
    }
    Root2.prototype.renderDebug = function(context) {
      var size = typeof this.debugDrawAxis === "number" ? this.debugDrawAxis : 10;
      var m = this.matrix();
      context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
      var lineWidth = 3 / m.a;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, 0.8 * size);
      context.lineTo(-0.2 * size, 0.8 * size);
      context.lineTo(0, size);
      context.lineTo(0.2 * size, 0.8 * size);
      context.lineTo(0, 0.8 * size);
      context.strokeStyle = "rgba(93, 173, 226)";
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = lineWidth;
      context.stroke();
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0.8 * size, 0);
      context.lineTo(0.8 * size, -0.2 * size);
      context.lineTo(size, 0);
      context.lineTo(0.8 * size, 0.2 * size);
      context.lineTo(0.8 * size, 0);
      context.strokeStyle = "rgba(236, 112, 99)";
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = lineWidth;
      context.stroke();
    };
    Root2.prototype.resume = function() {
      if (this.sleep || this.paused) {
        this.requestFrame();
      }
      this.paused = false;
      this.sleep = false;
      this.publish("resume");
      return this;
    };
    Root2.prototype.pause = function() {
      if (!this.paused) {
        this.publish("pause");
      }
      this.paused = true;
      return this;
    };
    Root2.prototype.touch = function() {
      if (this.sleep || this.paused) {
        this.requestFrame();
      }
      this.sleep = false;
      return _super.prototype.touch.call(this);
    };
    Root2.prototype.unmount = function() {
      var _a;
      this.mounted = false;
      var index = ROOTS.indexOf(this);
      if (index >= 0) {
        ROOTS.splice(index, 1);
      }
      (_a = this.pointer) === null || _a === void 0 ? void 0 : _a.unmount();
      return this;
    };
    Root2.prototype.background = function(color) {
      if (this.dom) {
        this.dom.style.backgroundColor = color;
      }
      return this;
    };
    Root2.prototype.viewport = function(width, height, ratio) {
      if (typeof width === "undefined") {
        return Object.assign({}, this._viewport);
      }
      if (typeof width === "object") {
        var options = width;
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
        var data_1 = Object.assign({}, this._viewport);
        this.visit({
          start: function(component2) {
            if (!component2._flag("viewport")) {
              return true;
            }
            component2.publish("viewport", [data_1]);
          }
        });
      }
      return this;
    };
    Root2.prototype.viewbox = function(width, height, mode) {
      if (typeof width === "number" && typeof height === "number") {
        this._viewbox = {
          width,
          height,
          mode
        };
      } else if (typeof width === "object" && width !== null) {
        this._viewbox = __assign({}, width);
      }
      this.rescale();
      return this;
    };
    Root2.prototype.camera = function(matrix) {
      this._camera = matrix;
      this.rescale();
      return this;
    };
    Root2.prototype.rescale = function() {
      var viewbox = this._viewbox;
      var viewport = this._viewport;
      var camera = this._camera;
      if (viewport && viewbox) {
        var viewportWidth = viewport.width;
        var viewportHeight = viewport.height;
        var viewboxMode = isValidFitMode(viewbox.mode) ? viewbox.mode : "in-pad";
        var viewboxWidth = viewbox.width;
        var viewboxHeight = viewbox.height;
        this.pin({
          width: viewboxWidth,
          height: viewboxHeight
        });
        this.fit(viewportWidth, viewportHeight, viewboxMode);
        var viewboxX = viewbox.x || 0;
        var viewboxY = viewbox.y || 0;
        var cameraZoomX = (camera === null || camera === void 0 ? void 0 : camera.a) || 1;
        var cameraZoomY = (camera === null || camera === void 0 ? void 0 : camera.d) || 1;
        var cameraX = (camera === null || camera === void 0 ? void 0 : camera.e) || 0;
        var cameraY = (camera === null || camera === void 0 ? void 0 : camera.f) || 0;
        var scaleX = this.pin("scaleX");
        var scaleY = this.pin("scaleY");
        this.pin("scaleX", scaleX * cameraZoomX);
        this.pin("scaleY", scaleY * cameraZoomY);
        this.pin("offsetX", cameraX - viewboxX * scaleX * cameraZoomX);
        this.pin("offsetY", cameraY - viewboxY * scaleY * cameraZoomY);
      } else if (viewport) {
        this.pin({
          width: viewport.width,
          height: viewport.height
        });
      }
      return this;
    };
    Root2.prototype.flipX = function(x) {
      this._pin._directionX = x ? -1 : 1;
      return this;
    };
    Root2.prototype.flipY = function(y) {
      this._pin._directionY = y ? -1 : 1;
      return this;
    };
    return Root2;
  }(Component)
);
function anim(frames, fps) {
  var anim2 = new Anim();
  anim2.frames(frames).gotoFrame(0);
  fps && anim2.fps(fps);
  return anim2;
}
var FPS = 15;
var Anim = (
  /** @class */
  function(_super) {
    __extends(Anim2, _super);
    function Anim2() {
      var _this = _super.call(this) || this;
      _this._texture = null;
      _this._frames = [];
      _this._time = -1;
      _this._repeat = 0;
      _this._index = 0;
      _this._animTickLastTime = 0;
      _this._animTick = function(t, now, last) {
        if (_this._time < 0 || _this._frames.length <= 1) {
          return;
        }
        var ignore = _this._animTickLastTime != last;
        _this._animTickLastTime = now;
        if (ignore) {
          return true;
        }
        _this._time += t;
        if (_this._time < _this._ft) {
          return true;
        }
        var n = _this._time / _this._ft | 0;
        _this._time -= n * _this._ft;
        _this.moveFrame(n);
        if (_this._repeat > 0 && (_this._repeat -= n) <= 0) {
          _this.stop();
          _this._callback && _this._callback();
          return false;
        }
        return true;
      };
      _this.label("Anim");
      _this._fps = FPS;
      _this._ft = 1e3 / _this._fps;
      _this.tick(_this._animTick, false);
      return _this;
    }
    Anim2.prototype.renderTexture = function(context) {
      if (!this._texture)
        return;
      this._texture.draw(context);
    };
    Anim2.prototype.fps = function(fps) {
      if (typeof fps === "undefined") {
        return this._fps;
      }
      this._fps = fps > 0 ? fps : FPS;
      this._ft = 1e3 / this._fps;
      return this;
    };
    Anim2.prototype.setFrames = function(frames) {
      return this.frames(frames);
    };
    Anim2.prototype.frames = function(frames) {
      this._index = 0;
      this._frames = texture(frames).array();
      this.touch();
      return this;
    };
    Anim2.prototype.length = function() {
      return this._frames ? this._frames.length : 0;
    };
    Anim2.prototype.gotoFrame = function(frame, resize) {
      if (resize === void 0) {
        resize = false;
      }
      this._index = math.wrap(frame, this._frames.length) | 0;
      resize = resize || !this._texture;
      this._texture = this._frames[this._index];
      if (resize) {
        this.pin("width", this._texture.getWidth());
        this.pin("height", this._texture.getHeight());
      }
      this.touch();
      return this;
    };
    Anim2.prototype.moveFrame = function(move) {
      return this.gotoFrame(this._index + move);
    };
    Anim2.prototype.repeat = function(repeat, callback) {
      this._repeat = repeat * this._frames.length - 1;
      this._callback = callback;
      this.play();
      return this;
    };
    Anim2.prototype.play = function(frame) {
      if (typeof frame !== "undefined") {
        this.gotoFrame(frame);
        this._time = 0;
      } else if (this._time < 0) {
        this._time = 0;
      }
      this.touch();
      return this;
    };
    Anim2.prototype.stop = function(frame) {
      this._time = -1;
      if (typeof frame !== "undefined") {
        this.gotoFrame(frame);
      }
      return this;
    };
    return Anim2;
  }(Component)
);
function monotype(chars) {
  return new Monotype().frames(chars);
}
var Monotype = (
  /** @class */
  function(_super) {
    __extends(Monotype2, _super);
    function Monotype2() {
      var _this = _super.call(this) || this;
      _this._textures = [];
      _this.label("Monotype");
      return _this;
    }
    Monotype2.prototype.renderTexture = function(context) {
      if (!this._textures || !this._textures.length)
        return;
      for (var i = 0, n = this._textures.length; i < n; i++) {
        this._textures[i].draw(context);
      }
    };
    Monotype2.prototype.setFont = function(frames) {
      return this.frames(frames);
    };
    Monotype2.prototype.frames = function(frames) {
      this._textures = [];
      if (typeof frames == "string") {
        var selection_1 = texture(frames);
        this._font = function(value) {
          return selection_1.one(value);
        };
      } else if (typeof frames === "object") {
        this._font = function(value) {
          return frames[value];
        };
      } else if (typeof frames === "function") {
        this._font = frames;
      }
      return this;
    };
    Monotype2.prototype.setValue = function(value) {
      return this.value(value);
    };
    Monotype2.prototype.value = function(value) {
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
      var width = 0;
      var height = 0;
      for (var i = 0; i < value.length; i++) {
        var v = value[i];
        var texture_1 = this._textures[i] = this._font(typeof v === "string" ? v : v + "");
        width += i > 0 ? this._spacing : 0;
        texture_1.setDestinationCoordinate(width, 0);
        width = width + texture_1.getWidth();
        height = Math.max(height, texture_1.getHeight());
      }
      this.pin("width", width);
      this.pin("height", height);
      this._textures.length = value.length;
      return this;
    };
    return Monotype2;
  }(Component)
);
const Stage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Anim,
  Atlas,
  CanvasTexture,
  Component,
  Image: Sprite,
  ImageTexture,
  Math: math,
  Matrix,
  Monotype,
  Mouse,
  Node: Component,
  POINTER_CANCEL,
  POINTER_CLICK,
  POINTER_DOWN,
  POINTER_END,
  POINTER_MOVE,
  POINTER_START,
  POINTER_UP,
  Pin,
  PipeTexture,
  Pointer,
  ResizableTexture,
  Root,
  Sprite,
  Str: Monotype,
  Texture,
  TextureSelection,
  Transition,
  anim,
  atlas,
  box,
  canvas,
  clamp,
  column,
  component,
  create,
  image: sprite,
  isValidFitMode,
  layer,
  layout,
  length,
  math,
  maximize,
  memoizeDraw,
  minimize,
  monotype,
  mount,
  pause,
  random,
  resume,
  row,
  sprite,
  string: monotype,
  texture,
  wrap
}, Symbol.toStringTag, { value: "Module" }));
export {
  Anim,
  Atlas,
  CanvasTexture,
  Component,
  Sprite as Image,
  ImageTexture,
  math as Math,
  Matrix,
  Monotype,
  Mouse,
  Component as Node,
  POINTER_CANCEL,
  POINTER_CLICK,
  POINTER_DOWN,
  POINTER_END,
  POINTER_MOVE,
  POINTER_START,
  POINTER_UP,
  Pin,
  PipeTexture,
  Pointer,
  ResizableTexture,
  Root,
  Sprite,
  Monotype as Str,
  Texture,
  TextureSelection,
  Transition,
  anim,
  atlas,
  box,
  canvas,
  clamp,
  column,
  component,
  create,
  Stage as default,
  sprite as image,
  isValidFitMode,
  layer,
  layout,
  length,
  math,
  maximize,
  memoizeDraw,
  minimize,
  monotype,
  mount,
  pause,
  random,
  resume,
  row,
  sprite,
  monotype as string,
  texture,
  wrap
};
//# sourceMappingURL=stage.js.map
