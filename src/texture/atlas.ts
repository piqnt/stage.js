import { isFn, isHash } from "../common/is";

import { Texture } from "./texture";
import { TextureSelection } from "./selection";
import { ImageTexture } from "./image";
import { PipeTexture } from "./pipe";

export interface AtlasTextureDefinition {
  x: number;
  y: number;
  width: number;
  height: number;

  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

type MonotypeAtlasTextureDefinition = Record<string, AtlasTextureDefinition | Texture | string>;
type AnimAtlasTextureDefinition = (AtlasTextureDefinition | Texture | string)[];

export interface AtlasDefinition {
  name?: string;
  image?:
    | {
        src: string;
        ratio?: number;
      }
    | {
        /** @deprecated Use src instead of url */
        url: string;
        ratio?: number;
      };

  ppu?: number;
  textures?: Record<
    string,
    AtlasTextureDefinition | Texture | MonotypeAtlasTextureDefinition | AnimAtlasTextureDefinition
  >;

  map?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;

  /** @deprecated Use map */
  filter?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;

  /** @deprecated */
  trim?: number;
  /** @deprecated Use ppu */
  ratio?: number;

  /** @deprecated Use map */
  imagePath?: string;
  /** @deprecated Use map */
  imageRatio?: number;
}

export class Atlas extends ImageTexture {
  /** @internal */ name: any;

  /** @internal */ _ppu: any;
  /** @internal */ _trim: any;
  /** @internal */ _map: any;
  /** @internal */ _textures: any;
  /** @internal */ _imageSrc: string;

  constructor(def: AtlasDefinition = {}) {
    super();

    this.name = def.name;
    this._ppu = def.ppu || def.ratio || 1;
    this._trim = def.trim || 0;

    this._map = def.map || def.filter;
    this._textures = def.textures;

    if (typeof def.image === "object" && isHash(def.image)) {
      if ("src" in def.image) {
        this._imageSrc = def.image.src;
      } else if ("url" in def.image) {
        this._imageSrc = def.image.url;
      }
      if (typeof def.image.ratio === "number") {
        this._pixelRatio = def.image.ratio;
      }
    } else {
      if (typeof def.imagePath === "string") {
        this._imageSrc = def.imagePath;
      } else if (typeof def.image === "string") {
        this._imageSrc = def.image;
      }
      if (typeof def.imageRatio === "number") {
        this._pixelRatio = def.imageRatio;
      }
    }

    deprecatedWarning(def);
  }

  async load() {
    if (this._imageSrc) {
      const image = await asyncLoadImage(this._imageSrc);
      this.setSourceImage(image, this._pixelRatio);
    }
  }

  /**
   * @internal
   * Uses the definition to create a texture object from this atlas.
   */
  pipeSpriteTexture = (def: AtlasTextureDefinition): Texture => {
    const map = this._map;
    const ppu = this._ppu;
    const trim = this._trim;

    if (!def) {
      return undefined;
    }

    def = Object.assign({}, def);

    if (isFn(map)) {
      def = map(def);
    }

    if (ppu != 1) {
      def.x *= ppu;
      def.y *= ppu;
      def.width *= ppu;
      def.height *= ppu;
      def.top *= ppu;
      def.bottom *= ppu;
      def.left *= ppu;
      def.right *= ppu;
    }

    if (trim != 0) {
      def.x += trim;
      def.y += trim;
      def.width -= 2 * trim;
      def.height -= 2 * trim;
      def.top -= trim;
      def.bottom -= trim;
      def.left -= trim;
      def.right -= trim;
    }

    const texture = new PipeTexture(this);
    texture.top = def.top;
    texture.bottom = def.bottom;
    texture.left = def.left;
    texture.right = def.right;
    texture.setSourceCoordinate(def.x, def.y);
    texture.setSourceDimension(def.width, def.height);
    return texture;
  };

  /**
   * @internal
   * Looks up and returns texture definition.
   */
  findSpriteDefinition = (query: string) => {
    const textures = this._textures;

    if (textures) {
      if (isFn(textures)) {
        return textures(query);
      } else if (isHash(textures)) {
        return textures[query];
      }
    }
  };

  // returns Selection, and then selection.one/array returns actual texture/textures
  select = (query?: string) => {
    if (!query) {
      // TODO: if `textures` is texture def, map or fn?
      return new TextureSelection(new PipeTexture(this));
    }
    const textureDefinition = this.findSpriteDefinition(query);
    if (textureDefinition) {
      return new TextureSelection(textureDefinition, this);
    }
  };
}

/** @internal */
function asyncLoadImage(src: string) {
  console.debug && console.debug("Loading image: " + src);
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      console.debug && console.debug("Image loaded: " + src);
      resolve(img);
    };
    img.onerror = function (error) {
      console.error("Loading failed: " + src);
      reject(error);
    };
    img.src = src;
  });
}

/** @internal */
function deprecatedWarning(def: AtlasDefinition) {
  if ("filter" in def) console.warn("'filter' field of atlas definition is deprecated");

  // todo: throw error here?
  if ("cutouts" in def) console.warn("'cutouts' field of atlas definition is deprecated");

  // todo: throw error here?
  if ("sprites" in def) console.warn("'sprites' field of atlas definition is deprecated");

  // todo: throw error here?
  if ("factory" in def) console.warn("'factory' field of atlas definition is deprecated");

  if ("ratio" in def) console.warn("'ratio' field of atlas definition is deprecated");

  if ("imagePath" in def) console.warn("'imagePath' field of atlas definition is deprecated");

  if ("imageRatio" in def) console.warn("'imageRatio' field of atlas definition is deprecated");

  if (typeof def.image === "object" && "url" in def.image)
    console.warn("'image.url' field of atlas definition is deprecated");
}
