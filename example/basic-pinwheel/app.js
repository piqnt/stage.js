Stage(function(stage) {

  stage.viewbox(1000, 1000).pin('handle', -0.5);

  var clicked = false;
  var logo = Stage.image('pinwheel').appendTo(stage).pin('handle', 0.5).on(
      Stage.Mouse.CLICK, function() {
        clicked = true;
        then();
      });

  function then() {
    logo.pin('rotation', logo.pin('rotation') % (Math.PI * 2));
    if (clicked) {
      logo.tween(1000).clear().pin('rotation',
          logo.pin('rotation') - Math.PI * 2).then(then);
    } else {
      logo.tween(2000).clear().pin('rotation',
          logo.pin('rotation') - Math.PI * 2).ease(function(t) {
        return Math.sin(t * Math.PI / 2);
      });
    }
    clicked = false;
  }
});

Stage({
  name : 'pinwheel',
  image : 'pinwheel.png',
});
