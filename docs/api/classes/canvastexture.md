[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [CanvasTexture](canvastexture.md)

# Class: CanvasTexture

A texture with off-screen canvas.

## Hierarchy

* [Texture](texture.md)

  ↳ **CanvasTexture**

## Index

### Constructors

* [constructor](canvastexture.md#constructor)

### Properties

* [bottom](canvastexture.md#bottom)
* [height](canvastexture.md#height)
* [left](canvastexture.md#left)
* [right](canvastexture.md#right)
* [top](canvastexture.md#top)
* [width](canvastexture.md#width)

### Methods

* [draw](canvastexture.md#draw)
* [getContext](canvastexture.md#getcontext)
* [pipe](canvastexture.md#pipe)
* [setDestinationCoordinate](canvastexture.md#setdestinationcoordinate)
* [setDestinationDimension](canvastexture.md#setdestinationdimension)
* [setDrawer](canvastexture.md#setdrawer)
* [setMemoizer](canvastexture.md#setmemoizer)
* [setSize](canvastexture.md#setsize)
* [setSourceCoordinate](canvastexture.md#setsourcecoordinate)
* [setSourceDimension](canvastexture.md#setsourcedimension)
* [setSourceImage](canvastexture.md#setsourceimage)

## Constructors

###  constructor

\+ **new CanvasTexture**(`type`: string, `attributes?`: any): *[CanvasTexture](canvastexture.md)*

*Overrides [Texture](texture.md).[constructor](texture.md#constructor)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`type` | string | "2d" |
`attributes?` | any | - |

**Returns:** *[CanvasTexture](canvastexture.md)*

## Properties

###  bottom

• **bottom**: *number*

*Inherited from [Texture](texture.md).[bottom](texture.md#bottom)*

___

###  height

• **height**: *number*

*Inherited from [Texture](texture.md).[height](texture.md#height)*

___

###  left

• **left**: *number*

*Inherited from [Texture](texture.md).[left](texture.md#left)*

___

###  right

• **right**: *number*

*Inherited from [Texture](texture.md).[right](texture.md#right)*

___

###  top

• **top**: *number*

*Inherited from [Texture](texture.md).[top](texture.md#top)*

___

###  width

• **width**: *number*

*Inherited from [Texture](texture.md).[width](texture.md#width)*

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

###  getContext

▸ **getContext**(): *any*

**Returns:** *any*

___

###  pipe

▸ **pipe**(): *[Texture](texture.md)‹›*

*Inherited from [Texture](texture.md).[pipe](texture.md#pipe)*

**Returns:** *[Texture](texture.md)‹›*

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

###  setDrawer

▸ **setDrawer**(`drawer`: [CanvasTextureDrawer](../globals.md#canvastexturedrawer)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`drawer` | [CanvasTextureDrawer](../globals.md#canvastexturedrawer) |

**Returns:** *void*

___

###  setMemoizer

▸ **setMemoizer**(`memoizer`: [CanvasTextureMemoizer](../globals.md#canvastexturememoizer)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`memoizer` | [CanvasTextureMemoizer](../globals.md#canvastexturememoizer) |

**Returns:** *void*

___

###  setSize

▸ **setSize**(`width`: number, `height`: number, `pixelRatio`: number): *void*

Note: texture size is set to width and height, and canvas size is texture size multiply by pixelRatio.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`width` | number | - |
`height` | number | - |
`pixelRatio` | number | 1 |

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

___

###  setSourceImage

▸ **setSourceImage**(`image`: [TextureSource](../globals.md#texturesource), `pixelRatio`: number): *void*

*Inherited from [Texture](texture.md).[setSourceImage](texture.md#setsourceimage)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`image` | [TextureSource](../globals.md#texturesource) | - |
`pixelRatio` | number | 1 |

**Returns:** *void*
