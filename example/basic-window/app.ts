import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

const math = Stage.math;

stage.viewbox(300, 200);

const window = Stage.sprite("dark")
  .minimize()
  .stretch()
  .pin("align", 0.5)
  .pin("textureAlpha", 0.5)
  .padding(7)
  .appendTo(stage);

const column = Stage.column(1).pin("align", 0.5).spacing(5).appendTo(window);

const text = Stage.monotype("digit").value("0123456789").appendTo(column);

const row = Stage.row().appendTo(column).spacing(1);

Stage.sprite("red")
  .minimize()
  .stretch()
  .appendTo(row)
  .append(Stage.monotype("digit").value("1"))
  .on("click", function () {
    const range = math.pow(10, math.random(0, 10) | 0);
    text.value(math.random(0, range) | 0);
  });

Stage.sprite("blue")
  .minimize()
  .stretch()
  .appendTo(row)
  .append(Stage.monotype("digit").value("2"))
  .on("click", function () {
    const range = math.pow(10, math.random(0, 10) | 0);
    text.value(math.random(0, range) | 0);
  });
