import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var math = Stage.math;

stage.viewbox(300, 200);

var box = Stage.sprite('box').box().stretch().padding(10).pin('align', 0.5)
    .appendTo(stage);

var number = Stage.string('digit').value('0123456789').pin('align', 0.5)
    .appendTo(box);

stage.on(Stage.Mouse.CLICK, function(point) {
  var range = math.pow(10, math.random(0, 10) | 0);
  number.value(math.random(0, range) | 0);
});
