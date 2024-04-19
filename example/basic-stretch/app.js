import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

let math = Stage.math;

stage.viewbox(200, 200);

Stage.sprite("box")
  .stretch()
  .appendTo(stage)
  .pin({
    width: 64,
    height: 64,
    align: 0.5,
  })
  .on("click", function () {
    this.tween().pin({
      width: math.random(32, 96),
      height: math.random(32, 96),
    });
    return true;
  });
