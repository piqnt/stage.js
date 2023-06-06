import Stage from './core';
import Matrix from  './matrix';
import Texture from './texture';
import './atlas';
import './tree';
import listenable from './util/event';

listenable(Stage.prototype, function(obj, name, on) {
  obj._flag(name, on);
});

import Pin from './pin';
import './loop';
import Root from './root';

import './canvas';
import Image from './image';
import Anim from './anim';
import Str from './str';
import './layout';
import Tween from './tween';
import Mouse from './mouse';
import Math from './util/math';

Stage.Matrix = Matrix;
Stage.Texture = Texture;
Stage.Mouse = Mouse;
Stage.Math = Math;
Stage.Image = Image;
Stage.Tween = Tween;
Stage.Root = Root;
Stage.Pin = Pin;
Stage.Str = Str;
Stage.Anim = Anim;

import './loader';


export default Stage;