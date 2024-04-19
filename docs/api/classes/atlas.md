[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Atlas](atlas.md)

# Class: Atlas

## Hierarchy

* [Texture](texture.md)

  ↳ **Atlas**

## Index

### Constructors

* [constructor](atlas.md#constructor)

### Properties

* [bottom](atlas.md#bottom)
* [height](atlas.md#height)
* [left](atlas.md#left)
* [right](atlas.md#right)
* [top](atlas.md#top)
* [width](atlas.md#width)

### Methods

* [draw](atlas.md#draw)
* [load](atlas.md#load)
* [pipe](atlas.md#pipe)
* [select](atlas.md#select)
* [setDestinationCoordinate](atlas.md#setdestinationcoordinate)
* [setDestinationDimension](atlas.md#setdestinationdimension)
* [setSourceCoordinate](atlas.md#setsourcecoordinate)
* [setSourceDimension](atlas.md#setsourcedimension)
* [setSourceImage](atlas.md#setsourceimage)

## Constructors

###  constructor

\+ **new Atlas**(`def`: [AtlasDefinition](../interfaces/atlasdefinition.md)): *[Atlas](atlas.md)*

*Overrides [Texture](texture.md).[constructor](texture.md#constructor)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`def` | [AtlasDefinition](../interfaces/atlasdefinition.md) | {} |

**Returns:** *[Atlas](atlas.md)*

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

###  load

▸ **load**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  pipe

▸ **pipe**(): *[Texture](texture.md)‹›*

*Inherited from [Texture](texture.md).[pipe](texture.md#pipe)*

**Returns:** *[Texture](texture.md)‹›*

___

###  select

▸ **select**(`query?`: string): *[TextureSelection](textureselection.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`query?` | string |

**Returns:** *[TextureSelection](textureselection.md)‹›*

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
