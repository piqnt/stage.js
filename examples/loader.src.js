// simple full-screen and resizable loader

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
  load : function(app) {
    var loader = function() {
      var canvas, context, root, player;

      console.log("Loading images...");
      Cut.loadImages(function(src, handleComplete, handleError) {
        var image = new Image();
        console.log("Loading image: " + src);
        image.onload = handleComplete;
        image.onerror = handleError;
        image.src = src;
        return image;
      }, start);

      function start() {
        console.log("Images loaded.");

        console.log("Creating canvas...");
        canvas = document.createElement("canvas");
        canvas.style.position = "absolute";

        var body = document.body;
        body.insertBefore(canvas, body.firstChild);

        context = canvas.getContext("2d");

        console.log("Creating root...");

        console.log("Starting...");
        root = app();

        console.log("Resize...");
        resize();

        player = root.start(function(root) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          root.render(context);
        }, requestAnimationFrame);

        window.addEventListener("resize", resize, false);
      }

      function resize() {
        width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
        height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

        console.log("Resize: " + width + " x " + height);

        canvas.width = width;
        canvas.height = height;

        root.resize && root.resize(width, height);
      }
    };
    if (this.started) {
      loader();
    } else {
      this.loaders.push(loader);
    }
    return loader;
  }
};