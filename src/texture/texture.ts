import stats from "../common/stats";
import { clamp } from "../common/math";

export type TextureSource = Texture | CanvasImageSource;

/** @internal */
export interface TexturePrerenderContext {
  pixelRatio: number;
}

/**
 * Textures are used to clip and resize a drawable object, for example atlas sprites.
 */
export class Texture {
  /** @internal */ _source: TextureSource;

  /** @internal */ _pixelRatio: number;

  /** @internal */ _sx: number;
  /** @internal */ _sy: number;
  /** @internal */ _sw: number;
  /** @internal */ _sh: number;
  /** @internal */ _dx: number;
  /** @internal */ _dy: number;
  /** @internal */ _dw: number;
  /** @internal */ _dh: number;

  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;

  /** @internal */
  _draw_failed = false;

  constructor(source?: TextureSource, pixelRatio?: number) {
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
  prerender(context: TexturePrerenderContext): boolean {
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

  setSourceImage(image: TextureSource, pixelRatio = 1) {
    this._source = image;
    this._pixelRatio = pixelRatio;
    if (
      "width" in image &&
      "height" in image &&
      typeof image.width === "number" &&
      typeof image.height === "number"
    ) {
      const pixelWidth = image.width;
      const pixelHeight = image.height;
      const geoWidth = pixelWidth / pixelRatio;
      const geoHeight = pixelHeight / pixelRatio;
      this.setSourceCoordinate(0, 0);
      this.setSourceDimension(geoWidth, geoHeight);
      this.setDestinationCoordinate(0, 0);
      this.setDestinationDimension(geoWidth, geoHeight);
    }
  }

  // Geometrical values
  setSourceCoordinate(x: number, y: number) {
    this._sx = x;
    this._sy = y;
  }

  // Geometrical values
  setSourceDimension(w: number, h: number) {
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
  setDestinationCoordinate(x: number, y: number) {
    this._dx = x;
    this._dy = y;
  }

  // Geometrical values
  setDestinationDimension(w: number, h: number) {
    this._dw = w;
    this._dh = h;

    this.width = w;
    this.height = h;
  }

  /**
   * Signatures:
   * - (): This is used when a sprite draws its textures
   * - (sx, sy, sw, sh, dx, dy, dw, dh): This is used when a piped texture passes drawing to it backend.
   * - (dx, dy, dw, dh): I guess unused.
   *
   * Note: sx and sy are added to this._sx and this._sy.
   */
  draw(context: CanvasRenderingContext2D): void;
  draw(context: CanvasRenderingContext2D, x1: number, y1: number, w1: number, h1: number): void;
  draw(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
  ): void;
  draw(
    context: CanvasRenderingContext2D,
    x1?: number,
    y1?: number,
    w1?: number,
    h1?: number,
    x2?: number,
    y2?: number,
    w2?: number,
    h2?: number,
  ): void {
    let sx = this._sx;
    let sy = this._sy;
    let sw = this._sw;
    let sh = this._sh;

    let dx = this._dx;
    let dy = this._dy;
    let dw = this._dw;
    let dh = this._dh;

    if (
      typeof x1 === "number" &&
      typeof y1 === "number" &&
      typeof w1 === "number" &&
      typeof h1 === "number"
    ) {
      if (
        typeof x2 === "number" &&
        typeof y2 === "number" &&
        typeof w2 === "number" &&
        typeof h2 === "number"
      ) {
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
  draw0(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) {
    const drawable = this._source;
    if (drawable === null || typeof drawable !== "object") {
      return;
    }
    try {
      if ("draw" in drawable && typeof drawable.draw === "function") {
        drawable.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        stats.draw++;
        context.drawImage(drawable as CanvasImageSource, sx, sy, sw, sh, dx, dy, dw, dh);
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
