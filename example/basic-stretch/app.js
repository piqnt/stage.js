Stage(function(stage) {

  stage.viewbox(200, 200);

  Stage.image('box').stretch().appendTo(stage).pin({
    width : 64,
    height : 64,
    align : 0.5
  }).on(Stage.Mouse.CLICK, function() {
    this.tween().clear().pin({
      width : Stage.Math.random(32, 96),
      height : Stage.Math.random(32, 96)
    });
    return true;
  });

});
