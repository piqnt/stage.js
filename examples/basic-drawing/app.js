Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(200, 200).on('click', function() {
    draw();
  });

  var width = 50, height = 50;
  var r1 = 10, r2 = 20, p = 4;

  var image = Cut.image().appendTo(root).pin('align', 0.5);

  draw();

  function draw() {
    image.image(Cut.drawing(function(ctx) {
      p = (p + 1 - 3) % 3 + 3;

      this.size(width, height, 4);

      ctx.scale(4, 4);

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
      ctx.fillStyle = '#eee';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }));
  }
});