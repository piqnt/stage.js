import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var math = Stage.math;

stage.viewbox(400, 100);

var last = null;
var colors = [ 'green', 'blue', 'purple', 'red', 'orange', 'yellow' ];

var row = Stage.row(0.5).appendTo(stage).pin('align', 0.5).spacing(1);
for (var i = 0; i < colors.length; i++) {
  Stage.sprite(colors[i]).appendTo(row).on(Stage.Mouse.MOVE, function(point) {
    if (this != last) {
      last = this;
      this.tween().pin({
        scaleX : math.random(0.8, 1.6),
        scaleY : math.random(0.8, 1.6)
      });
    }
    return true;
  });
}
