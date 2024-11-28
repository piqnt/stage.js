import stats from "../common/stats";
import { clamp } from "../common/math";

import { Texture, TexturePrerenderContext } from "./texture";

type TextureImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

export class ImageTexture extends Texture {
  /** @internal */ _source: TextureImageSource;

  /** @internal */ _pixelRatio = 1;

  /** @internal */ _draw_failed: boolean;

  /** @internal */
  private padding = 0;

  constructor(source?: TextureImageSource, pixelRatio?: number) {
    super();
    if (typeof source === "object") {
      this.setSourceImage(source, pixelRatio);
    }
  }

  setSourceImage(image: TextureImageSource, pixelRatio = 1) {
    this._source = image;
    this._pixelRatio = pixelRatio;
  }

  /**
   * Add padding to the image texture. Padding can be negative.
   */
  setPadding(padding: number): void {
    this.padding = padding;
  }

  getWidth(): number {
    return this._source.width / this._pixelRatio + (this.padding + this.padding);
  }

  getHeight(): number {
    return this._source.height / this._pixelRatio + (this.padding + this.padding);
  }

  /** @internal */
  prerender(context: TexturePrerenderContext): boolean {
    return false;
  }

  /** @internal */
  drawWithNormalizedArgs(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    const image = this._source;
    if (image === null || typeof image !== "object") {
      return;
    }

    sw = sw ?? this._source.width / this._pixelRatio;
    sh = sh ?? this._source.height / this._pixelRatio;

    dw = dw ?? sw;
    dh = dh ?? sh;

    dx += this.padding;
    dy += this.padding;

    const ix = sx * this._pixelRatio;
    const iy = sy * this._pixelRatio;
    const iw = sw * this._pixelRatio;
    const ih = sh * this._pixelRatio;

    try {
      stats.draw++;

      // sx = clamp(sx, 0, this._source.width);
      // sy = clamp(sx, 0, this._source.height);
      // sw = clamp(sw, 0, this._source.width - sw);
      // sh = clamp(sh, 0, this._source.height - sh);

      context.drawImage(image, ix, iy, iw, ih, dx, dy, dw, dh);
    } catch (ex) {
      if (!this._draw_failed) {
        console.log("Unable to draw: ", image);
        console.log(ex);
        this._draw_failed = true;
      }
    }
  }
}
