import { Sprite } from "../core/sprite";

import { Texture, TexturePrerenderContext } from "./texture";

// todo: update signature and use this
type CanvasTextureDrawer = (this: CanvasTexture) => void;
type CanvasTextureMemoizer = (this: CanvasTexture) => any;

/** @hidden @deprecated @internal */
type LegacyCanvasTextureDrawer = (this: CanvasTexture, context: CanvasRenderingContext2D) => void;
/** @hidden @deprecated @internal */
type LegacyCanvasSpriteMemoizer = () => any;

/** @hidden @deprecated @internal */
type LegacyCanvasSpriteDrawer = (ratio: number, texture: CanvasTexture, sprite: Sprite) => void;

/**
 * A texture with off-screen canvas.
 */
export class CanvasTexture extends Texture {
  // just casting the type
  /** @internal */ _canvas: HTMLCanvasElement;
  /** @internal */ _context: any;
  /** @internal */ _drawer?: CanvasTextureDrawer;
  /** @internal */ _memoizer: CanvasTextureMemoizer;

  /** @internal */ _lastPixelRatio = 0;
  /** @internal */ _lastMemoKey: any;

  constructor(type = "2d", attributes?: any) {
    super();
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext(type, attributes);
    this.setSourceImage(this._canvas);
  }

  /**
   * Note: texture size is set to width and height, and canvas size is texture size multiply by pixelRatio.
   */
  setSize(width: number, height: number, pixelRatio = 1) {
    this._canvas.width = width * pixelRatio;
    this._canvas.height = height * pixelRatio;
    this._pixelRatio = pixelRatio;
    this.setSourceDimension(width, height);
    this.setDestinationDimension(width, height);
  }

  getContext() {
    return this._context;
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

      this._drawer.call(this);
      return true;
    }
  }

  /** @hidden @deprecated @internal */
  size(width: number, height: number, pixelRatio: number) {
    this.setSize(width, height, pixelRatio);
    return this;
  }

  /** @hidden @deprecated @internal */
  context() {
    return this.getContext();
  }

  /** @hidden @deprecated @internal */
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
    const texture = new CanvasTexture(type);
    legacyTextureDrawer = attributes;
    texture.setDrawer(function () {
      legacyTextureDrawer.call(texture, texture.getContext());
    });
    return texture;
  } else if (typeof legacyTextureDrawer === "function") {
    const texture = new CanvasTexture(type, attributes);
    texture.setDrawer(function () {
      legacyTextureDrawer.call(texture, texture.getContext());
    });
    return texture;
  } else {
    const texture = new CanvasTexture(type, attributes);
    return texture;
  }
}

/** @hidden @deprecated @internal */
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
