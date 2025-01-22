import stats from "../common/stats";
import { Matrix } from "../common/matrix";

import { Component } from "./component";
import { Pointer } from "./pointer";
import { FitMode, isValidFitMode } from "./pin";

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
  /** @internal */ backingStoreRatio: number;

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
      console.debug && console.debug("Creating canvas element...");
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

    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.backingStoreRatio =
      this.context["webkitBackingStorePixelRatio"] ||
      this.context["mozBackingStorePixelRatio"] ||
      this.context["msBackingStorePixelRatio"] ||
      this.context["oBackingStorePixelRatio"] ||
      this.context["backingStorePixelRatio"] ||
      1;

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
  /** @internal */ _mo_touch: number | null = null; // monitor touch

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

        console.debug && console.debug(
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

    this.prerender();

    const tickRequest = this._tick(elapsed, now, last);
    if (this._mo_touch != this._ts_touch) {
      // something changed since last call
      this._mo_touch = this._ts_touch;
      this.sleep = false;

      if (this.drawingWidth > 0 && this.drawingHeight > 0) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);  
        if (this.debugDrawAxis > 0) {
          this.renderDebug(this.context);
        }
        this.render(this.context);
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

  /** @hidden */
  debugDrawAxis = 0;

  private renderDebug(context: CanvasRenderingContext2D): void {
    const size = typeof this.debugDrawAxis === "number" ? this.debugDrawAxis : 10;
    const m = this.matrix();
    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
    const lineWidth = 3 / m.a;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, 0.8 * size);
    context.lineTo(-0.2 * size, 0.8 * size);
    context.lineTo(0, size);
    context.lineTo(+0.2 * size, 0.8 * size);
    context.lineTo(0, 0.8 * size);
    context.strokeStyle = 'rgba(93, 173, 226)';
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = lineWidth;
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0.8 * size, 0);
    context.lineTo(0.8 * size, -0.2 * size);
    context.lineTo(size, 0);
    context.lineTo(0.8 * size, +0.2 * size);
    context.lineTo(0.8 * size, 0);
    context.strokeStyle = 'rgba(236, 112, 99)';
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = lineWidth;
    context.stroke();
  }

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
   * This is used along with viewbox to determine the scale and position of the viewbox within the viewport.
   * Viewport is the size of the container, for example size of the canvas element.
   * Viewbox is provided by the user, and is the ideal size of the content.
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
        start: function (component) {
          if (!component._flag("viewport")) {
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
   */
  viewbox(viewbox: Viewbox): this;
  viewbox(width?: number, height?: number, mode?: FitMode): this;
  viewbox(width?: number | Viewbox, height?: number, mode?: FitMode): this {
    // TODO: static/fixed viewbox
    // TODO: use css object-fit values
    if (typeof width === "number" && typeof height === "number") {
      this._viewbox = {
        width,
        height,
        mode,
      };
    } else if (typeof width === "object" && width !== null) {
      this._viewbox = {
        ...width,
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

      this.pin({
        width: viewboxWidth,
        height: viewboxHeight,
      });
      this.fit(viewportWidth, viewportHeight, viewboxMode);

      const viewboxX = viewbox.x || 0;
      const viewboxY = viewbox.y || 0;

      const cameraZoomX = camera?.a || 1;
      const cameraZoomY = camera?.d || 1;
      const cameraX = camera?.e || 0;
      const cameraY = camera?.f || 0;

      const scaleX = this.pin("scaleX");
      const scaleY = this.pin("scaleY");

      this.pin("scaleX", scaleX * cameraZoomX);
      this.pin("scaleY", scaleY * cameraZoomY);

      this.pin("offsetX", cameraX - viewboxX * scaleX * cameraZoomX);
      this.pin("offsetY", cameraY - viewboxY * scaleY * cameraZoomY);
    } else if (viewport) {
      this.pin({
        width: viewport.width,
        height: viewport.height,
      });
    }

    return this;
  }

  /** @hidden */
  flipX(x: boolean) {
    this._pin._directionX = x ? -1 : 1;
    return this;
  }

  /** @hidden */
  flipY(y: boolean) {
    this._pin._directionY = y ? -1 : 1;
    return this;
  }
}
