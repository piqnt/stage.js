import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

let math = Stage.math;

stage.viewbox(300, 200);

let box = Stage.sprite("box")
  .minimize()
  .stretch()
  .padding(10)
  .pin("align", 0.5)
  .appendTo(stage);

let number = Stage.monotype("digit").value("0123456789").pin("align", 0.5).appendTo(box);

stage.on("click", function (point) {
  let range = math.pow(10, math.random(0, 10) | 0);
  number.value(math.random(0, range) | 0);
});
