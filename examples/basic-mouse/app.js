Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(300, 100);

  var row = Cut.row().appendTo(root).pin('align', 0.5).spacing(1);

  Cut.anim('rainbow').appendTo(row).on(Cut.Mouse.CLICK, function(point) {
    this.moveFrame(1);
  }).label('click');

  Cut.anim('rainbow').appendTo(row).on(Cut.Mouse.START, function(point) {
    this.moveFrame(1);
  }).label('start');

  Cut.anim('rainbow').appendTo(row).on(Cut.Mouse.END, function(point) {
    this.moveFrame(1);
  }).label('end');

  var cursor = Cut.image('circle').pin({
    handle : 0.5
  }).appendTo(root);

  var down = false;
  root.on(Cut.Mouse.START, function(point) {
    down = true;
    cursor.pin({
      offsetX : point.x,
      offsetY : point.y,
      alpha : 1,
      scale : 1
    });
  }).on(Cut.Mouse.MOVE, function(point) {
    if (down) {
      cursor.pin({
        offsetX : point.x,
        offsetY : point.y,
        alpha : 1,
        scale : 2
      });
    }
  }).on(Cut.Mouse.END, function(point) {
    down = false;
    cursor.pin({
      offsetX : point.x,
      offsetY : point.y,
      alpha : 1,
      scale : 1
    });
  }).on(Cut.Mouse.CANCEL, function() {
    down = false;
    cursor.pin({
      alpha : 0.6,
      scale : 1
    });
  });

});