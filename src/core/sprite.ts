import {
  PipeTexture,
  texture,
  Texture,
  TexturePrerenderContext,
  TextureSelectionInput,
} from "../texture";
import { ResizableTexture } from "../texture/resizable";

import { Component } from "./component";

export function sprite(frame?: TextureSelectionInput) {
  const sprite = new Sprite();
  frame && sprite.texture(frame);
  return sprite;
}

export class Sprite extends Component {
  /** @internal */ _texture: Texture | null = null;

  /** @internal */ _image: Texture | null = null;
  /** @internal */ _tiled: boolean = false;
  /** @internal */ _stretched: boolean = false;

  constructor() {
    super();
    this.label("Sprite");
  }

  texture(frame: TextureSelectionInput) {
    this._image = texture(frame).one();
    if (this._image) {
      this.pin("width", this._image.getWidth());
      this.pin("height", this._image.getHeight());

      // todo: could we chain textures in a way that doesn't require rebuilding the chain?
      if (this._tiled) {
        this._texture = new ResizableTexture(this._image, "tile");
      } else if (this._stretched) {
        this._texture = new ResizableTexture(this._image, "stretch");
      } else {
        this._texture = new PipeTexture(this._image);
      }
    } else {
      this.pin("width", 0);
      this.pin("height", 0);
      this._texture = null;
    }
    return this;
  }

  /** @deprecated */
  image(frame: TextureSelectionInput) {
    return this.texture(frame);
  }

  tile(inner = false) {
    this._tiled = true;
    const texture = new ResizableTexture(this._image, "tile");
    this._texture = texture;
    return this;
  }

  stretch(inner = false) {
    this._stretched = true;
    const texture = new ResizableTexture(this._image, "stretch");
    this._texture = texture;
    return this;
  }

  /** @internal */
  private prerenderContext = {} as TexturePrerenderContext;

  /** @hidden */
  prerenderTexture(): void {
    if (!this._image) return;
    const pixelRatio = this.getDevicePixelRatio();
    this.prerenderContext.pixelRatio = pixelRatio;
    const updated = this._image.prerender(this.prerenderContext);
    if (updated === true) {
      // should we let draw function decide to make this update?
      const w = this._image.getWidth();
      const h = this._image.getHeight();
      this.size(w, h);
    }
  }

  /** @hidden */
  renderTexture(context: CanvasRenderingContext2D) {
    if (!this._texture) return;

    if (this._texture["_resizeMode"]) {
      this._texture.dw = this.pin("width");
      this._texture.dh = this.pin("height");
    }

    this._texture.draw(context);
  }
}

/** @hidden @deprecated */
export { sprite as image };
/** @hidden @deprecated */
export { Sprite as Image };
