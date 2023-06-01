import Stage from '../../src';
import '../common/texture';

Stage(function(stage) {

  var Math = Stage.Math, Mouse = Stage.Mouse, PI = Math.PI;

  stage.viewbox(1000, 1000).pin('handle', -0.5);

  Stage.image('pinwheel').appendTo(stage).pin('handle', 0.5).on(
      Mouse.CLICK,
      function() {
        var r = this.pin('rotation') % (Math.PI * 2);
        this.pin('rotation', r).tween(1000).rotate(r - PI * 2).tween(2000)
            .rotate(r - PI * 4).ease('sin-out');
      });

});

Stage({
  name : 'pinwheel',
  image : './pinwheel.png',
});
