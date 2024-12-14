import Stage from "../../src";
import "../common/texture";

const stage = Stage.mount();

stage.viewbox(100, 100);

let toggle = true;
Stage.anim("rainbow")
  .appendTo(stage)
  .pin("align", 0.5)
  .fps(4)
  .on("click", function (point) {
    if (toggle) {
      console.log("play");
      this.play();
    } else {
      console.log("stop");
      this.stop();
    }
    toggle = !toggle;
  });
