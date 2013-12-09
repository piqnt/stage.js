/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the BSD and MIT licenses
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

/**
 * Simple full-screen and resizable loader for web.
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
    Cut.Loader.play();
  },
  play : function() {
    this.played = true;
    for ( var i = this.loaders.length - 1; i >= 0; i--) {
      this.players.push(this.loaders[i]());
      this.loaders.splice(i, 1);
    }
  },
  pause : function() {
    for ( var i = this.loaders.length - 1; i >= 0; i--) {
      this.players[i].player.pause();
    }
  },
  resume : function() {
    for ( var i = this.loaders.length - 1; i >= 0; i--) {
      this.players[i].player.resume();
    }
  },
  loaders : [],
  players : [],
  load : function(app, canvas) {
    function loader() {
      var result = {}, context, root, full = false;
      var width = 0, height = 0;
      var devicePixelRatio = 1, backingStoreRatio = 1, ratio = 1;

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

        if (!canvas) {
          canvas = document.getElementById("cutout");
        }

        if (!canvas) {
          full = true;
          DEBUG && console.log("Creating canvas...");
          canvas = document.createElement("canvas");
          canvas.style.position = "absolute";
          var body = document.body;
          body.insertBefore(canvas, body.firstChild);
        }

        context = canvas.getContext("2d");

        DEBUG && console.log("Creating root...");
        root = app(canvas);

        devicePixelRatio = window.devicePixelRatio || 1;
        backingStoreRatio = context.webkitBackingStorePixelRatio
            || context.mozBackingStorePixelRatio
            || context.msBackingStorePixelRatio
            || context.oBackingStorePixelRatio
            || context.backingStorePixelRatio || 1;

        ratio = devicePixelRatio / backingStoreRatio;

        resize();
        window.addEventListener("resize", resize, false);

        DEBUG && console.log("Playing...");
        result.player = Cut.Player.play(root, function(root) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, width, height);
          root.render(context);
        }, requestAnimationFrame);
      }

      function resize() {

        if (full) {
          width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
          height = (window.innerHeight > 0 ? window.innerHeight : screen.height);
        } else {
          width = canvas.clientWidth;
          height = canvas.clientHeight;
        }

        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        DEBUG
            && console.log("Resize to: " + width + " x " + height + " / "
                + ratio);

        // alert(ratio);

        canvas.ratio = ratio;

        root.resize && root.resize(width, height);
      }

      return result;
    }

    if (this.played) {
      this.players.push(loader());
    } else {
      this.loaders.push(loader);
    }

  }
};