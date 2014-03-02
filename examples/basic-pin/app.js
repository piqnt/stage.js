Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(1000, 1000).pin("handle", -0.5);

  Cut.image("pin:box").appendTo(root).pin({});

  // Cut.image("pin:box").appendTo(root).pin({
  // pivot : 0.5,
  // rotation : 1
  // });
  //
  // Cut.image("pin:box").appendTo(root).pin({
  // handle : 0.5,
  // rotation : 1
  // });

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
