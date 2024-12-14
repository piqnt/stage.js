import Stage from "../../src";
import "../common/texture";

await Stage.atlas({
  name: "box",
  image: "box.png",
});

const stage = Stage.mount();

stage.viewbox(1000, 1000).pin("handle", -0.5);

let matrix = new Stage.Matrix();

Stage.sprite("box")
  .appendTo(stage)
  .pin("handle", 0.5)
  .pin(
    "matrix",
    matrix
      .identity()
      .rotate(Math.PI / 4)
      .scale(1, 0.5),
  );

Stage.sprite("box")
  .appendTo(stage)
  .pin("handle", 0.5)
  .pin(
    "matrix",
    matrix
      .identity()
      .scale(1, 0.5)
      .rotate(Math.PI / 4),
  );
