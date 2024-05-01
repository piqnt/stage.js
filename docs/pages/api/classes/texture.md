
# Class: Texture

Textures are used to clip and resize image objects.

## Hierarchy

* **Texture**

  ↳ [ImageTexture](/api/classes/imagetexture)

  ↳ [PipeTexture](/api/classes/pipetexture)

  ↳ [ResizableTexture](/api/classes/resizabletexture)

## Index

### Methods

* [draw](/api/classes/texture#draw)
* [getHeight](/api/classes/texture#abstract-getheight)
* [getWidth](/api/classes/texture#abstract-getwidth)
* [setDestinationCoordinate](/api/classes/texture#setdestinationcoordinate)
* [setDestinationDimension](/api/classes/texture#setdestinationdimension)
* [setSourceCoordinate](/api/classes/texture#setsourcecoordinate)
* [setSourceDimension](/api/classes/texture#setsourcedimension)

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

### `Abstract` getHeight

▸ **getHeight**(): *number*

**Returns:** *number*

___

### `Abstract` getWidth

▸ **getWidth**(): *number*

**Returns:** *number*

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
