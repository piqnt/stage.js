
# Class: ResizableTexture

## Hierarchy

* [Texture](/api/classes/texture)

  ↳ **ResizableTexture**

## Index

### Constructors

* [constructor](/api/classes/resizabletexture#constructor)

### Methods

* [draw](/api/classes/resizabletexture#draw)
* [drawWithNormalizedArgs](/api/classes/resizabletexture#drawwithnormalizedargs)
* [getHeight](/api/classes/resizabletexture#getheight)
* [getWidth](/api/classes/resizabletexture#getwidth)
* [setDestinationCoordinate](/api/classes/resizabletexture#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/resizabletexture#setdestinationdimension)
* [setSourceCoordinate](/api/classes/resizabletexture#setsourcecoordinate)
* [setSourceDimension](/api/classes/resizabletexture#setsourcedimension)

## Constructors

###  constructor

\+ **new ResizableTexture**(`source`: [Texture](/api/classes/texture), `mode`: [ResizableTextureMode](/api/globals#resizabletexturemode)): *[ResizableTexture](/api/classes/resizabletexture)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [Texture](/api/classes/texture) |
`mode` | [ResizableTextureMode](/api/globals#resizabletexturemode) |

**Returns:** *[ResizableTexture](/api/classes/resizabletexture)*

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

###  drawWithNormalizedArgs

▸ **drawWithNormalizedArgs**(`context`: CanvasRenderingContext2D, `sx`: number, `sy`: number, `sw`: number, `sh`: number, `dx`: number, `dy`: number, `dw`: number, `dh`: number): *void*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |
`sx` | number |
`sy` | number |
`sw` | number |
`sh` | number |
`dx` | number |
`dy` | number |
`dw` | number |
`dh` | number |

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
