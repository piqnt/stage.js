import { isFn, isHash } from "../common/is";

import { Texture } from "./texture";
import { TextureSelection } from "./selection";

/** @internal */ const DEBUG = true;

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

type AtlasTextureReferenceOne = AtlasTextureDefinition | string;
type AtlasTextureReferenceMap = Record<string, AtlasTextureReferenceOne>;
type AtlasTextureReferenceArray = AtlasTextureReferenceOne[];

export interface AtlasDefinition {
  name?: string;
  image?: {
    /** @deprecated */
    url: string;
    src: string;
    ratio?: number;
  };

  ppu?: number;
  textures?: Record<
    string,
    AtlasTextureDefinition | AtlasTextureReferenceMap | AtlasTextureReferenceArray
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

export class Atlas extends Texture {
  /** @internal */ _name: any;
  /** @internal */ _ppu: any;
  /** @internal */ _trim: any;
  /** @internal */ _map: any;
  /** @internal */ _textures: any;
  /** @internal */ _imageSrc: string;
  /** @internal */ _imagePixelRatio: number = 1;

  constructor(def: AtlasDefinition = {}) {
    super();

    this._name = def.name;
    this._ppu = def.ppu || def.ratio || 1;
    this._trim = def.trim || 0;

    this._map = def.map || def.filter;
    this._textures = def.textures;

    if (typeof def.image === "object" && isHash(def.image)) {
      this._imageSrc = def.image.src || def.image.url;
      if (typeof def.image.ratio === "number") {
        this._imagePixelRatio = def.image.ratio;
      }
    } else {
      if (typeof def.imagePath === "string") {
        this._imageSrc = def.imagePath;
      } else if (typeof def.image === "string") {
        this._imageSrc = def.image;
      }
      if (typeof def.imageRatio === "number") {
        this._imagePixelRatio = def.imageRatio;
      }
    }

    this.deprecatedWarning(def);
  }

  /** @internal */
  deprecatedWarning(def: AtlasDefinition) {
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

  async load() {
    if (this._imageSrc) {
      const image = await asyncLoadImage(this._imageSrc);
      this.setSourceImage(image, this._imagePixelRatio);
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

    const texture = this.pipe();
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
      return new TextureSelection(this.pipe());
    }
    const textureDefinition = this.findSpriteDefinition(query);
    if (textureDefinition) {
      return new TextureSelection(textureDefinition, this);
    }
  };
}

/** @internal */ function asyncLoadImage(src: string) {
  DEBUG && console.log("Loading image: " + src);
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      DEBUG && console.log("Image loaded: " + src);
      resolve(img);
    };
    img.onerror = function (error) {
      DEBUG && console.log("Loading failed: " + src);
      reject(error);
    };
    img.src = src;
  });
}
