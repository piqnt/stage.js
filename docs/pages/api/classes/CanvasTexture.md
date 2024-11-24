# Class: CanvasTexture

A texture with off-screen canvas.

## Extends

- [`ImageTexture`](ImageTexture)

## Constructors

### new CanvasTexture()

> **new CanvasTexture**(): [`CanvasTexture`](CanvasTexture)

#### Returns

[`CanvasTexture`](CanvasTexture)

#### Overrides

[`ImageTexture`](ImageTexture).[`constructor`](ImageTexture#constructors)

## Methods

### draw()

#### draw(context)

> **draw**(`context`): `void`

Signatures:
- (): This is used when a sprite draws its textures
- (sx, sy, sw, sh, dx, dy, dw, dh): This is used when a piped texture passes drawing to it backend.
- (dx, dy, dw, dh): I guess unused.

Note: sx and sy are added to this._sx and this._sy.

##### Parameters

• **context**: `CanvasRenderingContext2D`

##### Returns

`void`

##### Inherited from

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

#### draw(context, x1, y1, w1, h1)

> **draw**(`context`, `x1`, `y1`, `w1`, `h1`): `void`

##### Parameters

• **context**: `CanvasRenderingContext2D`

• **x1**: `number`

• **y1**: `number`

• **w1**: `number`

• **h1**: `number`

##### Returns

`void`

##### Inherited from

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

#### draw(context, x1, y1, w1, h1, x2, y2, w2, h2)

> **draw**(`context`, `x1`, `y1`, `w1`, `h1`, `x2`, `y2`, `w2`, `h2`): `void`

##### Parameters

• **context**: `CanvasRenderingContext2D`

• **x1**: `number`

• **y1**: `number`

• **w1**: `number`

• **h1**: `number`

• **x2**: `number`

• **y2**: `number`

• **w2**: `number`

• **h2**: `number`

##### Returns

`void`

##### Inherited from

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

***

### getContext()

> **getContext**(`type`, `attributes`?): `CanvasRenderingContext2D`

#### Parameters

• **type**: `string` = `"2d"`

• **attributes?**: `any`

#### Returns

`CanvasRenderingContext2D`

***

### getHeight()

> **getHeight**(): `number`

#### Returns

`number`

#### Inherited from

[`ImageTexture`](ImageTexture).[`getHeight`](ImageTexture#getheight)

***

### getOptimalPixelRatio()

> **getOptimalPixelRatio**(): `number`

**`Experimental`**

This is the ratio of screen pixel to this canvas pixel.

#### Returns

`number`

***

### getWidth()

> **getWidth**(): `number`

#### Returns

`number`

#### Inherited from

[`ImageTexture`](ImageTexture).[`getWidth`](ImageTexture#getwidth)

***

### setDestinationCoordinate()

> **setDestinationCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setDestinationCoordinate`](ImageTexture#setdestinationcoordinate)

***

### setDestinationDimension()

> **setDestinationDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setDestinationDimension`](ImageTexture#setdestinationdimension)

***

### setDrawer()

> **setDrawer**(`drawer`): `void`

#### Parameters

• **drawer**: `CanvasTextureDrawer`

#### Returns

`void`

***

### setMemoizer()

> **setMemoizer**(`memoizer`): `void`

#### Parameters

• **memoizer**: `CanvasTextureMemoizer`

#### Returns

`void`

***

### setSize()

> **setSize**(`textureWidth`, `textureHeight`, `pixelRatio`): `void`

Note: provided width and height will be texture size, and canvas size is texture size multiply by pixelRatio.

#### Parameters

• **textureWidth**: `number`

• **textureHeight**: `number`

• **pixelRatio**: `number` = `1`

#### Returns

`void`

***

### setSourceCoordinate()

> **setSourceCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setSourceCoordinate`](ImageTexture#setsourcecoordinate)

***

### setSourceDimension()

> **setSourceDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setSourceDimension`](ImageTexture#setsourcedimension)

***

### setSourceImage()

> **setSourceImage**(`image`, `pixelRatio`): `void`

#### Parameters

• **image**: `TextureImageSource`

• **pixelRatio**: `number` = `1`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setSourceImage`](ImageTexture#setsourceimage)