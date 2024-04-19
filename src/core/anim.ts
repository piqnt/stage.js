import { math } from "../common/math";
import { Texture, TextureSelectionInputArray, texture } from "../texture";

import { Node } from "./core";

export const anim = function (frames: string | TextureSelectionInputArray, fps?: number) {
  const anim = new Anim();
  anim.frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
};

// TODO: replace with atlas fps or texture time
/** @internal */ const FPS = 15;

export class Anim extends Node {
  /** @internal */ _fps: number;
  /** @internal */ _ft: number;
  /** @internal */ _time: number;
  /** @internal */ _repeat: number;
  /** @internal */ _index: number;
  /** @internal */ _frames: Texture[];
  /** @internal */ _callback: () => void;

  constructor() {
    super();
    this.label("Anim");

    this._textures = [];

    this._fps = FPS;
    this._ft = 1000 / this._fps;

    this._time = -1;
    this._repeat = 0;

    this._index = 0;
    this._frames = [];

    let lastTime = 0;
    this.tick(function (t, now, last) {
      if (this._time < 0 || this._frames.length <= 1) {
        return;
      }

      // ignore old elapsed
      const ignore = lastTime != last;
      lastTime = now;
      if (ignore) {
        return true;
      }

      this._time += t;
      if (this._time < this._ft) {
        return true;
      }
      const n = (this._time / this._ft) | 0;
      this._time -= n * this._ft;
      this.moveFrame(n);
      if (this._repeat > 0 && (this._repeat -= n) <= 0) {
        this.stop();
        this._callback && this._callback();
        return false;
      }
      return true;
    }, false);
  }

  fps(fps?: number) {
    if (typeof fps === "undefined") {
      return this._fps;
    }
    this._fps = fps > 0 ? fps : FPS;
    this._ft = 1000 / this._fps;
    return this;
  }

  /** @deprecated Use frames */
  setFrames(frames: string | TextureSelectionInputArray) {
    return this.frames(frames);
  }

  frames(frames: string | TextureSelectionInputArray) {
    this._index = 0;
    this._frames = texture(frames).array();
    this.touch();
    return this;
  }

  length() {
    return this._frames ? this._frames.length : 0;
  }

  gotoFrame(frame: number, resize = false) {
    this._index = math.wrap(frame, this._frames.length) | 0;
    resize = resize || !this._textures[0];
    this._textures[0] = this._frames[this._index];
    if (resize) {
      this.pin("width", this._textures[0].width);
      this.pin("height", this._textures[0].height);
    }
    this.touch();
    return this;
  }

  moveFrame(move) {
    return this.gotoFrame(this._index + move);
  }

  repeat(repeat, callback) {
    this._repeat = repeat * this._frames.length - 1;
    this._callback = callback;
    this.play();
    return this;
  }

  play(frame?: number) {
    if (typeof frame !== "undefined") {
      this.gotoFrame(frame);
      this._time = 0;
    } else if (this._time < 0) {
      this._time = 0;
    }

    this.touch();
    return this;
  }

  stop(frame?: number) {
    this._time = -1;
    if (typeof frame !== "undefined") {
      this.gotoFrame(frame);
    }
    return this;
  }
}
