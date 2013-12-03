Cut.Loader.load(function() {

  var root = Cut.create().id("root");

  Mouse.listen(root, true);

  root.resize = function(width, height) {
    this.pin({
      width : 500,
      height : 300,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  };

  var colors = [ "dark", "light", "red", "purple", "blue", "orange", "yellow",
      "green" ];

  var row = Cut.row().appendTo(root).pin("align", 0.5).spy(true);
  for ( var i = 0; i < 9; i++) {
    var box = Cut.image("boxes:box_dark").appendTo(row);

    box.attr(Mouse.ON_MOVE, function(ev, point) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      this.setImage("boxes:box_" + color );
      this.pin("offsetY", Math.random() * 50 - 5);
    });
  }

  return root;
});

Cut.addTexture({
  name : "boxes",
  imagePath : "boxes.png",
  imageRatio : 2,
  sprites : [
    { name : "box_dark",   x : 0,  y : 0,  width : 30, height : 30 },
    { name : "box_light",  x : 0,  y : 30, width : 30, height : 30 },
    { name : "box_red",    x : 30, y : 0,  width : 30, height : 30 },
    { name : "box_purple", x : 30, y : 30, width : 30, height : 30 },
    { name : "box_blue",   x : 60, y : 0,  width : 30, height : 30 },
    { name : "box_orange", x : 60, y : 30, width : 30, height : 30 },
    { name : "box_yellow", x : 90, y : 0,  width : 30, height : 30 },
    { name : "box_green",  x : 90, y : 30, width : 30, height : 30 }
  ]
});