import { math } from "../common/math";
import { Texture, TextureSelectionInputArray, texture } from "../texture";
import { Component } from "./component";

type AnimTextureInput = string | TextureSelectionInputArray;

export function anim(frames?: AnimTextureInput, fps?: number) {
  return new Anim(frames, fps);
}

// TODO: replace with atlas fps or texture time
/** @internal */ const FPS = 15;

export class Anim extends Component {
  /** @internal */ _textures: Texture[] = [];
  /** @internal */ _fps: number = FPS;
  /** @internal */ _time: number = -1;
  /** @internal */ _repeat: number = 0;
  /** @internal */ _index: number = 0;
  /** @internal */ _frames: Texture[] = [];
  /** @internal */ _callback: () => void;

  constructor(frames?: AnimTextureInput, fps?: number) {
    super();
    this.label("Anim");

    this.tick(this._animLoop, false);

    frames && this.frames(frames).gotoFrame(0);
    fps && this.fps(fps);
  }

  private _lastFrameTime = 0;
  private _animLoop(t: number, now: number, last: number) {
    if (this._time < 0 || this._frames.length <= 1) {
      return;
    }

    // ignore old elapsed
    const ignore = this._lastFrameTime != last;
    this._lastFrameTime = now;
    if (ignore) {
      return true;
    }

    this._time += t;
    const ft = (1 / this._fps) * 1000;
    if (this._time < ft) {
      return true;
    }
    const n = (this._time / ft) | 0;
    this._time -= n * ft;
    this.moveFrame(n);
    if (this._repeat > 0 && (this._repeat -= n) <= 0) {
      this.stop();
      this._callback && this._callback();
      return false;
    }
    return true;
  }

  fps(fps: number): this;
  fps(): number;
  fps(fps?: number) {
    if (typeof fps === "undefined") {
      return this._fps;
    }
    this._fps = fps > 0 ? fps : FPS;
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
      this.pin("width", this._textures[0].getWidth());
      this.pin("height", this._textures[0].getHeight());
    }
    this.touch();
    return this;
  }

  moveFrame(move: number) {
    return this.gotoFrame(this._index + move);
  }

  repeat(repeat: number, callback: () => any) {
    this._repeat = repeat * this._frames.length - 1;
    this._callback = callback;
    this.play();
    return this;
  }

  play(startFromFrame?: number) {
    if (typeof startFromFrame !== "undefined") {
      this.gotoFrame(startFromFrame);
      this._time = 0;
    } else if (this._time < 0) {
      this._time = 0;
    }

    this.touch();
    return this;
  }

  stop(stopAtFrame?: number) {
    this._time = -1;
    if (typeof stopAtFrame !== "undefined") {
      this.gotoFrame(stopAtFrame);
    }
    return this;
  }

  render(context: CanvasRenderingContext2D) {
    if (this._textures && this._textures.length) {
      for (let i = 0, n = this._textures.length; i < n; i++) {
        this._textures[i].draw(context);
      }
    }
  }
}
