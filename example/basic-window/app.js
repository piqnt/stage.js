Stage(function(stage) {

  stage.viewbox(300, 200);

  var window = Stage.image('dark').box().stretch().pin('align', 0.5).pin(
      'textureAlpha', 0.5).padding(7).appendTo(stage);

  var column = Stage.column(1).pin('align', 0.5).spacing(5).appendTo(window);

  var text = Stage.string('digit').value('0123456789').appendTo(column);

  var row = Stage.row().appendTo(column).spacing(1);

  Stage.image('red').box().stretch().appendTo(row).append(
      Stage.string('digit').value('1')).on(Stage.Mouse.CLICK, function() {
    var range = Math.pow(10, Stage.Math.random(0, 10) | 0);
    text.value(Stage.Math.random(0, range) | 0);
  });

  Stage.image('blue').box().stretch().appendTo(row).append(
      Stage.string('digit').value('2')).on(Stage.Mouse.CLICK, function() {
    var range = Math.pow(10, Stage.Math.random(0, 10) | 0);
    text.value(Stage.Math.random(0, range) | 0);
  });

});