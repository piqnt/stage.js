import Stage from '../../src';
import '../common/texture';

Stage(function(stage) {

  stage.viewbox(1000, 1000);

  var box = Stage.image('package').appendTo(stage).pin({
    alignX : 0.5,
    alignY : 0.6,
  });

  stage.on('click', function(point) {
    box.tween(300, true).ease('quad-out').offset(0, -200).tween(700).ease(
        'bounce').offset(0, 0);
  });
});

Stage({
  name : 'package',
  image : {
    src : './main.png'
  }
});
