
# Class: Sprite

## Hierarchy

* [Component](/api/classes/component)

  ↳ **Sprite**

## Implements

* [LayoutObject](/api/interfaces/layoutobject)

## Index

### Constructors

* [constructor](/api/classes/sprite#constructor)

### Methods

* [alpha](/api/classes/sprite#alpha)
* [append](/api/classes/sprite#append)
* [appendTo](/api/classes/sprite#appendto)
* [attr](/api/classes/sprite#attr)
* [box](/api/classes/sprite#box)
* [clearTimeout](/api/classes/sprite#cleartimeout)
* [column](/api/classes/sprite#column)
* [empty](/api/classes/sprite#empty)
* [first](/api/classes/sprite#first)
* [fit](/api/classes/sprite#fit)
* [getTransform](/api/classes/sprite#gettransform)
* [height](/api/classes/sprite#height)
* [hide](/api/classes/sprite#hide)
* [id](/api/classes/sprite#id)
* [image](/api/classes/sprite#image)
* [insertAfter](/api/classes/sprite#insertafter)
* [insertBefore](/api/classes/sprite#insertbefore)
* [insertNext](/api/classes/sprite#insertnext)
* [insertPrev](/api/classes/sprite#insertprev)
* [label](/api/classes/sprite#label)
* [last](/api/classes/sprite#last)
* [layer](/api/classes/sprite#layer)
* [listeners](/api/classes/sprite#listeners)
* [matrix](/api/classes/sprite#matrix)
* [maximize](/api/classes/sprite#maximize)
* [minimize](/api/classes/sprite#minimize)
* [next](/api/classes/sprite#next)
* [off](/api/classes/sprite#off)
* [offset](/api/classes/sprite#offset)
* [on](/api/classes/sprite#on)
* [onChildAdded](/api/classes/sprite#onchildadded)
* [onChildRemoved](/api/classes/sprite#onchildremoved)
* [padding](/api/classes/sprite#padding)
* [parent](/api/classes/sprite#parent)
* [pin](/api/classes/sprite#pin)
* [prepend](/api/classes/sprite#prepend)
* [prependTo](/api/classes/sprite#prependto)
* [prerender](/api/classes/sprite#prerender)
* [prerenderTree](/api/classes/sprite#prerendertree)
* [prev](/api/classes/sprite#prev)
* [publish](/api/classes/sprite#publish)
* [remove](/api/classes/sprite#remove)
* [render](/api/classes/sprite#render)
* [renderTree](/api/classes/sprite#rendertree)
* [rotate](/api/classes/sprite#rotate)
* [row](/api/classes/sprite#row)
* [scale](/api/classes/sprite#scale)
* [setFirst](/api/classes/sprite#setfirst)
* [setLast](/api/classes/sprite#setlast)
* [setNext](/api/classes/sprite#setnext)
* [setParent](/api/classes/sprite#setparent)
* [setPrev](/api/classes/sprite#setprev)
* [setTimeout](/api/classes/sprite#settimeout)
* [show](/api/classes/sprite#show)
* [size](/api/classes/sprite#size)
* [skew](/api/classes/sprite#skew)
* [spacing](/api/classes/sprite#spacing)
* [stretch](/api/classes/sprite#stretch)
* [texture](/api/classes/sprite#texture)
* [tick](/api/classes/sprite#tick)
* [tile](/api/classes/sprite#tile)
* [timeout](/api/classes/sprite#timeout)
* [toString](/api/classes/sprite#tostring)
* [touch](/api/classes/sprite#touch)
* [tween](/api/classes/sprite#tween)
* [untick](/api/classes/sprite#untick)
* [visible](/api/classes/sprite#visible)
* [visit](/api/classes/sprite#visit)
* [width](/api/classes/sprite#width)

## Constructors

###  constructor

\+ **new Sprite**(`frame?`: [SpriteTextureInput](/api/globals#spritetextureinput)): *[Sprite](/api/classes/sprite)*

**Parameters:**

Name | Type |
------ | ------ |
`frame?` | [SpriteTextureInput](/api/globals#spritetextureinput) |

**Returns:** *[Sprite](/api/classes/sprite)*

## Methods

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

*Inherited from [Component](/api/classes/component).[alpha](/api/classes/component#alpha)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  append

▸ **append**(...`child`: [Component](/api/classes/component)[]): *this*

*Inherited from [Component](/api/classes/component).[append](/api/classes/component#append)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Component](/api/classes/component)[] |

**Returns:** *this*

▸ **append**(`child`: [Component](/api/classes/component)[]): *this*

*Inherited from [Component](/api/classes/component).[append](/api/classes/component#append)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[appendTo](/api/classes/component#appendto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  attr

▸ **attr**(`key`: string, `value`: any): *this*

*Inherited from [Component](/api/classes/component).[attr](/api/classes/component#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`key`: string): *any*

*Inherited from [Component](/api/classes/component).[attr](/api/classes/component#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

*Inherited from [Component](/api/classes/component).[box](/api/classes/component#box)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [ComponentTickListener](/api/globals#componentticklistener)): *void*

*Inherited from [Component](/api/classes/component).[clearTimeout](/api/classes/component#cleartimeout)*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [ComponentTickListener](/api/globals#componentticklistener) |

**Returns:** *void*

___

###  column

▸ **column**(`align`: number): *this*

*Inherited from [Component](/api/classes/component).[column](/api/classes/component#column)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  empty

▸ **empty**(): *this*

*Inherited from [Component](/api/classes/component).[empty](/api/classes/component#empty)*

**Returns:** *this*

___

###  first

▸ **first**(`visible?`: boolean): *[Component](/api/classes/component)*

*Inherited from [Component](/api/classes/component).[first](/api/classes/component#first)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  fit

▸ **fit**(`width`: number, `height`: number, `mode?`: [FitMode](/api/globals#fitmode)): *this*

*Inherited from [Component](/api/classes/component).[fit](/api/classes/component#fit)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |
`mode?` | [FitMode](/api/globals#fitmode) |

**Returns:** *this*

▸ **fit**(`fit`: object): *this*

*Inherited from [Component](/api/classes/component).[fit](/api/classes/component#fit)*

**Parameters:**

▪ **fit**: *object*

Name | Type |
------ | ------ |
`height` | number |
`width` | number |

**Returns:** *this*

___

###  getTransform

▸ **getTransform**(): *[Matrix](/api/classes/matrix)‹›*

*Inherited from [Component](/api/classes/component).[getTransform](/api/classes/component#gettransform)*

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  height

▸ **height**(`h`: number): *this*

*Inherited from [Component](/api/classes/component).[height](/api/classes/component#height)*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

*Inherited from [Component](/api/classes/component).[height](/api/classes/component#height)*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

*Inherited from [Component](/api/classes/component).[hide](/api/classes/component#hide)*

**Returns:** *this*

___

###  id

▸ **id**(`id`: string): *this*

*Inherited from [Component](/api/classes/component).[id](/api/classes/component#id)*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *this*

___

###  image

▸ **image**(`frame`: [SpriteTextureInput](/api/globals#spritetextureinput)): *this*

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`frame` | [SpriteTextureInput](/api/globals#spritetextureinput) |

**Returns:** *this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[insertAfter](/api/classes/component#insertafter)*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[insertBefore](/api/classes/component#insertbefore)*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Component](/api/classes/component), `more?`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[insertNext](/api/classes/component#insertnext)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Component](/api/classes/component) |
`more?` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Component](/api/classes/component), `more?`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[insertPrev](/api/classes/component#insertprev)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Component](/api/classes/component) |
`more?` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *this*

*Inherited from [Component](/api/classes/component).[label](/api/classes/component#label)*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *this*

▸ **label**(): *string*

*Inherited from [Component](/api/classes/component).[label](/api/classes/component#label)*

**Returns:** *string*

___

###  last

▸ **last**(`visible?`: boolean): *[Component](/api/classes/component)*

*Inherited from [Component](/api/classes/component).[last](/api/classes/component#last)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  layer

▸ **layer**(): *this*

*Inherited from [Component](/api/classes/component).[layer](/api/classes/component#layer)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  listeners

▸ **listeners**(`type`: string): *function[]*

*Inherited from [Component](/api/classes/component).[listeners](/api/classes/component#listeners)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *function[]*

___

###  matrix

▸ **matrix**(`relative`: boolean): *[Matrix](/api/classes/matrix)‹›*

*Inherited from [Component](/api/classes/component).[matrix](/api/classes/component#matrix)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  maximize

▸ **maximize**(): *this*

*Inherited from [Component](/api/classes/component).[maximize](/api/classes/component#maximize)*

Set size to match parent size.

**Returns:** *this*

___

###  minimize

▸ **minimize**(): *this*

*Inherited from [Component](/api/classes/component).[minimize](/api/classes/component#minimize)*

Set size to match largest child size.

**Returns:** *this*

___

###  next

▸ **next**(`visible?`: boolean): *[Component](/api/classes/component)*

*Inherited from [Component](/api/classes/component).[next](/api/classes/component#next)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  off

▸ **off**(`types`: string, `listener`: [ComponentEventListener](/api/globals#componenteventlistener)‹this›): *this*

*Inherited from [Component](/api/classes/component).[off](/api/classes/component#off)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [ComponentEventListener](/api/globals#componenteventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Component](/api/classes/component).[offset](/api/classes/component#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

*Inherited from [Component](/api/classes/component).[offset](/api/classes/component#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  on

▸ **on**(`types`: string, `listener`: [ComponentEventListener](/api/globals#componenteventlistener)‹this›): *this*

*Inherited from [Component](/api/classes/component).[on](/api/classes/component#on)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [ComponentEventListener](/api/globals#componenteventlistener)‹this› |

**Returns:** *this*

___

###  onChildAdded

▸ **onChildAdded**(`child`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[onChildAdded](/api/classes/component#onchildadded)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  onChildRemoved

▸ **onChildRemoved**(`child`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[onChildRemoved](/api/classes/component#onchildremoved)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  padding

▸ **padding**(`value`: number): *this*

*Inherited from [Component](/api/classes/component).[padding](/api/classes/component#padding)*

Set padding layout

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *this*

▸ **padding**(): *number*

*Inherited from [Component](/api/classes/component).[padding](/api/classes/component#padding)*

Get padding.

**Returns:** *number*

___

###  parent

▸ **parent**(): *[Component](/api/classes/component)*

*Inherited from [Component](/api/classes/component).[parent](/api/classes/component#parent)*

**Returns:** *[Component](/api/classes/component)*

___

###  pin

▸ **pin**(`key`: string): *any*

*Inherited from [Component](/api/classes/component).[pin](/api/classes/component#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

▸ **pin**(`key`: string, `value`: any): *this*

*Inherited from [Component](/api/classes/component).[pin](/api/classes/component#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

*Inherited from [Component](/api/classes/component).[pin](/api/classes/component#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(): *[Pin](/api/classes/pin)*

*Inherited from [Component](/api/classes/component).[pin](/api/classes/component#pin)*

**Returns:** *[Pin](/api/classes/pin)*

___

###  prepend

▸ **prepend**(...`child`: [Component](/api/classes/component)[]): *this*

*Inherited from [Component](/api/classes/component).[prepend](/api/classes/component#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Component](/api/classes/component)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Component](/api/classes/component)[]): *this*

*Inherited from [Component](/api/classes/component).[prepend](/api/classes/component#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Component](/api/classes/component)): *this*

*Inherited from [Component](/api/classes/component).[prependTo](/api/classes/component#prependto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

*Overrides [Component](/api/classes/component).[prerender](/api/classes/component#prerender)*

**Returns:** *void*

___

###  prerenderTree

▸ **prerenderTree**(): *void*

*Inherited from [Component](/api/classes/component).[prerenderTree](/api/classes/component#prerendertree)*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Component](/api/classes/component)*

*Inherited from [Component](/api/classes/component).[prev](/api/classes/component#prev)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  publish

▸ **publish**(`name`: string, `args?`: any): *number*

*Inherited from [Component](/api/classes/component).[publish](/api/classes/component#publish)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`args?` | any |

**Returns:** *number*

___

###  remove

▸ **remove**(`child?`: [Component](/api/classes/component), `more?`: any): *this*

*Inherited from [Component](/api/classes/component).[remove](/api/classes/component#remove)*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Component](/api/classes/component) |
`more?` | any |

**Returns:** *this*

___

###  render

▸ **render**(`context`: CanvasRenderingContext2D): *void*

*Overrides [Component](/api/classes/component).[render](/api/classes/component#render)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  renderTree

▸ **renderTree**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Component](/api/classes/component).[renderTree](/api/classes/component#rendertree)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  rotate

▸ **rotate**(`a`: number): *this*

*Inherited from [Component](/api/classes/component).[rotate](/api/classes/component#rotate)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  row

▸ **row**(`align`: number): *this*

*Inherited from [Component](/api/classes/component).[row](/api/classes/component#row)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Component](/api/classes/component).[scale](/api/classes/component#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **scale**(`x`: number, `y?`: number): *this*

*Inherited from [Component](/api/classes/component).[scale](/api/classes/component#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y?` | number |

**Returns:** *this*

___

###  setFirst

▸ **setFirst**(`first`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[setFirst](/api/classes/component#setfirst)*

**Parameters:**

Name | Type |
------ | ------ |
`first` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setLast

▸ **setLast**(`last`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[setLast](/api/classes/component#setlast)*

**Parameters:**

Name | Type |
------ | ------ |
`last` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setNext

▸ **setNext**(`next`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[setNext](/api/classes/component#setnext)*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setParent

▸ **setParent**(`parent`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[setParent](/api/classes/component#setparent)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setPrev

▸ **setPrev**(`prev`: [Component](/api/classes/component)): *void*

*Inherited from [Component](/api/classes/component).[setPrev](/api/classes/component#setprev)*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setTimeout

▸ **setTimeout**(`callback`: function, `time`: number): *timer*

*Inherited from [Component](/api/classes/component).[setTimeout](/api/classes/component#settimeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *timer*

___

###  show

▸ **show**(): *this*

*Inherited from [Component](/api/classes/component).[show](/api/classes/component#show)*

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

*Inherited from [Component](/api/classes/component).[size](/api/classes/component#size)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Component](/api/classes/component).[skew](/api/classes/component#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **skew**(`x`: number, `y?`: number): *this*

*Inherited from [Component](/api/classes/component).[skew](/api/classes/component#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y?` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`value`: number): *this*

*Inherited from [Component](/api/classes/component).[spacing](/api/classes/component#spacing)*

Set spacing for row, column, monotype

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *this*

▸ **spacing**(): *number*

*Inherited from [Component](/api/classes/component).[spacing](/api/classes/component#spacing)*

Get spacing

**Returns:** *number*

___

###  stretch

▸ **stretch**(`inner`: boolean): *this*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`inner` | boolean | false |

**Returns:** *this*

___

###  texture

▸ **texture**(`frame`: [SpriteTextureInput](/api/globals#spritetextureinput)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frame` | [SpriteTextureInput](/api/globals#spritetextureinput) |

**Returns:** *this*

___

###  tick

▸ **tick**(`callback`: [ComponentTickListener](/api/globals#componentticklistener), `before`: boolean): *void*

*Inherited from [Component](/api/classes/component).[tick](/api/classes/component#tick)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [ComponentTickListener](/api/globals#componentticklistener) | - |
`before` | boolean | false |

**Returns:** *void*

___

###  tile

▸ **tile**(`inner`: boolean): *this*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`inner` | boolean | false |

**Returns:** *this*

___

###  timeout

▸ **timeout**(`callback`: function, `time`: number): *void*

*Inherited from [Component](/api/classes/component).[timeout](/api/classes/component#timeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Component](/api/classes/component).[toString](/api/classes/component#tostring)*

**Returns:** *string*

___

###  touch

▸ **touch**(): *this*

*Inherited from [Component](/api/classes/component).[touch](/api/classes/component#touch)*

Updates the revision/timestamp of this component and its parents.
This is used internally for component tree lifecycle management, such as updating the rendering.

**Returns:** *this*

___

###  tween

▸ **tween**(): *[Transition](/api/classes/transition)*

*Inherited from [Component](/api/classes/component).[tween](/api/classes/component#tween)*

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`opts`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

*Inherited from [Component](/api/classes/component).[tween](/api/classes/component#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [TransitionOptions](/api/globals#transitionoptions) |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration`: number, `delay?`: number, `append?`: boolean): *[Transition](/api/classes/transition)*

*Inherited from [Component](/api/classes/component).[tween](/api/classes/component#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`duration` | number |
`delay?` | number |
`append?` | boolean |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration`: number): *[Transition](/api/classes/transition)*

*Inherited from [Component](/api/classes/component).[tween](/api/classes/component#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`duration` | number |

**Returns:** *[Transition](/api/classes/transition)*

___

###  untick

▸ **untick**(`callback`: [ComponentTickListener](/api/globals#componentticklistener)): *void*

*Inherited from [Component](/api/classes/component).[untick](/api/classes/component#untick)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ComponentTickListener](/api/globals#componentticklistener) |

**Returns:** *void*

___

###  visible

▸ **visible**(`visible`: boolean): *this*

*Inherited from [Component](/api/classes/component).[visible](/api/classes/component#visible)*

**Parameters:**

Name | Type |
------ | ------ |
`visible` | boolean |

**Returns:** *this*

▸ **visible**(): *boolean*

*Inherited from [Component](/api/classes/component).[visible](/api/classes/component#visible)*

**Returns:** *boolean*

___

###  visit

▸ **visit**(`visitor`: [ComponentVisitor](/api/interfaces/componentvisitor), `payload?`: any): *boolean | void*

*Inherited from [Component](/api/classes/component).[visit](/api/classes/component#visit)*

**Parameters:**

Name | Type |
------ | ------ |
`visitor` | [ComponentVisitor](/api/interfaces/componentvisitor) |
`payload?` | any |

**Returns:** *boolean | void*

___

###  width

▸ **width**(`w`: number): *this*

*Inherited from [Component](/api/classes/component).[width](/api/classes/component#width)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

*Inherited from [Component](/api/classes/component).[width](/api/classes/component#width)*

**Returns:** *number*
