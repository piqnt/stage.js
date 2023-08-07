interface AtlasTextureDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

interface AtlasDefinition {
  name?: string;
  image: {
    src: string,
    ratio?: number
  };
  /** @deprecated */
  trim?: number;
  ppu?: number;
  textures?: Record<string, AtlasTextureDefinition | (AtlasTextureDefinition | string)[] | Record<string, (AtlasTextureDefinition | string)>>

  map?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;

  /** @deprecated Use map */
  filter?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;
}

type CanvasTextureDraw = (this: Stage.CanvasTexture, context: CanvasRenderingContext2D) => void;

type TextureSource = Stage.Texture | CanvasImageSource;

// TODO
type TextureQuery = any;
type TextureSubquery = any;

interface TextureSelection {
  one: (subquery: TextureSubquery) => Stage.Texture;
  array: (subquery: TextureSubquery) => Stage.Texture[];
}

type Ticker = (t: number, dt: number) => boolean | void

type Listener = (...args: any[]) => void

interface Visitor<D> {
  start(child: Node, data: D): boolean | void;
  end(child: Node, data: D): boolean | void;
  reverse: boolean;
  visible: boolean;
}

interface XY {
  x: number;
  y: number;
}

type FitMode = 'in' | 'out' | 'out-crop' | 'in-pad';

interface PinGetters {
  alpha: number;
  textureAlpha: number;
  width: number;
  height: number;
  boxWidth: number;
  boxHeight: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  rotation: number;
  pivotX: number;
  pivotY: number;
  offsetX: number;
  offsetY: number;
  alignX: number;
  alignY: number;
  handleX: number;
  handleY: number;
}

interface PinSetters {
  alpha: number;
  textureAlpha: number;
  width: number;
  height: number;
  scale: number;
  scaleX: number;
  scaleY: number;
  skew: number;
  skewX: number;
  skewY: number;
  rotation: number;
  pivot: number;
  pivotX: number;
  pivotY: number;
  offset: number;
  offsetX: number;
  offsetY: number;
  align: number;
  alignX: number;
  alignY: number;
  handle: number;
  handleX: number;
  handleY: number;
  resizeMode: FitMode;
  resizeWidth: number;
  resizeHeight: number;
  scaleMode: FitMode;
  scaleWidth: number;
  scaleHeight: number;
  matrix: Stage.Matrix;
}

export default Stage;
export as namespace Stage;

declare namespace Stage {
  function mount(config?: Record<string, any>): Root;
  function atlas(def: AtlasDefinition): Promise<Texture>;

  function create(): Node;

  /** @deprecated */
  function image(texture?: string | TextureSource): Sprite;

  function sprite(texture?: string | TextureSource): Sprite;
  function anim(frames: string | TextureSource[], fps?: number): Anim;
  function string(chars: string | Record<string, TextureSource> | ((char: string) => TextureSource)): Str;

  function column(align?: number): Node;
  function row(align?: number): Node;

  function layer(): Node; // resizes to fill parent
  function box(): Node; // resizes to fit children

  function texture(query: TextureQuery): TextureSelection;

  /** @deprecated */
  function canvas(callback: CanvasTextureDraw): CanvasTexture;
  /** @deprecated */
  function canvas(type: string, callback: CanvasTextureDraw): CanvasTexture;
  /** @deprecated */
  function canvas(type: string, attributes: Record<string, string>, callback: CanvasTextureDraw): CanvasTexture;

  /** @deprecated */
  interface CanvasTexture extends Stage.Texture {
    context: () => CanvasRenderingContext2D;
    size: (width: number, height: number, ratio?: number) => CanvasTexture;
    canvas: (callback?: CanvasTextureDraw) => CanvasTexture;
  }

  /** @deprecated */
  function memoizeDraw(
    callback: (ratio: number, texture: CanvasTexture, sprite: Stage.Sprite) => void,
    key?: () => any,
  ): Stage.Sprite;

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

