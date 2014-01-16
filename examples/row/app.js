Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().id("frame").appendTo(root);

  frame.listen("resize", function(width, height) {
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
  var row = Cut.row(0.5).appendTo(frame).pin("align", 0.5).spy(true).id("box");
  for (var i = 0; i < 6; i++) {
    var cell = Cut.image("base:color_" + colors[2 + i]).appendTo(row).id(i);
    cell.listen(Cut.Mouse.MOVE, function(ev, point) {
      if (last != this) {
        last = this;
        var color = colors[Math.floor(Math.random() * colors.length)];
        this.setImage("base:color_" + color);
      }
    });
  }

});
