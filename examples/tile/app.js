Cut.Loader.load(function(canvas) {

  var root = Cut.create().id("root");

  Cut.Mouse.subscribe(root, canvas, true);

  root.listen("resize", function(width, height) {
    this.pin({
      width : 200,
      height : 200,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  Cut.image("base:box").tile().appendTo(root).pin({
    width : 64,
    height : 64,
    align : 0.5
  });

  return root;
});
