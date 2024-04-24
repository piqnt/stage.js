[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Node](node.md)

# Class: Node

## Hierarchy

* **Node**

  ↳ [Sprite](sprite.md)

  ↳ [Anim](anim.md)

  ↳ [Monotype](monotype.md)

  ↳ [Root](root.md)

## Implements

* Pinned

## Index

### Constructors

* [constructor](node.md#constructor)

### Properties

* [MAX_ELAPSE](node.md#max_elapse)

### Methods

* [align](node.md#align)
* [alpha](node.md#alpha)
* [append](node.md#append)
* [appendTo](node.md#appendto)
* [attr](node.md#attr)
* [box](node.md#box)
* [clearTimeout](node.md#cleartimeout)
* [column](node.md#column)
* [empty](node.md#empty)
* [first](node.md#first)
* [fit](node.md#fit)
* [height](node.md#height)
* [hide](node.md#hide)
* [id](node.md#id)
* [insertAfter](node.md#insertafter)
* [insertBefore](node.md#insertbefore)
* [insertNext](node.md#insertnext)
* [insertPrev](node.md#insertprev)
* [label](node.md#label)
* [last](node.md#last)
* [layer](node.md#layer)
* [listeners](node.md#listeners)
* [matrix](node.md#matrix)
* [maximize](node.md#maximize)
* [minimize](node.md#minimize)
* [next](node.md#next)
* [off](node.md#off)
* [offset](node.md#offset)
* [on](node.md#on)
* [padding](node.md#padding)
* [parent](node.md#parent)
* [pin](node.md#pin)
* [prepend](node.md#prepend)
* [prependTo](node.md#prependto)
* [prerender](node.md#prerender)
* [prev](node.md#prev)
* [publish](node.md#publish)
* [remove](node.md#remove)
* [render](node.md#render)
* [rotate](node.md#rotate)
* [row](node.md#row)
* [scale](node.md#scale)
* [setTimeout](node.md#settimeout)
* [show](node.md#show)
* [size](node.md#size)
* [skew](node.md#skew)
* [spacing](node.md#spacing)
* [tick](node.md#tick)
* [timeout](node.md#timeout)
* [toString](node.md#tostring)
* [touch](node.md#touch)
* [tween](node.md#tween)
* [untick](node.md#untick)
* [visible](node.md#visible)
* [visit](node.md#visit)
* [width](node.md#width)

## Constructors

###  constructor

\+ **new Node**(): *[Node](node.md)*

**Returns:** *[Node](node.md)*

## Properties

###  MAX_ELAPSE

• **MAX_ELAPSE**: *number* = Infinity

## Methods

###  align

▸ **align**(`type`: "row" | "column", `align`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "row" &#124; "column" |
`align` | number |

**Returns:** *this*

___

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

▸ **append**(...`child`: [Node](node.md)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](node.md)[] |

**Returns:** *this*

▸ **append**(`child`: [Node](node.md)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  attr

▸ **attr**(`name`: string, `value`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`name`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [NodeTickListener](../globals.md#nodeticklistener)‹this›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

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

▸ **first**(`visible?`: boolean): *[Node](node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  fit

▸ **fit**(`width`: number, `height`: number, `mode?`: [FitMode](../globals.md#fitmode)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |
`mode?` | [FitMode](../globals.md#fitmode) |

**Returns:** *this*

▸ **fit**(`fit`: object): *this*

**Parameters:**

Name | Type |
------ | ------ |
`fit` | object |

**Returns:** *this*

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

▸ **id**(`id`: string): *string | this*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *string | this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Node](node.md) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Node](node.md) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *string | this*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *string | this*

___

###  last

▸ **last**(`visible?`: boolean): *[Node](node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

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

▸ **matrix**(`relative`: boolean): *[Matrix](matrix.md)‹›*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](matrix.md)‹›*

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

▸ **next**(`visible?`: boolean): *[Node](node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  off

▸ **off**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

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

▸ **on**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  padding

▸ **padding**(`pad`: number): *this*

Set cell spacing for layout.

**Parameters:**

Name | Type |
------ | ------ |
`pad` | number |

**Returns:** *this*

___

###  parent

▸ **parent**(): *[Node](node.md)‹›*

**Returns:** *[Node](node.md)‹›*

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

▸ **pin**(): *[Pin](pin.md)*

**Returns:** *[Pin](pin.md)*

___

###  prepend

▸ **prepend**(...`child`: [Node](node.md)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](node.md)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Node](node.md)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Node](node.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Node](node.md)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

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

▸ **remove**(`child?`: [Node](node.md), `more?`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Node](node.md) |
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

▸ **scale**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **scale**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

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

▸ **skew**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **skew**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`space`: number): *this*

Set cell spacing for row and column layout.

**Parameters:**

Name | Type |
------ | ------ |
`space` | number |

**Returns:** *this*

___

###  tick

▸ **tick**(`callback`: [NodeTickListener](../globals.md#nodeticklistener)‹this›, `before`: boolean): *void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› | - |
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

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](../globals.md#transitionoptions)): *[Transition](transition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](../globals.md#transitionoptions) |

**Returns:** *[Transition](transition.md)*

▸ **tween**(`duration?`: number, `delay?`: number, `append?`: boolean): *[Transition](transition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`duration?` | number |
`delay?` | number |
`append?` | boolean |

**Returns:** *[Transition](transition.md)*

___

###  untick

▸ **untick**(`callback`: [NodeTickListener](../globals.md#nodeticklistener)‹this›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

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

▸ **visit**‹**P**›(`visitor`: [NodeVisitor](../interfaces/nodevisitor.md)‹P›, `payload?`: P): *false | true | void*

**Type parameters:**

▪ **P**

**Parameters:**

Name | Type |
------ | ------ |
`visitor` | [NodeVisitor](../interfaces/nodevisitor.md)‹P› |
`payload?` | P |

**Returns:** *false | true | void*

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
