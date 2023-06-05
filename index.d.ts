export default Stage;

type AppDefinition = (root: Stage, canvas: Element) => void;

interface TextureDefinition {
}

type ImageType = HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | VideoFrame;

type Ticker = (t: number, dt: number) => boolean | void

type Plotter = (context: CanvasRenderingContext2D) => void;

interface Visitor<D> {
  start(child: Stage, data: D): boolean | void;
  end(child: Stage, data: D): boolean | void;
  reverse: boolean;
  visible: boolean;
}

export class Stage {
  constructor();
  constructor(app: AppDefinition);
  constructor(texture: TextureDefinition);

  static app(app: (root: Stage) => void, opts: object): void;
  static atlas(def: TextureDefinition): Texture;

  static config(key: string, value: any): void;
  static config(map: Record<string, any>): void;
  static config(key: string): any;

  static preload(load: (done: () => void) => void): void;
  static start(config: Record<string, any>): void;
  static pause(): void;
  static resume(): void;

  static root(
    request: (loop: (time: number) => void) => void,
    render: (root: Stage) => void,
  ): Stage;

  render(context: CanvasRenderingContext2D): void;
  touch(): Stage;
  toString(): string;

  appendTo(parent: Stage): Stage;
  prependTo(parent: Stage): Stage;

  append(child: Stage | Stage[]): Stage;
  prepend(child: Stage | Stage[]): Stage;

  insertNext(sibling: Stage, child: Stage | Stage[]): Stage;
  insertPrev(sibling: Stage, child: Stage | Stage[]): Stage;

  insertAfter(sibling: Stage): Stage;
  insertBefore(sibling: Stage): Stage;

  remove(child: Stage | Stage[]): Stage;
  remove(): Stage;
  empty(): Stage;

  parent(): Stage;

  first(visible?: boolean): Stage;
  last(visible?: boolean): Stage;

  next(visible?: boolean): Stage;
  prev(visible?: boolean): Stage;

  visible(): boolean;
  visible(visible: boolean): Stage;
  hide(): Stage;
  show(): Stage;
  visit<D>(visitor: Visitor<D>, data: D): boolean | void;

  tick(ticker: Ticker, before?: boolean): void;
  untick(ticker: Ticker): void;

  pin(a: string, b: any): Stage;
  pin(a: string): any;

  pin(a: Record<string, any>): Stage;
  pin(): Record<string, any>;

  size(w: number, h: number): Stage;
  width(w: number): Stage;
  height(h: number): Stage;
  scale(a: number, b: number): Stage;
  skew(a: number, b: number): Stage;
  rotate(a: number): Stage;
  offset(a: number, b: number): Stage;

  scaleTo(a: number, b: number, mode: string): Stage;

  padding(pad: number): Stage;
  spacing(space: number): Stage;

  alpha(a: number, ta: number): Stage;

  matrix(relative?: boolean): Stage.Matrix;

  tween(duration: number, delay: number, append: boolean): Stage.Tween;
  tween(duration: number, append: boolean): Stage.Tween;
  tween(append: boolean): Stage.Tween;

  on(type: string, listener: (...args: unknown[]) => void): Stage;
  off(type: string, listener: (...args: unknown[]) => void): Stage;
  publish(name: string, ...args: unknown[]): number;
  listeners(type: string): unknown[];

  id(): string;
  id(id: string): Stage;

  label(): string;
  label(label: string): Stage;

  attr(name: string): unknown;
  attr(name: string, value: unknown): Stage;

  static create(): Stage;

  static box(): Stage;
  box(): Stage;

  static column(align: number): Stage;
  column(align: number): Stage;

  static layer(): Stage;
  layer(): Stage;

  static row(align: number): Stage;
  row(align: number): Stage;

  // static sequence(type: 'row' | 'column', align: number): Stage;
  // sequence(type: 'row' | 'column', align: number): Stage;

  static anim(frames: string | Stage.Texture[], fps: number): Stage;
  static string(frames: string | Stage.Texture[]): Stage;

  static canvas(): Stage;
  static canvas(plotter: Plotter): Stage;
  static canvas(type: string, attributes: Record<string, string>, plotter: Plotter): Stage;

  static texture(query: string): Stage.Texture | Stage.Texture[];

  static image(image?: ImageType): Stage.Image;

  timeout(fn: () => unknown, time: number): void;
  setTimeout(fn: () => unknown, time: number): any;
  clearTimeout(timer: any): void;

  hitTest(hit: { x: number, y: number }): boolean;

  static Anim: {
    FPS: number;
  };
}

export namespace Stage {
  class Tween {
  }

  class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a: number, b: number, c: number, d: number, e: number, f: number);
    clone(): Matrix;
    concat(m: Matrix): Matrix;
    identity(): Matrix;
    inverse(): Matrix;
    map(p: number, q: number): Matrix;
    mapX(x: number, y: number): Matrix;
    mapY(x: number, y: number): Matrix;
    reset(a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
    reverse(): Matrix;
    rotate(angle: number): Matrix;
    scale(x: number, y: number): Matrix;
    skew(x: number, y: number): Matrix;
    toString(): string;
    translate(x: number, y: number): Matrix;
  }

  class Texture {
    constructor();
    constructor(image: ImageType, ratio: number);

    src(image: ImageType, ratio: number): Texture;

    src(x: number, y: number): Texture;
    src(x: number, y: number, w: number, h: number): Texture;

    dest(x: number, y: number): Texture;
    dest(x: number, y: number, w: number, h: number): Texture;

    pipe(): Texture;

    draw(context: CanvasRenderingContext2D): void;
    draw(context: CanvasRenderingContext2D, dw: number, dh: number): void;
    draw(context: CanvasRenderingContext2D, dx: number, dy: number, dw: number, dh: number): void;
    draw(context: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  }

  interface Mouse {
    CANCEL: string;
    CLICK: string;
    END: string;
    MOVE: string;
    START: string;
    subscribe(stage: Stage, elem: Element): void;
  }

  class Image extends Stage {
    constructor(texture: Texture);
    image(texture: Texture): Image;
    stretch(inner: any): Image;
    tile(inner: any): Image;
  }

  interface Math {
    random(min: number, max: number): number;
    rotate(num: number, min: number, max: number): number;
    length(x: number, y: number): number;
    limit(num: number, min: number, max: number): number;
  }
}
