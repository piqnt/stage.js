interface TextureDefinition {
}

type Plotter = (context: CanvasRenderingContext2D) => void;

type Drawable = Plotter | HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;

type Ticker = (t: number, dt: number) => boolean | void

type Frame = string;

interface Visitor<D> {
  start(child: Stage.Stage, data: D): boolean | void;
  end(child: Stage.Stage, data: D): boolean | void;
  reverse: boolean;
  visible: boolean;
}

export namespace Stage {
  function mount(config: Record<string, any>): void;
  function atlas(def: TextureDefinition): Stage.Texture;

  function pause(): void;
  function resume(): void;

  function create(): Stage.Stage;

  function sprite(frame?: Frame): Stage.Sprite;
  function anim(frames: Frame | Frame[], fps: number): Stage.Anim;
  function string(frames: string | Record<string, Stage.Texture> | ((char: string) => Stage.Texture)): Stage.Str;

  function column(align: number): Stage.Stage;
  function row(align: number): Stage.Stage;

  function layer(): Stage.Stage; // resizes to fill parent
  function box(): Stage.Stage; // resizes to fit children

  function texture(query: string): Stage.Texture | Stage.Texture[];
  function canvas(plotter: Plotter): Stage.Texture;
  function canvas(type: string, plotter: Plotter): Stage.Texture;
  function canvas(type: string, attributes: Record<string, string>, plotter: Plotter): Stage.Texture;

  class Stage {
    appendTo(parent: Stage.Stage): this;
    prependTo(parent: Stage.Stage): this;
  
    append(child: Stage.Stage | Stage.Stage[]): this;
    prepend(child: Stage.Stage | Stage.Stage[]): this;
  
    insertNext(sibling: Stage.Stage, child: Stage.Stage | Stage.Stage[]): this;
    insertPrev(sibling: Stage.Stage, child: Stage.Stage | Stage.Stage[]): this;
  
    insertAfter(sibling: Stage.Stage): this;
    insertBefore(sibling: Stage.Stage): this;
  
    remove(child: Stage.Stage | Stage.Stage[]): this;
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
  
    row(align: number): this;
    column(align: number): this;

    layer(): this; // resizes to fill parent
    box(): this; // resizes to fit children
  
    timeout(fn: () => unknown, time: number): void;
    setTimeout(fn: () => unknown, time: number): any;
    clearTimeout(timer: any): void;
  
    label(): string;
    label(label: string): this;
  
    attr(name: string): unknown;
    attr(name: string, value: unknown): this;
  
    render(context: CanvasRenderingContext2D): void;
    touch(): this;
    toString(): string;
  
    // hitTest(hit: { x: number, y: number }): boolean;
  }
  
  class Root extends Stage.Stage {
    constructor(
      request: (loop: (time: number) => void) => void,
      render: (root: this) => void,
    );
    background(color: string): this;
    viewbox(width: number, height: number, mode: 'in' | 'out' | 'out-crop' | 'in-pad'): this;

    viewport(): { width: number, height: number, ratio: number };
    viewport(width: number, height: number, ratio: number): this;
  }

  class Sprite extends Stage.Stage {
    constructor(frame: any);
    image(frame: any): this;
    stretch(inner: any): this;
    tile(inner: any): this;
  }

  class Anim extends Stage.Stage {
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

  class Str extends Stage.Stage {
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
    inverse(): this;
    rotate(angle: number): this;
    scale(x: number, y: number): this;
    skew(x: number, y: number): this;
    toString(): string;
    translate(x: number, y: number): this;
  }

  class Texture {
    constructor();
    constructor(drawable: Drawable, ratio: number);

    src(drawable: Drawable, ratio: number): this;

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
    subscribe(stage: Stage.Stage, elem: Element): void;
  }

  interface math {

    random(min: number, max: number): number;
    random(max: number): number;

    modulo(num: number, min: number, max: number): number;
    modulo(num: number, max: number): number;

    clamp(num: number, min: number, max: number): number;

    length(x: number, y: number): number;
  }
}
