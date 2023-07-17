import { Node } from './core';
import { Mouse } from './mouse';

import stats from './util/stats';

const DEBUG = true;

const _stages = [];

export const pause = function() {
  for (let i = _stages.length - 1; i >= 0; i--) {
    _stages[i].pause();
  }
};

export const resume = function() {
  for (let i = _stages.length - 1; i >= 0; i--) {
    _stages[i].resume();
  }
};

export const mount = function(configs = {}) {
  let root = new Root();
  root.mount(configs);
  root.mouse = new Mouse().mount(root, root.dom);
  return root;
};

export class Root extends Node {
  canvas = null;
  dom = null;
  context = null;

  pixelWidth = -1;
  pixelHeight = -1;
  pixelRatio = 1;
  drawingWidth = 0;
  drawingHeight = 0;

  mounted = false;
  paused = false;
  sleep = false;

  constructor() {
    super();
    this.label('Root');
  }

  mount = (configs = {}) => {
    if (typeof configs.canvas === 'string') {
      this.canvas = document.getElementById(configs.canvas);
    } else if (configs.canvas instanceof HTMLCanvasElement) {
      this.canvas = configs.canvas;
    } else if (configs.canvas) {
      // should we error here
    }

    if (!this.canvas) {
      this.canvas = document.getElementById('cutjs') || document.getElementById('stage');
    }

    if (!this.canvas) {
      DEBUG && console.log('Creating Canvas...');
      this.canvas = document.createElement('canvas');
      Object.assign(this.canvas.style, {
        position: 'absolute',
        display: 'block',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        width: '100%',
        height: '100%'
      });

      let body = document.body;
      body.insertBefore(this.canvas, body.firstChild);
    }

    this.dom = this.canvas;

    this.context = this.canvas.getContext('2d');

    this.devicePixelRatio = window.devicePixelRatio || 1;

    this.backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
  
    this.pixelRatio = this.devicePixelRatio / this.backingStoreRatio;

    // resize();
    // window.addEventListener('resize', resize, false);
    // window.addEventListener('orientationchange', resize, false);

    this.mounted = true;
    _stages.push(this);
    this.requestFrame(this.onFrame);
  }

  frameRequested = false;

  requestFrame = () => {
    // one request at a time
    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(this.onFrame);
    }
  };

  lastTime = 0;
  _mo_touch = null; // monitor touch

  onFrame = (now) => {
    this.frameRequested = false;

    if (!this.mounted) {
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
    
        DEBUG && console.log('Resize: [' + this.drawingWidth + ', ' + this.drawingHeight + '] = ' + this.pixelRatio + ' x [' + this.pixelWidth + ', ' + this.pixelHeight + ']');
    
        this.viewport({
          width: this.drawingWidth,
          height: this.drawingHeight,
          ratio: this.pixelRatio
        } );
      }  
    }

    let last = this.lastTime || now;
    let elapsed = now - last;

    if (!this.mounted || this.paused || this.sleep) {
      return;
    }

    this.lastTime = now;

    let tickRequest = this._tick(elapsed, now, last);
    if (this._mo_touch != this._ts_touch) {
      // something changed since last call
      this._mo_touch = this._ts_touch;
      this.sleep = false;

      if (this.drawingWidth > 0 && this.drawingHeight > 0) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);
        this.render(this.context);
      }
  
    } else if (tickRequest) {
      // nothing changed, but a node requested next tick
      this.sleep = false;
    } else {
      // nothing changed, and no node requested next tick
      this.sleep = true;
    }

    stats.fps = elapsed ? 1000 / elapsed : 0;
  }

  resume() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.paused = false;
    this.sleep = false;
    this.publish('resume');
    return this;
  }

  pause() {
    if (!this.paused) {
      this.publish('pause');
    }
    this.paused = true;
    return this;
  }

  touch() {
    if (this.sleep || this.paused) {
      this.requestFrame();
    }
    this.sleep = false;
    return Node.prototype.touch();
  }

  unmount() {
    this.mounted = false;
    let index = _stages.indexOf(this);
    if (index >= 0) {
      _stages.splice(index, 1);
    }

    this.mouse?.unmount();
    return this;
  }

  background(color) {
    this.dom.style.backgroundColor = color;
    return this;
  }

  /**
   * Set/Get viewport.
   * This is used along with viewbox to determine the scale and position of the viewbox within the viewport.
   * Viewport is the size of the container, for example size of the canvas element.
   * Viewbox is provided by the user, and is the ideal size of the content.
   */
  viewport(width, height, ratio) {
    if (typeof width === 'undefined') {
      return Object.assign({}, this._viewport);
    }

    if (typeof width === 'object') {
      const options = width;
      width = options.width;
      height = options.height;
      ratio = options.ratio;
    }

    this._viewport = {
      width: width,
      height: height,
      ratio: ratio || 1
    };
    this.viewbox();
    let data = Object.assign({}, this._viewport);
    this.visit({
      start: function (node) {
        if (!node._flag('viewport')) {
          return true;
        }
        node.publish('viewport', [data]);
      }
    });
    return this;
  }

  /**
   * Set viewbox.
   * 
   * @param {mode} string - One of: 'in-pad' (like css object-fit: 'contain'), 'in', 'out-crop' (like css object-fit: 'cover'), 'out'
   */
  // TODO: static/fixed viewbox
  // TODO: use css object-fit values
  viewbox(width, height, mode) {
    if (typeof width === 'number' && typeof height === 'number') {
      this._viewbox = {
        width,
        height,
        mode
      };
    } else if (typeof width === 'object' && width !== null) {
      this._viewbox = {
        ...width,
      };
    }

    this.rescale();

    return this;
  };

  camera(matrix) {
    this._camera = matrix;
    this.rescale();
    return this;
  };

  rescale() {
    let viewbox = this._viewbox;
    let viewport = this._viewport;
    let camera = this._camera;
    if (viewport && viewbox) {
      const viewportWidth = viewport.width;
      const viewportHeight = viewport.height;
      const viewboxMode = /^(in|out|in-pad|out-crop)$/.test(viewbox.mode) ? viewbox.mode : 'in-pad';
      const viewboxWidth = viewbox.width;
      const viewboxHeight = viewbox.height;

      this.pin({
        width: viewboxWidth,
        height: viewboxHeight
      });
      this.scaleTo(viewportWidth, viewportHeight, viewboxMode);

      const viewboxX = viewbox.x || 0;
      const viewboxY = viewbox.y || 0;
      const cameraZoom = camera?.a || 1;
      const cameraX = camera?.e || 0;
      const cameraY = camera?.f || 0;
      const scaleX = this.pin("scaleX");
      const scaleY = this.pin("scaleY");
      this.pin("scaleX", scaleX * cameraZoom);
      this.pin("scaleY", scaleY * cameraZoom);
      this.pin("offsetX", cameraX - viewboxX * scaleX * cameraZoom);
      this.pin("offsetY", cameraY - viewboxY * scaleY * cameraZoom);
    } else if (viewport) {
      this.pin({
        width: viewport.width,
        height: viewport.height
      });
    }

    return this;
  }
}
