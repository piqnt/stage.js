import { isFn, isHash } from "../common/is";

import { Atlas, AtlasDefinition, AtlasTextureDefinition } from "./atlas";
import { Texture, TexturePrerenderContext } from "./texture";

export type TextureSelectionInputOne = Texture | AtlasTextureDefinition | string;
export type TextureSelectionInputMap = Record<string, TextureSelectionInputOne>;
export type TextureSelectionInputArray = TextureSelectionInputOne[];
export type TextureSelectionInputFactory = (subquery: string) => TextureSelectionInputOne;

/**
 * Texture selection input could be one:
 * - texture
 * - sprite definition (and an atlas): atlas sprite texture
 * - string (with an atlas): string used as key to find sprite in the atlas, re-resolve
 * - hash object: use subquery as key, then re-resolve value
 * - array: re-resolve first item
 * - function: call function with subquery, then re-resolve
 */
export type TextureSelectionInput =
  | TextureSelectionInputOne
  | TextureSelectionInputMap
  | TextureSelectionInputArray
  | TextureSelectionInputFactory;

/** @internal */
function isAtlasSpriteDefinition(selection: any) {
  return (
    typeof selection === "object" &&
    isHash(selection) &&
    "number" === typeof selection.width &&
    "number" === typeof selection.height
  );
}

/**
 * TextureSelection holds reference to one or many textures or something that
 * can be resolved to one or many textures. This is used to decouple resolving
 * references to textures from rendering them in various ways.
 */
export class TextureSelection {
  selection: TextureSelectionInput;
  atlas: Atlas;
  constructor(selection: TextureSelectionInput, atlas?: Atlas) {
    this.selection = selection;
    this.atlas = atlas;
  }

  /**
   * @internal
   * Resolves the selection to a texture.
   */
  resolve(selection: TextureSelectionInput, subquery?: string): Texture {
    if (!selection) {
      return NO_TEXTURE;
    } else if (Array.isArray(selection)) {
      return this.resolve(selection[0]);
    } else if (selection instanceof Texture) {
      return selection;
    } else if (isAtlasSpriteDefinition(selection)) {
      if (!this.atlas) {
        return NO_TEXTURE;
      }
      return this.atlas.pipeSpriteTexture(selection as AtlasTextureDefinition);
    } else if (
      typeof selection === "object" &&
      isHash(selection) &&
      typeof subquery !== "undefined"
    ) {
      return this.resolve(selection[subquery]);
    } else if (typeof selection === "function" && isFn(selection)) {
      return this.resolve(selection(subquery));
    } else if (typeof selection === "string") {
      if (!this.atlas) {
        return NO_TEXTURE;
      }
      return this.resolve(this.atlas.findSpriteDefinition(selection));
    }
  }

  one(subquery?: string): Texture {
    return this.resolve(this.selection, subquery);
  }

  array(arr?: Texture[]): Texture[] {
    const array = Array.isArray(arr) ? arr : [];
    if (Array.isArray(this.selection)) {
      for (let i = 0; i < this.selection.length; i++) {
        array[i] = this.resolve(this.selection[i]);
      }
    } else {
      array[0] = this.resolve(this.selection);
    }
    return array;
  }
}

/** @internal */
const NO_TEXTURE = new (class extends Texture {
  getWidth(): number {
    return 0;
  }
  getHeight(): number {
    return 0;
  }
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
  ): void {}
  constructor() {
    super();
    this.setSourceDimension(0, 0);
  }
  setSourceCoordinate(x: any, y: any): void {}
  setSourceDimension(w: any, h: any): void {}
  setDestinationCoordinate(x: number, y: number): void {}
  setDestinationDimension(w: number, h: number): void {}
  draw(): void {}
})();

/** @internal */
const NO_SELECTION = new TextureSelection(NO_TEXTURE);

/** @internal */
const ATLAS_MEMO_BY_NAME: Record<string, Atlas> = {};

/** @internal */
const ATLAS_ARRAY: Atlas[] = [];

// TODO: print subquery not found error
// TODO: index textures

export async function atlas(def: AtlasDefinition | Atlas): Promise<Atlas> {
  // todo: where is this used?
  let atlas: Atlas;
  if (def instanceof Atlas) {
    atlas = def;
  } else {
    atlas = new Atlas(def);
  }

  if (atlas.name) {
    ATLAS_MEMO_BY_NAME[atlas.name] = atlas;
  }
  ATLAS_ARRAY.push(atlas);

  await atlas.load();

  return atlas;
}

/**
 * When query argument is string, this function parses the query; looks up registered atlases; and returns a texture selection object.
 *
 * When query argument is an object, the object is used to create a new selection.
 */
export function texture(query: string | TextureSelectionInput): TextureSelection {
  if ("string" !== typeof query) {
    return new TextureSelection(query);
  }

  let result: TextureSelection | undefined | null = null;

  // parse query as atlas-name:texture-name
  const colonIndex = query.indexOf(":");
  if (colonIndex > 0 && query.length > colonIndex + 1) {
    const atlas = ATLAS_MEMO_BY_NAME[query.slice(0, colonIndex)];
    result = atlas && atlas.select(query.slice(colonIndex + 1));
  }

  if (!result) {
    // use query as "atlas-name", return entire atlas
    const atlas = ATLAS_MEMO_BY_NAME[query];
    result = atlas && atlas.select();
  }

  if (!result) {
    // use query as "texture-name", search over all atlases
    for (let i = 0; i < ATLAS_ARRAY.length; i++) {
      result = ATLAS_ARRAY[i].select(query);
      if (result) {
        break;
      }
    }
  }

  if (!result) {
    console.error("Texture not found: " + query);
    result = NO_SELECTION;
  }

  return result;
}
