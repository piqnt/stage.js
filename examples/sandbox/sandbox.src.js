// create shortcut
var C = Cutout;

// regster loading process
window.addEventListener("load", function() {
  console.log("Page loaded. Initing...");
  load(rootMaker);
}, false);

// UI root maker
function rootMaker() {

  var root = new Cutout();

  var column = C.column().appendTo(root).align(0.5);
  for ( var j = 0; j < 9; j++) {
    var row = C.row().id("row" + j).appendTo(column);
    for ( var i = 0; i < 9; i++) {
      // colors as frames
      var box = C.anim("boxes:box_").id(j + "-" + i).appendTo(row);

      box.attr(Mouse.ON_MOVE, function(ev, point) {
        animateBox(this);
        return true;
      });
    }
  }

  // only register root
  Mouse.listen(root, true);

  // tick tween.js
  root.addTicker(function() {
    TWEEN.update();
  }, true);

  root.resize = function(width, height) {
    // size relative to graphics, resize to fit in screen
    this.size(500, 500).scaleTo(width, height, C.scale.fit, true);
  };

  return root;
}

var last = null;

function animateBox(box) {

  if (box == last) {
    return;
  }
  last = box;

  // random color
  box.randomFrame();

  // animate box using tween.js
  if (!box.tween) {
    box.tween = new TWEEN.Tween({});
  } else {
    box.tween.stop();
  }

  box.tween.to({
    scaleX : random(-0.1, 0.4),
    scaleY : random(-0.1, 0.4),
    rotation : random(-Math.PI, Math.PI),
    skewX : random(0, 0.4),
    skewY : random(0, 0.4),
    pivotX : random(-0.3, 0.3),
    pivotY : random(-0.3, 0.3)
  }, random(2000, 5000)).onUpdate(function(t) {
    box.scale(1 + this.scaleX, 1 + this.scaleY);
    box.rotate(this.rotation);
    box.skew(this.skewX, this.skewY);
    box.pivot(0.5 + this.pivotX, 0.5 + this.pivotY);
  }).start();

}

// reusable loader
function load(rootMaker) {
  var canvas, context, root, player;

  console.log("Loading images...");
  Cutout.loadImages(function(src, handleComplete, handleError) {
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
    root = rootMaker();

    console.log("Resize...");
    resize();
    window.addEventListener("resize", resize, false);

    console.log("Starting...");
    player = root.start(function(root) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      root.render(context);
    }, requestAnimationFrame);
  }

  function resize() {
    width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
    height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

    console.log("Resize: " + width + " x " + height);

    canvas.width = width;
    canvas.height = height;

    root.resize && root.resize(width, height);
  }
}

function random(min, max) {
  if (arguments.length == 0) {
    max = 1, min = 0;
  } else if (arguments.length == 1) {
    max = min, min = 0;
  }
  if (min == max) {
    return min;
  }
  return Math.random() * (max - min) + min;
}

// register texture(s)
Cutout.addTexture({
  name : "boxes",
  imagePath : "boxes.png",
  imageRatio : 2,
  cuts : [
    { name : "box_d", x : 0,  y : 0,  width : 30, height : 30 },
    { name : "box_l", x : 0,  y : 30, width : 30, height : 30 },
    { name : "box_r", x : 30, y : 0,  width : 30, height : 30 },
    { name : "box_p", x : 30, y : 30, width : 30, height : 30 },
    { name : "box_b", x : 60, y : 0,  width : 30, height : 30 },
    { name : "box_o", x : 60, y : 30, width : 30, height : 30 },
    { name : "box_y", x : 90, y : 0,  width : 30, height : 30 },
    { name : "box_g", x : 90, y : 30, width : 30, height : 30 }
  ]
});