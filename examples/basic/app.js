Cut.Loader.load(function(canvas) {

  var root = Cut.create().id("root");

  Cut.Mouse.listen(root, canvas, true);

  root.listen("resize", function(width, height) {
    this.pin({
      width : 500,
      height : 300,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
    return true;
  });

  var colors = [ "dark", "light", "red", "orange", "yellow", "green", "blue",
      "purple" ];

  var last = null;
  var box = Cut.row(0.5).appendTo(root).pin("align", 0.5).spy(true).id("box");
  for ( var i = 0; i < 6; i++) {
    var cell = Cut.image("colors:color_" + colors[2 + i]).appendTo(box).id(i);
    cell.listen(Cut.Mouse.MOVE, function(ev, point) {
      if (last == this) {
        return;
      }
      last = this;
      var color = colors[Math.floor(Math.random() * colors.length)];
      this.setImage("colors:color_" + color);
    });
  }

  return root;
});

Cut.addTexture({
  name : "colors",
  imagePath : "colors.png",
  imageRatio : 2,
  sprites : [
    { name : "color_dark",   x : 0,  y : 0,  width : 30, height : 30 },
    { name : "color_light",  x : 0,  y : 30, width : 30, height : 30 },
    { name : "color_red",    x : 30, y : 0,  width : 30, height : 30 },
    { name : "color_purple", x : 30, y : 30, width : 30, height : 30 },
    { name : "color_orange", x : 60, y : 0,  width : 30, height : 30 },
    { name : "color_blue",   x : 60, y : 30, width : 30, height : 30 },
    { name : "color_yellow", x : 90, y : 0,  width : 30, height : 30 },
    { name : "color_green",  x : 90, y : 30, width : 30, height : 30 }
  ]
});