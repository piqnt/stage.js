Stage(function(stage) {

  stage.viewbox(300, 200);

  var box = Stage.image('box').box().stretch().padding(10).pin('align', 0.5).appendTo(stage);

  var number = Stage.string('digit').value('0123456789').pin('align', 0.5)
      .appendTo(box);

  stage.on(Stage.Mouse.CLICK, function(point) {
    var range = Math.pow(10, Stage.Math.random(0, 10) | 0);
    number.value(Stage.Math.random(0, range) | 0);
  });

});