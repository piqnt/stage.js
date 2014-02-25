Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  root.viewbox(200, 200);

  var drawing = Cut.image().appendTo(root).pin("align", 0.5);

  root.on(Cut.Mouse.CLICK, function() {
    star();
  });

  var p = 4;
  star();

  function star() {
    var w = 50, h = 50, r = 10, m = 2;
    p = (p + 1 - 3) % 3 + 3;
    drawing.setImage(Cut.Out.drawing(w, h, 4, function(ctx, ratio) {
      ctx.scale(ratio, ratio);

      // draw star
      ctx.translate(w / 2, h / 2);
      ctx.beginPath();
      ctx.rotate(Math.PI / p);
      ctx.moveTo(0, 0 - r);
      for (var i = 0; i < p; i++) {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r * m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
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