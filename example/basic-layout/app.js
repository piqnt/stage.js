import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

const math = Stage.math;

stage.viewbox(500, 300);

stage.on("click", function (point) {
  bar1.tween().pin("width", math.random(20, 100) | 0);
  bar2.tween().pin("width", math.random(20, 100) | 0);
  bar3.tween().pin("width", math.random(20, 100) | 0);
  bar4.tween().pin("width", math.random(20, 100) | 0);
  bar5.tween().pin("height", math.random(20, 100) | 0);
  bar6.tween().pin("height", math.random(20, 100) | 0);
  bar7.tween().pin("height", math.random(20, 100) | 0);
  bar8.tween().pin("height", math.random(20, 100) | 0);
});

const bar1 = Stage.sprite("box").stretch();
const bar2 = Stage.sprite("box").stretch();
const bar3 = Stage.sprite("box").stretch();
const bar4 = Stage.sprite("box").stretch();
const bar5 = Stage.sprite("box").stretch();
const bar6 = Stage.sprite("box").stretch();
const bar7 = Stage.sprite("box").stretch();
const bar8 = Stage.sprite("box").stretch();

Stage.column(1)
  .append(bar1, bar2)
  .appendTo(stage)
  .pin({
    alignX: 1,
    alignY: 0,
    offsetX: -10,
    offsetY: 10,
  })
  .label("topleft");

Stage.column(0)
  .append(bar3, bar4)
  .appendTo(stage)
  .pin({
    alignX: 0,
    alignY: 1,
    offsetX: 10,
    offsetY: -10,
  })
  .label("bottomright");

Stage.row(0)
  .append(bar5, bar6)
  .appendTo(stage)
  .pin({
    alignX: 0,
    alignY: 0,
    offsetX: 10,
    offsetY: 10,
  })
  .label("topleft");

Stage.row(1)
  .append(bar7, bar8)
  .appendTo(stage)
  .pin({
    alignX: 1,
    alignY: 1,
    offsetX: -10,
    offsetY: -10,
  })
  .label("bottomleft");
