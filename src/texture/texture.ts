import { uid } from "../common/uid";

/** @internal */
export interface TexturePrerenderContext {
  pixelRatio: number;
}

// todo: unify 9-patch and padding?
// todo: prerender is used to get texture width and height, replace it with a function to only get width and height

// todo: add reusable shape textures

/**
 * Textures are used to clip and resize image objects.
 */
export abstract class Texture {
  /** @internal */ uid = "texture:" + uid();

  /** @hidden */ sx = 0;
  /** @hidden */ sy = 0;
  /** @hidden */ sw: number;
  /** @hidden */ sh: number;
  /** @hidden */ dx = 0;
  /** @hidden */ dy = 0;
  /** @hidden */ dw: number;
  /** @hidden */ dh: number;

  // 9-patch resizing specification
  // todo: rename to something more descriptive
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
   * Defer draw spec to texture config. This is used when a sprite draws its textures.
   */
  draw(context: CanvasRenderingContext2D): void;
  /**
   * This is probably unused.
   * Note: dx, dy are added to this.dx, this.dy.
   */
  draw(context: CanvasRenderingContext2D, dx: number, dy: number, dw: number, dh: number): void;
  /**
   * This is used when a piped texture passes drawing to it backend.
   * Note: sx, sy, dx, dy are added to this.sx, this.sy, this.dx, this.dy.
   */
  draw(
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
    let sx: number, sy: number, sw: number, sh: number;
    let dx: number, dy: number, dw: number, dh: number;

    if (arguments.length > 5) {
      // two sets of [x, y, w, h] arguments
      sx = this.sx + x1;
      sy = this.sy + y1;
      sw = w1 ?? this.sw;
      sh = h1 ?? this.sh;

      dx = this.dx + x2;
      dy = this.dy + y2;
      dw = w2 ?? this.dw;
      dh = h2 ?? this.dh;
    } else if(arguments.length > 1) {
      // one set of [x, y, w, h] arguments
      sx = this.sx;
      sy = this.sy;
      sw = this.sw;
      sh = this.sh;

      dx = this.dx + x1;
      dy = this.dy + y1;
      dw = w1 ?? this.dw;
      dh = h1 ?? this.dh;
    } else {
      // no additional arguments
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
