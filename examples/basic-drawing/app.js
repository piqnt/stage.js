Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(200, 200);

  var width = 50, height = 50, r1 = 10, r2 = 20;

  var image = Cut.image().appendTo(root).pin("align", 0.5);

  root.on(Cut.Mouse.CLICK, function() {
    draw();
  });

  var p = 4;
  draw();

  function draw() {
    p = (p + 1 - 3) % 3 + 3;
    image.image(Cut.Out.drawing(width, height, 4, function(ctx, ratio) {
      ctx.scale(ratio, ratio);

      // draw star
      ctx.translate(width / 2, height / 2);
      ctx.beginPath();
      ctx.rotate(Math.PI / p);
      ctx.moveTo(0, 0 - r1);
      for (var i = 0; i < p; i++) {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r2);
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r1);
      }

      // fill & stroke
      ctx.fillStyle = "#eee";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }));
  }
});