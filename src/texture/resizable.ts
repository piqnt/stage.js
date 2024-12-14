import { Texture, TexturePrerenderContext } from "./texture";

export type ResizableTextureMode = "stretch" | "tile";

export class ResizableTexture extends Texture {
  /** @internal */ _source: Texture;

  /** @internal */ _resizeMode: ResizableTextureMode;
  /** @internal */ _innerSize: boolean;

  constructor(source: Texture, mode: ResizableTextureMode) {
    super();
    this._source = source;
    this._resizeMode = mode;
  }

  getWidth(): number {
    // this is the last known width
    return this.dw ?? this._source.getWidth();
  }

  getHeight(): number {
    // this is the last known height
    return this.dh ?? this._source.getHeight();
  }

  /** @internal */
  prerender(context: TexturePrerenderContext): boolean {
    return false;
  }

  drawWithNormalizedArgs(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    const texture = this._source;
    if (texture === null || typeof texture !== "object") {
      return;
    }

    let outWidth = dw;
    let outHeight = dh;

    const left = Number.isFinite(texture.left) ? texture.left : 0;
    const right = Number.isFinite(texture.right) ? texture.right : 0;
    const top = Number.isFinite(texture.top) ? texture.top : 0;
    const bottom = Number.isFinite(texture.bottom) ? texture.bottom : 0;

    const width = texture.getWidth() - left - right;
    const height = texture.getHeight() - top - bottom;

    if (!this._innerSize) {
      outWidth = Math.max(outWidth - left - right, 0);
      outHeight = Math.max(outHeight - top - bottom, 0);
    }

    // corners
    if (top > 0 && left > 0) {
      texture.draw(context, 0, 0, left, top, 0, 0, left, top);
    }
    if (bottom > 0 && left > 0) {
      texture.draw(context, 0, height + top, left, bottom, 0, outHeight + top, left, bottom);
    }
    if (top > 0 && right > 0) {
      texture.draw(context, width + left, 0, right, top, outWidth + left, 0, right, top);
    }
    if (bottom > 0 && right > 0) {
      texture.draw(
        context,
        width + left,
        height + top,
        right,
        bottom,
        outWidth + left,
        outHeight + top,
        right,
        bottom,
      );
    }

    if (this._resizeMode === "stretch") {
      // sides
      if (top > 0) {
        texture.draw(context, left, 0, width, top, left, 0, outWidth, top);
      }
      if (bottom > 0) {
        texture.draw(
          context,
          left,
          height + top,
          width,
          bottom,
          left,
          outHeight + top,
          outWidth,
          bottom,
        );
      }
      if (left > 0) {
        texture.draw(context, 0, top, left, height, 0, top, left, outHeight);
      }
      if (right > 0) {
        texture.draw(
          context,
          width + left,
          top,
          right,
          height,
          outWidth + left,
          top,
          right,
          outHeight,
        );
      }
      // center
      texture.draw(context, left, top, width, height, left, top, outWidth, outHeight);
    } else if (this._resizeMode === "tile") {
      // tile
      let l = left;
      let r = outWidth;
      let w: number;
      while (r > 0) {
        w = Math.min(width, r);
        r -= width;
        let t = top;
        let b = outHeight;
        let h: number;
        while (b > 0) {
          h = Math.min(height, b);
          b -= height;
          texture.draw(context, left, top, w, h, l, t, w, h);
          if (r <= 0) {
            if (left) {
              texture.draw(context, 0, top, left, h, 0, t, left, h);
            }
            if (right) {
              texture.draw(context, width + left, top, right, h, l + w, t, right, h);
            }
          }
          t += h;
        }
        if (top) {
          texture.draw(context, left, 0, w, top, l, 0, w, top);
        }
        if (bottom) {
          texture.draw(context, left, height + top, w, bottom, l, t, w, bottom);
        }
        l += w;
      }
    }
  }
}
