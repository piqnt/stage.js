Stage(function(stage) {

  stage.viewbox(300, 100);

  var row = Stage.row().appendTo(stage).pin('align', 0.5).spacing(1);

  Stage.anim('rainbow').appendTo(row).on(Stage.Mouse.CLICK, function(point) {
    this.moveFrame(1);
  }).label('click');

  Stage.anim('rainbow').appendTo(row).on(Stage.Mouse.START, function(point) {
    this.moveFrame(1);
  }).label('start');

  Stage.anim('rainbow').appendTo(row).on(Stage.Mouse.END, function(point) {
    this.moveFrame(1);
  }).label('end');

  var cursor = Stage.image('circle').pin({
    handle : 0.5
  }).appendTo(stage);

  var down = false;
  stage.on(Stage.Mouse.START, function(point) {
    down = true;
    cursor.pin({
      offsetX : point.x,
      offsetY : point.y,
      alpha : 1,
      scale : 1
    });
  }).on(Stage.Mouse.MOVE, function(point) {
    if (down) {
      cursor.pin({
        offsetX : point.x,
        offsetY : point.y,
        alpha : 1,
        scale : 2
      });
    }
  }).on(Stage.Mouse.END, function(point) {
    down = false;
    cursor.pin({
      offsetX : point.x,
      offsetY : point.y,
      alpha : 1,
      scale : 1
    });
  }).on(Stage.Mouse.CANCEL, function() {
    down = false;
    cursor.pin({
      alpha : 0.6,
      scale : 1
    });
  });

});