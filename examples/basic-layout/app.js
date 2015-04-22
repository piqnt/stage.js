Stage(function(stage) {

  stage.viewbox(500, 300);

  stage.on(Stage.Mouse.CLICK, function(point) {
    bar1.tween().clear().pin('width', Stage.Math.random(20, 100) | 0);
    bar2.tween().clear().pin('width', Stage.Math.random(20, 100) | 0);
    bar3.tween().clear().pin('width', Stage.Math.random(20, 100) | 0);
    bar4.tween().clear().pin('width', Stage.Math.random(20, 100) | 0);
    bar5.tween().clear().pin('height', Stage.Math.random(20, 100) | 0);
    bar6.tween().clear().pin('height', Stage.Math.random(20, 100) | 0);
    bar7.tween().clear().pin('height', Stage.Math.random(20, 100) | 0);
    bar8.tween().clear().pin('height', Stage.Math.random(20, 100) | 0);
  });

  var bar1 = Stage.image('box').stretch();
  var bar2 = Stage.image('box').stretch();
  var bar3 = Stage.image('box').stretch();
  var bar4 = Stage.image('box').stretch();
  var bar5 = Stage.image('box').stretch();
  var bar6 = Stage.image('box').stretch();
  var bar7 = Stage.image('box').stretch();
  var bar8 = Stage.image('box').stretch();

  Stage.column(1).append(bar1, bar2).appendTo(stage).pin({
    alignX : 1,
    alignY : 0,
    offsetX : -10,
    offsetY : 10
  }).label('topleft');

  Stage.column(0).append(bar3, bar4).appendTo(stage).pin({
    alignX : 0,
    alignY : 1,
    offsetX : 10,
    offsetY : -10
  }).label('bottomright');

  Stage.row(0).append(bar5, bar6).appendTo(stage).pin({
    alignX : 0,
    alignY : 0,
    offsetX : 10,
    offsetY : 10
  }).label('topleft');

  Stage.row(1).append(bar7, bar8).appendTo(stage).pin({
    alignX : 1,
    alignY : 1,
    offsetX : -10,
    offsetY : -10
  }).label('bottomleft');

});
