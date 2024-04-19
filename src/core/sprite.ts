import { texture, Texture, TexturePrerenderContext, TextureSelectionInput } from "../texture";

import { Node } from "./core";
import { getPixelRatio } from "./root";

export const sprite = function (frame?: TextureSelectionInput) {
  const sprite = new Sprite();
  frame && sprite.texture(frame);
  return sprite;
};

export class Sprite extends Node {
  /** @internal */ _image: Texture | null;

  // todo: override tick function instead
  /** @internal */ _repeatTicker: () => void;
  /** @internal */ _mo_stretch: number;

  constructor() {
    super();
    this.label("Sprite");
    this._textures = [];
    this._image = null;
  }

  texture(frame: TextureSelectionInput) {
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
  image(frame: TextureSelectionInput) {
    return this.texture(frame);
  }

  tile(inner: boolean) {
    this._repeat(false, inner);
    return this;
  }

  stretch(inner: boolean) {
    this._repeat(true, inner);
    return this;
  }

  /** @internal */
  _repeat(stretch: boolean, inner: boolean) {
    const insert = (
      i: number,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number,
    ) => {
      if (!this._image) {
        return;
      }
      const repeat =
        this._textures.length > i ? this._textures[i] : (this._textures[i] = this._image.pipe());
      repeat.setSourceCoordinate(sx, sy);
      repeat.setSourceDimension(sw, sh);
      repeat.setDestinationCoordinate(dx, dy);
      repeat.setDestinationDimension(dw, dh);
    };

    this.untick(this._repeatTicker);
    this.tick(
      (this._repeatTicker = () => {
        if (this._mo_stretch == this._pin._ts_transform) {
          return;
        }
        this._mo_stretch = this._pin._ts_transform;
        const width = this.pin("width");
        const height = this.pin("height");
        this._textures.length = repeat(this._image, width, height, stretch, inner, insert);
      }),
    );
  }

  /** @internal */
  private prerenderContext = {} as TexturePrerenderContext;

  prerender(): void {
    if (!this._visible) {
      return;
    }

    // if (!this._parent) {
    //   return;
    // }

    if (this._image) {
      // todo: parent matrix is not available in the first call
      const m = this._parent?.matrix();
      // todo: why "divide by" pixel ratio
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

/** @internal */
function repeat(
  img: Texture,
  owidth: number,
  oheight: number,
  stretch: boolean,
  inner: boolean,
  insert: (
    i: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) => void,
) {
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
      bottom,
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
    // center
    insert(i++, left, top, width, height, left, top, owidth, oheight);
  } else {
    // tile
    let l = left;
    let r = owidth;
    let w: number;
    while (r > 0) {
      w = Math.min(width, r);
      r -= width;
      let t = top;
      let b = oheight;
      let h: number;
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

/** @hidden @deprecated @internal */
export const image = sprite;
/** @hidden @deprecated @internal */
export const Image = Sprite;
