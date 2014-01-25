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

  var row = Cut.row().appendTo(viewport).pin("align", 0.5).spacing(1);
  for (var i = 0; i < colors.length; i++) {

    Cut.image("base:color_" + colors[i]).appendTo(row).pin("pivot", 0.5)
        .listen(Cut.Mouse.MOVE, function(ev, point) {
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