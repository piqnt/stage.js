Cut.Loader.load(function(canvas) {

  var root = Cut.create().id("root");

  Cut.Mouse.subscribe(root, canvas, true);

  root.listen("resize", function(width, height) {
    this.pin({
      width : 300,
      height : 200,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var colors = [ "dark", "light", "red", "orange", "yellow", "green", "blue",
      "purple" ];

  var last = null;
  var row = Cut.row(0.5).appendTo(root).pin("align", 0.5).spy(true).id("box");
  for ( var i = 0; i < 6; i++) {
    var cell = Cut.image("base:color_" + colors[2 + i]).appendTo(row).id(i);
    cell.listen(Cut.Mouse.MOVE, function(ev, point) {
      if (last == this) {
        return;
      }
      last = this;
      var color = colors[Math.floor(Math.random() * colors.length)];
      this.setImage("base:color_" + color);
    });
  }

  return root;
});
