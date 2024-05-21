import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

const math = Stage.math;

stage.viewbox(300, 200);

const box = Stage.sprite("box");
box.minimize();
box.stretch();
box.padding(10);
box.pin("align", 0.5);
box.appendTo(stage);

const number = Stage.monotype("digit").value("0123456789").pin("align", 0.5).appendTo(box);

stage.on("click", function (point) {
  const range = math.pow(10, math.random(0, 10) | 0);
  number.value(math.random(0, range) | 0);
});
