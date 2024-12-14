import { Texture, TexturePrerenderContext } from "./texture";

export class PipeTexture extends Texture {
  /** @internal */ _source: Texture;

  constructor(source: Texture) {
    super();
    this._source = source;
  }

  setSourceTexture(texture: Texture) {
    this._source = texture;
  }

  getWidth(): number {
    return this.dw ?? this.sw ?? this._source.getWidth();
  }

  getHeight(): number {
    return this.dh ?? this.sh ?? this._source.getHeight();
  }

  /** @internal */
  prerender(context: TexturePrerenderContext): boolean {
    return this._source.prerender(context);
  }

  /** @internal */
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

    texture.draw(context, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}
