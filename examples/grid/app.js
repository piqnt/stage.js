Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().appendTo(root);

  frame.listen("resize", function(width, height) {
    // resize to fit in screen
    this.pin({
      width : 300,
      height : 300,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var last = null;

  var j = 0, i = 0;
  var column = Cut.column().appendTo(frame).pin("align", 0.5);
  for (j = 0; j < 9; j++) {
    var row = Cut.row().appendTo(column);
    for (i = 0; i < 9; i++) {
      // colors as frames
      var cell = Cut.anim("base:color_").appendTo(row).pin("pivot", 0.5);
      cell.listen(Cut.Mouse.MOVE, function(ev, point) {
        if (this != last) {
          last = this;
          // random frame = random color
          this.randomFrame();
          this.tween(Cut.Math.random(2000, 5000)).clear().pin({
            scaleX : Cut.Math.random(0.9, 1.4),
            scaleY : Cut.Math.random(0.9, 1.4),
            skewX : Cut.Math.random(0, 0.4),
            skewY : Cut.Math.random(0, 0.4),
            rotation : Cut.Math.random(-Math.PI, Math.PI),
            pivotX : Cut.Math.random(0.3, 0.7),
            pivotY : Cut.Math.random(0.3, 0.7)
          });
        }
        return true;
      });
    }
  }

});