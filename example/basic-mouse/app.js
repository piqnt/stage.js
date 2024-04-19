import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

stage.viewbox(300, 100);

let row = Stage.row().appendTo(stage).pin("align", 0.5).spacing(1);

Stage.anim("rainbow")
  .appendTo(row)
  .on("click", function (point) {
    this.moveFrame(1);
  })
  .label("click");

Stage.anim("rainbow")
  .appendTo(row)
  .on(Stage.POINTER_START, function (point) {
    this.moveFrame(1);
  })
  .label("start");

Stage.anim("rainbow")
  .appendTo(row)
  .on(Stage.POINTER_END, function (point) {
    this.moveFrame(1);
  })
  .label("end");

let cursor = Stage.sprite("circle")
  .pin({
    handle: 0.5,
  })
  .appendTo(stage);

let down = false;

stage.on(Stage.POINTER_START, function (point) {
  down = true;
  cursor.pin({
    offsetX: point.x,
    offsetY: point.y,
    alpha: 1,
    scale: 1,
  });
});

stage.on(Stage.POINTER_MOVE, function (point) {
  if (down) {
    cursor.pin({
      offsetX: point.x,
      offsetY: point.y,
      alpha: 1,
      scale: 2,
    });
  }
});

stage.on(Stage.POINTER_END, function (point) {
  down = false;
  cursor.pin({
    offsetX: point.x,
    offsetY: point.y,
    alpha: 1,
    scale: 1,
  });
});

stage.on(Stage.POINTER_CANCEL, function () {
  down = false;
  cursor.pin({
    alpha: 0.6,
    scale: 1,
  });
});
