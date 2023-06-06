import Stage from '../../src';
import '../common/texture';

var stage = Stage.mount();

var Mouse = Stage.Mouse;

stage.viewbox(300, 100);

var row = Stage.row().appendTo(stage).pin('align', 0.5).spacing(1);

Stage.anim('rainbow').appendTo(row).on(Mouse.CLICK, function(point) {
  this.moveFrame(1);
}).label('click');

Stage.anim('rainbow').appendTo(row).on(Mouse.START, function(point) {
  this.moveFrame(1);
}).label('start');

Stage.anim('rainbow').appendTo(row).on(Mouse.END, function(point) {
  this.moveFrame(1);
}).label('end');

var cursor = Stage.image('circle').pin({
  handle : 0.5
}).appendTo(stage);

var down = false;
stage.on(Mouse.START, function(point) {
  down = true;
  cursor.pin({
    offsetX : point.x,
    offsetY : point.y,
    alpha : 1,
    scale : 1
  });
}).on(Mouse.MOVE, function(point) {
  if (down) {
    cursor.pin({
      offsetX : point.x,
      offsetY : point.y,
      alpha : 1,
      scale : 2
    });
  }
}).on(Mouse.END, function(point) {
  down = false;
  cursor.pin({
    offsetX : point.x,
    offsetY : point.y,
    alpha : 1,
    scale : 1
  });
}).on(Mouse.CANCEL, function() {
  down = false;
  cursor.pin({
    alpha : 0.6,
    scale : 1
  });
});
