import { Node } from './core';
import { texture } from './drawable';
import { math } from './util/math';

export const anim = function(frames, fps) {
  var anim = new Anim();
  anim.frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};

Anim._super = Node;
Anim.prototype = Object.create(Anim._super.prototype);

// TODO: replace with atlas fps or texture time
const FPS = 15;

export function Anim() {
  Anim._super.call(this);
  this.label('Anim');

  this._textures = [];

  this._fps = FPS;
  this._ft = 1000 / this._fps;

  this._time = -1;
  this._repeat = 0;

  this._index = 0;
  this._frames = [];

  var lastTime = 0;
  this.tick(function(t, now, last) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }

    // ignore old elapsed
    var ignore = lastTime != last;
    lastTime = now;
    if (ignore) {
      return true;
    }

    this._time += t;
    if (this._time < this._ft) {
      return true;
    }
    var n = this._time / this._ft | 0;
    this._time -= n * this._ft;
    this.moveFrame(n);
    if (this._repeat > 0 && (this._repeat -= n) <= 0) {
      this.stop();
      this._callback && this._callback();
      return false;
    }
    return true;
  }, false);
};

Anim.prototype.fps = function(fps) {
  if (typeof fps === 'undefined') {
    return this._fps;
  }
  this._fps = fps > 0 ? fps : FPS;
  this._ft = 1000 / this._fps;
  return this;
};

/**
 * @deprecated Use frames
 */
Anim.prototype.setFrames = function(a, b, c) {
  return this.frames(a, b, c);
};

Anim.prototype.frames = function(frames) {
  this._index = 0;
  this._frames = texture(frames).array();
  this.touch();
  return this;
};

Anim.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};

Anim.prototype.gotoFrame = function(frame, resize) {
  this._index = math.mod(frame, this._frames.length) | 0;
  resize = resize || !this._textures[0];
  this._textures[0] = this._frames[this._index];
  if (resize) {
    this.pin('width', this._textures[0].width);
    this.pin('height', this._textures[0].height);
  }
  this.touch();
  return this;
};

Anim.prototype.moveFrame = function(move) {
  return this.gotoFrame(this._index + move);
};

Anim.prototype.repeat = function(repeat, callback) {
  this._repeat = repeat * this._frames.length - 1;
  this._callback = callback;
  this.play();
  return this;
};

Anim.prototype.play = function(frame) {
  if (typeof frame !== 'undefined') {
    this.gotoFrame(frame);
    this._time = 0;
  } else if (this._time < 0) {
    this._time = 0;
  }

  this.touch();
  return this;
};

Anim.prototype.stop = function(frame) {
  this._time = -1;
  if (typeof frame !== 'undefined') {
    this.gotoFrame(frame);
  }
  return this;
};
