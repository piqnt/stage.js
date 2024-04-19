[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Texture](texture.md)

# Class: Texture

Textures are used to clip and resize a drawable object, for example atlas sprites.

## Hierarchy

* **Texture**

  ↳ [Atlas](atlas.md)

  ↳ [CanvasTexture](canvastexture.md)

## Index

### Constructors

* [constructor](texture.md#constructor)

### Properties

* [bottom](texture.md#bottom)
* [height](texture.md#height)
* [left](texture.md#left)
* [right](texture.md#right)
* [top](texture.md#top)
* [width](texture.md#width)

### Methods

* [draw](texture.md#draw)
* [pipe](texture.md#pipe)
* [setDestinationCoordinate](texture.md#setdestinationcoordinate)
* [setDestinationDimension](texture.md#setdestinationdimension)
* [setSourceCoordinate](texture.md#setsourcecoordinate)
* [setSourceDimension](texture.md#setsourcedimension)
* [setSourceImage](texture.md#setsourceimage)

## Constructors

###  constructor

\+ **new Texture**(`source?`: [TextureSource](../globals.md#texturesource), `pixelRatio?`: number): *[Texture](texture.md)*

**Parameters:**

Name | Type |
------ | ------ |
`source?` | [TextureSource](../globals.md#texturesource) |
`pixelRatio?` | number |

**Returns:** *[Texture](texture.md)*

## Properties

###  bottom

• **bottom**: *number*

___

###  height

• **height**: *number*

___

###  left

• **left**: *number*

___

###  right

• **right**: *number*

___

###  top

• **top**: *number*

___

###  width

• **width**: *number*

## Methods

###  draw

▸ **draw**(`context`: CanvasRenderingContext2D): *void*

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

###  pipe

▸ **pipe**(): *[Texture](texture.md)‹›*

**Returns:** *[Texture](texture.md)‹›*

___

###  setDestinationCoordinate

▸ **setDestinationCoordinate**(`x`: number, `y`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setDestinationDimension

▸ **setDestinationDimension**(`w`: number, `h`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*

___

###  setSourceCoordinate

▸ **setSourceCoordinate**(`x`: number, `y`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  setSourceDimension

▸ **setSourceDimension**(`w`: number, `h`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *void*

___

###  setSourceImage

▸ **setSourceImage**(`image`: [TextureSource](../globals.md#texturesource), `pixelRatio`: number): *void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`image` | [TextureSource](../globals.md#texturesource) | - |
`pixelRatio` | number | 1 |

**Returns:** *void*
