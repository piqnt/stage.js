import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var Math = Stage.Math, Mouse = Stage.Mouse;

stage.viewbox(300, 200);

var box = Stage.sprite('box').box().stretch().padding(10).pin('align', 0.5)
    .appendTo(stage);

var number = Stage.string('digit').value('0123456789').pin('align', 0.5)
    .appendTo(box);

stage.on(Mouse.CLICK, function(point) {
  var range = Math.pow(10, Math.random(0, 10) | 0);
  number.value(Math.random(0, range) | 0);
});
