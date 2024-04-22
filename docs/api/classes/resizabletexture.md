[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [ResizableTexture](resizabletexture.md)

# Class: ResizableTexture

## Hierarchy

* [Texture](texture.md)

  ↳ **ResizableTexture**

## Index

### Constructors

* [constructor](resizabletexture.md#constructor)

### Methods

* [draw](resizabletexture.md#draw)
* [drawWithNormalizedArgs](resizabletexture.md#drawwithnormalizedargs)
* [getHeight](resizabletexture.md#getheight)
* [getWidth](resizabletexture.md#getwidth)
* [setDestinationCoordinate](resizabletexture.md#setdestinationcoordinate)
* [setDestinationDimension](resizabletexture.md#setdestinationdimension)
* [setSourceCoordinate](resizabletexture.md#setsourcecoordinate)
* [setSourceDimension](resizabletexture.md#setsourcedimension)

## Constructors

###  constructor

\+ **new ResizableTexture**(`source`: [Texture](texture.md), `mode`: [ResizableTextureMode](../globals.md#resizabletexturemode)): *[ResizableTexture](resizabletexture.md)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [Texture](texture.md) |
`mode` | [ResizableTextureMode](../globals.md#resizabletexturemode) |

**Returns:** *[ResizableTexture](resizabletexture.md)*

## Methods

###  draw

▸ **draw**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Texture](texture.md).[draw](texture.md#draw)*

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

*Inherited from [Texture](texture.md).[draw](texture.md#draw)*

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

*Inherited from [Texture](texture.md).[draw](texture.md#draw)*

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

*Overrides [Texture](texture.md).[getHeight](texture.md#abstract-getheight)*

**Returns:** *number*

___

###  getWidth

▸ **getWidth**(): *number*

*Overrides [Texture](texture.md).[getWidth](texture.md#abstract-getwidth)*

**Returns:** *number*

___

###  setDestinationCoordinate

▸ **setDestinationCoordinate**(`x`: number, `y`: number): *void*

*Inherited from [Texture](texture.md).[setDestinationCoordinate](texture.md#setdestinationcoordinate)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setDestinationDimension

▸ **setDestinationDimension**(`w`: number, `h`: number): *void*

*Inherited from [Texture](texture.md).[setDestinationDimension](texture.md#setdestinationdimension)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*

___

###  setSourceCoordinate

▸ **setSourceCoordinate**(`x`: number, `y`: number): *void*

*Inherited from [Texture](texture.md).[setSourceCoordinate](texture.md#setsourcecoordinate)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setSourceDimension

▸ **setSourceDimension**(`w`: number, `h`: number): *void*

*Inherited from [Texture](texture.md).[setSourceDimension](texture.md#setsourcedimension)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*
