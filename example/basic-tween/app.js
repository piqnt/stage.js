Stage(function(stage) {

  var Mouse = Stage.Mouse;

  stage.viewbox(400, 100);

  var x = 50;

  var result = Stage.string('digit').appendTo(stage).pin('align', 0.5).alpha(
      1.0).offset(x, -20).value(0);
  var eager = Stage.string('digit').appendTo(stage).pin('align', 0.5)
      .alpha(0.7).offset(x, 0).value(0);
  var lazy = Stage.string('digit').appendTo(stage).pin('align', 0.5).alpha(0.4)
      .offset(x, +20).value(0);

  stage.on(Mouse.CLICK, function(point) {
    x = -x;
    result.tween(600).pin('offsetX', x).done(function() {
      this.value(this.value() + 1);
    });
    eager.tween(600, true).pin('offsetX', x).done(function() {
      this.value(this.value() + 1);
    });
    lazy.tween(600, 300, true).pin('offsetX', x).done(function() {
      this.value(this.value() + 1);
    });
  });

});
