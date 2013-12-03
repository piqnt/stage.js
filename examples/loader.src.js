DEBUG = typeof DEBUG === 'undefined' || DEBUG;

// A simple full-screen and resizable loader.
window.addEventListener("load", function() {
  Cut.Loader.start();
}, false);

Cut.Loader = {
  start : function() {
    this.started = true;
    for ( var i = this.loaders.length - 1; i >= 0; i--) {
      this.loaders[i]();
      this.loaders.splice(i, 1);
    }
  },
  loaders : [],
  load : function(app, canvas) {
    function loader() {
      var context, root, player, full = false;

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
        root = app();

        resize();
        window.addEventListener("resize", resize, false);

        DEBUG && console.log("Playing...");
        player = Cut.Player.play(root, function(root) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          root.render(context);
        }, requestAnimationFrame);
      }

      function resize() {
        var width, height;
        if (full) {
          width = canvas.width = (window.innerWidth > 0 ? window.innerWidth
              : screen.width);
          height = canvas.height = (window.innerHeight > 0 ? window.innerHeight
              : screen.height);
        } else {
          width = canvas.width;
          height = canvas.height;
        }

        DEBUG && console.log("Resize to: " + width + " x " + height);

        root.resize && root.resize(width, height);
      }
    }

    if (this.started) {
      loader();
    } else {
      this.loaders.push(loader);
    }
  }
};