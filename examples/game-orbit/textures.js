Cut.addTexture({
  name : "base",
  factory : function(name) {
    if (name.substring(0, 2) === "d_") {
      var d = name.substr(2, 1);
      return Cut.Out.drawing("d_" + d, 12, 6, 10, function(ctx, ratio) {
        ctx.scale(ratio, ratio);
        ctx.font = "bold 4px Arial";
        ctx.fillStyle = "#bbb";
        ctx.measureText && this.cropX(ctx.measureText(d).width + 0.4);
        ctx.textBaseline = "top";
        ctx.fillText(d, 0.2, 1);
      });
    }
  },
  cutouts : [ Cut.Out.drawing("bg", 100, 100, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.rect(0, 0, 100, 100);
    ctx.fillStyle = "#000";
    ctx.fill();

  }), Cut.Out.drawing("planet", 10, 10, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(5, 5, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#eee";
    ctx.fill();

  }), Cut.Out.drawing("explosion", 10, 10, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(5, 5, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#aaa";
    ctx.fill();

  }), Cut.Out.drawing("ship", 2, 2, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(1, 1, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

  }), Cut.Out.drawing("next", 4, 4, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(2, 2, 1.6, 0, 2 * Math.PI);
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

  }), Cut.Out.drawing("asteroid", 2, 2, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(1, 1, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "#888";
    ctx.fill();

  }), Cut.Out.drawing("bullet", 2, 2, 10, function(ctx, ratio) {
    ctx.scale(ratio, ratio);
    ctx.arc(1, 1, 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

  }) ]
});