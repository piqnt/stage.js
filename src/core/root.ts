import stats from "../common/stats";
import { Matrix } from "../common/matrix";

import { Component } from "./component";
import { Pointer } from "./pointer";
import { FitMode, isValidFitMode } from "./pin";
import { Memo } from "../common/memo";

/** @internal */ const DEBUG = true;

/** @internal */ const ROOTS: Root[] = [];

export function pause() {
  for (let i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].pause();
  }
}

export function resume() {
  for (let i = ROOTS.length - 1; i >= 0; i--) {
    ROOTS[i].resume();
  }
}

export function mount(configs: RootConfig = {}) {
  const root = new Root();
  // todo: root.use(new Pointer());
  root.mount(configs);
  // todo: maybe just pass root? or do root.use(pointer)
  root.pointer = new Pointer().mount(root, root.dom as HTMLElement);
  return root;
}

type RootConfig = {
  canvas?: string | HTMLCanvasElement;
};

/**
 * Geometry of the rectangular that the application takes on the screen.
 */
export type Viewport = {
  width: number;
  height: number;
  ratio: number;
};

/**
 * Geometry of a rectangular portion of the game that is projected on the screen.
 */
export type Viewbox = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  mode?: FitMode;
};

export class Root extends Component {
  canvas: HTMLCanvasElement | null = null;
  dom: HTMLCanvasElement | null = null;
  context: CanvasRenderingContext2D | null = null;

  /** @internal */ pixelWidth = -1;
  /** @internal */ pixelHeight = -1;
  /** @internal */ pixelRatio = 1;
  /** @internal */ drawingWidth = 0;
  /** @internal */ drawingHeight = 0;

  mounted = false;
  paused = false;
  sleep = false;

  /** @internal */ devicePixelRatio: number;
  /** @internal */ backingStoreRatio: any;

  /** @internal */ pointer: Pointer;

  /** @internal */ _viewport: Viewport;
  /** @internal */ _viewbox: Viewbox;
  /** @internal */ _camera: Matrix;

  constructor() {
    super();
    this.label("Root");
  }

  mount = (configs: RootConfig = {}) => {
    if (typeof configs.canvas === "string") {
      this.canvas = document.getElementById(configs.canvas) as HTMLCanvasElement;
      if (!this.canvas) {
        console.error("Canvas element not found: ", configs.canvas);
      }
    } else if (configs.canvas instanceof HTMLCanvasElement) {
      this.canvas = configs.canvas;
    } else if (configs.canvas) {
      console.error("Unknown value for canvas:", configs.canvas);
    }

    if (!this.canvas) {
      this.canvas = (document.getElementById("cutjs") ||
        document.getElementById("stage")) as HTMLCanvasElement;
    }

    if (!this.canvas) {
      DEBUG && console.log("Creating canvas element...");
      this.canvas = document.createElement("canvas");
      Object.assign(this.canvas.style, {
        position: "absolute",
        display: "block",
        top: "0",
        left: "0",
        bottom: "0",
        right: "0",
        width: "100%",
        height: "100%",
      });

      const body = document.body;
      body.insertBefore(this.canvas, body.firstChild);
    }

    this.dom = this.canvas;

    this.context = this.canvas.getContext("2d");

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStorePixelRatio =
      // @ts-ignore
      this.context.webkitBackingStorePixelRatio ||
      // @ts-ignore
      this.context.mozBackingStorePixelRatio ||
      // @ts-ignore
      this.context.msBackingStorePixelRatio ||
      // @ts-ignore
      this.context.oBackingStorePixelRatio ||
      // @ts-ignore
      this.context.backingStorePixelRatio ||
      1;

    this.devicePixelRatio = devicePixelRatio;
    this.backingStoreRatio = backingStorePixelRatio;
    this.pixelRatio = this.devicePixelRatio / this.backingStoreRatio;

    // resize();
    // window.addEventListener('resize', resize, false);
    // window.addEventListener('orientationchange', resize, false);

    this.mounted = true;
    ROOTS.push(this);
    this.requestFrame();
  };

  /** @internal */ frameRequested = false;

