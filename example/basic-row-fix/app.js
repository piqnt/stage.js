Stage(function(stage) {

  var Math = Stage.Math, Mouse = Stage.Mouse;

  stage.viewbox(400, 100);

  var last = null;
  var colors = [ 'green', 'blue', 'purple', 'red', 'orange', 'yellow' ];

  var row = Stage.row().appendTo(stage).pin('align', 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {
    Stage.image(colors[i]).appendTo(row).pin('pivot', 0.5).on(Mouse.MOVE,
        function(point) {
          if (this != last) {
            last = this;
            this.tween().clear().pin({
              scaleX : Math.random(0.9, 1.4),
              scaleY : Math.random(0.9, 1.4),
              skewX : Math.random(0, 0.4),
              skewY : Math.random(0, 0.4),
              rotation : Math.random(-Math.PI, Math.PI),
              pivotX : Math.random(0.3, 0.7),
              pivotY : Math.random(0.3, 0.7)
            });
          }
          return true;
        });
  }

});