if (typeof DEBUG === 'undefined')
  DEBUG = true;

var C = Cutout;

function Game() {
  Game.prototype._super.call(this);
  this.spy = true;

  var column = C.column(C.align.center).align(C.align.center).appendTo(this);
  for ( var j = 0; j < 9; j++) {
    var row = C.row(C.align.center).appendTo(column);
    for ( var i = 0; i < 9; i++) {
      C.anim("boxes", "box_").id(i).appendTo(row).attr(Mouse.ON_MOVE, click)
          .align(null, C.align.center);
    }
  }

  var last = null;

  function click(ev, point) {
    if (this !== last) {
      last = this;
      play.bind(this)();
    }
  }

  function play(reset) {

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

    if (!reset) {
      // tweening.reset && window.clearTimeout(tweening.reset);
      // tweening.reset = window.setTimeout(function() {
      // play.bind(this)(true);
      // }.bind(this), U.random(5000, 25000));
    }

    return true;
  }

  this.resize();

  window.addEventListener("resize", this.resize.bind(this), false);

  Mouse.listen(this, true);
}

Game.prototype = new C();
Game.prototype._super = C;
Game.prototype.constructor = Game;

Game.prototype.paint = function() {
  TWEEN.update();
};

Game.prototype.resize = function() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

  DEBUG && console.log("Size: " + width + " x " + height);

  this.size(1000, 1000).scaleTo(width, height, "fit");

  this.align(C.align.center, C.align.center).offset(width / 2, height / 2);

  this.postNotif(C.notif.size);
};
