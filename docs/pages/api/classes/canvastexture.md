
# Class: CanvasTexture

A texture with off-screen canvas.

## Hierarchy

  ↳ [ImageTexture](/api/classes/imagetexture)

  ↳ **CanvasTexture**

## Index

### Constructors

* [constructor](/api/classes/canvastexture#constructor)

### Methods

* [draw](/api/classes/canvastexture#draw)
* [getContext](/api/classes/canvastexture#getcontext)
* [getHeight](/api/classes/canvastexture#getheight)
* [getOptimalPixelRatio](/api/classes/canvastexture#getoptimalpixelratio)
* [getWidth](/api/classes/canvastexture#getwidth)
* [setDestinationCoordinate](/api/classes/canvastexture#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/canvastexture#setdestinationdimension)
* [setDrawer](/api/classes/canvastexture#setdrawer)
* [setMemoizer](/api/classes/canvastexture#setmemoizer)
* [setSize](/api/classes/canvastexture#setsize)
* [setSourceCoordinate](/api/classes/canvastexture#setsourcecoordinate)
* [setSourceDimension](/api/classes/canvastexture#setsourcedimension)
* [setSourceImage](/api/classes/canvastexture#setsourceimage)

## Constructors

###  constructor

\+ **new CanvasTexture**(): *[CanvasTexture](/api/classes/canvastexture)*

*Overrides [ImageTexture](/api/classes/imagetexture).[constructor](/api/classes/imagetexture#constructor)*

**Returns:** *[CanvasTexture](/api/classes/canvastexture)*

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

###  getContext

▸ **getContext**(`type`: string, `attributes?`: any): *CanvasRenderingContext2D*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`type` | string | "2d" |
`attributes?` | any | - |

**Returns:** *CanvasRenderingContext2D*

___

###  getHeight

▸ **getHeight**(): *number*

*Inherited from [ImageTexture](/api/classes/imagetexture).[getHeight](/api/classes/imagetexture#getheight)*

*Overrides [Texture](/api/classes/texture).[getHeight](/api/classes/texture#abstract-getheight)*

**Returns:** *number*

___

###  getOptimalPixelRatio

▸ **getOptimalPixelRatio**(): *number*

**`experimental`** 

This is the ratio of screen pixel to this canvas pixel.

**Returns:** *number*

___

###  getWidth

▸ **getWidth**(): *number*

*Inherited from [ImageTexture](/api/classes/imagetexture).[getWidth](/api/classes/imagetexture#getwidth)*

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

###  setDrawer

▸ **setDrawer**(`drawer`: [CanvasTextureDrawer](/api/globals#canvastexturedrawer)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`drawer` | [CanvasTextureDrawer](/api/globals#canvastexturedrawer) |

**Returns:** *void*

___

###  setMemoizer

▸ **setMemoizer**(`memoizer`: [CanvasTextureMemoizer](/api/globals#canvastexturememoizer)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`memoizer` | [CanvasTextureMemoizer](/api/globals#canvastexturememoizer) |

**Returns:** *void*

___

###  setSize

▸ **setSize**(`textureWidth`: number, `textureHeight`: number, `pixelRatio`: number): *void*

Note: provided width and height will be texture size, and canvas size is texture size multiply by pixelRatio.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`textureWidth` | number | - |
`textureHeight` | number | - |
`pixelRatio` | number | 1 |

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
