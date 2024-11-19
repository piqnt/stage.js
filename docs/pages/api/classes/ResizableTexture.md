# Class: ResizableTexture

Textures are used to clip and resize image objects.

## Extends

- [`Texture`](Texture)

## Constructors

### new ResizableTexture()

> **new ResizableTexture**(`source`, `mode`): [`ResizableTexture`](ResizableTexture)

#### Parameters

• **source**: [`Texture`](Texture)

• **mode**: [`ResizableTextureMode`](../type-aliases/ResizableTextureMode)

#### Returns

[`ResizableTexture`](ResizableTexture)

#### Overrides

[`Texture`](Texture).[`constructor`](Texture#constructors)

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

[`Texture`](Texture).[`draw`](Texture#draw)

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

[`Texture`](Texture).[`draw`](Texture#draw)

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

[`Texture`](Texture).[`draw`](Texture#draw)

***

### getHeight()

> **getHeight**(): `number`

#### Returns

`number`

#### Overrides

[`Texture`](Texture).[`getHeight`](Texture#getheight)

***

### getWidth()

> **getWidth**(): `number`

#### Returns

`number`

#### Overrides

[`Texture`](Texture).[`getWidth`](Texture#getwidth)

***

### setDestinationCoordinate()

> **setDestinationCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](Texture).[`setDestinationCoordinate`](Texture#setdestinationcoordinate)

***

### setDestinationDimension()

> **setDestinationDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](Texture).[`setDestinationDimension`](Texture#setdestinationdimension)

***

### setSourceCoordinate()

> **setSourceCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](Texture).[`setSourceCoordinate`](Texture#setsourcecoordinate)

***

### setSourceDimension()

> **setSourceDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](Texture).[`setSourceDimension`](Texture#setsourcedimension)
