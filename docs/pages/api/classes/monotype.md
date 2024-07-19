
# Class: Monotype

## Hierarchy

* [Component](/api/classes/component)

  ↳ **Monotype**

## Implements

* [LayoutObject](/api/interfaces/layoutobject)

## Index

### Constructors

* [constructor](/api/classes/monotype#constructor)

### Methods

* [alpha](/api/classes/monotype#alpha)
* [append](/api/classes/monotype#append)
* [appendTo](/api/classes/monotype#appendto)
* [attr](/api/classes/monotype#attr)
* [box](/api/classes/monotype#box)
* [clearTimeout](/api/classes/monotype#cleartimeout)
* [column](/api/classes/monotype#column)
* [empty](/api/classes/monotype#empty)
* [first](/api/classes/monotype#first)
* [fit](/api/classes/monotype#fit)
* [frames](/api/classes/monotype#frames)
* [getTransform](/api/classes/monotype#gettransform)
* [height](/api/classes/monotype#height)
* [hide](/api/classes/monotype#hide)
* [id](/api/classes/monotype#id)
* [insertAfter](/api/classes/monotype#insertafter)
* [insertBefore](/api/classes/monotype#insertbefore)
* [insertNext](/api/classes/monotype#insertnext)
* [insertPrev](/api/classes/monotype#insertprev)
* [label](/api/classes/monotype#label)
* [last](/api/classes/monotype#last)
* [layer](/api/classes/monotype#layer)
* [listeners](/api/classes/monotype#listeners)
* [matrix](/api/classes/monotype#matrix)
* [maximize](/api/classes/monotype#maximize)
* [minimize](/api/classes/monotype#minimize)
* [next](/api/classes/monotype#next)
* [off](/api/classes/monotype#off)
* [offset](/api/classes/monotype#offset)
* [on](/api/classes/monotype#on)
* [onChildAdded](/api/classes/monotype#onchildadded)
* [onChildRemoved](/api/classes/monotype#onchildremoved)
* [padding](/api/classes/monotype#padding)
* [parent](/api/classes/monotype#parent)
* [pin](/api/classes/monotype#pin)
* [prepend](/api/classes/monotype#prepend)
* [prependTo](/api/classes/monotype#prependto)
* [prerender](/api/classes/monotype#prerender)
* [prerenderTree](/api/classes/monotype#prerendertree)
* [prev](/api/classes/monotype#prev)
* [publish](/api/classes/monotype#publish)
* [remove](/api/classes/monotype#remove)
* [render](/api/classes/monotype#render)
* [renderTree](/api/classes/monotype#rendertree)
* [rotate](/api/classes/monotype#rotate)
* [row](/api/classes/monotype#row)
* [scale](/api/classes/monotype#scale)
* [setFirst](/api/classes/monotype#setfirst)
* [setFont](/api/classes/monotype#setfont)
* [setLast](/api/classes/monotype#setlast)
* [setNext](/api/classes/monotype#setnext)
* [setParent](/api/classes/monotype#setparent)
* [setPrev](/api/classes/monotype#setprev)
* [setTimeout](/api/classes/monotype#settimeout)
* [setValue](/api/classes/monotype#setvalue)
* [show](/api/classes/monotype#show)
* [size](/api/classes/monotype#size)
* [skew](/api/classes/monotype#skew)
* [spacing](/api/classes/monotype#spacing)
* [tick](/api/classes/monotype#tick)
* [timeout](/api/classes/monotype#timeout)
* [toString](/api/classes/monotype#tostring)
* [touch](/api/classes/monotype#touch)
* [tween](/api/classes/monotype#tween)
* [untick](/api/classes/monotype#untick)
* [value](/api/classes/monotype#value)
* [visible](/api/classes/monotype#visible)
* [visit](/api/classes/monotype#visit)
* [width](/api/classes/monotype#width)

## Constructors

###  constructor

\+ **new Monotype**(`font?`: [MonotypeTextureInput](/api/globals#monotypetextureinput)): *[Monotype](/api/classes/monotype)*

**Parameters:**

Name | Type |
------ | ------ |
`font?` | [MonotypeTextureInput](/api/globals#monotypetextureinput) |

**Returns:** *[Monotype](/api/classes/monotype)*

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

###  frames

▸ **frames**(`frames`: [MonotypeTextureInput](/api/globals#monotypetextureinput)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | [MonotypeTextureInput](/api/globals#monotypetextureinput) |

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

*Inherited from [Component](/api/classes/component).[prerender](/api/classes/component#prerender)*

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

###  setFont

▸ **setFont**(`frames`: [MonotypeTextureInput](/api/globals#monotypetextureinput)): *this*

**`deprecated`** Use frames

**Parameters:**

Name | Type |
------ | ------ |
`frames` | [MonotypeTextureInput](/api/globals#monotypetextureinput) |

**Returns:** *this*

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

###  setValue

▸ **setValue**(`value`: [MonotypeValue](/api/globals#monotypevalue)): *this*

**`deprecated`** Use value

**Parameters:**

Name | Type |
------ | ------ |
`value` | [MonotypeValue](/api/globals#monotypevalue) |

**Returns:** *this*

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

###  value

▸ **value**(): *[MonotypeValue](/api/globals#monotypevalue)*

**Returns:** *[MonotypeValue](/api/globals#monotypevalue)*

▸ **value**(`value`: [MonotypeValue](/api/globals#monotypevalue)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [MonotypeValue](/api/globals#monotypevalue) |

**Returns:** *this*

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
