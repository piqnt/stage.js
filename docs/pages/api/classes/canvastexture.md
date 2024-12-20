# Class: CanvasTexture

A texture with off-screen canvas.

## Extends

- [`ImageTexture`](/api/classes/ImageTexture)

## Constructors

### new CanvasTexture()

> **new CanvasTexture**(): [`CanvasTexture`](/api/classes/CanvasTexture)

#### Returns

[`CanvasTexture`](/api/classes/CanvasTexture)

#### Overrides

[`ImageTexture`](/api/classes/ImageTexture).[`constructor`](/api/classes/ImageTexture#constructors)

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

[`ImageTexture`](/api/classes/ImageTexture).[`draw`](/api/classes/ImageTexture#draw)

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

[`ImageTexture`](/api/classes/ImageTexture).[`draw`](/api/classes/ImageTexture#draw)

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

[`ImageTexture`](/api/classes/ImageTexture).[`draw`](/api/classes/ImageTexture#draw)

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

[`ImageTexture`](/api/classes/ImageTexture).[`getHeight`](/api/classes/ImageTexture#getheight)

***

### getWidth()

> **getWidth**(): `number`

#### Returns

`number`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`getWidth`](/api/classes/ImageTexture#getwidth)

***

### setDestinationCoordinate()

> **setDestinationCoordinate**(`x`, `y`): `void`

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`setDestinationCoordinate`](/api/classes/ImageTexture#setdestinationcoordinate)

***

### setDestinationDimension()

> **setDestinationDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`setDestinationDimension`](/api/classes/ImageTexture#setdestinationdimension)

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

### setPadding()

> **setPadding**(`padding`): `void`

Add padding to the image texture. Padding can be negative.

#### Parameters

• **padding**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`setPadding`](/api/classes/ImageTexture#setpadding)

***

### setSize()

> **setSize**(`destWidth`, `destHeight`, `pixelRatio`): `void`

Set texture size to given width and height, and set canvas size to texture size multiply by pixelRatio.

#### Parameters

• **destWidth**: `number`

• **destHeight**: `number`

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

[`ImageTexture`](/api/classes/ImageTexture).[`setSourceCoordinate`](/api/classes/ImageTexture#setsourcecoordinate)

***

### setSourceDimension()

> **setSourceDimension**(`w`, `h`): `void`

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`setSourceDimension`](/api/classes/ImageTexture#setsourcedimension)

***

### setSourceImage()

> **setSourceImage**(`image`, `pixelRatio`): `void`

#### Parameters

• **image**: `TextureImageSource`

• **pixelRatio**: `number` = `1`

#### Returns

`void`

#### Inherited from

[`ImageTexture`](/api/classes/ImageTexture).[`setSourceImage`](/api/classes/ImageTexture#setsourceimage)
