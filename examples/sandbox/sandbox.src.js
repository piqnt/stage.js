// create shortcut
var C = Cutout, U = CutoutUtils;

// UI root
function Game(canvas) {
  Game.prototype._super.call(this);

  this.canvas = canvas;

  this.addboxes();

  this.resize();
  window.addEventListener("resize", this.resize.bind(this), false);

  Mouse.listen(this, true);
}

// game is a cutout
Game.prototype = new Cutout();
Game.prototype._super = Cutout;
Game.prototype.constructor = Game;

Game.prototype.paint = function() {
  // tick tweening
  TWEEN.update();
};

Game.prototype.resize = function() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

  console.log("Size: " + width + " x " + height);

  // resize canvas
  this.canvas.width = width;
  this.canvas.height = height;

  // size relative to image graphics, scaled to fit in screen
  this.size(500, 500).scaleTo(width, height, C.scale.fit);

  // move it to center
  this.align(C.align.center, C.align.center).offset(width / 2, height / 2);
};

Game.prototype.addboxes = function() {

  var last = null;
  var column = C.column().appendTo(this).align(C.align.center);
  for ( var j = 0; j < 9; j++) {
    var row = C.row().appendTo(column);
    for ( var i = 0; i < 9; i++) {
      // colors as frames
      var box = C.anim("boxes", "box_").id(i).appendTo(row);

      box.attr(Mouse.ON_MOVE, function(ev, point) {
        if (this !== last) {
          last = this;
          play.bind(this)();
        }
      });
    }
  }

  function play(reset) {

    // random color
    !reset && this.randomFrame();

    // tweening objects
    var tweening = this.tweening = this.tweening || {};

    // tweening current values
    var value = tweening.value = tweening.value || {};

    // tweening target values
    var target = tweening.target = tweening.target || {};

    target.scaleX = reset ? 0 : U.random(-0.1, 0.4);
    target.scaleY = reset ? 0 : U.random(-0.1, 0.4);
    target.rotation = reset ? Math.round(value.rotation / Math.PI) * Math.PI
        : U.random(-Math.PI, Math.PI);
    target.skewX = reset ? 0 : U.random(0, 0.4);
    target.skewY = reset ? 0 : U.random(0, 0.4);
    target.cx = reset ? 0 : U.random(-0.4, 0.4);
    target.cy = reset ? 0 : U.random(-0.4, 0.4);

    if (tweening.tween) {
      tweening.tween.stop();
    } else {
      tweening.tween = new TWEEN.Tween(value).onUpdate(function(t) {
        var value = this.tweening.value;
        this.scale(1 + value.scaleX, 1 + value.scaleY);
        this.rotate(value.rotation);
        this.skew(value.skewX, value.skewY);
        this.pivot(value.cx, value.cy);
      }.bind(this));
    }

    tweening.tween.onComplete(function() {
      tweening.reset && window.clearTimeout(tweening.reset);
      tweening.reset = window.setTimeout(function() {
        tweening.reset = null;
        if (reset) {
          this.gotoFrame(1);
        } else {
          play.bind(this)(true);
        }
      }.bind(this), reset ? U.random(5000, 10000) : U.random(1000, 3000));
    }.bind(this));

    tweening.tween.to(target, reset ? U.random(10000, 20000) : 2000).start();

    return true;
  }
};

// register texture(s)
Cutout.addTexture({
  name : "boxes",
  imagePath : "boxes.png",
  imageRatio : 2,
  cuts : [
      { name : "box_d", x : 0, y : 0, width : 30, height : 30 },
      { name : "box_l", x : 0, y : 30, width : 30, height : 30 },
      { name : "box_r", x : 30, y : 0, width : 30, height : 30 },
      { name : "box_p", x : 30, y : 30, width : 30, height : 30 },
      { name : "box_b", x : 60, y : 0, width : 30, height : 30 },
      { name : "box_o", x : 60, y : 30, width : 30, height : 30 },
      { name : "box_y", x : 90, y : 0, width : 30, height : 30 },
      { name : "box_g", x : 90, y : 30, width : 30, height : 30 },
  ] });

// loading process
window.addEventListener("load", function() {
  console.log("On load.");
  console.log("Initing...");

  var game = null, canvas = null, context = null;

  canvas = document.createElement("canvas");
  canvas.style.position = "absolute";

  var body = document.body;
  body.insertBefore(canvas, body.firstChild);

  context = canvas.getContext("2d");

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
    console.log("Starting...");
    game = new Game(canvas);
    requestAnimationFrame(render);
  }

  function render() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.render(context);
    requestAnimationFrame(render);
  }

}, false);