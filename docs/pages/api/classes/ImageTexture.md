# Class: ImageTexture

Textures are used to clip and resize image objects.

## Extends

- [`Texture`](/api/classes/Texture)

## Extended by

- [`Atlas`](/api/classes/Atlas)
- [`CanvasTexture`](/api/classes/CanvasTexture)

## Constructors

### new ImageTexture()

> **new ImageTexture**(`source`?, `pixelRatio`?): [`ImageTexture`](/api/classes/ImageTexture)

#### Parameters

• **source?**: `TextureImageSource`

• **pixelRatio?**: `number`

#### Returns

[`ImageTexture`](/api/classes/ImageTexture)

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

### setPadding()

> **setPadding**(`padding`): `void`

Add padding to the image texture. Padding can be negative.

#### Parameters

• **padding**: `number`

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

### setSourceImage()

> **setSourceImage**(`image`, `pixelRatio`): `void`

#### Parameters

• **image**: `TextureImageSource`

• **pixelRatio**: `number` = `1`

#### Returns

`void`
