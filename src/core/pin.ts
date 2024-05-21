import { Matrix, Vec2Value } from "../common/matrix";
import { Memo } from "../common/memo";
import { uid } from "../common/uid";

import { Component } from "./component";

/**
 * @deprecated
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

  /** @internal */ _matrix: Matrix;

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

  /** @internal */ _handleX: number;
  /** @internal */ _handleY: number;

  /** @internal */ _alignX: number;
  /** @internal */ _alignY: number;

  /** @internal */ _offsetX: number;
  /** @internal */ _offsetY: number;

  /** @internal */ _boxX: number;
  /** @internal */ _boxY: number;
  /** @internal */ _boxWidth: number;
  /** @internal */ _boxHeight: number;

  /** @internal */ _padding: number;
  /** @internal */ _spacing: number;

  /** @internal */ _memo_handle = Memo.init();
  /** @internal */ _memo_align = Memo.init();
  /** @internal */ _memo_abs = Memo.init();
  /** @internal */ _memo_rel = Memo.init();

  /** @internal */
  constructor(owner: Component) {
    this._owner = owner;

    // relative to parent
    this._matrix = new Matrix();

    this.reset();
  }

  /** @internal */
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
    this._handleX = 0;
    this._handleY = 0;

    // parent pin point
    this._alignX = 0;
    this._alignY = 0;

    // as seen by parent px
    this._offsetX = 0;
    this._offsetY = 0;

    this._boxX = 0;
    this._boxY = 0;
    this._boxWidth = this._width;
    this._boxHeight = this._height;

    this._padding = 0;
    this._spacing = 0;
  }

  toString() {
    return this.uid + " (" + this._owner + ")";
  }

  toMatrix() {
    const parent = this._owner?.parent();

    if (
      this._memo_rel.recall(
        this._pivotX,
        this._pivotY,
        this._scaleX,
        this._scaleY,
        this._rotation,
        this._skewX,
        this._skewY,
        this._width,
        this._height,
        this._offsetX,
        this._offsetY,
        this._handleX,
        this._handleY,
        this._alignX,
        this._alignY,
        parent?.getHeight(),
        parent?.getWidth(),
      )
    ) {
      return this._matrix;
    }

    const rel = this._matrix;

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

    let translateX = this._offsetX;
    let translateY = this._offsetY;

    translateX -= this._boxX + this._handleX * this._boxWidth;
    translateY -= this._boxY + this._handleY * this._boxHeight;

    if (parent && (this._alignX !== 0 || this._alignY !== 0)) {
      translateX += this._alignX * parent.getWidth();
      translateY += this._alignY * parent.getHeight();
    }

    rel.translate(translateX, translateY);

    return this._matrix;
  }

  /** @internal */
  get(key: string) {
    if (typeof getters[key] === "function") {
      const value = getters[key](this);
      return value;
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
      this._owner.touch();
    }
    return this;
  }

  // todo: should this be public?
  /** @internal */
  fit(width: number | null, height: number | null, mode?: FitMode) {
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

  padding: function (pin: Pin) {
    return pin._padding;
  },

  spacing: function (pin: Pin) {
    return pin._spacing;
  },
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
  },

  height: function (pin: Pin, value: number) {
    pin._unscaled_height = value;
    pin._height = value;
  },

  scale: function (pin: Pin, value: number) {
    pin._scaleX = value;
    pin._scaleY = value;
  },

  scaleX: function (pin: Pin, value: number) {
    pin._scaleX = value;
  },

  scaleY: function (pin: Pin, value: number) {
    pin._scaleY = value;
  },

  skew: function (pin: Pin, value: number) {
    pin._skewX = value;
    pin._skewY = value;
  },

  skewX: function (pin: Pin, value: number) {
    pin._skewX = value;
  },

  skewY: function (pin: Pin, value: number) {
    pin._skewY = value;
  },

  rotation: function (pin: Pin, value: number) {
    pin._rotation = value;
  },

  pivot: function (pin: Pin, value: number) {
    pin._pivotX = value;
    pin._pivotY = value;
    pin._pivoted = true;
  },

  pivotX: function (pin: Pin, value: number) {
    pin._pivotX = value;
    pin._pivoted = true;
  },

  pivotY: function (pin: Pin, value: number) {
    pin._pivotY = value;
    pin._pivoted = true;
  },

  offset: function (pin: Pin, value: number) {
    pin._offsetX = value;
    pin._offsetY = value;
  },

  offsetX: function (pin: Pin, value: number) {
    pin._offsetX = value;
  },

  offsetY: function (pin: Pin, value: number) {
    pin._offsetY = value;
  },

  align: function (pin: Pin, value: number) {
    this.alignX(pin, value);
    this.alignY(pin, value);
  },

  alignX: function (pin: Pin, value: number) {
    pin._alignX = value;

    this.handleX(pin, value);
  },

  alignY: function (pin: Pin, value: number) {
    pin._alignY = value;

    this.handleY(pin, value);
  },

  handle: function (pin: Pin, value: number) {
    this.handleX(pin, value);
    this.handleY(pin, value);
  },

  handleX: function (pin: Pin, value: number) {
    pin._handleX = value;
  },

  handleY: function (pin: Pin, value: number) {
    pin._handleY = value;
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

  padding: function (pin: Pin, value: number) {
    pin._padding = value;
  },

  spacing: function (pin: Pin, value: number) {
    pin._spacing = value;
  },
};
