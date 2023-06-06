export default Stage;

type AppDefinition = (root: Stage, canvas: Element) => void;

interface TextureDefinition {
}

type ImageType = HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;

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

  static app(app: (root: Stage) => void, opts: object): void;
  constructor(app: AppDefinition);

  constructor(texture: TextureDefinition);
  static atlas(def: TextureDefinition): Stage.Texture;

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
  ): Stage.Root;

  render(context: CanvasRenderingContext2D): void;
  touch(): this;
  toString(): string;

  appendTo(parent: Stage): this;
  prependTo(parent: Stage): this;

  append(child: Stage | Stage[]): this;
  prepend(child: Stage | Stage[]): this;

  insertNext(sibling: Stage, child: Stage | Stage[]): this;
  insertPrev(sibling: Stage, child: Stage | Stage[]): this;

  insertAfter(sibling: Stage): this;
  insertBefore(sibling: Stage): this;

  remove(child: Stage | Stage[]): this;
  remove(): this;
  empty(): this;

  parent(): this;

  first(visible?: boolean): this;
  last(visible?: boolean): this;

  next(visible?: boolean): this;
  prev(visible?: boolean): this;

  visible(): boolean;
  visible(visible: boolean): this;
  hide(): this;
  show(): this;
  visit<D>(visitor: Visitor<D>, data: D): boolean | void;

  tick(ticker: Ticker, before?: boolean): void;
  untick(ticker: Ticker): void;

  pin(a: string, b: any): this;
  pin(a: string): any;

  pin(a: Record<string, any>): this;
  pin(): Record<string, any>;

  size(w: number, h: number): this;
  width(w: number): this;
  height(h: number): this;
  scale(a: number, b: number): this;
  skew(a: number, b: number): this;
  rotate(a: number): this;
  offset(a: number, b: number): this;

  scaleTo(a: number, b: number, mode: string): this;

  padding(pad: number): this;
  spacing(space: number): this;

  alpha(a: number, ta: number): this;

  matrix(relative?: boolean): Stage.Matrix;

  tween(duration: number, delay: number, append: boolean): Stage.Tween;
  tween(duration: number, append: boolean): Stage.Tween;
  tween(append: boolean): Stage.Tween;

  on(type: string, listener: (...args: unknown[]) => void): this;
  off(type: string, listener: (...args: unknown[]) => void): this;
  publish(name: string, ...args: unknown[]): number;
  listeners(type: string): unknown[];

  label(): string;
  label(label: string): this;

  attr(name: string): unknown;
  attr(name: string, value: unknown): this;

  static create(): Stage;

  static box(): Stage;
  box(): this;

  static column(align: number): Stage;
  column(align: number): this;

  static layer(): Stage;
  layer(): this;

  static row(align: number): Stage;
  row(align: number): this;

  // static sequence(type: 'row' | 'column', align: number): this;
  // sequence(type: 'row' | 'column', align: number): this;

  static anim(frames: string | Stage.Texture[], fps: number): Stage.Anim;
  static string(frames: string | Stage.Texture[]): Stage.Str;

  static canvas(): Stage;
  static canvas(plotter: Plotter): Stage;
  static canvas(type: string, attributes: Record<string, string>, plotter: Plotter): Stage;

  static texture(query: string): Stage.Texture | Stage.Texture[];

  static image(image?: ImageType): Stage.Image;

  timeout(fn: () => unknown, time: number): void;
  setTimeout(fn: () => unknown, time: number): any;
  clearTimeout(timer: any): void;

  // hitTest(hit: { x: number, y: number }): boolean;
}

export namespace Stage {
  class Root extends Stage {
    constructor(
      request: (loop: (time: number) => void) => void,
      render: (root: Stage) => void,
    );
    background(color: string): this;
    viewbox(width: number, height: number, mode: string): this;
    viewport(width: number, height: number, ratio: any): this;
  }

  class Image extends Stage {
    constructor(texture: Texture);
    image(texture: Texture): this;
    stretch(inner: any): this;
    tile(inner: any): this;
  }

  class Anim extends Stage {
    static FPS: number;
    constructor();
    fps(fps: number): this;
    frames(frames: any): this;
    gotoFrame(frame: any, resize: any): this;
    length(): number;
    moveFrame(move: any): this;
    play(frame: any): this;
    repeat(repeat: any, callback: any): this;
    setFrames(a: any, b: any, c: any): this;
    stop(frame: any): this;
  }

  class Str extends Stage {
    constructor();
    frames(frames: any): this;
    setFont(a: any, b: any, c: any): this;
    setValue(a: any, b: any, c: any): this;
    value(value: any): this;
  }

  class Pin {
    constructor(owner: any);
    absoluteMatrix(): Matrix;
    get(key: any): any;
    relativeMatrix(): Matrix;
    reset(): void;
    set(a: any, b: any): this;
    toString(): string;
  }

  class Tween {
    constructor(owner: any, duration: any, delay: any);
    clear(forward: any): this;
    delay(delay: any): this;
    done(fn: any): this;
    duration(duration: any): this;
    ease(easing: any): this;

    hide(): this;
    remove(): this;
    then(fn: any): this;
    tween(duration: any, delay: any): this;
    tick(node: any, elapsed: any, now: any, last: any): this;

    pin(a: string, b: any): this;
    pin(a: Record<string, any>): this;  

    size(w: number, h: number): this;
    width(w: number): this;
    height(h: number): this;
    scale(a: number, b: number): this;
    skew(a: number, b: number): this;
    rotate(a: number): this;
    offset(a: number, b: number): this;
    alpha(a: number, ta: number): this;
  }

  class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a: number, b: number, c: number, d: number, e: number, f: number);
    clone(): this;
    concat(m: Matrix): this;
    identity(): this;
    inverse(): this;
    map(p: number, q: number): this;
    mapX(x: number, y: number): this;
    mapY(x: number, y: number): this;
    reset(a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
    reverse(): this;
    rotate(angle: number): this;
    scale(x: number, y: number): this;
    skew(x: number, y: number): this;
    toString(): string;
    translate(x: number, y: number): this;
  }

  class Texture {
    constructor();
    constructor(image: ImageType, ratio: number);

    src(image: ImageType, ratio: number): this;

    src(x: number, y: number): this;
    src(x: number, y: number, w: number, h: number): this;

    dest(x: number, y: number): this;
    dest(x: number, y: number, w: number, h: number): this;

    pipe(): this;

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

  interface Math {
    random(min: number, max: number): number;
    rotate(num: number, min: number, max: number): number;
    length(x: number, y: number): number;
    limit(num: number, min: number, max: number): number;
  }
}
