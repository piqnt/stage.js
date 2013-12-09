/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the BSD and MIT licenses
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

/**
 * PhoneGap FastCanvas plugin loader.
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
      var result = {}, context, root;

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

        canvas = FastCanvas.create();
        context = canvas.getContext("2d");

        DEBUG && console.log("Creating root...");
        root = app(canvas);

        resize();
        window.addEventListener("resize", resize, false);

        DEBUG && console.log("Playing...");
        result.player = Cut.Player.play(root, function(root) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          root.render(context);
          FastCanvas.render();
        }, requestAnimationFrame);
      }

      function resize() {
        var width, height;
        width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
        height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

        canvas.width = width;
        canvas.height = height;

        DEBUG && console.log("Resize to: " + width + " x " + height);

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