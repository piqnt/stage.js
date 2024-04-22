[Stage.js API Doc](README.md) › [Globals](globals.md)

# Stage.js API Doc

## Index

### Classes

* [Anim](classes/anim.md)
* [Atlas](classes/atlas.md)
* [CanvasTexture](classes/canvastexture.md)
* [Easing](classes/easing.md)
* [EventPoint](classes/eventpoint.md)
* [ImageTexture](classes/imagetexture.md)
* [Matrix](classes/matrix.md)
* [Node](classes/node.md)
* [Pin](classes/pin.md)
* [PipeTexture](classes/pipetexture.md)
* [PointerSyntheticEvent](classes/pointersyntheticevent.md)
* [ResizableTexture](classes/resizabletexture.md)
* [Root](classes/root.md)
* [Sprite](classes/sprite.md)
* [Str](classes/str.md)
* [Texture](classes/texture.md)
* [TextureSelection](classes/textureselection.md)
* [Transition](classes/transition.md)

### Interfaces

* [AtlasDefinition](interfaces/atlasdefinition.md)
* [AtlasTextureDefinition](interfaces/atlastexturedefinition.md)
* [MatrixValue](interfaces/matrixvalue.md)
* [NodeVisitor](interfaces/nodevisitor.md)
* [Vec2Value](interfaces/vec2value.md)

### Type aliases

