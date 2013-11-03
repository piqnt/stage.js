window.addEventListener("load", function() {
  DEBUG && console.log("On load.");

  var game = null, canvas = null, context = null, paused = false;

  function init() {
    DEBUG && console.log("Initing...");

    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    canvas.height = (window.innerHeight > 0) ? window.innerHeight
        : screen.height;

    var body = document.body;
    body.insertBefore(canvas, body.firstChild);

    context = canvas.getContext("2d");

    Cutout.loadImages(function(src, handleComplete, handleError) {
      var image = new Image();
      DEBUG && console.log("Loading: " + src);
      image.onload = handleComplete;
      image.onerror = handleError;
      image.src = src;
      return image;
    }, start);
  }

  function start() {
    DEBUG && console.log("Images loaded.");
    DEBUG && console.log("Starting...");
    game = new Game();
    resume();
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
    requestAnimationFrame(render);
  }

  function render() {
    if (paused === true) {
      return;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.render(context);
    requestAnimationFrame(render);
  }

  init();

}, false);