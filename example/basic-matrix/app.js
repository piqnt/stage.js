import Stage from '../../src';
import '../common/texture';

Stage(function(stage) {

  stage.viewbox(1000, 1000).pin('handle', -0.5);

  var matrix = new Stage.Matrix();

  Stage.image('box').appendTo(stage).pin('handle', 0.5).pin('matrix',
      matrix.identity().rotate(Math.PI / 4).scale(1, 0.5));

  Stage.image('box').appendTo(stage).pin('handle', 0.5).pin('matrix',
      matrix.identity().scale(1, 0.5).rotate(Math.PI / 4));
});

Stage({
  name : 'box',
  image : 'box.png'
});
