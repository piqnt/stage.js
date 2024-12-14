import Stage from "../../src";
import "../common/texture.js";

const stage = Stage.mount();

let math = Stage.math;

stage.viewbox(300, 300);

let last = null;

let j = 0,
  i = 0;
let column = Stage.column().appendTo(stage).pin("align", 0.5).spacing(1);
for (j = 0; j < 9; j++) {
  let row = Stage.row().appendTo(column).spacing(1);
  for (i = 0; i < 9; i++) {
    // colors as frames
    let cell = Stage.anim("rainbow").appendTo(row).pin("pivot", 0.5);
    cell.on(Stage.POINTER_MOVE, function (point) {
      if (this != last) {
        last = this;
        // random frame = random color
        this.gotoFrame(math.random(this.length()));
        this.tween(math.random(2000, 5000)).pin({
          scaleX: math.random(0.9, 1.4),
          scaleY: math.random(0.9, 1.4),
          skewX: math.random(0, 0.4),
          skewY: math.random(0, 0.4),
          rotation: math.random(-math.PI, math.PI),
          pivotX: math.random(0.3, 0.7),
          pivotY: math.random(0.3, 0.7),
        });
      }
      return true;
    });
  }
}
