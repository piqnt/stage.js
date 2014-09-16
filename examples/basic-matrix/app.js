Cut(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(1000, 1000).pin("handle", -0.5);

  var matrix = new Cut.Matrix();

  Cut.image("pin:box").appendTo(root).pin("handle", 0.5).pin("matrix",
      matrix.identity().rotate(Math.PI / 4).scale(1, 0.5));

  Cut.image("pin:box").appendTo(root).pin("handle", 0.5).pin("matrix",
      matrix.identity().scale(1, 0.5).rotate(Math.PI / 4));
});

Cut({
  name : "pin",
  imagePath : "box.png",
  cutouts : [ {
    name : "box",
    x : 0,
    y : 0,
    width : 200,
    height : 200
  } ]
});
