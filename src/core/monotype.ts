import { Texture, texture } from "../texture";

import { Component } from "./component";

export function monotype(chars: string | Record<string, Texture> | ((char: string) => Texture)) {
  return new Monotype().frames(chars);
}

export class Monotype extends Component {
  /** @internal */ _textures: Texture[] = [];

  /** @internal */ _font: (value: string) => Texture;
  /** @internal */ _value: string | number | string[] | number[];

  constructor() {
    super();
    this.label("Monotype");
  }

  /** @hidden */
  renderTexture(context: CanvasRenderingContext2D) {
    if (!this._textures || !this._textures.length) return;

    for (let i = 0, n = this._textures.length; i < n; i++) {
      this._textures[i].draw(context);
    }
  }

  /** @deprecated Use frames */
  setFont(frames: string | Record<string, Texture> | ((char: string) => Texture)) {
    return this.frames(frames);
  }

  frames(frames: string | Record<string, Texture> | ((char: string) => Texture)) {
    this._textures = [];
    if (typeof frames == "string") {
      const selection = texture(frames);
      this._font = function (value: string) {
        return selection.one(value);
      };
    } else if (typeof frames === "object") {
      this._font = function (value: string) {
        return frames[value];
      };
    } else if (typeof frames === "function") {
      this._font = frames;
    }
    return this;
  }

  /** @deprecated Use value */
  setValue(value: string | number | string[] | number[]) {
    return this.value(value);
  }

  value(value: string | number | string[] | number[]): this;
  value(value: string | number | string[] | number[]) {
    if (typeof value === "undefined") {
      return this._value;
    }
    if (this._value === value) {
      return this;
    }
    this._value = value;

    if (value === null) {
      value = "";
    } else if (typeof value !== "string" && !Array.isArray(value)) {
      value = value.toString();
    }

    this._spacing = this._spacing || 0;

    let width = 0;
    let height = 0;
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const texture = (this._textures[i] = this._font(typeof v === "string" ? v : v + ""));
      width += i > 0 ? this._spacing : 0;
      texture.setDestinationCoordinate(width, 0);
      width = width + texture.getWidth();
      height = Math.max(height, texture.getHeight());
    }
    this.pin("width", width);
    this.pin("height", height);
    this._textures.length = value.length;
    return this;
  }
}

/** @hidden @deprecated */
export { monotype as string };
/** @hidden @deprecated */
export { Monotype as Str };
