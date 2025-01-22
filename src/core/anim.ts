import { math } from "../common/math";
import { Texture, TextureSelectionInputArray, texture } from "../texture";

import { Component } from "./component";

export function anim(frames: string | TextureSelectionInputArray, fps?: number) {
  const anim = new Anim();
  anim.frames(frames).gotoFrame(0);
  fps && anim.fps(fps);
  return anim;
}

// TODO: replace with atlas fps or texture time
/** @internal */ const FPS = 15;

export class Anim extends Component {
  /** @internal */ _texture: Texture | null = null;

  /** @internal */ _frames: Texture[] = [];

  /** @internal */ _fps: number;
  /** @internal */ _ft: number;

  /** @internal */ _time: number = -1;
  /** @internal */ _repeat: number = 0;
  /** @internal */ _index: number = 0;

  /** @internal */ _callback: () => void;

  constructor() {
    super();
    this.label("Anim");

    this._fps = FPS;
    this._ft = 1000 / this._fps;

    this.tick(this._animTick, false);
  }

  /** @hidden */
  renderTexture(context: CanvasRenderingContext2D) {
    if (!this._texture) return;

    this._texture.draw(context);
  }

  /** @internal */
  private _animTickLastTime = 0;
  /** @internal */
  private _animTick = (t: number, now: number, last: number) => {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }

    // ignore old elapsed
    const ignore = this._animTickLastTime != last;
    this._animTickLastTime = now;
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
  };

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
    resize = resize || !this._texture;
    this._texture = this._frames[this._index];
    if (resize) {
      this.pin("width", this._texture.getWidth());
      this.pin("height", this._texture.getHeight());
    }
    this.touch();
    return this;
  }

  moveFrame(move: number) {
    return this.gotoFrame(this._index + move);
  }

  repeat(repeat: number, callback?: () => void) {
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