  /** @internal */
  requestFrame = () => {
    // one request at a time
    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(this.onFrame);
    }
  };

  /** @internal */ _lastFrameTime = 0;

  /** @internal */ _memo_touch = Memo.init();

  /** @internal */
  onFrame = (now: number) => {
    this.frameRequested = false;

    if (!this.mounted || !this.canvas || !this.context) {
      return;
    }

    this.requestFrame();

    const newPixelWidth = this.canvas.clientWidth;
    const newPixelHeight = this.canvas.clientHeight;

    if (this.pixelWidth !== newPixelWidth || this.pixelHeight !== newPixelHeight) {
      // viewport pixel size is not the same as last time
      this.pixelWidth = newPixelWidth;
      this.pixelHeight = newPixelHeight;

      this.drawingWidth = newPixelWidth * this.pixelRatio;
      this.drawingHeight = newPixelHeight * this.pixelRatio;

      if (this.canvas.width !== this.drawingWidth || this.canvas.height !== this.drawingHeight) {
        // canvas size doesn't math
        this.canvas.width = this.drawingWidth;
        this.canvas.height = this.drawingHeight;

        DEBUG &&
          console.log(
            "Resize: [" +
              this.drawingWidth +
              ", " +
              this.drawingHeight +
              "] = " +
              this.pixelRatio +
              " x [" +
              this.pixelWidth +
              ", " +
              this.pixelHeight +
              "]",
          );

        this.viewport({
          width: this.drawingWidth,
          height: this.drawingHeight,
          ratio: this.pixelRatio,
        });
      }
    }

    const last = this._lastFrameTime || now;
    const elapsed = now - last;

    if (!this.mounted || this.paused || this.sleep) {
      return;
    }

    this._lastFrameTime = now;

    this.prerenderTree();

    const tickRequest = this.tickTree(elapsed, now, last);
    if (!this._memo_touch.recall(this._revision)) {
      // something changed since last call
      this.sleep = false;

      if (this.drawingWidth > 0 && this.drawingHeight > 0) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);
        this.renderTree(this.context);
      }
    } else if (tickRequest) {
      // nothing changed, but a component requested next tick
      this.sleep = false;
    } else {
      // nothing changed, and no component requested next tick
      this.sleep = true;
    }

    stats.fps = elapsed ? 1000 / elapsed : 0;
  };

  resume() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.paused = false;
    this.sleep = false;
    this.publish("resume");
    return this;
  }

  pause() {
    if (!this.paused) {
      this.publish("pause");
    }
    this.paused = true;
    return this;
  }

  /** @internal */
  touch() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.sleep = false;
    return super.touch();
  }

  unmount() {
    this.mounted = false;
    const index = ROOTS.indexOf(this);
    if (index >= 0) {
      ROOTS.splice(index, 1);
    }

    this.pointer?.unmount();
    return this;
  }

  background(color: string) {
    if (this.dom) {
      this.dom.style.backgroundColor = color;
    }
    return this;
  }

  /**
   * Set/Get viewport.
   *
   * Viewport is the size of the container, for example size of the canvas element.
   *
   * Viewbox is provided by the user, and defines a rectangle that is projected (scaled and positioned) into the viewport.
   */
  viewport(): Viewport;
  viewport(width: number, height: number, ratio?: number): this;
  viewport(viewbox: Viewport): this;
  viewport(width?: number | Viewport, height?: number, ratio?: number) {
    if (typeof width === "undefined") {
      // todo: return readonly object instead
      return Object.assign({}, this._viewport);
    }

    if (typeof width === "object") {
      const options = width;
      width = options.width;
      height = options.height;
      ratio = options.ratio;
    }

    if (typeof width === "number" && typeof height === "number") {
      this._viewport = {
        width: width,
        height: height,
        ratio: typeof ratio === "number" ? ratio : 1,
      };
      this.viewbox();
      const data = Object.assign({}, this._viewport);
      this.visit({
        start: function (component: Component) {
          if (!component.evalDeepFlag("viewport")) {
            return true;
          }
          component.publish("viewport", [data]);
        },
      });
    }

    return this;
  }

  /**
   * Set viewbox.
   *
   * The provided dimension is automatically scaled to fit in the available container viewport.
   */
  viewbox(viewbox: Viewbox): this;
  viewbox(width?: number, height?: number, mode?: FitMode): this;
  viewbox(width?: number | Viewbox, height?: number, mode?: FitMode): this {
    // TODO: static/fixed viewbox
    // todo: do not create new object, update same viewbox object
    if (typeof width === "number" && typeof height === "number") {
      this._viewbox = {
        width,
        height,
        mode,
      };
    } else if (typeof width === "object" && width !== null) {
      const viewbox = width as Viewbox;
      this._viewbox = {
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width,
        height: viewbox.height,
        mode: viewbox.mode,
      };
    }

    this.rescale();

    return this;
  }

  camera(matrix: Matrix) {
    this._camera = matrix;
    this.rescale();
    return this;
  }

  /** @internal */
  rescale() {
    const viewbox = this._viewbox;
    const viewport = this._viewport;
    const camera = this._camera;
    if (viewport && viewbox) {
      const viewportWidth = viewport.width;
      const viewportHeight = viewport.height;

      const viewboxMode = isValidFitMode(viewbox.mode) ? viewbox.mode : "in-pad";
      const viewboxWidth = viewbox.width;
      const viewboxHeight = viewbox.height;

      this.width(viewboxWidth);
      this.height(viewboxHeight);

      this.fit(viewportWidth, viewportHeight, viewboxMode);

      const viewboxX = viewbox.x ?? 0;
      const viewboxY = viewbox.y ?? 0;

      const scaleX = this.pin("scaleX");
      const scaleY = this.pin("scaleY");

      if (!camera) {
        const offsetX =  - viewboxX * scaleX;
        const offsetY =  - viewboxY * scaleY;
        this.pin("offsetX", offsetX);
        this.pin("offsetY", offsetY);

      } else {
        // todo: use matrix to apply viewbox and concat camera
        const cameraScaleX = camera.a || 1;
        const cameraScaleY = camera.b || 1;
        const cameraTranslateX = camera.e || 0;
        const cameraTranslateY = camera.f || 0;

        const combinedScaleX = scaleX * cameraScaleX;
        const combinedScaleY = scaleY * cameraScaleY;
        this.pin("scaleX", combinedScaleX);
        this.pin("scaleY", combinedScaleY);

        const combinedOffsetX = cameraTranslateX - viewboxX * combinedScaleX;
        const combinedOffsetY = cameraTranslateY - viewboxY * combinedScaleY;
        this.pin("offsetX", combinedOffsetX);
        this.pin("offsetY", combinedOffsetY);
      }
    } else if (viewport) {
      this.width(viewport.width);
      this.height(viewport.height);
    }

    return this;
  }
}
