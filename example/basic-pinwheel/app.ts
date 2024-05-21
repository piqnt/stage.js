import Stage from "../../src";
import "../common/texture";

await Stage.atlas({
  name: "pinwheel",
  image: "./pinwheel.png",
});

const stage = Stage.mount();

stage.viewbox(1000, 1000).pin("handle", -0.5);

Stage.sprite("pinwheel")
  .appendTo(stage)
  .pin("handle", 0.5)
  .on("click", function () {
    const r = this.pin("rotation") % (Math.PI * 2);
    this.pin("rotation", r)
      .tween(1000)
      .rotate(r - Math.PI * 2)
      .tween(2000)
      .rotate(r - Math.PI * 4)
      .ease("sin-out");
  });
