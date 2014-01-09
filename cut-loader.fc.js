/*
 * Cut.js
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

/**
 * Cordova/PhoneGap FastCanvas plugin loader.
 */

window.addEventListener("load", function() {
  DEBUG && console.log("On load.");
  Cut.Loader.start();
}, false);

Cut.Loader = {
  start : function() {
    if (this.started) {
      return;
    }
    this.started = true;
    // device ready not called; must be in a browser
    var readyTimeout = setTimeout(function() {
      DEBUG && console.log("On deviceready timeout.");
      Cut.Loader.play();
    }, 2000);

    document.addEventListener("deviceready", function() {
      DEBUG && console.log("On deviceready.");
      clearTimeout(readyTimeout);
      Cut.Loader.play();
    }, false);

    document.addEventListener("pause", function() {
      Cut.Loader.pause();
    }, false);

    document.addEventListener("resume", function() {
      Cut.Loader.resume();
    }, false);
  },
  play : function() {
    this.played = true;
    for (var i = this.loaders.length - 1; i >= 0; i--) {
      this.roots.push(this.loaders[i]());
      this.loaders.splice(i, 1);
    }
  },
  pause : function() {
    for (var i = this.loaders.length - 1; i >= 0; i--) {
      this.roots[i].pause();
    }
  },
  resume : function() {
    for (var i = this.loaders.length - 1; i >= 0; i--) {
      this.roots[i].resume();
    }
  },
  loaders : [],
  roots : [],
  load : function(app, canvas) {
    function loader() {
      var context = null, width = 0, height = 0;

      DEBUG && console.log("Creating root...");
      var root = Cut.root(function(root) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, width, height);
        root.render(context);
        FastCanvas.render();
      }, requestAnimationFrame);

      canvas = FastCanvas.create(typeof FASTCANVAS_FALLBACK !== "undefined"
          && FASTCANVAS_FALLBACK);
      console.log("FastCanvas: " + FastCanvas.isFast);

      DEBUG && console.log("Loading images...");
      Cut.loadImages(function(src, handleComplete, handleError) {
        var image = FastCanvas.createImage();
        DEBUG
            && console.log("Loading image: " + src
                + (image.id ? (", ID: " + image.id) : ""));
        image.onload = handleComplete;
        image.onerror = handleError;
        image.src = src;
        return image;
      }, init);

      function init() {
        DEBUG && console.log("Images loaded.");

        context = canvas.getContext("2d");

        DEBUG && console.log("Loading...");
        app(root, document);

        root.listen("resize", function(width, height) {
          this.pin({
            width : width,
            height : height
          });
          return true;
        });

        resize();
        window.addEventListener("resize", resize, false);

        DEBUG && console.log("Start playing...");
        root.start();
      }

      function resize() {

        width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
        height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

        canvas.width = width;
        canvas.height = height;

        DEBUG && console.log("Resize: " + width + " x " + height);

        root.visit({
          start : function(cut) {
            var stop = true;
            var listeners = cut.listeners("resize");
            if (listeners) {
              for (var l = 0; l < listeners.length; l++)
                stop &= !listeners[l].call(cut, width, height);
            }
            return stop;
          }
        });
      }

      return root;
    }

    if (this.played) {
      this.roots.push(loader());
    } else {
      this.loaders.push(loader);
    }

  }
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