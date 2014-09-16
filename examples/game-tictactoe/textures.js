Cut({
  name : "base",
  cutouts : [ Cut.Out.drawing("bg", 30, 30, 20, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.moveTo(10, 1);
    ctx.lineTo(10, 29);
    ctx.moveTo(20, 1);
    ctx.lineTo(20, 29);
    ctx.moveTo(1, 10);
    ctx.lineTo(29, 10);
    ctx.moveTo(1, 20);
    ctx.lineTo(29, 20);
    ctx.lineWidth = 0.3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#999";
    ctx.stroke();

  }), Cut.Out.drawing("x", 10, 10, 20, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.moveTo(2, 2);
    ctx.lineTo(8, 8);
    ctx.moveTo(2, 8);
    ctx.lineTo(8, 2);
    ctx.lineWidth = 0.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.stroke();

  }), Cut.Out.drawing("o", 10, 10, 20, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(5, 5, 2.4, 0, 2 * Math.PI);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#000";
    ctx.stroke();

  }), Cut.Out.drawing("-", 10, 10, 20, function(ctx, ratio) {

  }) ]
});