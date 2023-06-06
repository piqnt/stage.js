import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var math = Stage.math;

stage.viewbox(300, 200);

var window = Stage.sprite('dark').box().stretch().pin('align', 0.5).pin(
    'textureAlpha', 0.5).padding(7).appendTo(stage);

var column = Stage.column(1).pin('align', 0.5).spacing(5).appendTo(window);

var text = Stage.string('digit').value('0123456789').appendTo(column);

var row = Stage.row().appendTo(column).spacing(1);

Stage.sprite('red').box().stretch().appendTo(row).append(
    Stage.string('digit').value('1')).on(Stage.Mouse.CLICK, function() {
  var range = math.pow(10, math.random(0, 10) | 0);
  text.value(math.random(0, range) | 0);
});

Stage.sprite('blue').box().stretch().appendTo(row).append(
    Stage.string('digit').value('2')).on(Stage.Mouse.CLICK, function() {
  var range = math.pow(10, math.random(0, 10) | 0);
  text.value(math.random(0, range) | 0);
});
