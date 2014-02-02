Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  root.viewbox(200, 200);

  Cut.drawing(16, 16, 4, function(context) {
    context.beginPath();
    context.arc(32, 32, 30, 0, 2 * Math.PI, false);
    context.fillStyle = "gray";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }).appendTo(root).pin("align", 0.5);

});