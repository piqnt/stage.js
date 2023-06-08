import { Node } from './core';
import { Mouse } from './mouse';

import stats from './util/stats';

if (typeof DEBUG === 'undefined')
  DEBUG = true;

var _stages = [];

export const pause = function() {
  for (var i = _stages.length - 1; i >= 0; i--) {
    _stages[i].pause();
  }
};

export const resume = function() {
  for (var i = _stages.length - 1; i >= 0; i--) {
    _stages[i].resume();
  }
};

export const mount = function(configs = {}) {
  var root = new Root();
  root.mount(configs);
  root.mouse = new Mouse().mount(root, root.dom);
  return root;
};

Root._super = Node;
Root.prototype = Object.create(Root._super.prototype);

export function Root() {
  Root._super.call(this);
  this.label('Root');
}

Root.prototype.mount = function(configs = {}) {
  var canvas;
  var context = null;

  var fullpage = false;
  var drawingWidth = 0;
  var drawingHeight = 0;
  var pixelRatio = 1;

  var mounted = false;

  var paused = true;

  if (typeof configs.canvas === 'string') {
    canvas = document.getElementById(configs.canvas);
  }

  if (!canvas) {
    canvas = document.getElementById('cutjs')
        || document.getElementById('stage');
  }

  if (!canvas) {
    fullpage = true;
    DEBUG && console.log('Creating Canvas...');
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }

  this.dom = canvas;

  context = canvas.getContext('2d');

  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  pixelRatio = devicePixelRatio / backingStoreRatio;

  var requestAnimationFrame = window.requestAnimationFrame
      || window.msRequestAnimationFrame || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame
      || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };

  var lastTime = 0;
  var renderLoop = (now) => {
    if (!mounted || paused) {
      return;
    }

    var last = lastTime || now;
    var elapsed = now - last;
    lastTime = now;

    var ticked = this._tick(elapsed, now, last);
    if (this._mo_touch != this._ts_touch) {
      this._mo_touch = this._ts_touch;
      onRender(this);
      requestAnimationFrame(renderLoop);
    } else if (ticked) {
      requestAnimationFrame(renderLoop);
    } else {
      paused = true;
    }

    stats.fps = elapsed ? 1000 / elapsed : 0;
  };

  var onRender = () => {
    if (drawingWidth > 0 && drawingHeight > 0) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, drawingWidth, drawingHeight);
      this.render(context);
    }
  }

  // resize();
  // window.addEventListener('resize', resize, false);
  // window.addEventListener('orientationchange', resize, false);

  var lastWidth = -1;
  var lastHeight = -1;
  var resizeLoop = () => {
    if (!mounted) {
      return;
    }
    var newWidth, newHeight;
    if (fullpage) {
      // screen.availWidth/Height?
      newWidth = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      newHeight = (window.innerHeight > 0 ? window.innerHeight : screen.height);
    } else {
      newWidth = canvas.clientWidth;
      newHeight = canvas.clientHeight;
    }
    if (lastWidth !== newWidth || lastHeight !== newHeight) {
      lastWidth = newWidth;
      lastHeight = newHeight;
      onResize();
    }
    requestAnimationFrame(resizeLoop);
  };

  var onResize = () => {
    if (fullpage) {
      // screen.availWidth/Height?
      drawingWidth = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      drawingHeight = (window.innerHeight > 0 ? window.innerHeight : screen.height);

      canvas.style.width = drawingWidth + 'px';
      canvas.style.height = drawingHeight + 'px';

    } else {
      drawingWidth = canvas.clientWidth;
      drawingHeight = canvas.clientHeight;
    }

    drawingWidth *= pixelRatio;
    drawingHeight *= pixelRatio;

    if (canvas.width === drawingWidth && canvas.height === drawingHeight) {
      return;
    }

    canvas.width = drawingWidth;
    canvas.height = drawingHeight;

    DEBUG && console.log('Resize: ' + drawingWidth + ' x ' + drawingHeight + ' / ' + pixelRatio);

    this.viewport(drawingWidth, drawingHeight, pixelRatio);

    onRender();
  }

  this.resume = function() {
    if (paused) {
      this.publish('resume');
      paused = false;
      requestAnimationFrame(renderLoop);
    }
    return this;
  };

  this.pause = function() {
    if (!paused) {
      this.publish('pause');
    }
    paused = true;
    return this;
  };

  this.touch_root = this.touch;
  this.touch = function() {
    this.resume();
    return this.touch_root();
  };

  this.unmount = function() {
    mounted = false;
    var index = _stages.indexOf(this);
    if (index >= 0) {
      _stages.splice(index, 1);
    }

    this.mouse?.unmount();
    return this;
  };

  mounted = true;
  _stages.push(this);
  resizeLoop();
  requestAnimationFrame(renderLoop);
};

Root.prototype.background = function(color) {
  this.dom.style.backgroundColor = color;
  return this;
};

/**
 * Set/get available rendering viewport.
 */
Root.prototype.viewport = function(width, height, ratio) {
  if (typeof width === 'undefined') {
    return Object.assign({}, this._viewport);
  }
  this._viewport = {
    width : width,
    height : height,
    ratio : ratio || 1
  };
  this.viewbox();
  var data = Object.assign({}, this._viewport);
  this.visit({
    start : function(node) {
      if (!node._flag('viewport')) {
        return true;
      }
      node.publish('viewport', [ data ]);
    }
  });
  return this;
};

/**
 * Like css object-fit, scales and positions the viewbox within the viewport.
 */
// TODO: static/fixed viewbox
Root.prototype.viewbox = function(width, height, mode) {
  if (typeof width === 'number' && typeof height === 'number') {
    this._viewbox = {
      width : width,
      height : height,
      mode : /^(in|out|in-pad|out-crop)$/.test(mode) ? mode : 'in-pad'
    };
  }

  var viewbox = this._viewbox;
  var viewport = this._viewport;
  if (viewport && viewbox) {
    this.pin({
      width : viewbox.width,
      height : viewbox.height
    });
    this.scaleTo(viewport.width, viewport.height, viewbox.mode);
  } else if (viewport) {
    this.pin({
      width : viewport.width,
      height : viewport.height
    });
  }

  return this;
};
