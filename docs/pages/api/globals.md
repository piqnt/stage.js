
# API Reference

## Index

### Classes

* [Anim](/api/classes/anim)
* [Atlas](/api/classes/atlas)
* [CanvasTexture](/api/classes/canvastexture)
* [Easing](/api/classes/easing)
* [EventPoint](/api/classes/eventpoint)
* [ImageTexture](/api/classes/imagetexture)
* [Matrix](/api/classes/matrix)
* [Monotype](/api/classes/monotype)
* [Node](/api/classes/node)
* [Pin](/api/classes/pin)
* [PipeTexture](/api/classes/pipetexture)
* [PointerSyntheticEvent](/api/classes/pointersyntheticevent)
* [ResizableTexture](/api/classes/resizabletexture)
* [Root](/api/classes/root)
* [Sprite](/api/classes/sprite)
* [Texture](/api/classes/texture)
* [TextureSelection](/api/classes/textureselection)
* [Transition](/api/classes/transition)

### Interfaces

* [AtlasDefinition](/api/interfaces/atlasdefinition)
* [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition)
* [MatrixValue](/api/interfaces/matrixvalue)
* [NodeVisitor](/api/interfaces/nodevisitor)
* [Vec2Value](/api/interfaces/vec2value)

### Type aliases

* [AtlasTextureReferenceArray](/api/globals#atlastexturereferencearray)
* [AtlasTextureReferenceMap](/api/globals#atlastexturereferencemap)
* [AtlasTextureReferenceOne](/api/globals#atlastexturereferenceone)
* [CanvasTextureDrawer](/api/globals#canvastexturedrawer)
* [CanvasTextureMemoizer](/api/globals#canvastexturememoizer)
* [EasingFunction](/api/globals#easingfunction)
* [EasingFunctionName](/api/globals#easingfunctionname)
* [FitMode](/api/globals#fitmode)
* [LegacyFitMode](/api/globals#legacyfitmode)
* [NodeEventListener](/api/globals#nodeeventlistener)
* [NodeTickListener](/api/globals#nodeticklistener)
* [ResizableTextureMode](/api/globals#resizabletexturemode)
* [ResizeParams](/api/globals#resizeparams)
* [RootConfig](/api/globals#rootconfig)
* [ScaleParams](/api/globals#scaleparams)
* [TextureImageSource](/api/globals#textureimagesource)
* [TextureSelectionInput](/api/globals#textureselectioninput)
* [TextureSelectionInputArray](/api/globals#textureselectioninputarray)
* [TextureSelectionInputFactory](/api/globals#textureselectioninputfactory)
* [TextureSelectionInputMap](/api/globals#textureselectioninputmap)
* [TextureSelectionInputOne](/api/globals#textureselectioninputone)
* [TransitionEndListener](/api/globals#transitionendlistener)
* [TransitionOptions](/api/globals#transitionoptions)
* [Viewbox](/api/globals#viewbox)
* [Viewport](/api/globals#viewport)

### Variables

* [POINTER_CANCEL](/api/globals#const-pointer_cancel)
* [POINTER_CLICK](/api/globals#const-pointer_click)
* [POINTER_END](/api/globals#const-pointer_end)
* [POINTER_MOVE](/api/globals#const-pointer_move)
* [POINTER_START](/api/globals#const-pointer_start)
* [math](/api/globals#const-math)

### Functions

* [anim](/api/globals#anim)
* [atlas](/api/globals#atlas)
* [box](/api/globals#box)
* [canvas](/api/globals#canvas)
* [column](/api/globals#column)
* [create](/api/globals#create)
* [layer](/api/globals#layer)
* [layout](/api/globals#layout)
* [maximize](/api/globals#maximize)
* [minimize](/api/globals#minimize)
* [monotype](/api/globals#monotype)
* [mount](/api/globals#mount)
* [pause](/api/globals#pause)
* [resume](/api/globals#resume)
* [row](/api/globals#row)
* [sprite](/api/globals#sprite)
* [texture](/api/globals#texture)

## Type aliases

###  AtlasTextureReferenceArray

Ƭ **AtlasTextureReferenceArray**: *[AtlasTextureReferenceOne](/api/globals#atlastexturereferenceone)[]*

___

###  AtlasTextureReferenceMap

Ƭ **AtlasTextureReferenceMap**: *Record‹string, [AtlasTextureReferenceOne](/api/globals#atlastexturereferenceone)›*

___

###  AtlasTextureReferenceOne

Ƭ **AtlasTextureReferenceOne**: *[AtlasTextureDefinition](/api/interfaces/atlastexturedefinition) | string*

___

###  CanvasTextureDrawer

Ƭ **CanvasTextureDrawer**: *function*

#### Type declaration:

▸ (`this`: [CanvasTexture](/api/classes/canvastexture)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [CanvasTexture](/api/classes/canvastexture) |

___

###  CanvasTextureMemoizer

Ƭ **CanvasTextureMemoizer**: *function*

#### Type declaration:

▸ (`this`: [CanvasTexture](/api/classes/canvastexture)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [CanvasTexture](/api/classes/canvastexture) |

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

Ƭ **FitMode**: *"contain" | "cover" | "fill" | [LegacyFitMode](/api/globals#legacyfitmode)*

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

* **resizeMode**: *[FitMode](/api/globals#fitmode)*

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

* **scaleMode**: *[FitMode](/api/globals#fitmode)*

* **scaleWidth**: *number*

___

###  TextureImageSource

Ƭ **TextureImageSource**: *HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas*

___

###  TextureSelectionInput

Ƭ **TextureSelectionInput**: *[TextureSelectionInputOne](/api/globals#textureselectioninputone) | [TextureSelectionInputMap](/api/globals#textureselectioninputmap) | [TextureSelectionInputArray](/api/globals#textureselectioninputarray) | [TextureSelectionInputFactory](/api/globals#textureselectioninputfactory)*

Texture selection input could be one:
- texture
- sprite definition (and an atlas): atlas sprite texture
- string (with an atlas): string used as key to find sprite in the atlas, re-resolve
- hash object: use subquery as key, then re-resolve value
- array: re-resolve first item
- function: call function with subquery, then re-resolve

___

###  TextureSelectionInputArray

Ƭ **TextureSelectionInputArray**: *[TextureSelectionInputOne](/api/globals#textureselectioninputone)[]*

___

###  TextureSelectionInputFactory

Ƭ **TextureSelectionInputFactory**: *function*

#### Type declaration:

▸ (`subquery`: string): *[TextureSelectionInputOne](/api/globals#textureselectioninputone)*

**Parameters:**

Name | Type |
------ | ------ |
`subquery` | string |

___

###  TextureSelectionInputMap

Ƭ **TextureSelectionInputMap**: *Record‹string, [TextureSelectionInputOne](/api/globals#textureselectioninputone)›*

___

###  TextureSelectionInputOne

Ƭ **TextureSelectionInputOne**: *[Texture](/api/classes/texture) | [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition) | string*

___

###  TransitionEndListener

Ƭ **TransitionEndListener**: *function*

#### Type declaration:

▸ (`this`: [Node](/api/classes/node)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`this` | [Node](/api/classes/node) |

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

* **mode**? : *[FitMode](/api/globals#fitmode)*

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

###  anim

▸ **anim**(`frames`: string | [TextureSelectionInputArray](/api/globals#textureselectioninputarray), `fps?`: number): *[Anim](/api/classes/anim)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; [TextureSelectionInputArray](/api/globals#textureselectioninputarray) |
`fps?` | number |

**Returns:** *[Anim](/api/classes/anim)‹›*

___

###  atlas

▸ **atlas**(`def`: [AtlasDefinition](/api/interfaces/atlasdefinition) | [Atlas](/api/classes/atlas)): *Promise‹[Atlas](/api/classes/atlas)›*

**Parameters:**

Name | Type |
------ | ------ |
`def` | [AtlasDefinition](/api/interfaces/atlasdefinition) &#124; [Atlas](/api/classes/atlas) |

**Returns:** *Promise‹[Atlas](/api/classes/atlas)›*

___

###  box

▸ **box**(): *string | [Node](/api/classes/node)‹›*

**`deprecated`** Use minimize()

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  canvas

▸ **canvas**(): *[CanvasTexture](/api/classes/canvastexture)*

Create CanvasTexture (a texture with off-screen canvas).

**Returns:** *[CanvasTexture](/api/classes/canvastexture)*

___

###  column

▸ **column**(`align`: number): *string | [Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  create

▸ **create**(): *[Node](/api/classes/node)‹›*

**`deprecated`** Use layout()

**Returns:** *[Node](/api/classes/node)‹›*

___

###  layer

▸ **layer**(): *string | [Node](/api/classes/node)‹›*

**`deprecated`** Use maximize()

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  layout

▸ **layout**(): *[Node](/api/classes/node)‹›*

**Returns:** *[Node](/api/classes/node)‹›*

___

###  maximize

▸ **maximize**(): *string | [Node](/api/classes/node)‹›*

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  minimize

▸ **minimize**(): *string | [Node](/api/classes/node)‹›*

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  monotype

▸ **monotype**(`chars`: string | Record‹string, [Texture](/api/classes/texture)› | function): *[Monotype](/api/classes/monotype)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`chars` | string &#124; Record‹string, [Texture](/api/classes/texture)› &#124; function |

**Returns:** *[Monotype](/api/classes/monotype)‹›*

___

###  mount

▸ **mount**(`configs`: [RootConfig](/api/globals#rootconfig)): *[Root](/api/classes/root)‹›*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`configs` | [RootConfig](/api/globals#rootconfig) | {} |

**Returns:** *[Root](/api/classes/root)‹›*

___

###  pause

▸ **pause**(): *void*

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

**Returns:** *void*

___

###  row

▸ **row**(`align`: number): *string | [Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *string | [Node](/api/classes/node)‹›*

___

###  sprite

▸ **sprite**(`frame?`: [TextureSelectionInput](/api/globals#textureselectioninput)): *[Sprite](/api/classes/sprite)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`frame?` | [TextureSelectionInput](/api/globals#textureselectioninput) |

**Returns:** *[Sprite](/api/classes/sprite)‹›*

___

###  texture

▸ **texture**(`query`: string | [TextureSelectionInput](/api/globals#textureselectioninput)): *[TextureSelection](/api/classes/textureselection)*

When query argument is string, this function parses the query; looks up registered atlases; and returns a texture selection object.

When query argument is an object, the object is used to create a new selection.

**Parameters:**

Name | Type |
------ | ------ |
`query` | string &#124; [TextureSelectionInput](/api/globals#textureselectioninput) |

**Returns:** *[TextureSelection](/api/classes/textureselection)*
