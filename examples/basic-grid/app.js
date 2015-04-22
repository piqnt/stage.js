Stage(function(stage) {

  stage.viewbox(300, 300);

  var last = null;

  var j = 0, i = 0;
  var column = Stage.column().appendTo(stage).pin('align', 0.5).spacing(1);
  for (j = 0; j < 9; j++) {
    var row = Stage.row().appendTo(column).spacing(1);
    for (i = 0; i < 9; i++) {
      // colors as frames
      var cell = Stage.anim('rainbow').appendTo(row).pin('pivot', 0.5);
      cell.on(Stage.Mouse.MOVE, function(point) {
        if (this != last) {
          last = this;
          // random frame = random color
          this.gotoFrame(Stage.Math.random(this.length()));
          this.tween(Stage.Math.random(2000, 5000)).clear().pin({
            scaleX : Stage.Math.random(0.9, 1.4),
            scaleY : Stage.Math.random(0.9, 1.4),
            skewX : Stage.Math.random(0, 0.4),
            skewY : Stage.Math.random(0, 0.4),
            rotation : Stage.Math.random(-Math.PI, Math.PI),
            pivotX : Stage.Math.random(0.3, 0.7),
            pivotY : Stage.Math.random(0.3, 0.7)
          });
        }
        return true;
      });
    }
  }

});