
# Class: Atlas

## Hierarchy

  ↳ [ImageTexture](/api/classes/imagetexture)

  ↳ **Atlas**

## Index

### Constructors

* [constructor](/api/classes/atlas#constructor)

### Methods

* [draw](/api/classes/atlas#draw)
* [getHeight](/api/classes/atlas#getheight)
* [getWidth](/api/classes/atlas#getwidth)
* [load](/api/classes/atlas#load)
* [select](/api/classes/atlas#select)
* [setDestinationCoordinate](/api/classes/atlas#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/atlas#setdestinationdimension)
* [setSourceCoordinate](/api/classes/atlas#setsourcecoordinate)
* [setSourceDimension](/api/classes/atlas#setsourcedimension)
* [setSourceImage](/api/classes/atlas#setsourceimage)

## Constructors

###  constructor

\+ **new Atlas**(`def`: [AtlasDefinition](/api/interfaces/atlasdefinition)): *[Atlas](/api/classes/atlas)*

*Overrides [ImageTexture](/api/classes/imagetexture).[constructor](/api/classes/imagetexture#constructor)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`def` | [AtlasDefinition](/api/interfaces/atlasdefinition) | {} |

**Returns:** *[Atlas](/api/classes/atlas)*

## Methods

###  draw

▸ **draw**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Texture](/api/classes/texture).[draw](/api/classes/texture#draw)*

Signatures:
- (): This is used when a sprite draws its textures
- (sx, sy, sw, sh, dx, dy, dw, dh): This is used when a piped texture passes drawing to it backend.
- (dx, dy, dw, dh): I guess unused.

Note: sx and sy are added to this._sx and this._sy.

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

▸ **draw**(`context`: CanvasRenderingContext2D, `x1`: number, `y1`: number, `w1`: number, `h1`: number): *void*

*Inherited from [Texture](/api/classes/texture).[draw](/api/classes/texture#draw)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |
`x1` | number |
`y1` | number |
`w1` | number |
`h1` | number |

**Returns:** *void*

▸ **draw**(`context`: CanvasRenderingContext2D, `x1`: number, `y1`: number, `w1`: number, `h1`: number, `x2`: number, `y2`: number, `w2`: number, `h2`: number): *void*

*Inherited from [Texture](/api/classes/texture).[draw](/api/classes/texture#draw)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |
`x1` | number |
`y1` | number |
`w1` | number |
`h1` | number |
`x2` | number |
`y2` | number |
`w2` | number |
`h2` | number |

**Returns:** *void*

___

###  getHeight

▸ **getHeight**(): *number*

*Inherited from [ImageTexture](/api/classes/imagetexture).[getHeight](/api/classes/imagetexture#getheight)*

*Overrides [Texture](/api/classes/texture).[getHeight](/api/classes/texture#abstract-getheight)*

**Returns:** *number*

___

###  getWidth

▸ **getWidth**(): *number*

*Inherited from [ImageTexture](/api/classes/imagetexture).[getWidth](/api/classes/imagetexture#getwidth)*

*Overrides [Texture](/api/classes/texture).[getWidth](/api/classes/texture#abstract-getwidth)*

**Returns:** *number*

___

###  load

▸ **load**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  select

▸ **select**(`query?`: string): *[TextureSelection](/api/classes/textureselection)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`query?` | string |

**Returns:** *[TextureSelection](/api/classes/textureselection)‹›*

___

###  setDestinationCoordinate

▸ **setDestinationCoordinate**(`x`: number, `y`: number): *void*

*Inherited from [Texture](/api/classes/texture).[setDestinationCoordinate](/api/classes/texture#setdestinationcoordinate)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setDestinationDimension

▸ **setDestinationDimension**(`w`: number, `h`: number): *void*

*Inherited from [Texture](/api/classes/texture).[setDestinationDimension](/api/classes/texture#setdestinationdimension)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*

___

###  setSourceCoordinate

▸ **setSourceCoordinate**(`x`: number, `y`: number): *void*

*Inherited from [Texture](/api/classes/texture).[setSourceCoordinate](/api/classes/texture#setsourcecoordinate)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setSourceDimension

▸ **setSourceDimension**(`w`: number, `h`: number): *void*

*Inherited from [Texture](/api/classes/texture).[setSourceDimension](/api/classes/texture#setsourcedimension)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*

___

###  setSourceImage

▸ **setSourceImage**(`image`: [TextureImageSource](/api/globals#textureimagesource), `pixelRatio`: number): *void*

*Inherited from [ImageTexture](/api/classes/imagetexture).[setSourceImage](/api/classes/imagetexture#setsourceimage)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`image` | [TextureImageSource](/api/globals#textureimagesource) | - |
`pixelRatio` | number | 1 |

**Returns:** *void*
