if (typeof DEBUG === 'undefined')
  DEBUG = true;

function Game() {
  Game.prototype._super.call(this);
  this.spy = true;

  var column = Cutout.column(0).align(0, 0).appendTo(this);
  for ( var j = 0; j < 11; j++) {
    var row = Cutout.row(0).appendTo(column);
    row.height = 60;
    for ( var i = 0; i < 11; i++) {
      Cutout.anim("boxes", "box_").id(i).appendTo(row).attr("handleMouseMove",
          click).align(null, 0);
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
      if (reset) {
        tweening.reset = window.setTimeout(function() {
          this.gotoFrame(1);
          tweening.reset = null;
        }.bind(this), U.random(2000, 12000));
      }
    }.bind(this));

    tweening.tween.to(target, reset ? U.random(5000, 10000) : 2000).repeat(0)
        .yoyo(false).start();

    if (!reset) {
      tweening.reset && window.clearTimeout(tweening.reset);
      tweening.reset = window.setTimeout(function() {
        play.bind(this)(true);
      }.bind(this), U.random(5000, 25000));
    }

    return true;
  }

  this.resize();

  window.addEventListener("resize", this.resize.bind(this), false);

  Mouse.listen(this, true);
}

Game.prototype = new Cutout();
Game.prototype._super = Cutout;
Game.prototype.constructor = Game;

Game.prototype.paint = function() {
  TWEEN.update();
};

Game.prototype.resize = function() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  this.ratio = window.devicePixelRatio || 1;

  DEBUG && console.log("Size: " + width + " x " + height + " / " + this.ratio);

  this.height = 1000;
  this.width = 1000;

  this.scaleTo(width / this.ratio, height / this.ratio, "fit");

  this.align(0, 0).translate(width / 2, height / 2);

  this.notif(Cutout.on_size);
};
