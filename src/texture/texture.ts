import { uid } from "../common/uid";

/** @internal */
export interface TexturePrerenderContext {
  pixelRatio: number;
}

/**
 * Textures are used to clip and resize image objects.
 */
export abstract class Texture {
  /** @internal */ uid = "texture:" + uid();

  /** @internal */ sx = 0;
  /** @internal */ sy = 0;
  /** @internal */ sw: number;
  /** @internal */ sh: number;
  /** @internal */ dx = 0;
  /** @internal */ dy = 0;
  /** @internal */ dw: number;
  /** @internal */ dh: number;

  // margins, used for resizing texture
  /** @internal */ top: number;
  /** @internal */ bottom: number;
  /** @internal */ left: number;
  /** @internal */ right: number;

  // Geometrical values
  setSourceCoordinate(x: number, y: number) {
    this.sx = x;
    this.sy = y;
  }

  // Geometrical values
  setSourceDimension(w: number, h: number) {
    this.sw = w;
    this.sh = h;
  }

  // Geometrical values
  setDestinationCoordinate(x: number, y: number) {
    this.dx = x;
    this.dy = y;
  }

  // Geometrical values
  setDestinationDimension(w: number, h: number) {
    this.dw = w;
    this.dh = h;
  }

  abstract getWidth(): number;

  abstract getHeight(): number;

  /**
   * @internal
   * This is used by subclasses, such as CanvasTexture, to rerender offscreen texture if needed.
   */
  abstract prerender(context: TexturePrerenderContext): boolean;

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
    let sx = this.sx;
    let sy = this.sy;
    let sw = this.sw;
    let sh = this.sh;

    let dx = this.dx;
    let dy = this.dy;
    let dw = this.dw;
    let dh = this.dh;

    if (
      typeof x1 === "number" ||
      typeof y1 === "number" ||
      typeof w1 === "number" ||
      typeof h1 === "number" ||
      typeof x2 === "number" ||
      typeof y2 === "number" ||
      typeof w2 === "number" ||
      typeof h2 === "number"
    ) {
      if (
        typeof x2 === "number" ||
        typeof y2 === "number" ||
        typeof w2 === "number" ||
        typeof h2 === "number"
      ) {
        // two sets of [x, y, w, h] arguments
        sx += x1;
        sy += y1;
        sw = w1 ?? sw;
        sh = h1 ?? sh;

        dx += x2;
        dy += y2;
        dw = w2 ?? dw;
        dh = h2 ?? dh;
      } else {
        // one set of [x, y, w, h] arguments
        dx += x1;
        dy += y1;
        dw = w1;
        dh = h1;
      }
    } else {
      // no additional arguments
    }

    this.drawWithNormalizedArgs(context, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  /** @internal */
  abstract drawWithNormalizedArgs(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void;
}
