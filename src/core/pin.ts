import { Matrix, Vec2Value } from "../common/matrix";
import { uid } from "../common/uid";

import type { Component } from "./component";

/**
 *  @hidden @deprecated
 * - 'in-pad': same as 'contain'
 * - 'in': similar to 'contain' without centering
 * - 'out-crop': same as 'cover'
 * - 'out': similar to 'cover' without centering
 */
export type LegacyFitMode = "in" | "out" | "out-crop" | "in-pad";

/**
 * - 'contain': contain within the provided space, maintain aspect ratio
 * - 'cover': cover the provided space, maintain aspect ratio
 * - 'fill': fill provided space without maintaining aspect ratio
 */
export type FitMode = "contain" | "cover" | "fill" | LegacyFitMode;

/** @internal */
export function isValidFitMode(value: string) {
  return (
    value &&
    (value === "cover" ||
      value === "contain" ||
      value === "fill" ||
      value === "in" ||
      value === "in-pad" ||
      value === "out" ||
      value === "out-crop")
  );
}

/** @internal */ let iid = 0;

/** @hidden */
export interface Pinned {
  pin(pin: object): this;
  pin(key: string, value: any): this;
  pin(key: string): any;

  size(w: number, h: number): this;

  width(): number;
  width(w: number): this;

  height(): number;
  height(h: number): this;

  offset(a: Vec2Value): this;
  offset(a: number, b: number): this;

  rotate(a: number): this;

  skew(a: Vec2Value): this;
  skew(a: number, b: number): this;

  scale(a: Vec2Value): this;
  scale(a: number, b: number): this;

  alpha(a: number, ta?: number): this;
}

export class Pin {
  /** @internal */ uid = "pin:" + uid();

  /** @internal */ _owner: Component;

  // todo: maybe this should be a getter instead?
  /** @internal */ _parent: Pin | null;

  /** @internal */ _relativeMatrix: Matrix;
  /** @internal */ _absoluteMatrix: Matrix;

  /** @internal */ _x: number;
  /** @internal */ _y: number;

  /** @internal */ _unscaled_width: number;
  /** @internal */ _unscaled_height: number;

  /** @internal */ _width: number;
  /** @internal */ _height: number;

  /** @internal */ _textureAlpha: number;
  /** @internal */ _alpha: number;

  /** @internal */ _scaleX: number;
  /** @internal */ _scaleY: number;

  /** @internal */ _skewX: number;
  /** @internal */ _skewY: number;
  /** @internal */ _rotation: number;

  /** @internal */ _pivoted: boolean;
  /** @internal */ _pivotX: number;
  /** @internal */ _pivotY: number;

  /** @internal */ _handled: boolean;
  /** @internal */ _handleX: number;
  /** @internal */ _handleY: number;

  /** @internal */ _aligned: boolean;
  /** @internal */ _alignX: number;
  /** @internal */ _alignY: number;

  /** @internal */ _offsetX: number;
  /** @internal */ _offsetY: number;

  /** @internal */ _boxX: number;
  /** @internal */ _boxY: number;
  /** @internal */ _boxWidth: number;
  /** @internal */ _boxHeight: number;

  /** @internal */ _ts_transform: number;
  /** @internal */ _ts_translate: number;
  /** @internal */ _ts_matrix: number;

  /** @internal */ _mo_handle: number;
  /** @internal */ _mo_align: number;
  /** @internal */ _mo_abs: number;
  /** @internal */ _mo_rel: number;

  /** @internal */ _directionX = 1;
  /** @internal */ _directionY = 1;

  /** @internal */
  constructor(owner: Component) {
    this._owner = owner;
    this._parent = null;

    // relative to parent
    this._relativeMatrix = new Matrix();

    // relative to stage
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

    // scale/skew/rotate center
    this._pivoted = false;
    // todo: this used to be null
    this._pivotX = 0;
    this._pivotY = 0;

    // self pin point
    this._handled = false;
    this._handleX = 0;
    this._handleY = 0;

    // parent pin point
    this._aligned = false;
    this._alignX = 0;
    this._alignY = 0;

    // as seen by parent px
    this._offsetX = 0;
    this._offsetY = 0;

    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;

    // TODO: also set for owner
    this._ts_translate = ++iid;
    this._ts_transform = ++iid;
    this._ts_matrix = ++iid;
  }

