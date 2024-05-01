
# Class: ImageTexture

## Hierarchy

* [Texture](/api/classes/texture)

  ↳ **ImageTexture**

  ↳ [Atlas](/api/classes/atlas)

  ↳ [CanvasTexture](/api/classes/canvastexture)

## Index

### Constructors

* [constructor](/api/classes/imagetexture#constructor)

### Methods

* [draw](/api/classes/imagetexture#draw)
* [getHeight](/api/classes/imagetexture#getheight)
* [getWidth](/api/classes/imagetexture#getwidth)
* [setDestinationCoordinate](/api/classes/imagetexture#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/imagetexture#setdestinationdimension)
* [setSourceCoordinate](/api/classes/imagetexture#setsourcecoordinate)
* [setSourceDimension](/api/classes/imagetexture#setsourcedimension)
* [setSourceImage](/api/classes/imagetexture#setsourceimage)

## Constructors

###  constructor

\+ **new ImageTexture**(`source?`: [TextureImageSource](/api/globals#textureimagesource), `pixelRatio?`: number): *[ImageTexture](/api/classes/imagetexture)*

**Parameters:**

Name | Type |
------ | ------ |
`source?` | [TextureImageSource](/api/globals#textureimagesource) |
`pixelRatio?` | number |

**Returns:** *[ImageTexture](/api/classes/imagetexture)*

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

*Overrides [Texture](/api/classes/texture).[getHeight](/api/classes/texture#abstract-getheight)*

**Returns:** *number*

___

###  getWidth

▸ **getWidth**(): *number*

*Overrides [Texture](/api/classes/texture).[getWidth](/api/classes/texture#abstract-getwidth)*

**Returns:** *number*

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

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`image` | [TextureImageSource](/api/globals#textureimagesource) | - |
`pixelRatio` | number | 1 |

**Returns:** *void*
