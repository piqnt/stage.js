import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

stage.viewbox(100, 100);

let toggle = true;

const box = Stage.anim("rainbow");
box.appendTo(stage);
box.pin("align", 0.5);
box.fps(4);
box.on("click", function (point) {
  if (toggle) {
    console.log("play");
    this.play();
  } else {
    console.log("stop");
    this.stop();
  }
  toggle = !toggle;
});
