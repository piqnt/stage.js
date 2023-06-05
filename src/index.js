import Stage from './core';
import Matrix from  './matrix';
import Texture from './texture';
import './atlas';
import './tree';
import listenable from './util/event';

listenable(Stage.prototype, function(obj, name, on) {
  obj._flag(name, on);
});

import './pin';
import './loop';
import './root';

import './canvas';
import Image from './image';
import './anim';
import './str';
import './layout';
import './tween';
import Mouse from './mouse';
import Math from './util/math';

Stage.Matrix = Matrix;
Stage.Texture = Texture;
Stage.Mouse = Mouse;
Stage.Math = Math;
Stage.Image = Image;

import './loader';


export default Stage;