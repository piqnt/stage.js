# Class: PipeTexture

Textures are used to clip and resize image objects.

## Extends

- [`Texture`](/api/classes/Texture)

## Constructors

### new PipeTexture()

> **new PipeTexture**(`source`): [`PipeTexture`](/api/classes/PipeTexture)

#### Parameters

• **source**: [`Texture`](/api/classes/Texture)

#### Returns

[`PipeTexture`](/api/classes/PipeTexture)

#### Overrides

[`Texture`](/api/classes/Texture).[`constructor`](/api/classes/Texture#constructors)

## Methods

### draw()

#### draw(context)

> **draw**(`context`): `void`

Defer draw spec to texture config. This is used when a sprite draws its textures.

##### Parameters

• **context**: `CanvasRenderingContext2D`

##### Returns

`void`

##### Inherited from

[`Texture`](/api/classes/Texture).[`draw`](/api/classes/Texture#draw)

#### draw(context, dx, dy, dw, dh)

> **draw**(`context`, `dx`, `dy`, `dw`, `dh`): `void`

This is probably unused.
Note: dx, dy are added to this.dx, this.dy.

##### Parameters

• **context**: `CanvasRenderingContext2D`

• **dx**: `number`

• **dy**: `number`

• **dw**: `number`

• **dh**: `number`

##### Returns

`void`

##### Inherited from

[`Texture`](/api/classes/Texture).[`draw`](/api/classes/Texture#draw)

#### draw(context, sx, sy, sw, sh, dx, dy, dw, dh)

> **draw**(`context`, `sx`, `sy`, `sw`, `sh`, `dx`, `dy`, `dw`, `dh`): `void`

This is used when a piped texture passes drawing to it backend.
Note: sx, sy, dx, dy are added to this.sx, this.sy, this.dx, this.dy.

##### Parameters

• **context**: `CanvasRenderingContext2D`

• **sx**: `number`

• **sy**: `number`

• **sw**: `number`

• **sh**: `number`

• **dx**: `number`

• **dy**: `number`

• **dw**: `number`

• **dh**: `number`

##### Returns

`void`

##### Inherited from

[`Texture`](/api/classes/Texture).[`draw`](/api/classes/Texture#draw)

***

### getHeight()

> **getHeight**(): `number`

#### Returns

`number`

#### Overrides

[`Texture`](/api/classes/Texture).[`getHeight`](/api/classes/Texture#getheight)

***

### getWidth()

> **getWidth**(): `number`

#### Returns

`number`

#### Overrides

[`Texture`](/api/classes/Texture).[`getWidth`](/api/classes/Texture#getwidth)

***

### setDestinationCoordinate()

> **setDestinationCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](/api/classes/Texture).[`setDestinationCoordinate`](/api/classes/Texture#setdestinationcoordinate)

***

### setDestinationDimension()

> **setDestinationDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](/api/classes/Texture).[`setDestinationDimension`](/api/classes/Texture#setdestinationdimension)

***

### setSourceCoordinate()

> **setSourceCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](/api/classes/Texture).[`setSourceCoordinate`](/api/classes/Texture#setsourcecoordinate)

***

### setSourceDimension()

> **setSourceDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`Texture`](/api/classes/Texture).[`setSourceDimension`](/api/classes/Texture#setsourcedimension)

***

### setSourceTexture()

> **setSourceTexture**(`texture`): `void`

#### Parameters

• **texture**: [`Texture`](/api/classes/Texture)

#### Returns

`void`
