import { Sprite } from "../core/sprite";

import { ImageTexture } from "./image";
import { TexturePrerenderContext } from "./texture";

type CanvasTextureDrawer = (this: CanvasTexture) => void;
type CanvasTextureMemoizer = (this: CanvasTexture) => any;

/** @hidden @deprecated */
type LegacyCanvasTextureDrawer = (this: CanvasTexture, context: CanvasRenderingContext2D) => void;
/** @hidden @deprecated */
type LegacyCanvasSpriteMemoizer = () => any;

/** @hidden @deprecated */
type LegacyCanvasSpriteDrawer = (ratio: number, texture: CanvasTexture, sprite: Sprite) => void;

/**
 * A texture with off-screen canvas.
 */
export class CanvasTexture extends ImageTexture {
  /** @internal */ _source: HTMLCanvasElement;
  /** @internal */ _drawer?: CanvasTextureDrawer;
  /** @internal */ _memoizer: CanvasTextureMemoizer;

  /** @internal */ _lastPixelRatio = 0;
  /** @internal */ _lastMemoKey: any;

  constructor() {
    super(document.createElement("canvas"));
  }

  /**
   * Set texture size to given width and height, and set canvas size to texture size multiply by pixelRatio.
   */
  setSize(destWidth: number, destHeight: number, pixelRatio = 1) {
    this._source.width = destWidth * pixelRatio;
    this._source.height = destHeight * pixelRatio;
    this._pixelRatio = pixelRatio;
  }

  getContext(type = "2d", attributes?: any): CanvasRenderingContext2D {
    return this._source.getContext(type, attributes) as CanvasRenderingContext2D;
  }

  /**
   * @hidden @experimental
   *
   * This is the ratio of screen pixel to this canvas pixel.
   */
  getDevicePixelRatio() {
    return this._lastPixelRatio;
  }

  // todo: remove in stable v1.0
  /** @hidden @deprecated */
  getOptimalPixelRatio() {
    return this.getDevicePixelRatio();
  }

  setMemoizer(memoizer: CanvasTextureMemoizer) {
    this._memoizer = memoizer;
  }

  setDrawer(drawer: CanvasTextureDrawer) {
    this._drawer = drawer;
  }

  /** @internal */
  prerender(context: TexturePrerenderContext): boolean {
    const newPixelRatio = context.pixelRatio;
    const lastPixelRatio = this._lastPixelRatio;

    const pixelRationChange = lastPixelRatio / newPixelRatio;
    const pixelRatioChanged =
      lastPixelRatio === 0 || pixelRationChange > 1.25 || pixelRationChange < 0.8;

    if (pixelRatioChanged) {
      this._lastPixelRatio = newPixelRatio;
    }

    const newMemoKey = this._memoizer ? this._memoizer.call(this) : null;
    const memoKeyChanged = this._lastMemoKey !== newMemoKey;

    if (pixelRatioChanged || memoKeyChanged) {
      this._lastMemoKey = newMemoKey;
      this._lastPixelRatio = newPixelRatio;

      if (typeof this._drawer === "function") {
        this._drawer.call(this);
      }
      return true;
    }
  }

  /** @hidden @deprecated */
  size(width: number, height: number, pixelRatio: number) {
    this.setSize(width, height, pixelRatio);
    return this;
  }

  /** @hidden @deprecated */
  context(type = "2d", attributes?: any) {
    return this.getContext(type, attributes);
  }

  /** @hidden @deprecated */
  canvas(legacyTextureDrawer: LegacyCanvasTextureDrawer) {
    if (typeof legacyTextureDrawer === "function") {
      legacyTextureDrawer.call(this, this.getContext());
    } else if (typeof legacyTextureDrawer === "undefined") {
      if (typeof this._drawer === "function") {
        this._drawer.call(this);
      }
    }

    return this;
  }
}

/**
 * Create CanvasTexture (a texture with off-screen canvas).
 */
export function canvas(): CanvasTexture;

/** @hidden @deprecated @internal */
export function canvas(drawer: LegacyCanvasTextureDrawer): CanvasTexture;

/** @hidden @deprecated @internal */
export function canvas(type: string, drawer: LegacyCanvasTextureDrawer): CanvasTexture;

/** @hidden @deprecated @internal */
export function canvas(
  type: string,
  attributes: Record<string, string>,
  drawer: LegacyCanvasTextureDrawer,
): CanvasTexture;

export function canvas(type?, attributes?, legacyTextureDrawer?): CanvasTexture {
  if (typeof type === "function") {
    const texture = new CanvasTexture();
    legacyTextureDrawer = type;
    texture.setDrawer(function () {
      legacyTextureDrawer.call(texture, texture.getContext());
    });
    return texture;
  } else if (typeof attributes === "function") {
    const texture = new CanvasTexture();
    legacyTextureDrawer = attributes;
    texture.setDrawer(function () {
      legacyTextureDrawer.call(texture, texture.getContext(type));
    });
    return texture;
  } else if (typeof legacyTextureDrawer === "function") {
    const texture = new CanvasTexture();
    texture.setDrawer(function () {
      legacyTextureDrawer.call(texture, texture.getContext(type, attributes));
    });
    return texture;
  } else {
    const texture = new CanvasTexture();
    return texture;
  }
}

/** @hidden @deprecated */
export function memoizeDraw(
  legacySpriteDrawer: LegacyCanvasSpriteDrawer,
  legacySpriteMemoizer: LegacyCanvasSpriteMemoizer = () => null,
) {
  const sprite = new Sprite();
  const texture = new CanvasTexture();

  sprite.texture(texture);

  texture.setDrawer(function () {
    legacySpriteDrawer(2.5 * texture._lastPixelRatio, texture, sprite);
  });

  texture.setMemoizer(legacySpriteMemoizer);

  return sprite;
}
