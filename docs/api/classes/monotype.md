[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Monotype](monotype.md)

# Class: Monotype

## Hierarchy

* [Node](node.md)

  ↳ **Monotype**

## Implements

* Pinned

## Index

### Constructors

* [constructor](monotype.md#constructor)

### Properties

* [MAX_ELAPSE](monotype.md#max_elapse)

### Methods

* [align](monotype.md#align)
* [alpha](monotype.md#alpha)
* [append](monotype.md#append)
* [appendTo](monotype.md#appendto)
* [attr](monotype.md#attr)
* [box](monotype.md#box)
* [clearTimeout](monotype.md#cleartimeout)
* [column](monotype.md#column)
* [empty](monotype.md#empty)
* [first](monotype.md#first)
* [fit](monotype.md#fit)
* [frames](monotype.md#frames)
* [height](monotype.md#height)
* [hide](monotype.md#hide)
* [id](monotype.md#id)
* [insertAfter](monotype.md#insertafter)
* [insertBefore](monotype.md#insertbefore)
* [insertNext](monotype.md#insertnext)
* [insertPrev](monotype.md#insertprev)
* [label](monotype.md#label)
* [last](monotype.md#last)
* [layer](monotype.md#layer)
* [listeners](monotype.md#listeners)
* [matrix](monotype.md#matrix)
* [maximize](monotype.md#maximize)
* [minimize](monotype.md#minimize)
* [next](monotype.md#next)
* [off](monotype.md#off)
* [offset](monotype.md#offset)
* [on](monotype.md#on)
* [padding](monotype.md#padding)
* [parent](monotype.md#parent)
* [pin](monotype.md#pin)
* [prepend](monotype.md#prepend)
* [prependTo](monotype.md#prependto)
* [prerender](monotype.md#prerender)
* [prev](monotype.md#prev)
* [publish](monotype.md#publish)
* [remove](monotype.md#remove)
* [render](monotype.md#render)
* [rotate](monotype.md#rotate)
* [row](monotype.md#row)
* [scale](monotype.md#scale)
* [setFont](monotype.md#setfont)
* [setTimeout](monotype.md#settimeout)
* [setValue](monotype.md#setvalue)
* [show](monotype.md#show)
* [size](monotype.md#size)
* [skew](monotype.md#skew)
* [spacing](monotype.md#spacing)
* [tick](monotype.md#tick)
* [timeout](monotype.md#timeout)
* [toString](monotype.md#tostring)
* [touch](monotype.md#touch)
* [tween](monotype.md#tween)
* [untick](monotype.md#untick)
* [value](monotype.md#value)
* [visible](monotype.md#visible)
* [visit](monotype.md#visit)
* [width](monotype.md#width)

## Constructors

###  constructor

\+ **new Monotype**(): *[Monotype](monotype.md)*

*Overrides [Node](node.md).[constructor](node.md#constructor)*

**Returns:** *[Monotype](monotype.md)*

## Properties

###  MAX_ELAPSE

• **MAX_ELAPSE**: *number* = Infinity

*Inherited from [Node](node.md).[MAX_ELAPSE](node.md#max_elapse)*

## Methods

###  align

▸ **align**(`type`: "row" | "column", `align`: number): *this*

*Inherited from [Node](node.md).[align](node.md#align)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "row" &#124; "column" |
`align` | number |

**Returns:** *this*

___

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

*Inherited from [Node](node.md).[alpha](node.md#alpha)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  append

▸ **append**(...`child`: [Node](node.md)[]): *this*

*Inherited from [Node](node.md).[append](node.md#append)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](node.md)[] |

**Returns:** *this*

▸ **append**(`child`: [Node](node.md)[]): *this*

*Inherited from [Node](node.md).[append](node.md#append)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md)[] |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[appendTo](node.md#appendto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  attr

▸ **attr**(`name`: string, `value`: any): *this*

*Inherited from [Node](node.md).[attr](node.md#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`name`: string): *any*

*Inherited from [Node](node.md).[attr](node.md#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

*Inherited from [Node](node.md).[box](node.md#box)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [NodeTickListener](../globals.md#nodeticklistener)‹this›): *void*

*Inherited from [Node](node.md).[clearTimeout](node.md#cleartimeout)*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

**Returns:** *void*

___

###  column

▸ **column**(`align`: number): *this*

*Inherited from [Node](node.md).[column](node.md#column)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  empty

▸ **empty**(): *this*

*Inherited from [Node](node.md).[empty](node.md#empty)*

**Returns:** *this*

___

###  first

▸ **first**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Node](node.md).[first](node.md#first)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  fit

▸ **fit**(`width`: number, `height`: number, `mode?`: [FitMode](../globals.md#fitmode)): *this*

*Inherited from [Node](node.md).[fit](node.md#fit)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |
`mode?` | [FitMode](../globals.md#fitmode) |

**Returns:** *this*

▸ **fit**(`fit`: object): *this*

*Inherited from [Node](node.md).[fit](node.md#fit)*

**Parameters:**

Name | Type |
------ | ------ |
`fit` | object |

**Returns:** *this*

___

###  frames

▸ **frames**(`frames`: string | Record‹string, [Texture](texture.md)› | function): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; Record‹string, [Texture](texture.md)› &#124; function |

**Returns:** *this*

___

###  height

▸ **height**(`h`: number): *this*

*Inherited from [Node](node.md).[height](node.md#height)*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

*Inherited from [Node](node.md).[height](node.md#height)*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

*Inherited from [Node](node.md).[hide](node.md#hide)*

**Returns:** *this*

___

###  id

▸ **id**(`id`: string): *string | this*

*Inherited from [Node](node.md).[id](node.md#id)*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *string | this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[insertAfter](node.md#insertafter)*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Node](node.md) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[insertBefore](node.md#insertbefore)*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Node](node.md) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[insertNext](node.md#insertnext)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[insertPrev](node.md#insertprev)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *string | this*

*Inherited from [Node](node.md).[label](node.md#label)*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *string | this*

___

###  last

▸ **last**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Node](node.md).[last](node.md#last)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  layer

▸ **layer**(): *this*

*Inherited from [Node](node.md).[layer](node.md#layer)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  listeners

▸ **listeners**(`type`: string): *function[]*

*Inherited from [Node](node.md).[listeners](node.md#listeners)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *function[]*

___

###  matrix

▸ **matrix**(`relative`: boolean): *[Matrix](matrix.md)‹›*

*Inherited from [Node](node.md).[matrix](node.md#matrix)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](matrix.md)‹›*

___

###  maximize

▸ **maximize**(): *this*

*Inherited from [Node](node.md).[maximize](node.md#maximize)*

Set size to match parent size.

**Returns:** *this*

___

###  minimize

▸ **minimize**(): *this*

*Inherited from [Node](node.md).[minimize](node.md#minimize)*

Set size to match largest child size.

**Returns:** *this*

___

###  next

▸ **next**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Node](node.md).[next](node.md#next)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  off

▸ **off**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

*Inherited from [Node](node.md).[off](node.md#off)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Node](node.md).[offset](node.md#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

*Inherited from [Node](node.md).[offset](node.md#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  on

▸ **on**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

*Inherited from [Node](node.md).[on](node.md#on)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  padding

▸ **padding**(`pad`: number): *this*

*Inherited from [Node](node.md).[padding](node.md#padding)*

Set cell spacing for layout.

**Parameters:**

Name | Type |
------ | ------ |
`pad` | number |

**Returns:** *this*

___

###  parent

▸ **parent**(): *[Node](node.md)‹›*

*Inherited from [Node](node.md).[parent](node.md#parent)*

**Returns:** *[Node](node.md)‹›*

___

###  pin

▸ **pin**(`key`: string): *any*

*Inherited from [Node](node.md).[pin](node.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

▸ **pin**(`key`: string, `value`: any): *this*

*Inherited from [Node](node.md).[pin](node.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

*Inherited from [Node](node.md).[pin](node.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(): *[Pin](pin.md)*

*Inherited from [Node](node.md).[pin](node.md#pin)*

**Returns:** *[Pin](pin.md)*

___

###  prepend

▸ **prepend**(...`child`: [Node](node.md)[]): *this*

*Inherited from [Node](node.md).[prepend](node.md#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`...child` | [Node](node.md)[] |

**Returns:** *this*

▸ **prepend**(`child`: [Node](node.md)[]): *this*

*Inherited from [Node](node.md).[prepend](node.md#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md)[] |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Node](node.md)): *this*

*Inherited from [Node](node.md).[prependTo](node.md#prependto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

*Inherited from [Node](node.md).[prerender](node.md#prerender)*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Node](node.md).[prev](node.md#prev)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  publish

▸ **publish**(`name`: string, `args?`: any): *number*

*Inherited from [Node](node.md).[publish](node.md#publish)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`args?` | any |

**Returns:** *number*

___

###  remove

▸ **remove**(`child?`: [Node](node.md), `more?`: any): *this*

*Inherited from [Node](node.md).[remove](node.md#remove)*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Node](node.md) |
`more?` | any |

**Returns:** *this*

___

###  render

▸ **render**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Node](node.md).[render](node.md#render)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  rotate

▸ **rotate**(`a`: number): *this*

*Inherited from [Node](node.md).[rotate](node.md#rotate)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  row

▸ **row**(`align`: number): *this*

*Inherited from [Node](node.md).[row](node.md#row)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Node](node.md).[scale](node.md#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **scale**(`x`: number, `y`: number): *this*

*Inherited from [Node](node.md).[scale](node.md#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  setFont

▸ **setFont**(`frames`: string | Record‹string, [Texture](texture.md)› | function): *this*

**`deprecated`** Use frames

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; Record‹string, [Texture](texture.md)› &#124; function |

**Returns:** *this*

___

###  setTimeout

▸ **setTimeout**(`callback`: function, `time`: number): *timer*

*Inherited from [Node](node.md).[setTimeout](node.md#settimeout)*

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

*Inherited from [Node](node.md).[show](node.md#show)*

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

*Inherited from [Node](node.md).[size](node.md#size)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Node](node.md).[skew](node.md#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **skew**(`x`: number, `y`: number): *this*

*Inherited from [Node](node.md).[skew](node.md#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`space`: number): *this*

*Inherited from [Node](node.md).[spacing](node.md#spacing)*

Set cell spacing for row and column layout.

**Parameters:**

Name | Type |
------ | ------ |
`space` | number |

**Returns:** *this*

___

###  tick

▸ **tick**(`callback`: [NodeTickListener](../globals.md#nodeticklistener)‹this›, `before`: boolean): *void*

*Inherited from [Node](node.md).[tick](node.md#tick)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› | - |
`before` | boolean | false |

**Returns:** *void*

___

###  timeout

▸ **timeout**(`callback`: function, `time`: number): *void*

*Inherited from [Node](node.md).[timeout](node.md#timeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Node](node.md).[toString](node.md#tostring)*

**Returns:** *string*

___

###  touch

▸ **touch**(): *this*

*Inherited from [Node](node.md).[touch](node.md#touch)*

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](../globals.md#transitionoptions)): *[Transition](transition.md)*

*Inherited from [Node](node.md).[tween](node.md#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](../globals.md#transitionoptions) |

**Returns:** *[Transition](transition.md)*

▸ **tween**(`duration?`: number, `delay?`: number, `append?`: boolean): *[Transition](transition.md)*

*Inherited from [Node](node.md).[tween](node.md#tween)*

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

*Inherited from [Node](node.md).[untick](node.md#untick)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

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

*Inherited from [Node](node.md).[visible](node.md#visible)*

**Parameters:**

Name | Type |
------ | ------ |
`visible` | boolean |

**Returns:** *this*

▸ **visible**(): *boolean*

*Inherited from [Node](node.md).[visible](node.md#visible)*

**Returns:** *boolean*

___

###  visit

▸ **visit**‹**P**›(`visitor`: [NodeVisitor](../interfaces/nodevisitor.md)‹P›, `payload?`: P): *false | true | void*

*Inherited from [Node](node.md).[visit](node.md#visit)*

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

*Inherited from [Node](node.md).[width](node.md#width)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

*Inherited from [Node](node.md).[width](node.md#width)*

**Returns:** *number*
