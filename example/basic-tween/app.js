Stage(function(stage) {

  stage.viewbox(400, 100);

  var turn = false;

  Stage.image('dark').appendTo(stage).pin('align', 0.5).on(Stage.Mouse.CLICK,
      function(point) {
        turn = !turn;
        this.tween(500, 500).clear().pin({
          scaleX : turn ? 2 : 1,
          scaleY : turn ? 1 : 2
        });
        return true;
      });

});
