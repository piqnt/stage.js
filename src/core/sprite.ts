import {
  PipeTexture,
  texture,
  Texture,
  TexturePrerenderContext,
  TextureSelectionInput,
} from "../texture";
import { ResizableTexture } from "../texture/resizable";

import { Node } from "./core";

export function sprite(frame?: TextureSelectionInput) {
  const sprite = new Sprite();
  frame && sprite.texture(frame);
  return sprite;
}

export class Sprite extends Node {
  /** @internal */ _image: Texture | null;

  /** @internal */ _tiled: boolean = false;
  /** @internal */ _stretched: boolean = false;

  constructor() {
    super();
    this.label("Sprite");
    this._textures = [];
    this._image = null;
  }

  texture(frame: TextureSelectionInput) {
    this._image = texture(frame).one();
    if (this._image) {
      this.pin("width", this._image.getWidth());
      this.pin("height", this._image.getHeight());

      // todo: could we chain textures in a way that doesn't require rebuilding the chain?
      if (this._tiled) {
        this._textures[0] = new ResizableTexture(this._image, "tile");
      } else if (this._stretched) {
        this._textures[0] = new ResizableTexture(this._image, "stretch");
      } else {
        this._textures[0] = new PipeTexture(this._image);
      }

      this._textures.length = 1;
    } else {
      this.pin("width", 0);
      this.pin("height", 0);
      this._textures.length = 0;
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
    this._textures[0] = texture;
    return this;
  }

  stretch(inner = false) {
    this._stretched = true;
    const texture = new ResizableTexture(this._image, "stretch");
    this._textures[0] = texture;
    return this;
  }

  /** @internal */
  private prerenderContext = {} as TexturePrerenderContext;

  prerender(): void {
    if (!this._visible) {
      return;
    }

    // if (!this._parent) {
    //   return;
    // }

    if (this._image) {
      const pixelRatio = this.getPixelRatio();
      this.prerenderContext.pixelRatio = pixelRatio;
      const updated = this._image.prerender(this.prerenderContext);
      if (updated === true) {
        // should we let draw function decide to make this update?
        const w = this._image.getWidth();
        const h = this._image.getHeight();
        this.size(w, h);
      }
    }

    super.prerender();
  }

  render(context: CanvasRenderingContext2D): void {
    const texture = this._textures[0];
    if (texture?.["_resizeMode"]) {
      texture.dw = this.pin("width");
      texture.dh = this.pin("height");
    }
    super.render(context);
  }
}

/** @hidden @deprecated @internal */
export const image = sprite;
/** @hidden @deprecated @internal */
export const Image = Sprite;