* [AtlasTextureReferenceArray](globals.md#atlastexturereferencearray)
* [AtlasTextureReferenceMap](globals.md#atlastexturereferencemap)
* [AtlasTextureReferenceOne](globals.md#atlastexturereferenceone)
* [CanvasTextureDrawer](globals.md#canvastexturedrawer)
* [CanvasTextureMemoizer](globals.md#canvastexturememoizer)
* [EasingFunction](globals.md#easingfunction)
* [EasingFunctionName](globals.md#easingfunctionname)
* [FitMode](globals.md#fitmode)
* [LegacyFitMode](globals.md#legacyfitmode)
* [NodeEventListener](globals.md#nodeeventlistener)
* [NodeTickListener](globals.md#nodeticklistener)
* [ResizableTextureMode](globals.md#resizabletexturemode)
* [ResizeParams](globals.md#resizeparams)
* [RootConfig](globals.md#rootconfig)
* [ScaleParams](globals.md#scaleparams)
* [TextureImageSource](globals.md#textureimagesource)
* [TextureSelectionInput](globals.md#textureselectioninput)
* [TextureSelectionInputArray](globals.md#textureselectioninputarray)
* [TextureSelectionInputFactory](globals.md#textureselectioninputfactory)
* [TextureSelectionInputMap](globals.md#textureselectioninputmap)
* [TextureSelectionInputOne](globals.md#textureselectioninputone)
* [TransitionEndListener](globals.md#transitionendlistener)
* [TransitionOptions](globals.md#transitionoptions)
* [Viewbox](globals.md#viewbox)
* [Viewport](globals.md#viewport)

### Variables

* [POINTER_CANCEL](globals.md#const-pointer_cancel)
* [POINTER_CLICK](globals.md#const-pointer_click)
* [POINTER_END](globals.md#const-pointer_end)
* [POINTER_MOVE](globals.md#const-pointer_move)
* [POINTER_START](globals.md#const-pointer_start)
* [math](globals.md#const-math)

### Functions

* [anim](globals.md#const-anim)
* [atlas](globals.md#const-atlas)
* [box](globals.md#const-box)
* [canvas](globals.md#canvas)
* [column](globals.md#const-column)
* [create](globals.md#const-create)
* [isValidFitMode](globals.md#isvalidfitmode)
* [layer](globals.md#const-layer)
* [layout](globals.md#const-layout)
* [maximize](globals.md#const-maximize)
* [minimize](globals.md#const-minimize)
* [mount](globals.md#const-mount)
* [pause](globals.md#const-pause)
* [resume](globals.md#const-resume)
* [row](globals.md#const-row)
* [sprite](globals.md#const-sprite)
* [string](globals.md#const-string)
* [texture](globals.md#const-texture)

## Type aliases

###  AtlasTextureReferenceArray

Ƭ **AtlasTextureReferenceArray**: *[AtlasTextureReferenceOne](globals.md#atlastexturereferenceone)[]*

___

###  AtlasTextureReferenceMap

Ƭ **AtlasTextureReferenceMap**: *Record‹string, [AtlasTextureReferenceOne](globals.md#atlastexturereferenceone)›*

___

###  AtlasTextureReferenceOne

Ƭ **AtlasTextureReferenceOne**: *[AtlasTextureDefinition](interfaces/atlastexturedefinition.md) | string*

___

###  CanvasTextureDrawer

Ƭ **CanvasTextureDrawer**: *function*

#### Type declaration:

▸ (`this`: [CanvasTexture](classes/canvastexture.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [CanvasTexture](classes/canvastexture.md) |

___

###  CanvasTextureMemoizer

Ƭ **CanvasTextureMemoizer**: *function*

#### Type declaration:

▸ (`this`: [CanvasTexture](classes/canvastexture.md)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [CanvasTexture](classes/canvastexture.md) |

___

###  EasingFunction

Ƭ **EasingFunction**: *function*

#### Type declaration:

▸ (`p`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`p` | number |

___

###  EasingFunctionName

Ƭ **EasingFunctionName**: *string*

Easing function formats are:
- [name]
- [name\]([params])
- [name]-[mode]
- [name]-[mode\]([params])

Easing function names are 'linear', 'quad', 'cubic', 'quart', 'quint', 'sin' (or 'sine'), 'exp' (or 'expo'), 'circle' (or 'circ'), 'bounce', 'poly', 'elastic', 'back'.

Easing modes are 'in', 'out', 'in-out', 'out-in'.

For example, 'linear', 'cubic-in', and 'poly(2)'.

___

###  FitMode

Ƭ **FitMode**: *"contain" | "cover" | "fill" | [LegacyFitMode](globals.md#legacyfitmode)*

- 'contain': contain within the provided space, maintain aspect ratio
- 'cover': cover the provided space, maintain aspect ratio
- 'fill': fill provided space without maintaining aspect ratio

___

###  LegacyFitMode

Ƭ **LegacyFitMode**: *"in" | "out" | "out-crop" | "in-pad"*

**`deprecated`** 
- 'in-pad': same as 'contain'
- 'in': similar to 'contain' without centering
- 'out-crop': same as 'cover'
- 'out': similar to 'cover' without centering

___

###  NodeEventListener

Ƭ **NodeEventListener**: *function*

#### Type declaration:

▸ (`this`: T, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | T |
`...args` | any[] |

___

###  NodeTickListener

Ƭ **NodeTickListener**: *function*

#### Type declaration:

▸ (`this`: T, `elapsed`: number, `now`: number, `last`: number): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | T |
`elapsed` | number |
`now` | number |
`last` | number |

___

###  ResizableTextureMode

Ƭ **ResizableTextureMode**: *"stretch" | "tile"*

___

###  ResizeParams

Ƭ **ResizeParams**: *object*

#### Type declaration:

* **resizeHeight**: *number*

* **resizeMode**: *[FitMode](globals.md#fitmode)*

* **resizeWidth**: *number*

___

###  RootConfig

Ƭ **RootConfig**: *object*

#### Type declaration:

* **canvas**? : *string | HTMLCanvasElement*

___

###  ScaleParams

Ƭ **ScaleParams**: *object*

#### Type declaration:

* **scaleHeight**: *number*

* **scaleMode**: *[FitMode](globals.md#fitmode)*

* **scaleWidth**: *number*

___

###  TextureImageSource

Ƭ **TextureImageSource**: *HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas*

___

###  TextureSelectionInput

Ƭ **TextureSelectionInput**: *[TextureSelectionInputOne](globals.md#textureselectioninputone) | [TextureSelectionInputMap](globals.md#textureselectioninputmap) | [TextureSelectionInputArray](globals.md#textureselectioninputarray) | [TextureSelectionInputFactory](globals.md#textureselectioninputfactory)*

Texture selection input could be one:
- texture
- sprite definition (and an atlas): atlas sprite texture
- string (with an atlas): string used as key to find sprite in the atlas, re-resolve
- hash object: use subquery as key, then re-resolve value
- array: re-resolve first item
- function: call function with subquery, then re-resolve

___

###  TextureSelectionInputArray

Ƭ **TextureSelectionInputArray**: *[TextureSelectionInputOne](globals.md#textureselectioninputone)[]*

___

###  TextureSelectionInputFactory

Ƭ **TextureSelectionInputFactory**: *function*

#### Type declaration:

▸ (`subquery`: string): *[TextureSelectionInputOne](globals.md#textureselectioninputone)*

**Parameters:**

Name | Type |
------ | ------ |
`subquery` | string |

___

###  TextureSelectionInputMap

Ƭ **TextureSelectionInputMap**: *Record‹string, [TextureSelectionInputOne](globals.md#textureselectioninputone)›*

___

###  TextureSelectionInputOne

Ƭ **TextureSelectionInputOne**: *[Texture](classes/texture.md) | [AtlasTextureDefinition](interfaces/atlastexturedefinition.md) | string*

___

###  TransitionEndListener

Ƭ **TransitionEndListener**: *function*

#### Type declaration:

▸ (`this`: [Node](classes/node.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Node](classes/node.md) |

___

###  TransitionOptions

Ƭ **TransitionOptions**: *object*

#### Type declaration:

* **append**? : *boolean*

* **delay**? : *number*

* **duration**? : *number*

___

###  Viewbox

Ƭ **Viewbox**: *object*

Geometry of a rectangular portion of the game that is projected on the screen.

#### Type declaration:

* **height**: *number*

* **mode**? : *[FitMode](globals.md#fitmode)*

* **width**: *number*

* **x**? : *number*

* **y**? : *number*

___

###  Viewport

Ƭ **Viewport**: *object*

Geometry of the rectangular that the application takes on the screen.

#### Type declaration:

* **height**: *number*

* **ratio**: *number*

* **width**: *number*

## Variables

### `Const` POINTER_CANCEL

• **POINTER_CANCEL**: *"touchcancel mousecancel"* = "touchcancel mousecancel"

___

### `Const` POINTER_CLICK

• **POINTER_CLICK**: *"click"* = "click"

___

### `Const` POINTER_END

• **POINTER_END**: *"touchend mouseup"* = "touchend mouseup"

___

### `Const` POINTER_MOVE

• **POINTER_MOVE**: *"touchmove mousemove"* = "touchmove mousemove"

___

### `Const` POINTER_START

• **POINTER_START**: *"touchstart mousedown"* = "touchstart mousedown"

___

### `Const` math

• **math**: *any* = Object.create(Math)

## Functions

### `Const` anim

▸ **anim**(`frames`: string | [TextureSelectionInputArray](globals.md#textureselectioninputarray), `fps?`: number): *[Anim](classes/anim.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; [TextureSelectionInputArray](globals.md#textureselectioninputarray) |
`fps?` | number |

**Returns:** *[Anim](classes/anim.md)‹›*

___

### `Const` atlas

▸ **atlas**(`def`: [AtlasDefinition](interfaces/atlasdefinition.md) | [Atlas](classes/atlas.md)): *Promise‹[Atlas](classes/atlas.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`def` | [AtlasDefinition](interfaces/atlasdefinition.md) &#124; [Atlas](classes/atlas.md) |

**Returns:** *Promise‹[Atlas](classes/atlas.md)›*

___

### `Const` box

▸ **box**(): *string | [Node](classes/node.md)‹›*

**`deprecated`** Use minimize()

**Returns:** *string | [Node](classes/node.md)‹›*

___

###  canvas

▸ **canvas**(): *[CanvasTexture](classes/canvastexture.md)*

Create CanvasTexture (a texture with off-screen canvas).

**Returns:** *[CanvasTexture](classes/canvastexture.md)*

___

### `Const` column

▸ **column**(`align`: number): *string | [Node](classes/node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *string | [Node](classes/node.md)‹›*

___

### `Const` create

▸ **create**(): *[Node](classes/node.md)‹›*

**`deprecated`** Use layout()

**Returns:** *[Node](classes/node.md)‹›*

___

###  isValidFitMode

▸ **isValidFitMode**(`value`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *boolean*

___

### `Const` layer

▸ **layer**(): *string | [Node](classes/node.md)‹›*

**`deprecated`** Use maximize()

**Returns:** *string | [Node](classes/node.md)‹›*

___

### `Const` layout

▸ **layout**(): *[Node](classes/node.md)‹›*

**Returns:** *[Node](classes/node.md)‹›*

___

### `Const` maximize

▸ **maximize**(): *string | [Node](classes/node.md)‹›*

**Returns:** *string | [Node](classes/node.md)‹›*

___

### `Const` minimize

▸ **minimize**(): *string | [Node](classes/node.md)‹›*

**Returns:** *string | [Node](classes/node.md)‹›*

___

### `Const` mount

▸ **mount**(`configs`: [RootConfig](globals.md#rootconfig)): *[Root](classes/root.md)‹›*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`configs` | [RootConfig](globals.md#rootconfig) | {} |

**Returns:** *[Root](classes/root.md)‹›*

___

### `Const` pause

▸ **pause**(): *void*

**Returns:** *void*

___

### `Const` resume

▸ **resume**(): *void*

**Returns:** *void*

___

### `Const` row

▸ **row**(`align`: number): *string | [Node](classes/node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *string | [Node](classes/node.md)‹›*

___

### `Const` sprite

▸ **sprite**(`frame?`: [TextureSelectionInput](globals.md#textureselectioninput)): *[Sprite](classes/sprite.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`frame?` | [TextureSelectionInput](globals.md#textureselectioninput) |

**Returns:** *[Sprite](classes/sprite.md)‹›*

___

### `Const` string

▸ **string**(`chars`: string | Record‹string, [Texture](classes/texture.md)› | function): *[Str](classes/str.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`chars` | string &#124; Record‹string, [Texture](classes/texture.md)› &#124; function |

**Returns:** *[Str](classes/str.md)‹›*

___

### `Const` texture

▸ **texture**(`query`: string | [TextureSelectionInput](globals.md#textureselectioninput)): *[TextureSelection](classes/textureselection.md)*

When query argument is string, this function parses the query; looks up registered atlases; and returns a texture selection object.

When query argument is an object, the object is used to create a new selection.

**Parameters:**

Name | Type |
------ | ------ |
`query` | string &#124; [TextureSelectionInput](globals.md#textureselectioninput) |

**Returns:** *[TextureSelection](classes/textureselection.md)*
