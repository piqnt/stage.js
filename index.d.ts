interface TextureDefinition {
}

type Plotter = (context: CanvasRenderingContext2D) => void;

type Drawable = Plotter | HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;

type Ticker = (t: number, dt: number) => boolean | void

type Frame = string | Drawable | Stage.Texture;

type Listener = (...args: any[]) => void

interface Visitor<D> {
  start(child: Node, data: D): boolean | void;
  end(child: Node, data: D): boolean | void;
  reverse: boolean;
  visible: boolean;
}

export default Stage;
export as namespace Stage;

declare namespace Stage {
  function mount(config?: Record<string, any>): Root;
  function atlas(def: TextureDefinition): Texture;

  function pause(): void;
  function resume(): void;

  function create(): Node;

  function sprite(frame?: string | Frame): Sprite;
  function anim(frames: string | Frame[], fps: number): Anim;
  function string(frames: string | Record<string, Texture> | ((char: string) => Texture)): Str;

  function column(align: number): Node;
  function row(align: number): Node;

  function layer(): Node; // resizes to fill parent
  function box(): Node; // resizes to fit children

  function texture(query: string): Texture | Texture[];
  function canvas(plotter: Plotter): Texture;
  function canvas(type: string, plotter: Plotter): Texture;
  function canvas(type: string, attributes: Record<string, string>, plotter: Plotter): Texture;

  class Node {
    appendTo(parent: Node): this;
    prependTo(parent: Node): this;

    append(child: Node | Node[]): this;
    prepend(child: Node | Node[]): this;

    insertNext(sibling: Node, child: Node | Node[]): this;
    insertPrev(sibling: Node, child: Node | Node[]): this;

    insertAfter(sibling: Node): this;
    insertBefore(sibling: Node): this;

    remove(child: Node | Node[]): this;
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

    matrix(relative?: boolean): Matrix;

    tween(duration: number, delay: number, append: boolean): Tween;
    tween(duration: number, append: boolean): Tween;
    tween(append: boolean): Tween;

    on(type: string, listener: Listener): this;
    off(type: string, listener: Listener): this;
    publish(name: string, ...args: any[]): number;
    listeners(type: string): Listener[];  

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

  class Root extends Node {
    constructor(
      request: (loop: (time: number) => void) => void,
      render: (root: Root) => void,
    );
    background(color: string): this;
    viewbox(width: number, height: number, mode?: 'in' | 'out' | 'out-crop' | 'in-pad'): this;

    viewport(): { width: number, height: number, ratio: number };
    viewport(width: number, height: number, ratio: number): this;

    dom?: HTMLCanvasElement;
  }

  class Sprite extends Node {
    constructor(frame: any);
    image(frame: any): this;
    stretch(inner?: boolean): this;
    tile(inner?: boolean): this;
  }

  class Anim extends Node {
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

  class Str extends Node {
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

  class Mouse {
    static CANCEL: string;
    static CLICK: string;
    static END: string;
    static MOVE: string;
    static START: string;
  }

  class math {

    static random(min: number, max: number): number;
    static random(max: number): number;

    static mod(num: number, min: number, max: number): number;
    static mod(num: number, max: number): number;

    static clamp(num: number, min: number, max: number): number;

    static length(x: number, y: number): number;
  }
}
