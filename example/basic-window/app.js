import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

let math = Stage.math;

stage.viewbox(300, 200);

let window = Stage.sprite("dark")
  .minimize()
  .stretch()
  .pin("align", 0.5)
  .pin("textureAlpha", 0.5)
  .padding(7)
  .appendTo(stage);

let column = Stage.column(1).pin("align", 0.5).spacing(5).appendTo(window);

let text = Stage.monotype("digit").value("0123456789").appendTo(column);

let row = Stage.row().appendTo(column).spacing(1);

Stage.sprite("red")
  .minimize()
  .stretch()
  .appendTo(row)
  .append(Stage.monotype("digit").value("1"))
  .on("click", function () {
    let range = math.pow(10, math.random(0, 10) | 0);
    text.value(math.random(0, range) | 0);
  });

Stage.sprite("blue")
  .minimize()
  .stretch()
  .appendTo(row)
  .append(Stage.monotype("digit").value("2"))
  .on("click", function () {
    let range = math.pow(10, math.random(0, 10) | 0);
    text.value(math.random(0, range) | 0);
  });
