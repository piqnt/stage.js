Stage(function(stage) {

  stage.viewbox(400, 100);

  var last = null;
  var colors = [ 'green', 'blue', 'purple', 'red', 'orange', 'yellow' ];

  var row = Stage.row().appendTo(stage).pin('align', 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {
    Stage.image(colors[i]).appendTo(row).pin('pivot', 0.5).on(Stage.Mouse.MOVE,
        function(point) {
          if (this != last) {
            last = this;
            this.tween().clear().pin({
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

});