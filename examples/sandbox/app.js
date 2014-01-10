Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().id("frame").appendTo(root);

  frame.listen("resize", function(width, height) {
    // resize to fit in screen
    this.pin({
      width : 200,
      height : 200,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var j = 0, i = 0;
  var column = Cut.column().appendTo(frame).pin("align", 0.5);
  for (j = 0; j < 9; j++) {
    var row = Cut.row().id("row-" + j).appendTo(column);
    for (i = 0; i < 9; i++) {
      // colors as frames
      Cut.anim("base:color_").id("cell-" + j + "-" + i).appendTo(row).pin(
          "pivot", 0.5).listen(Cut.Mouse.MOVE, function(ev, point) {
        animate(this);
        return true;
      });
    }
  }

  var last = null;

  function animate(cell) {

    if (cell == last)
      return;
    last = cell;

    // random color
    cell.randomFrame();

    cell.tween({
      scaleX : Cut.Math.random(0.9, 1.4),
      scaleY : Cut.Math.random(0.9, 1.4),
      skewX : Cut.Math.random(0, 0.4),
      skewY : Cut.Math.random(0, 0.4),
      rotation : Cut.Math.random(-Math.PI, Math.PI),
      pivotX : Cut.Math.random(0.3, 0.7),
      pivotY : Cut.Math.random(0.3, 0.7)
    }, Cut.Math.random(2000, 5000));
  }

});