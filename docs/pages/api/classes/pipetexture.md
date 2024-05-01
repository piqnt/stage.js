
# Class: PipeTexture

## Hierarchy

* [Texture](/api/classes/texture)

  ↳ **PipeTexture**

## Index

### Constructors

* [constructor](/api/classes/pipetexture#constructor)

### Methods

* [draw](/api/classes/pipetexture#draw)
* [getHeight](/api/classes/pipetexture#getheight)
* [getWidth](/api/classes/pipetexture#getwidth)
* [setDestinationCoordinate](/api/classes/pipetexture#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/pipetexture#setdestinationdimension)
* [setSourceCoordinate](/api/classes/pipetexture#setsourcecoordinate)
* [setSourceDimension](/api/classes/pipetexture#setsourcedimension)
* [setSourceTexture](/api/classes/pipetexture#setsourcetexture)

## Constructors

###  constructor

\+ **new PipeTexture**(`source`: [Texture](/api/classes/texture)): *[PipeTexture](/api/classes/pipetexture)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [Texture](/api/classes/texture) |

**Returns:** *[PipeTexture](/api/classes/pipetexture)*

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

###  setSourceTexture

▸ **setSourceTexture**(`texture`: [Texture](/api/classes/texture)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`texture` | [Texture](/api/classes/texture) |

**Returns:** *void*
