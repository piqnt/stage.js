import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var math = Stage.math;

stage.viewbox(400, 100);

var last = null;
var colors = [ 'green', 'blue', 'purple', 'red', 'orange', 'yellow' ];

var row = Stage.row().appendTo(stage).pin('align', 0.5).spacing(1);
for (var i = 0; i < colors.length; i++) {
  Stage.sprite(colors[i]).appendTo(row).pin('pivot', 0.5).on(Stage.Mouse.MOVE,
      function(point) {
        if (this != last) {
          last = this;
          this.tween().pin({
            scaleX : math.random(0.9, 1.4),
            scaleY : math.random(0.9, 1.4),
            skewX : math.random(0, 0.4),
            skewY : math.random(0, 0.4),
            rotation : math.random(-math.PI, math.PI),
            pivotX : math.random(0.3, 0.7),
            pivotY : math.random(0.3, 0.7)
          });
        }
        return true;
      });
}
