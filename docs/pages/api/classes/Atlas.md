# Class: Atlas

Textures are used to clip and resize image objects.

## Extends

- [`ImageTexture`](ImageTexture)

## Constructors

### new Atlas()

> **new Atlas**(`def`): [`Atlas`](Atlas)

#### Parameters

• **def**: [`AtlasDefinition`](../interfaces/AtlasDefinition) = `{}`

#### Returns

[`Atlas`](Atlas)

#### Overrides

[`ImageTexture`](ImageTexture).[`constructor`](ImageTexture#constructors)

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

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

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

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

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

[`ImageTexture`](ImageTexture).[`draw`](ImageTexture#draw)

***

### getHeight()

> **getHeight**(): `number`

#### Returns

`number`

#### Inherited from

[`ImageTexture`](ImageTexture).[`getHeight`](ImageTexture#getheight)

***

### getWidth()

> **getWidth**(): `number`

#### Returns

`number`

#### Inherited from

[`ImageTexture`](ImageTexture).[`getWidth`](ImageTexture#getwidth)

***

### load()

> **load**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

### select()

> **select**(`query`?): [`TextureSelection`](TextureSelection)

#### Parameters

• **query?**: `string`

#### Returns

[`TextureSelection`](TextureSelection)

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

### setPadding()

> **setPadding**(`padding`): `void`

Add padding to the image texture. Padding can be negative.

#### Parameters

• **padding**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](ImageTexture).[`setPadding`](ImageTexture#setpadding)

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
