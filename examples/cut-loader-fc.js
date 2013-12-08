DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

// PhoneGap FastCanvas plugin loader.
window.addEventListener("load", function() {

  DEBUG && console.log("On load.");

  // device ready not called; must be in a browser
  var readyTimeout = setTimeout(function() {
    DEBUG && console.log("On deviceready timeout.");
    Cut.Loader.start();
  }, 2000);

  document.addEventListener("deviceready", function() {
    DEBUG && console.log("On deviceready.");
    clearTimeout(readyTimeout);

    document.addEventListener("pause", function() {
      Cut.Loader.pause();
    }, false);
    document.addEventListener("resume", function() {
      Cut.Loader.resume();
    }, false);

    Cut.Loader.start();
  }, false);
}, false);

Cut.Loader = {
  start : function() {
    this.started = true;
    for ( var i = this.loaders.length - 1; i >= 0; i--) {
      this.loaders[i]();
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
      var context, root, player;

      DEBUG && console.log("Loading images...");
      Cut.loadImages(function(src, handleComplete, handleError) {
        var image = new Image();
        DEBUG && console.log("Loading image: " + src);
        image.onload = handleComplete;
        image.onerror = handleError;
        image.src = src;
        return image;
      }, start);

      function start() {
        DEBUG && console.log("Images loaded.");

        canvas = FastCanvas.create();
        context = canvas.getContext("2d");

        DEBUG && console.log("Creating root...");
        root = app(canvas);

        resize();
        window.addEventListener("resize", resize, false);

        DEBUG && console.log("Playing...");
        player = Cut.Player.play(root, function(root) {
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
      return player;
    }

    if (this.started) {
      this.players.push(loader());
    } else {
      this.loaders.push(loader);
    }
    this.players.push(loader);

  }
};