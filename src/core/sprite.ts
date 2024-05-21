import {
  PipeTexture,
  texture,
  Texture,
  TexturePrerenderContext,
  TextureSelectionInput,
} from "../texture";
import { ResizableTexture } from "../texture/resizable";

import { Component } from "./component";

type SpriteTextureInput = TextureSelectionInput;

export function sprite(frame?: TextureSelectionInput) {
  return new Sprite(frame);
}

export class Sprite extends Component {
  /** @internal */ _textures: Texture[] = [];
  /** @internal */ _image: Texture | null;

  constructor(frame?: SpriteTextureInput) {
    super();
    this.label("Sprite");
    this._image = null;
    frame && this.texture(frame);
  }

  texture(frame: SpriteTextureInput) {
    this._image = texture(frame).one();
    if (this._image) {
      this.pin("width", this._image.getWidth());
      this.pin("height", this._image.getHeight());
      this._textures[0] = new PipeTexture(this._image);
      this._textures.length = 1;
    } else {
      this.pin("width", 0);
      this.pin("height", 0);
      this._textures.length = 0;
    }
    return this;
  }

  /** @deprecated */
  image(frame: SpriteTextureInput) {
    return this.texture(frame);
  }

  tile(inner = false) {
    const texture = new ResizableTexture(this._image, "tile");
    this._textures[0] = texture;
    return this;
  }

  stretch(inner = false) {
    const texture = new ResizableTexture(this._image, "stretch");
    this._textures[0] = texture;
    return this;
  }

  /** @internal */
  private prerenderContext = {} as TexturePrerenderContext;

  prerender(): void {
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
  }

  render(context: CanvasRenderingContext2D) {
    const texture = this._textures[0];
    if (texture?.["_resizeMode"]) {
      texture.dw = this.pin("width");
      texture.dh = this.pin("height");
    }
    if (this._textures && this._textures.length) {
      for (let i = 0, n = this._textures.length; i < n; i++) {
        this._textures[i].draw(context);
      }
    }
  }
}

/** @hidden @deprecated @internal */
export const image = sprite;
/** @hidden @deprecated @internal */
export const Image = Sprite;