  /** @internal */
  _update() {
    this._parent = this._owner._parent && this._owner._parent._pin;

    // if handled and transformed then be translated
    if (this._handled && this._mo_handle != this._ts_transform) {
      this._mo_handle = this._ts_transform;
      this._ts_translate = ++iid;
    }

    if (this._aligned && this._parent && this._mo_align != this._parent._ts_transform) {
      this._mo_align = this._parent._ts_transform;
      this._ts_translate = ++iid;
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
      this._parent ? this._parent._ts_matrix : 0,
    );
    if (this._mo_abs == ts) {
      return this._absoluteMatrix;
    }
    this._mo_abs = ts;

    const abs = this._absoluteMatrix;
    abs.reset(this.relativeMatrix());

    this._parent && abs.concat(this._parent._absoluteMatrix);

    this._ts_matrix = ++iid;

    return abs;
  }

  relativeMatrix() {
    this._update();
    const ts = Math.max(
      this._ts_transform,
      this._ts_translate,
      this._parent ? this._parent._ts_transform : 0,
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
    rel.scale(this._scaleX * this._directionX, this._scaleY * this._directionY);
    rel.skew(this._skewX, this._skewY);
    rel.rotate(this._rotation);
    if (this._pivoted) {
      rel.translate(this._pivotX * this._width, this._pivotY * this._height);
    }

    // calculate effective box
    if (this._pivoted) {
      // origin
      this._boxX = 0;
      this._boxY = 0;
      this._boxWidth = this._width;
      this._boxHeight = this._height;
    } else {
      // aabb
      let p;
      let q;
      if ((rel.a > 0 && rel.c > 0) || (rel.a < 0 && rel.c < 0)) {
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
      if ((rel.b > 0 && rel.d > 0) || (rel.b < 0 && rel.d < 0)) {
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
  }

  /** @internal */
  get(key: string) {
    if (typeof getters[key] === "function") {
      return getters[key](this);
    }
  }

  // TODO: Use defineProperty instead? What about multi-field pinning?
  /** @internal */
  set(a, b?) {
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
  }

  // todo: should this be public?
  /** @internal */
  fit(width: number | null, height: number | null, mode?: FitMode) {
    this._ts_transform = ++iid;
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
      if (mode === "fill") {
      } else if (mode === "out" || mode === "out-crop") {
        this._scaleX = this._scaleY = Math.max(this._scaleX, this._scaleY);
      } else if (mode === "in" || mode === "in-pad") {
        this._scaleX = this._scaleY = Math.min(this._scaleX, this._scaleY);
      }
      if (mode === "out-crop" || mode === "in-pad") {
        this._width = width / this._scaleX;
        this._height = height / this._scaleY;
      }
    }
  }
}

/** @internal */ const getters = {
  alpha: function (pin: Pin) {
    return pin._alpha;
  },

  textureAlpha: function (pin: Pin) {
    return pin._textureAlpha;
  },

  width: function (pin: Pin) {
    return pin._width;
  },

  height: function (pin: Pin) {
    return pin._height;
  },

  boxWidth: function (pin: Pin) {
    return pin._boxWidth;
  },

  boxHeight: function (pin: Pin) {
    return pin._boxHeight;
  },

  // scale : function(pin: Pin) {
  // },

  scaleX: function (pin: Pin) {
    return pin._scaleX;
  },

  scaleY: function (pin: Pin) {
    return pin._scaleY;
  },

  // skew : function(pin: Pin) {
  // },

  skewX: function (pin: Pin) {
    return pin._skewX;
  },

  skewY: function (pin: Pin) {
    return pin._skewY;
  },

  rotation: function (pin: Pin) {
    return pin._rotation;
  },

  // pivot : function(pin: Pin) {
  // },

  pivotX: function (pin: Pin) {
    return pin._pivotX;
  },

  pivotY: function (pin: Pin) {
    return pin._pivotY;
  },

  // offset : function(pin: Pin) {
  // },

  offsetX: function (pin: Pin) {
    return pin._offsetX;
  },

  offsetY: function (pin: Pin) {
    return pin._offsetY;
  },

  // align : function(pin: Pin) {
  // },

  alignX: function (pin: Pin) {
    return pin._alignX;
  },

  alignY: function (pin: Pin) {
    return pin._alignY;
  },

  // handle : function(pin: Pin) {
  // },

  handleX: function (pin: Pin) {
    return pin._handleX;
  },

  handleY: function (pin: Pin) {
    return pin._handleY;
  },
};

type ResizeParams = {
  resizeMode: FitMode;
  resizeWidth: number;
  resizeHeight: number;
};

type ScaleParams = {
  scaleMode: FitMode;
  scaleWidth: number;
  scaleHeight: number;
};

/** @internal */ const setters = {
  alpha: function (pin: Pin, value: number) {
    pin._alpha = value;
  },

  textureAlpha: function (pin: Pin, value: number) {
    pin._textureAlpha = value;
  },

  width: function (pin: Pin, value: number) {
    pin._unscaled_width = value;
    pin._width = value;
    pin._ts_transform = ++iid;
  },

  height: function (pin: Pin, value: number) {
    pin._unscaled_height = value;
    pin._height = value;
    pin._ts_transform = ++iid;
  },

  scale: function (pin: Pin, value: number) {
    pin._scaleX = value;
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },

  scaleX: function (pin: Pin, value: number) {
    pin._scaleX = value;
    pin._ts_transform = ++iid;
  },

  scaleY: function (pin: Pin, value: number) {
    pin._scaleY = value;
    pin._ts_transform = ++iid;
  },

  skew: function (pin: Pin, value: number) {
    pin._skewX = value;
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },

  skewX: function (pin: Pin, value: number) {
    pin._skewX = value;
    pin._ts_transform = ++iid;
  },

  skewY: function (pin: Pin, value: number) {
    pin._skewY = value;
    pin._ts_transform = ++iid;
  },

  rotation: function (pin: Pin, value: number) {
    pin._rotation = value;
    pin._ts_transform = ++iid;
  },

  pivot: function (pin: Pin, value: number) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  pivotX: function (pin: Pin, value: number) {
    pin._pivotX = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  pivotY: function (pin: Pin, value: number) {
    pin._pivotY = value;
    pin._pivoted = true;
    pin._ts_transform = ++iid;
  },

  offset: function (pin: Pin, value: number) {
    pin._offsetX = value;
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },

  offsetX: function (pin: Pin, value: number) {
    pin._offsetX = value;
    pin._ts_translate = ++iid;
  },

  offsetY: function (pin: Pin, value: number) {
    pin._offsetY = value;
    pin._ts_translate = ++iid;
  },

  align: function (pin: Pin, value: number) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },

  alignX: function (pin: Pin, value: number) {
    pin._alignX = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;

    this.handleX(pin, value);
  },

  alignY: function (pin: Pin, value: number) {
    pin._alignY = value;
    pin._aligned = true;
    pin._ts_translate = ++iid;

    this.handleY(pin, value);
  },

  handle: function (pin: Pin, value: number) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },

  handleX: function (pin: Pin, value: number) {
    pin._handleX = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
  },

  handleY: function (pin: Pin, value: number) {
    pin._handleY = value;
    pin._handled = true;
    pin._ts_translate = ++iid;
  },

  resizeMode: function (pin: Pin, value: FitMode, all: ResizeParams) {
    if (all) {
      if (value == "in") {
        value = "in-pad";
      } else if (value == "out") {
        value = "out-crop";
      }
      pin.fit(all.resizeWidth, all.resizeHeight, value);
    }
  },

  resizeWidth: function (pin: Pin, value: number, all: ResizeParams) {
    if (!all || !all.resizeMode) {
      pin.fit(value, null);
    }
  },

  resizeHeight: function (pin: Pin, value: number, all: ResizeParams) {
    if (!all || !all.resizeMode) {
      pin.fit(null, value);
    }
  },

  scaleMode: function (pin: Pin, value: FitMode, all: ScaleParams) {
    if (all) {
      pin.fit(all.scaleWidth, all.scaleHeight, value);
    }
  },

  scaleWidth: function (pin: Pin, value: number, all: ScaleParams) {
    if (!all || !all.scaleMode) {
      pin.fit(value, null);
    }
  },

  scaleHeight: function (pin: Pin, value: number, all: ScaleParams) {
    if (!all || !all.scaleMode) {
      pin.fit(null, value);
    }
  },

  matrix: function (pin: Pin, value: Matrix) {
    this.scaleX(pin, value.a);
    this.skewX(pin, value.c / value.d);
    this.skewY(pin, value.b / value.a);
    this.scaleY(pin, value.d);
    this.offsetX(pin, value.e);
    this.offsetY(pin, value.f);
    this.rotation(pin, 0);
  },
};
