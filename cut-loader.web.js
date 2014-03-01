/*
 * CutJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

/**
 * Default loader for web.
 */

window.addEventListener("load", function() {
  DEBUG && console.log("On load.");
  Cut.Loader.start();
}, false);

Cut.Loader.init = function(app, canvas) {
  var context = null, full = false;
  var width = 0, height = 0, ratio = 1;

  DEBUG && console.log("Creating root...");
  var root = Cut.root(requestAnimationFrame, function() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    this.render(context);
  });

  if (typeof canvas === "string") {
    canvas = document.getElementById(canvas);
  }

  if (!canvas) {
    canvas = document.getElementById("cutjs");
  }

  if (!canvas) {
    full = true;
    DEBUG && console.log("Creating element...");
    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }

  DEBUG && console.log("Loading images...");
  Cut.loadImages(function(src, handleComplete, handleError) {
    var image = new Image();
    DEBUG && console.log("Loading image: " + src);
    image.onload = handleComplete;
    image.onerror = handleError;
    image.src = src;
    return image;
  }, init);

  function init() {
    DEBUG && console.log("Images loaded.");

    context = canvas.getContext("2d");

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio || 1;
    ratio = devicePixelRatio / backingStoreRatio;

    canvas.resize = resize;

    DEBUG && console.log("Loading...");
    app(root, canvas);

    resize();
    window.addEventListener("resize", resize, false);

    DEBUG && console.log("Start playing...");
    root.start();
  }

  function resize() {

    if (full) {
      width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

    } else {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    }

    width *= ratio;
    height *= ratio;

    canvas.width = width;
    canvas.height = height;

    root._ratio = ratio;

    DEBUG && console.log("Resize: " + width + " x " + height + " / " + ratio);

    root.visit({
      start : function(cut) {
        var stop = true;
        var listeners = cut.listeners("viewport");
        if (listeners) {
          for (var l = 0; l < listeners.length; l++)
            stop &= !listeners[l].call(cut, width, height);
        }
        return stop;
      }
    });
  }

  return root;

};

!function() {
  var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
  for (var v = 0; v < vendors.length && !window.requestAnimationFrame; v++) {
    var vendor = vendors[v];
    window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame']
        || window[vendor + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    var next = 0;
    window.requestAnimationFrame = function(callback) {
      var now = new Date().getTime();
      next = Math.max(next + 16, now);
      return window.setTimeout(function() {
        callback(next);
      }, next - now);
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}();