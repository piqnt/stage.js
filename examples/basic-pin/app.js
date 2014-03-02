Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(1000, 1000).pin("handle", -0.5);

  var box = Cut.image("pin:box").appendTo(root).pin("handle", 0.5);

  box.on(Cut.Mouse.CLICK, function() {
    this.tween().clear().pin({
      scaleX : Cut.Math.random(0.5, 1.5),
      scaleY : Cut.Math.random(0.5, 1.5),
    // skewX : Cut.Math.random(0, 0.4),
    // skewY : Cut.Math.random(0, 0.4),
    // rotation : Cut.Math.random(-Math.PI, Math.PI)
    });
  });

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
