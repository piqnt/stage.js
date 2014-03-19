Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(1000, 1000).pin("handle", -0.5);

  Cut.image("pin:box").appendTo(root).pin("matrix",
      new Cut.Matrix().rotate(Math.PI / 4).scale(1, 0.5));

});

Cut.addTexture({
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
