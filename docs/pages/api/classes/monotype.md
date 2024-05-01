
# Class: Monotype

## Hierarchy

* [Node](/api/classes/node)

  ↳ **Monotype**

## Implements

* Pinned

## Index

### Constructors

* [constructor](/api/classes/monotype#constructor)

### Properties

* [MAX_ELAPSE](/api/classes/monotype#max_elapse)

### Methods

* [align](/api/classes/monotype#align)
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
* [padding](/api/classes/monotype#padding)
* [parent](/api/classes/monotype#parent)
* [pin](/api/classes/monotype#pin)
* [prepend](/api/classes/monotype#prepend)
* [prependTo](/api/classes/monotype#prependto)
* [prerender](/api/classes/monotype#prerender)
* [prev](/api/classes/monotype#prev)
* [publish](/api/classes/monotype#publish)
* [remove](/api/classes/monotype#remove)
* [render](/api/classes/monotype#render)
* [rotate](/api/classes/monotype#rotate)
* [row](/api/classes/monotype#row)
* [scale](/api/classes/monotype#scale)
* [setFont](/api/classes/monotype#setfont)
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

\+ **new Monotype**(): *[Monotype](/api/classes/monotype)*

*Overrides [Node](/api/classes/node).[constructor](/api/classes/node#constructor)*

**Returns:** *[Monotype](/api/classes/monotype)*

## Properties

###  MAX_ELAPSE

• **MAX_ELAPSE**: *number* = Infinity

*Inherited from [Node](/api/classes/node).[MAX_ELAPSE](/api/classes/node#max_elapse)*

## Methods

###  align

▸ **align**(`type`: "row" | "column", `align`: number): *this*

*Inherited from [Node](/api/classes/node).[align](/api/classes/node#align)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "row" &#124; "column" |
`align` | number |

**Returns:** *this*

___

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

*Inherited from [Node](/api/classes/node).[alpha](/api/classes/node#alpha)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  append

▸ **append**(...`child`: [Node](/api/classes/node)[]): *this*

*Inherited from [Node](/api/classes/node).[append](/api/classes/node#append)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](/api/classes/node)[] |

**Returns:** *this*

▸ **append**(`child`: [Node](/api/classes/node)[]): *this*

*Inherited from [Node](/api/classes/node).[append](/api/classes/node#append)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](/api/classes/node)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[appendTo](/api/classes/node#appendto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  attr

▸ **attr**(`name`: string, `value`: any): *this*

*Inherited from [Node](/api/classes/node).[attr](/api/classes/node#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`name`: string): *any*

*Inherited from [Node](/api/classes/node).[attr](/api/classes/node#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

*Inherited from [Node](/api/classes/node).[box](/api/classes/node#box)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [NodeTickListener](/api/globals#nodeticklistener)‹this›): *void*

*Inherited from [Node](/api/classes/node).[clearTimeout](/api/classes/node#cleartimeout)*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [NodeTickListener](/api/globals#nodeticklistener)‹this› |

**Returns:** *void*

___

###  column

▸ **column**(`align`: number): *this*

*Inherited from [Node](/api/classes/node).[column](/api/classes/node#column)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  empty

▸ **empty**(): *this*

*Inherited from [Node](/api/classes/node).[empty](/api/classes/node#empty)*

**Returns:** *this*

___

###  first

▸ **first**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

*Inherited from [Node](/api/classes/node).[first](/api/classes/node#first)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

___

###  fit

▸ **fit**(`width`: number, `height`: number, `mode?`: [FitMode](/api/globals#fitmode)): *this*

*Inherited from [Node](/api/classes/node).[fit](/api/classes/node#fit)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |
`mode?` | [FitMode](/api/globals#fitmode) |

**Returns:** *this*

▸ **fit**(`fit`: object): *this*

*Inherited from [Node](/api/classes/node).[fit](/api/classes/node#fit)*

**Parameters:**

Name | Type |
------ | ------ |
`fit` | object |

**Returns:** *this*

___

###  frames

▸ **frames**(`frames`: string | Record‹string, [Texture](/api/classes/texture)› | function): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; Record‹string, [Texture](/api/classes/texture)› &#124; function |

**Returns:** *this*

___

###  height

▸ **height**(`h`: number): *this*

*Inherited from [Node](/api/classes/node).[height](/api/classes/node#height)*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

*Inherited from [Node](/api/classes/node).[height](/api/classes/node#height)*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

*Inherited from [Node](/api/classes/node).[hide](/api/classes/node#hide)*

**Returns:** *this*

___

###  id

▸ **id**(`id`: string): *string | this*

*Inherited from [Node](/api/classes/node).[id](/api/classes/node#id)*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *string | this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[insertAfter](/api/classes/node#insertafter)*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[insertBefore](/api/classes/node#insertbefore)*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Node](/api/classes/node), `more?`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[insertNext](/api/classes/node#insertnext)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](/api/classes/node) |
`more?` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Node](/api/classes/node), `more?`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[insertPrev](/api/classes/node#insertprev)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](/api/classes/node) |
`more?` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *string | this*

*Inherited from [Node](/api/classes/node).[label](/api/classes/node#label)*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *string | this*

___

###  last

▸ **last**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

*Inherited from [Node](/api/classes/node).[last](/api/classes/node#last)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

___

###  layer

▸ **layer**(): *this*

*Inherited from [Node](/api/classes/node).[layer](/api/classes/node#layer)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  listeners

▸ **listeners**(`type`: string): *function[]*

*Inherited from [Node](/api/classes/node).[listeners](/api/classes/node#listeners)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *function[]*

___

###  matrix

▸ **matrix**(`relative`: boolean): *[Matrix](/api/classes/matrix)‹›*

*Inherited from [Node](/api/classes/node).[matrix](/api/classes/node#matrix)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  maximize

▸ **maximize**(): *this*

*Inherited from [Node](/api/classes/node).[maximize](/api/classes/node#maximize)*

Set size to match parent size.

**Returns:** *this*

___

###  minimize

▸ **minimize**(): *this*

*Inherited from [Node](/api/classes/node).[minimize](/api/classes/node#minimize)*

Set size to match largest child size.

**Returns:** *this*

___

###  next

▸ **next**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

*Inherited from [Node](/api/classes/node).[next](/api/classes/node#next)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

___

###  off

▸ **off**(`types`: string, `listener`: [NodeEventListener](/api/globals#nodeeventlistener)‹this›): *this*

*Inherited from [Node](/api/classes/node).[off](/api/classes/node#off)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](/api/globals#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Node](/api/classes/node).[offset](/api/classes/node#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

*Inherited from [Node](/api/classes/node).[offset](/api/classes/node#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  on

▸ **on**(`types`: string, `listener`: [NodeEventListener](/api/globals#nodeeventlistener)‹this›): *this*

*Inherited from [Node](/api/classes/node).[on](/api/classes/node#on)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](/api/globals#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  padding

▸ **padding**(`pad`: number): *this*

*Inherited from [Node](/api/classes/node).[padding](/api/classes/node#padding)*

Set cell spacing for layout.

**Parameters:**

Name | Type |
------ | ------ |
`pad` | number |

**Returns:** *this*

___

###  parent

▸ **parent**(): *[Node](/api/classes/node)‹›*

*Inherited from [Node](/api/classes/node).[parent](/api/classes/node#parent)*

**Returns:** *[Node](/api/classes/node)‹›*

___

###  pin

▸ **pin**(`key`: string): *any*

*Inherited from [Node](/api/classes/node).[pin](/api/classes/node#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

▸ **pin**(`key`: string, `value`: any): *this*

*Inherited from [Node](/api/classes/node).[pin](/api/classes/node#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

*Inherited from [Node](/api/classes/node).[pin](/api/classes/node#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(): *[Pin](/api/classes/pin)*

*Inherited from [Node](/api/classes/node).[pin](/api/classes/node#pin)*

**Returns:** *[Pin](/api/classes/pin)*

___

###  prepend

▸ **prepend**(...`child`: [Node](/api/classes/node)[]): *this*

*Inherited from [Node](/api/classes/node).[prepend](/api/classes/node#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](/api/classes/node)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Node](/api/classes/node)[]): *this*

*Inherited from [Node](/api/classes/node).[prepend](/api/classes/node#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](/api/classes/node)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Node](/api/classes/node)): *this*

*Inherited from [Node](/api/classes/node).[prependTo](/api/classes/node#prependto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](/api/classes/node) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

*Inherited from [Node](/api/classes/node).[prerender](/api/classes/node#prerender)*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Node](/api/classes/node)‹›*

*Inherited from [Node](/api/classes/node).[prev](/api/classes/node#prev)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](/api/classes/node)‹›*

___

###  publish

▸ **publish**(`name`: string, `args?`: any): *number*

*Inherited from [Node](/api/classes/node).[publish](/api/classes/node#publish)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`args?` | any |

**Returns:** *number*

___

###  remove

▸ **remove**(`child?`: [Node](/api/classes/node), `more?`: any): *this*

*Inherited from [Node](/api/classes/node).[remove](/api/classes/node#remove)*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Node](/api/classes/node) |
`more?` | any |

**Returns:** *this*

___

###  render

▸ **render**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Node](/api/classes/node).[render](/api/classes/node#render)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  rotate

▸ **rotate**(`a`: number): *this*

*Inherited from [Node](/api/classes/node).[rotate](/api/classes/node#rotate)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  row

▸ **row**(`align`: number): *this*

*Inherited from [Node](/api/classes/node).[row](/api/classes/node#row)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Node](/api/classes/node).[scale](/api/classes/node#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **scale**(`x`: number, `y`: number): *this*

*Inherited from [Node](/api/classes/node).[scale](/api/classes/node#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  setFont

▸ **setFont**(`frames`: string | Record‹string, [Texture](/api/classes/texture)› | function): *this*

**`deprecated`** Use frames

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; Record‹string, [Texture](/api/classes/texture)› &#124; function |

**Returns:** *this*

___

###  setTimeout

▸ **setTimeout**(`callback`: function, `time`: number): *timer*

*Inherited from [Node](/api/classes/node).[setTimeout](/api/classes/node#settimeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *timer*

___

###  setValue

▸ **setValue**(`value`: string | number | string[] | number[]): *this*

**`deprecated`** Use value

**Parameters:**

Name | Type |
------ | ------ |
`value` | string &#124; number &#124; string[] &#124; number[] |

**Returns:** *this*

___

###  show

▸ **show**(): *this*

*Inherited from [Node](/api/classes/node).[show](/api/classes/node#show)*

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

*Inherited from [Node](/api/classes/node).[size](/api/classes/node#size)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

*Inherited from [Node](/api/classes/node).[skew](/api/classes/node#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *this*

▸ **skew**(`x`: number, `y`: number): *this*

*Inherited from [Node](/api/classes/node).[skew](/api/classes/node#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`space`: number): *this*

*Inherited from [Node](/api/classes/node).[spacing](/api/classes/node#spacing)*

Set cell spacing for row and column layout.

**Parameters:**

Name | Type |
------ | ------ |
`space` | number |

**Returns:** *this*

___

###  tick

▸ **tick**(`callback`: [NodeTickListener](/api/globals#nodeticklistener)‹this›, `before`: boolean): *void*

*Inherited from [Node](/api/classes/node).[tick](/api/classes/node#tick)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [NodeTickListener](/api/globals#nodeticklistener)‹this› | - |
`before` | boolean | false |

**Returns:** *void*

___

###  timeout

▸ **timeout**(`callback`: function, `time`: number): *void*

*Inherited from [Node](/api/classes/node).[timeout](/api/classes/node#timeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Node](/api/classes/node).[toString](/api/classes/node#tostring)*

**Returns:** *string*

___

###  touch

▸ **touch**(): *this*

*Inherited from [Node](/api/classes/node).[touch](/api/classes/node#touch)*

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

*Inherited from [Node](/api/classes/node).[tween](/api/classes/node#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](/api/globals#transitionoptions) |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration?`: number, `delay?`: number, `append?`: boolean): *[Transition](/api/classes/transition)*

*Inherited from [Node](/api/classes/node).[tween](/api/classes/node#tween)*

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

*Inherited from [Node](/api/classes/node).[untick](/api/classes/node#untick)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeTickListener](/api/globals#nodeticklistener)‹this› |

**Returns:** *void*

___

###  value

▸ **value**(`value`: string | number | string[] | number[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string &#124; number &#124; string[] &#124; number[] |

**Returns:** *this*

___

###  visible

▸ **visible**(`visible`: boolean): *this*

*Inherited from [Node](/api/classes/node).[visible](/api/classes/node#visible)*

**Parameters:**

Name | Type |
------ | ------ |
`visible` | boolean |

**Returns:** *this*

▸ **visible**(): *boolean*

*Inherited from [Node](/api/classes/node).[visible](/api/classes/node#visible)*

**Returns:** *boolean*

___

###  visit

▸ **visit**‹**P**›(`visitor`: [NodeVisitor](/api/interfaces/nodevisitor)‹P›, `payload?`: P): *false | true | void*

*Inherited from [Node](/api/classes/node).[visit](/api/classes/node#visit)*

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

*Inherited from [Node](/api/classes/node).[width](/api/classes/node#width)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

*Inherited from [Node](/api/classes/node).[width](/api/classes/node#width)*

**Returns:** *number*
