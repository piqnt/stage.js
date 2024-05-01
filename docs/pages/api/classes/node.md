
# Class: Node

## Hierarchy

* **Node**

  ↳ [Sprite](/api/classes/sprite)

  ↳ [Anim](/api/classes/anim)

  ↳ [Monotype](/api/classes/monotype)

  ↳ [Root](/api/classes/root)

## Implements

* Pinned

## Index

### Constructors

* [constructor](/api/classes/node#constructor)

### Properties

* [MAX_ELAPSE](/api/classes/node#max_elapse)

### Methods

* [align](/api/classes/node#align)
* [alpha](/api/classes/node#alpha)
* [append](/api/classes/node#append)
* [appendTo](/api/classes/node#appendto)
* [attr](/api/classes/node#attr)
* [box](/api/classes/node#box)
* [clearTimeout](/api/classes/node#cleartimeout)
* [column](/api/classes/node#column)
* [empty](/api/classes/node#empty)
* [first](/api/classes/node#first)
* [fit](/api/classes/node#fit)
* [height](/api/classes/node#height)
* [hide](/api/classes/node#hide)
* [id](/api/classes/node#id)
* [insertAfter](/api/classes/node#insertafter)
* [insertBefore](/api/classes/node#insertbefore)
* [insertNext](/api/classes/node#insertnext)
* [insertPrev](/api/classes/node#insertprev)
* [label](/api/classes/node#label)
* [last](/api/classes/node#last)
* [layer](/api/classes/node#layer)
* [listeners](/api/classes/node#listeners)
* [matrix](/api/classes/node#matrix)
* [maximize](/api/classes/node#maximize)
* [minimize](/api/classes/node#minimize)
* [next](/api/classes/node#next)
* [off](/api/classes/node#off)
* [offset](/api/classes/node#offset)
* [on](/api/classes/node#on)
* [padding](/api/classes/node#padding)
* [parent](/api/classes/node#parent)
* [pin](/api/classes/node#pin)
* [prepend](/api/classes/node#prepend)
* [prependTo](/api/classes/node#prependto)
* [prerender](/api/classes/node#prerender)
* [prev](/api/classes/node#prev)
* [publish](/api/classes/node#publish)
* [remove](/api/classes/node#remove)
* [render](/api/classes/node#render)
* [rotate](/api/classes/node#rotate)
* [row](/api/classes/node#row)
* [scale](/api/classes/node#scale)
* [setTimeout](/api/classes/node#settimeout)
* [show](/api/classes/node#show)
* [size](/api/classes/node#size)
* [skew](/api/classes/node#skew)
* [spacing](/api/classes/node#spacing)
* [tick](/api/classes/node#tick)
* [timeout](/api/classes/node#timeout)
* [toString](/api/classes/node#tostring)
* [touch](/api/classes/node#touch)
* [tween](/api/classes/node#tween)
* [untick](/api/classes/node#untick)
* [visible](/api/classes/node#visible)
* [visit](/api/classes/node#visit)
* [width](/api/classes/node#width)

## Constructors

###  constructor

\+ **new Node**(): *[Node](/api/classes/node)*

**Returns:** *[Node](/api/classes/node)*

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

▸ **append**(...`child`: [Node](/api/classes/node)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](/api/classes/node)[] |

**Returns:** *this*

▸ **append**(`child`: [Node](/api/classes/node)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](/api/classes/node)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](/api/classes/node) |

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

▸ **clearTimeout**(`timer`: [NodeTickListener](/api/globals#nodeticklistener)‹this›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [NodeTickListener](/api/globals#nodeticklistener)‹this› |

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

▸ **first**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

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

▸ **insertAfter**(`prev`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Node](/api/classes/node), `more?`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](/api/classes/node) |
`more?` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Node](/api/classes/node), `more?`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](/api/classes/node) |
`more?` | [Node](/api/classes/node) |

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

▸ **last**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

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

▸ **next**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

___

###  off

▸ **off**(`types`: string, `listener`: [NodeEventListener](/api/globals#nodeeventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](/api/globals#nodeeventlistener)‹this› |

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

▸ **on**(`types`: string, `listener`: [NodeEventListener](/api/globals#nodeeventlistener)‹this›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](/api/globals#nodeeventlistener)‹this› |

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

▸ **parent**(): *[Node](/api/classes/node)‹›*

**Returns:** *[Node](/api/classes/node)‹›*

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

▸ **prepend**(...`child`: [Node](/api/classes/node)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](/api/classes/node)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Node](/api/classes/node)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](/api/classes/node)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Node](/api/classes/node)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

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

▸ **remove**(`child?`: [Node](/api/classes/node), `more?`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Node](/api/classes/node) |
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

▸ **scale**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

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

▸ **skew**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

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

▸ **tick**(`callback`: [NodeTickListener](/api/globals#nodeticklistener)‹this›, `before`: boolean): *void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [NodeTickListener](/api/globals#nodeticklistener)‹this› | - |
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

▸ **tween**(`opts?`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](/api/globals#transitionoptions) |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration?`: number, `delay?`: number, `append?`: boolean): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`duration?` | number |
`delay?` | number |
`append?` | boolean |

**Returns:** *[Transition](/api/classes/transition)*

___

###  untick

▸ **untick**(`callback`: [NodeTickListener](/api/globals#nodeticklistener)‹this›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeTickListener](/api/globals#nodeticklistener)‹this› |

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

▸ **visit**‹**P**›(`visitor`: [NodeVisitor](/api/interfaces/nodevisitor)‹P›, `payload?`: P): *false | true | void*

**Type parameters:**

▪ **P**

**Parameters:**

Name | Type |
------ | ------ |
`visitor` | [NodeVisitor](/api/interfaces/nodevisitor)‹P› |
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
