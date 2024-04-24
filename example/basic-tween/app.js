import Stage from "../../src";
import "../common/texture";

let stage = Stage.mount();

stage.viewbox(400, 100);

let x = 50;

let result = Stage.monotype("digit")
  .appendTo(stage)
  .pin("align", 0.5)
  .alpha(1.0)
  .offset(x, -20)
  .value(0);
let eager = Stage.monotype("digit")
  .appendTo(stage)
  .pin("align", 0.5)
  .alpha(0.7)
  .offset(x, 0)
  .value(0);
let lazy = Stage.monotype("digit")
  .appendTo(stage)
  .pin("align", 0.5)
  .alpha(0.4)
  .offset(x, +20)
  .value(0);

stage.on("click", function (point) {
  x = -x;
  result
    .tween(600)
    .pin("offsetX", x)
    .done(function () {
      this.value(this.value() + 1);
    });
  eager
    .tween(600, true)
    .pin("offsetX", x)
    .done(function () {
      this.value(this.value() + 1);
    });
  lazy
    .tween(600, 300, true)
    .pin("offsetX", x)
    .done(function () {
      this.value(this.value() + 1);
    });
});
