import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

let math = Stage.math;

stage.viewbox(400, 100);

let last = null;
let colors = ["green", "blue", "purple", "red", "orange", "yellow"];

let row = Stage.row(0.5).appendTo(stage).pin("align", 0.5).spacing(1);
for (let i = 0; i < colors.length; i++) {
  Stage.sprite(colors[i])
    .appendTo(row)
    .on(Stage.POINTER_MOVE, function (point) {
      if (this != last) {
        last = this;
        this.tween().pin({
          scaleX: math.random(0.8, 1.6),
          scaleY: math.random(0.8, 1.6),
        });
      }
      return true;
    });
}
