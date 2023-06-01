import Stage from '../../src';
import '../common/texture';

Stage(function(stage) {

  var Mouse = Stage.Mouse;

  stage.viewbox(100, 100);

  var toggle = true;
  Stage.anim('rainbow').appendTo(stage).pin('align', 0.5).fps(4).on(
      Mouse.CLICK, function(point) {
        if (toggle) {
          console.log('play');
          this.play();
        } else {
          console.log('stop');
          this.stop();
        }
        toggle = !toggle;
      });

});
