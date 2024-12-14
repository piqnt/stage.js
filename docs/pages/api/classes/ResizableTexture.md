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

Defer draw spec to texture config. This is used when a sprite draws its textures.

##### Parameters

• **context**: `CanvasRenderingContext2D`

##### Returns

`void`

##### Inherited from

[`Texture`](Texture).[`draw`](Texture#draw)

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

[`Texture`](Texture).[`draw`](Texture#draw)

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
