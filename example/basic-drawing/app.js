import Stage from "../../src";

const stage = Stage.mount();

stage.viewbox(100, 100);

Stage.memoizeDraw(
  function (pixelRatio, texture) {
    let p = +Date.now().toString().charAt(9) + 2;

    let r1 = Math.random() * 30 + 5;
    let r2 = Math.random() * 30 + 10;
    const width = Math.max(r1, r2) * 2 + 2;
    const height = width;

    console.log("redraw", p, pixelRatio);

    pixelRatio *= 2;

    let ctx = texture.getContext();

    texture.setSize(width, height, pixelRatio);

    // ctx.resetTransform();
    ctx.scale(pixelRatio, pixelRatio);

    // draw star
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.rotate(Math.PI / p);
    ctx.moveTo(0, 0 - r1);
    for (let i = 0; i < p; i++) {
      ctx.rotate(Math.PI / p);
      ctx.lineTo(0, 0 - r2);
      ctx.rotate(Math.PI / p);
      ctx.lineTo(0, 0 - r1);
    }

    ctx.closePath();

    ctx.lineJoin = "round";
    ctx.lineWidth = 50;
    // fill & stroke
    ctx.fillStyle = "#eee";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
  },
  () => Date.now().toString().charAt(9),
)
  .appendTo(stage)
  .pin("align", 1);
