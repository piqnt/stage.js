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
  lastTime = 0;
  pixelWidth = -1;
  pixelHeight = -1;
  canvas = null;
  dom = null;
  context = null;
  fullpage = false;
  drawingWidth = 0;
  drawingHeight = 0;
  pixelRatio = 1;

  mounted = false;
  paused = false;
  sleep = false;

  constructor() {
    super();
    this.label('Root');
  }

  computeViewport = () => {
    let newPixelWidth;
    let newPixelHeight;
    if (this.fullpage) {
      // screen.availWidth/Height?
      newPixelWidth = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      newPixelHeight = (window.innerHeight > 0 ? window.innerHeight : screen.height);
    } else {
      newPixelWidth = this.canvas.clientWidth;
      newPixelHeight = this.canvas.clientHeight;
    }

    return [newPixelWidth, newPixelHeight, this.fullpage];
  }

  mount = (configs = {}) => {
    if (typeof configs.canvas === 'string') {
      this.canvas = document.getElementById(configs.canvas);
    }

    if (!this.canvas) {
      this.canvas = document.getElementById('cutjs') || document.getElementById('stage');
    }

    if (!this.canvas) {
      this.fullpage = true;
      DEBUG && console.log('Creating Canvas...');
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';

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

  onFrame = (now) => {
    this.frameRequested = false;

    if (!this.mounted) {
      return;
    }

    this.requestFrame();

    let [newPixelWidth, newPixelHeight, managed] = this.computeViewport();

    if (this.pixelWidth !== newPixelWidth || this.pixelHeight !== newPixelHeight) {
      // viewport pixel size is not the same as last time
      this.pixelWidth = newPixelWidth;
      this.pixelHeight = newPixelHeight;

      if (managed) {
        // when we match canvas size with, for example, window size
        this.canvas.style.width = newPixelWidth + 'px';
        this.canvas.style.height = newPixelHeight + 'px';
      }
  
      this.drawingWidth = newPixelWidth * this.pixelRatio;
      this.drawingHeight = newPixelHeight * this.pixelRatio;
  
      if (this.canvas.width !== this.drawingWidth || this.canvas.height !== this.drawingHeight) {
        // canvas size doesn't math
        this.canvas.width = this.drawingWidth;
        this.canvas.height = this.drawingHeight;
    
        DEBUG && console.log('Resize: ' + this.drawingWidth + ' x ' + this.drawingHeight + ' / ' + this.pixelRatio);
    
        this.viewport(this.drawingWidth, this.drawingHeight, this.pixelRatio);
      }  
    }

    let last = this.lastTime || now;
    let elapsed = now - last;

    if (!this.mounted || this.paused || this.sleep) {
      return;
    }

    this.lastTime = now;

    let loopRequest = this._tick(elapsed, now, last);
    if (this._mo_touch != this._ts_touch) {
      // something changed since last call
      this._mo_touch = this._ts_touch;
      this.sleep = false;

      if (this.drawingWidth > 0 && this.drawingHeight > 0) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.drawingWidth, this.drawingHeight);
        this.render(this.context);
      }
  
    } else if (loopRequest) {
      // nothing changed, but a node requested a loop
      this.sleep = false;
    } else {
      // nothing changed, and no node requested a loop
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
   * Set/get viewport. This is combined with viewbox to determine the scale and position of the viewbox within the viewport.
   */
  viewport(width, height, ratio) {
    if (typeof width === 'undefined') {
      return Object.assign({}, this._viewport);
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
   * Set/get viewbox. This is combined with viewport to determine the scale and position of the viewbox within the viewport.
   * 
   * @param {mode} string - One of: 'in-pad' (like css object-fit: 'contain'), 'in', 'out-crop' (like css object-fit: 'cover'), 'out'
   */
  // TODO: static/fixed viewbox
  viewbox(width, height, mode) {
    // todo: #v1 use css object-fit values
    if (typeof width === 'number' && typeof height === 'number') {
      this._viewbox = {
        width: width,
        height: height,
        mode: /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
      };
    }

    let viewbox = this._viewbox;
    let viewport = this._viewport;
    if (viewport && viewbox) {
      this.pin({
        width: viewbox.width,
        height: viewbox.height
      });
      this.scaleTo(viewport.width, viewport.height, viewbox.mode);
    } else if (viewport) {
      this.pin({
        width: viewport.width,
        height: viewport.height
      });
    }

    return this;
  }
}
