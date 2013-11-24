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

  var last = null;
  var column = C.column().appendTo(root).align(0.5);
  for ( var j = 0; j < 9; j++) {
    var row = C.row().id("row" + j).appendTo(column);
    for ( var i = 0; i < 9; i++) {
      // colors as frames
      var box = C.anim("boxes:box_").id(j + "-" + i).appendTo(row);

      box.attr(Mouse.ON_MOVE, function(ev, point) {
        if (this !== last) {
          last = this;
          animateBox.bind(this)();
        }
        return true;
      });
    }
  }

  // only register root
  Mouse.listen(root, true);

  root.paint = function() {
    // tick tween.js
    TWEEN.update();
  };

  root.resize = function(width, height) {
    // size relative to graphics, resize to fit in screen
    this.size(500, 500).scaleTo(width, height, C.scale.fit, true);
  };

  return root;
}

// animate box using tween.js
function animateBox(reset) {

  // random color
  !reset && this.randomFrame();

  // tweening objects
  var tweening = this.tweening = this.tweening || {};

  // tweening current values
  var value = tweening.value = tweening.value || {};

  // tweening target values
  var target = tweening.target = tweening.target || {};

  target.scaleX = reset ? 0 : random(-0.1, 0.4);
  target.scaleY = reset ? 0 : random(-0.1, 0.4);
  target.rotation = reset ? Math.round(value.rotation / Math.PI) * Math.PI
      : random(-Math.PI, Math.PI);
  target.skewX = reset ? 0 : random(0, 0.4);
  target.skewY = reset ? 0 : random(0, 0.4);
  target.pivotX = reset ? 0 : random(0.2, 0.8);
  target.pivotY = reset ? 0 : random(0.2, 0.8);

  if (tweening.tween) {
    tweening.tween.stop();
  } else {
    tweening.tween = new TWEEN.Tween(value).onUpdate(function(t) {
      var value = this.tweening.value;
      this.scale(1 + value.scaleX, 1 + value.scaleY);
      this.rotate(value.rotation);
      this.skew(value.skewX, value.skewY);
      this.pivot(value.pivotX, value.pivotY);
    }.bind(this));
  }

  tweening.tween.to(target, reset ? random(10000, 20000) : 3000).start();

  this.touch();
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