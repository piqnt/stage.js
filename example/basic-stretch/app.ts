import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

const math = Stage.math;

stage.viewbox(200, 200);

const box = Stage.sprite("box");
box.stretch();
box.appendTo(stage);
box.pin({
  width: 64,
  height: 64,
  align: 0.5,
});
box.on("click", function () {
  this.tween().pin({
    width: math.random(32, 96),
    height: math.random(32, 96),
  });
  return true;
});