    pin(pin: Partial<PinSetters>): this;
    pin(): PinGetters;

    offset(x: number, y: number): this;
    offset(value: XY): this;

    rotate(angle: number): this;

    size(w: number, h: number): this;
    width(w: number): this;
    width(): number;
    height(h: number): this;
    height(): number;

    skew(x: number, y: number): this;
    skew(value: XY): this;

    scale(x: number, y: number): this;
    scale(value: XY): this;

    scaleTo(a: number, b: number, mode: string): this;

    padding(value: number): this;
    spacing(value: number): this;

    alpha(a: number, ta: number): this;

    matrix(relative?: boolean): Matrix;

    tween(options?: {
      duration?: number,
      delay?: number,
      append?: boolean,
    }): Tween;

    /** @deprecated Use tween(options) */
    tween(duration: number, delay: number, append: boolean): Tween;
    /** @deprecated Use tween(options) */
    tween(duration: number, append: boolean): Tween;
    /** @deprecated Use tween(options) */
    tween(duration: number): Tween;
    /** @deprecated Use tween(options) */
    tween(append: boolean): Tween;

    on(type: string | string[], listener: Listener): this;
    off(type: string | string[], listener: Listener): this;
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

  interface Root extends Node {
    pause(): this;
    resume(): this;
  
    background(color: string): this;
    
    viewbox(viewbox: {
      width: number,
      height: number,
      mode?: FitMode,
      x?: number,
      y?: number,
    }): this;

    // /** @deprecated */
    viewbox(width: number, height: number, mode?: FitMode): this;

    camera(camera: Stage.Matrix): this;

    // for internal use only
    // viewport(): { width: number, height: number, ratio: number };
    // viewport(width: number, height: number, ratio: number): this;

    dom?: HTMLCanvasElement;
  }

  class Sprite extends Node {
    constructor(frame: any);
    texture(frame: any): this;
    stretch(inner?: boolean): this;
    tile(inner?: boolean): this;

    /** @deprecated use texture */
    image(frames: any): this;
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
    stop(frame: any): this;

    /** @deprecated use frames */
    setFrames(frames: any): this;
  }

  class Str extends Node {
    constructor();
    frames(frames: any): this;
    value(value?: any): this;

    /** @deprecated use frames */
    setFont(frames: any): this;
    /** @deprecated use value */
    setValue(value?: any): this;
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
    // set up
    delay(delay: any): this;
    duration(duration: any): this;
    ease(easing: any): this;

    // action
    size(w: number, h: number): this;
    width(w: number): this;
    height(h: number): this;
    scale(a: number, b: number): this;
    skew(a: number, b: number): this;
    rotate(a: number): this;
    offset(a: number, b: number): this;
    alpha(a: number, ta: number): this;

    pin(a: string, b: any): this;
    pin(a: Record<string, any>): this;  

    // ending
    hide(): this;
    remove(): this;
    done(fn: any): this;
    // deprecated then(fn: any): this;
    // deprecated clear(forward: any): this;

    /** @deprecated */
    tween(duration: number, delay: any): this;
    /** @deprecated */
    tween(duration: number): this;

    /** chain another tween */
    tween(options?: {
      duration?: number,
      delay?: number,
    }): Tween;
    
    // internal tick(node: any, elapsed: any, now: any, last: any): this;
  }

  class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a: number, b: number, c: number, d: number, e: number, f: number);
    constructor();
    clone(): this;
    concat(m: Matrix): this;
    identity(): this;
    inverse(): this;
    map(p: XY, q?: XY): XY;
    mapX(p: XY): number;
    mapX(x: number, y: number): number;
    mapY(p: XY): number;
    mapY(x: number, y: number): number;
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
    constructor(source: TextureSource, ratio: number);

    src(source: TextureSource, ratio: number): this;

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

    static wrap(num: number, min: number, max: number): number;
    static wrap(num: number, max: number): number;

    static clamp(num: number, min: number, max: number): number;

    static length(x: number, y: number): number;
  }
}
