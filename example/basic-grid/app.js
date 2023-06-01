import Stage from '../../src';
import '../common/texture.js';

Stage(function(stage) {

  var Math = Stage.Math, Mouse = Stage.Mouse;

  stage.viewbox(300, 300);

  var last = null;

  var j = 0, i = 0;
  var column = Stage.column().appendTo(stage).pin('align', 0.5).spacing(1);
  for (j = 0; j < 9; j++) {
    var row = Stage.row().appendTo(column).spacing(1);
    for (i = 0; i < 9; i++) {
      // colors as frames
      var cell = Stage.anim('rainbow').appendTo(row).pin('pivot', 0.5);
      cell.on(Mouse.MOVE, function(point) {
        if (this != last) {
          last = this;
          // random frame = random color
          this.gotoFrame(Math.random(this.length()));
          this.tween(Math.random(2000, 5000)).pin({
            scaleX : Math.random(0.9, 1.4),
            scaleY : Math.random(0.9, 1.4),
            skewX : Math.random(0, 0.4),
            skewY : Math.random(0, 0.4),
            rotation : Math.random(-Math.PI, Math.PI),
            pivotX : Math.random(0.3, 0.7),
            pivotY : Math.random(0.3, 0.7)
          });
        }
        return true;
      });
    }
  }

});