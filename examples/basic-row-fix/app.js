Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(400, 100);

  var last = null;
  var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];

  var row = Cut.row().appendTo(root).pin("align", 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {

    Cut.image("base:color_" + colors[i]).appendTo(row).pin("pivot", 0.5).on(
        Cut.Mouse.MOVE, function(point) {
          if (this != last) {
            last = this;
            this.tween().clear().pin({
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

});