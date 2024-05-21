import { Texture, texture } from "../texture";

import { Component } from "./component";

export function monotype(font: MonotypeTextureInput) {
  return new Monotype(font);
}

type MonotypeTextureInput = string | Record<string, Texture> | ((char: string) => Texture);
type MonotypeValue = string | number | string[] | number[];

export class Monotype extends Component {
  /** @internal */ _textures: Texture[] = [];
  /** @internal */ _font: (value: string) => Texture;
  /** @internal */ _value: MonotypeValue;

  constructor(font?: MonotypeTextureInput) {
    super();
    this.label("String");
    font && this.frames(font);
  }

  /** @deprecated Use frames */
  setFont(frames: MonotypeTextureInput) {
    return this.frames(frames);
  }

  frames(frames: MonotypeTextureInput) {
    this._textures.length = 0;
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
  setValue(value: MonotypeValue) {
    return this.value(value);
  }

  value(): MonotypeValue;
  value(value: MonotypeValue): this;
  value(value?: MonotypeValue) {
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

    let width = 0;
    let height = 0;
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const texture = (this._textures[i] = this._font(typeof v === "string" ? v : v + ""));
      // todo: use independent spacing, maybe rename to letterSpacing
      width += i > 0 ? this.spacing() : 0;
      texture.setDestinationCoordinate(width, 0);
      width = width + texture.getWidth();
      height = Math.max(height, texture.getHeight());
    }
    this.pin("width", width);
    this.pin("height", height);
    this._textures.length = value.length;
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

/** @hidden @deprecated @internal */
export const str = monotype;
/** @hidden @deprecated @internal */
export const Str = Monotype;
