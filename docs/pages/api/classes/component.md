
# Class: Component

## Hierarchy

* **Component**

  ↳ [Sprite](/api/classes/sprite)

  ↳ [Anim](/api/classes/anim)

  ↳ [Monotype](/api/classes/monotype)

  ↳ [Root](/api/classes/root)

## Implements

* [LayoutObject](/api/interfaces/layoutobject)

## Index

### Methods

* [alpha](/api/classes/component#alpha)
* [append](/api/classes/component#append)
* [appendTo](/api/classes/component#appendto)
* [attr](/api/classes/component#attr)
* [box](/api/classes/component#box)
* [clearTimeout](/api/classes/component#cleartimeout)
* [column](/api/classes/component#column)
* [empty](/api/classes/component#empty)
* [first](/api/classes/component#first)
* [fit](/api/classes/component#fit)
* [getTransform](/api/classes/component#gettransform)
* [height](/api/classes/component#height)
* [hide](/api/classes/component#hide)
* [id](/api/classes/component#id)
* [insertAfter](/api/classes/component#insertafter)
* [insertBefore](/api/classes/component#insertbefore)
* [insertNext](/api/classes/component#insertnext)
* [insertPrev](/api/classes/component#insertprev)
* [label](/api/classes/component#label)
* [last](/api/classes/component#last)
* [layer](/api/classes/component#layer)
* [listeners](/api/classes/component#listeners)
* [matrix](/api/classes/component#matrix)
* [maximize](/api/classes/component#maximize)
* [minimize](/api/classes/component#minimize)
* [next](/api/classes/component#next)
* [off](/api/classes/component#off)
* [offset](/api/classes/component#offset)
* [on](/api/classes/component#on)
* [onChildAdded](/api/classes/component#onchildadded)
* [onChildRemoved](/api/classes/component#onchildremoved)
* [padding](/api/classes/component#padding)
* [parent](/api/classes/component#parent)
* [pin](/api/classes/component#pin)
* [prepend](/api/classes/component#prepend)
* [prependTo](/api/classes/component#prependto)
* [prerender](/api/classes/component#prerender)
* [prerenderTree](/api/classes/component#prerendertree)
* [prev](/api/classes/component#prev)
* [publish](/api/classes/component#publish)
* [remove](/api/classes/component#remove)
* [render](/api/classes/component#render)
* [renderTree](/api/classes/component#rendertree)
* [rotate](/api/classes/component#rotate)
* [row](/api/classes/component#row)
* [scale](/api/classes/component#scale)
* [setFirst](/api/classes/component#setfirst)
* [setLast](/api/classes/component#setlast)
* [setNext](/api/classes/component#setnext)
* [setParent](/api/classes/component#setparent)
* [setPrev](/api/classes/component#setprev)
* [setTimeout](/api/classes/component#settimeout)
* [show](/api/classes/component#show)
* [size](/api/classes/component#size)
* [skew](/api/classes/component#skew)
* [spacing](/api/classes/component#spacing)
* [tick](/api/classes/component#tick)
* [timeout](/api/classes/component#timeout)
* [toString](/api/classes/component#tostring)
* [touch](/api/classes/component#touch)
* [tween](/api/classes/component#tween)
* [untick](/api/classes/component#untick)
* [visible](/api/classes/component#visible)
* [visit](/api/classes/component#visit)
* [width](/api/classes/component#width)

## Methods

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  append

▸ **append**(...`child`: [Component](/api/classes/component)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Component](/api/classes/component)[] |

**Returns:** *this*

▸ **append**(`child`: [Component](/api/classes/component)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  attr

▸ **attr**(`key`: string, `value`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`key`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [ComponentTickListener](/api/globals#componentticklistener)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [ComponentTickListener](/api/globals#componentticklistener) |

**Returns:** *void*

___

###  column

▸ **column**(`align`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  empty

▸ **empty**(): *this*

**Returns:** *this*

___

###  first

▸ **first**(`visible?`: boolean): *[Component](/api/classes/component)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  fit

▸ **fit**(`width`: number, `height`: number, `mode?`: [FitMode](/api/globals#fitmode)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |
`mode?` | [FitMode](/api/globals#fitmode) |

**Returns:** *this*

▸ **fit**(`fit`: object): *this*

**Parameters:**

▪ **fit**: *object*

Name | Type |
------ | ------ |
`height` | number |
`width` | number |

**Returns:** *this*

___

###  getTransform

▸ **getTransform**(`combined?`: boolean): *[Matrix](/api/classes/matrix)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`combined?` | boolean |

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  height

▸ **height**(`h`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

**Returns:** *this*

___

###  id

▸ **id**(`id`: string): *this*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Component](/api/classes/component), `more?`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Component](/api/classes/component) |
`more?` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Component](/api/classes/component), `more?`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Component](/api/classes/component) |
`more?` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *this*

▸ **label**(): *string*

**Returns:** *string*

___

###  last

▸ **last**(`visible?`: boolean): *[Component](/api/classes/component)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  layer

▸ **layer**(): *this*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  listeners

▸ **listeners**(`type`: string): *function[]*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *function[]*

___

###  matrix

▸ **matrix**(`relative`: boolean): *[Matrix](/api/classes/matrix)‹›*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  maximize

▸ **maximize**(): *this*

Set size to match parent size.

**Returns:** *this*

___

###  minimize

▸ **minimize**(): *this*

Set size to match largest child size.

**Returns:** *this*

___

###  next

▸ **next**(`visible?`: boolean): *[Component](/api/classes/component)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  off

▸ **off**(`types`: string, `listener`: [ComponentEventListener](/api/globals#componenteventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [ComponentEventListener](/api/globals#componenteventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  on

▸ **on**(`types`: string, `listener`: [ComponentEventListener](/api/globals#componenteventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [ComponentEventListener](/api/globals#componenteventlistener)‹this› |

**Returns:** *this*

___

###  onChildAdded

▸ **onChildAdded**(`child`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  onChildRemoved

▸ **onChildRemoved**(`child`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  padding

▸ **padding**(`value`: number): *this*

Set padding layout

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *this*

▸ **padding**(): *number*

Get padding.

**Returns:** *number*

___

###  parent

▸ **parent**(): *[Component](/api/classes/component)*

**Returns:** *[Component](/api/classes/component)*

___

###  pin

▸ **pin**(`key`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

▸ **pin**(`key`: string, `value`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(): *[Pin](/api/classes/pin)*

**Returns:** *[Pin](/api/classes/pin)*

___

###  prepend

▸ **prepend**(...`child`: [Component](/api/classes/component)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Component](/api/classes/component)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Component](/api/classes/component)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Component](/api/classes/component)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Component](/api/classes/component)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

**Returns:** *void*

___

###  prerenderTree

▸ **prerenderTree**(): *void*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Component](/api/classes/component)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Component](/api/classes/component)*

___

###  publish

▸ **publish**(`name`: string, `args?`: any): *number*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`args?` | any |

**Returns:** *number*

___

###  remove

▸ **remove**(`child?`: [Component](/api/classes/component), `more?`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Component](/api/classes/component) |
`more?` | any |

**Returns:** *this*

___

###  render

▸ **render**(`context`: CanvasRenderingContext2D): *void*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  renderTree

▸ **renderTree**(`context`: CanvasRenderingContext2D): *void*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  rotate

▸ **rotate**(`a`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  row

▸ **row**(`align`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **scale**(`x`: number, `y?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y?` | number |

**Returns:** *this*

___

###  setFirst

▸ **setFirst**(`first`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`first` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setLast

▸ **setLast**(`last`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`last` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setNext

▸ **setNext**(`next`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setParent

▸ **setParent**(`parent`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setPrev

▸ **setPrev**(`prev`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setTimeout

▸ **setTimeout**(`callback`: function, `time`: number): *timer*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *timer*

___

###  show

▸ **show**(): *this*

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **skew**(`x`: number, `y?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y?` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`value`: number): *this*

Set spacing for row, column, monotype

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *this*

▸ **spacing**(): *number*

Get spacing

**Returns:** *number*

___

###  tick

▸ **tick**(`callback`: [ComponentTickListener](/api/globals#componentticklistener), `before`: boolean): *void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [ComponentTickListener](/api/globals#componentticklistener) | - |
`before` | boolean | false |

**Returns:** *void*

___

###  timeout

▸ **timeout**(`callback`: function, `time`: number): *void*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

**Returns:** *string*

___

###  touch

▸ **touch**(): *this*

Updates the revision/timestamp of this component and its parents.
This is used internally for component tree lifecycle management, such as updating the rendering.

**Returns:** *this*

___

###  tween

▸ **tween**(): *[Transition](/api/classes/transition)*

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`opts`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [TransitionOptions](/api/globals#transitionoptions) |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration`: number, `delay?`: number, `append?`: boolean): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`duration` | number |
`delay?` | number |
`append?` | boolean |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration`: number): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`duration` | number |

**Returns:** *[Transition](/api/classes/transition)*

___

###  untick

▸ **untick**(`callback`: [ComponentTickListener](/api/globals#componentticklistener)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ComponentTickListener](/api/globals#componentticklistener) |

**Returns:** *void*

___

###  visible

▸ **visible**(`visible`: boolean): *this*

**Parameters:**

Name | Type |
------ | ------ |
`visible` | boolean |

**Returns:** *this*

▸ **visible**(): *boolean*

**Returns:** *boolean*

___

###  visit

▸ **visit**(`visitor`: [ComponentVisitor](/api/interfaces/componentvisitor), `payload?`: any): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`visitor` | [ComponentVisitor](/api/interfaces/componentvisitor) |
`payload?` | any |

**Returns:** *boolean | void*

___

###  width

▸ **width**(`w`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

**Returns:** *number*
