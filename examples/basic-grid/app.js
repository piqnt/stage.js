Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(300, 300);

  var last = null;

  var j = 0, i = 0;
  var column = Cut.column().appendTo(root).pin("align", 0.5).spacing(1);
  for (j = 0; j < 9; j++) {
    var row = Cut.row().appendTo(column).spacing(1);
    for (i = 0; i < 9; i++) {
      // colors as frames
      var cell = Cut.anim("base:color_").appendTo(row).pin("pivot", 0.5);
      cell.on(Cut.Mouse.MOVE, function(point) {
        if (this != last) {
          last = this;
          // random frame = random color
          this.gotoFrame(Cut.Math.random(this.length()));
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