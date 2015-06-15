Stage(function(stage) {

  var Mouse = Stage.Mouse;

  stage.viewbox(400, 100);

  var turn = false;

  Stage.image('dark').appendTo(stage).pin('align', 0.5).on(Mouse.CLICK,
      function(point) {
        turn = !turn;
        this.tween(500, 500).clear().scale(turn ? 2 : 1, turn ? 1 : 2);
        return true;
      });

});
