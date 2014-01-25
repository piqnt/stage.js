Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var viewport = Cut.create().id("frame").appendTo(root).pin({
    width : 400,
    height : 100
  }).listen("resize", function(width, height) {
    this.pin({
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var last = null;
  var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];

  var row = Cut.row(0.5).appendTo(viewport).pin("align", 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {

    Cut.image("base:color_" + colors[i]).appendTo(row).listen(Cut.Mouse.MOVE,
        function(ev, point) {
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
