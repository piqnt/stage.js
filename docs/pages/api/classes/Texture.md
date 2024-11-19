# Class: `abstract` Texture

Textures are used to clip and resize image objects.

## Extended by

- [`ImageTexture`](ImageTexture)
- [`PipeTexture`](PipeTexture)
- [`ResizableTexture`](ResizableTexture)

## Constructors

### new Texture()

> **new Texture**(): [`Texture`](Texture)

#### Returns

[`Texture`](Texture)

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

***

### getHeight()

> `abstract` **getHeight**(): `number`

#### Returns

`number`

***

### getWidth()

> `abstract` **getWidth**(): `number`

#### Returns

`number`

***

### setDestinationCoordinate()

> **setDestinationCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

***

### setDestinationDimension()

> **setDestinationDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

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

***

### setSourceDimension()

> **setSourceDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`
