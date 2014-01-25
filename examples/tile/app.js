Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var viewport = Cut.viewport(200, 200).appendTo(root);

  Cut.image("base:box").tile().appendTo(viewport).pin({
    width : 64,
    height : 64,
    align : 0.5
  }).listen(Cut.Mouse.CLICK, function(ev, point) {
    this.tween().clear().pin({
      width : Cut.Math.random(32, 96),
      height : Cut.Math.random(32, 96)
    });
    return true;
  });

});
