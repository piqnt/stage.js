Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().id("frame").appendTo(root);

  frame.listen("resize", function(width, height) {
    this.pin({
      width : 200,
      height : 200,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  Cut.image("base:box").stretch().appendTo(frame).pin({
    width : 64,
    height : 64,
    align : 0.5
  }).listen(Cut.Mouse.CLICK, function(ev, point) {
    this.tween().clear().pin({
      width : Cut.Math.random(32, 96),
      height : Cut.Math.random(32, 96)
    });
    return true;
  });;
  
});
