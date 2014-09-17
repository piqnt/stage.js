Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(400, 100);

  var last = null;
  var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];

  var row = Cut.row(0.5).appendTo(root).pin("align", 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {

    Cut.image("base:color_" + colors[i]).appendTo(row).on(
        Cut.Mouse.MOVE, function(point) {
          if (this != last) {
            last = this;
            this.tween().clear().pin({
              scaleX : Cut.Math.random(0.8, 1.6),
              scaleY : Cut.Math.random(0.8, 1.6)
            });
          }
          return true;
        });
  }

});
