[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Anim](anim.md)

# Class: Anim

## Hierarchy

* [Node](node.md)

  ↳ **Anim**

## Implements

* Pinned

## Index

### Constructors

* [constructor](anim.md#constructor)

### Properties

* [MAX_ELAPSE](anim.md#max_elapse)

### Methods

* [align](anim.md#align)
* [alpha](anim.md#alpha)
* [append](anim.md#append)
* [appendTo](anim.md#appendto)
* [attr](anim.md#attr)
* [box](anim.md#box)
* [clearTimeout](anim.md#cleartimeout)
* [column](anim.md#column)
* [empty](anim.md#empty)
* [first](anim.md#first)
* [fps](anim.md#fps)
* [frames](anim.md#frames)
* [gotoFrame](anim.md#gotoframe)
* [height](anim.md#height)
* [hide](anim.md#hide)
* [id](anim.md#id)
* [insertAfter](anim.md#insertafter)
* [insertBefore](anim.md#insertbefore)
* [insertNext](anim.md#insertnext)
* [insertPrev](anim.md#insertprev)
* [label](anim.md#label)
* [last](anim.md#last)
* [layer](anim.md#layer)
* [length](anim.md#length)
* [listeners](anim.md#listeners)
* [matrix](anim.md#matrix)
* [maximize](anim.md#maximize)
* [minimize](anim.md#minimize)
* [moveFrame](anim.md#moveframe)
* [next](anim.md#next)
* [off](anim.md#off)
* [offset](anim.md#offset)
* [on](anim.md#on)
* [padding](anim.md#padding)
* [parent](anim.md#parent)
* [pin](anim.md#pin)
* [play](anim.md#play)
* [prepend](anim.md#prepend)
* [prependTo](anim.md#prependto)
* [prerender](anim.md#prerender)
* [prev](anim.md#prev)
* [publish](anim.md#publish)
* [remove](anim.md#remove)
* [render](anim.md#render)
* [repeat](anim.md#repeat)
* [rotate](anim.md#rotate)
* [row](anim.md#row)
* [scale](anim.md#scale)
* [scaleTo](anim.md#scaleto)
* [setFrames](anim.md#setframes)
* [setTimeout](anim.md#settimeout)
* [show](anim.md#show)
* [size](anim.md#size)
* [skew](anim.md#skew)
* [spacing](anim.md#spacing)
* [stop](anim.md#stop)
* [tick](anim.md#tick)
* [timeout](anim.md#timeout)
* [toString](anim.md#tostring)
* [touch](anim.md#touch)
* [tween](anim.md#tween)
* [untick](anim.md#untick)
* [visible](anim.md#visible)
* [visit](anim.md#visit)
* [width](anim.md#width)

## Constructors

###  constructor

\+ **new Anim**(): *[Anim](anim.md)*

*Overrides [Node](node.md).[constructor](node.md#constructor)*

**Returns:** *[Anim](anim.md)*

## Properties

###  MAX_ELAPSE

• **MAX_ELAPSE**: *number* = Infinity

*Inherited from [Root](root.md).[MAX_ELAPSE](root.md#max_elapse)*

## Methods

###  align

▸ **align**(`type`: "row" | "column", `align`: number): *this*

*Inherited from [Root](root.md).[align](root.md#align)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "row" &#124; "column" |
`align` | number |

**Returns:** *this*

___

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

*Inherited from [Root](root.md).[alpha](root.md#alpha)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  append

▸ **append**(`child`: [Node](node.md), `more?`: any): *this*

*Inherited from [Root](root.md).[append](root.md#append)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md) |
`more?` | any |

**Returns:** *this*

___

###  appendTo

▸ **appendTo**(`parent`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[appendTo](root.md#appendto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  attr

▸ **attr**(`name`: string, `value`: any): *this*

*Inherited from [Root](root.md).[attr](root.md#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | any |

**Returns:** *this*

▸ **attr**(`name`: string): *any*

*Inherited from [Root](root.md).[attr](root.md#attr)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *any*

___

###  box

▸ **box**(): *this*

*Inherited from [Root](root.md).[box](root.md#box)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  clearTimeout

▸ **clearTimeout**(`timer`: [NodeTickListener](../globals.md#nodeticklistener)‹this›): *void*

*Inherited from [Root](root.md).[clearTimeout](root.md#cleartimeout)*

**Parameters:**

Name | Type |
------ | ------ |
`timer` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

**Returns:** *void*

___

###  column

▸ **column**(`align`: number): *this*

*Inherited from [Root](root.md).[column](root.md#column)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  empty

▸ **empty**(): *this*

*Inherited from [Root](root.md).[empty](root.md#empty)*

**Returns:** *this*

___

###  first

▸ **first**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Root](root.md).[first](root.md#first)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  fps

▸ **fps**(`fps?`: number): *number | this*

**Parameters:**

Name | Type |
------ | ------ |
`fps?` | number |

**Returns:** *number | this*

___

###  frames

▸ **frames**(`frames`: string | [TextureSelectionInputArray](../globals.md#textureselectioninputarray)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; [TextureSelectionInputArray](../globals.md#textureselectioninputarray) |

**Returns:** *this*

___

###  gotoFrame

▸ **gotoFrame**(`frame`: number, `resize`: boolean): *this*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`frame` | number | - |
`resize` | boolean | false |

**Returns:** *this*

___

###  height

▸ **height**(`h`: number): *this*

*Inherited from [Root](root.md).[height](root.md#height)*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

*Inherited from [Root](root.md).[height](root.md#height)*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

*Inherited from [Root](root.md).[hide](root.md#hide)*

**Returns:** *this*

___

###  id

▸ **id**(`id`: string): *string | this*

*Inherited from [Root](root.md).[id](root.md#id)*

**`deprecated`** Use label()

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *string | this*

___

###  insertAfter

▸ **insertAfter**(`prev`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[insertAfter](root.md#insertafter)*

**Parameters:**

Name | Type |
------ | ------ |
`prev` | [Node](node.md) |

**Returns:** *this*

___

###  insertBefore

▸ **insertBefore**(`next`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[insertBefore](root.md#insertbefore)*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Node](node.md) |

**Returns:** *this*

___

###  insertNext

▸ **insertNext**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[insertNext](root.md#insertnext)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  insertPrev

▸ **insertPrev**(`sibling`: [Node](node.md), `more?`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[insertPrev](root.md#insertprev)*

**Parameters:**

Name | Type |
------ | ------ |
`sibling` | [Node](node.md) |
`more?` | [Node](node.md) |

**Returns:** *this*

___

###  label

▸ **label**(`label`: string): *string | this*

*Inherited from [Root](root.md).[label](root.md#label)*

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |

**Returns:** *string | this*

___

###  last

▸ **last**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Root](root.md).[last](root.md#last)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  layer

▸ **layer**(): *this*

*Inherited from [Root](root.md).[layer](root.md#layer)*

**`deprecated`** Use minimize()

**Returns:** *this*

___

###  length

▸ **length**(): *number*

**Returns:** *number*

___

###  listeners

▸ **listeners**(`type`: string): *function[]*

*Inherited from [Root](root.md).[listeners](root.md#listeners)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *function[]*

___

###  matrix

▸ **matrix**(`relative`: boolean): *[Matrix](matrix.md)‹›*

*Inherited from [Root](root.md).[matrix](root.md#matrix)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`relative` | boolean | false |

**Returns:** *[Matrix](matrix.md)‹›*

___

###  maximize

▸ **maximize**(): *this*

*Inherited from [Root](root.md).[maximize](root.md#maximize)*

Set size to match parent size.

**Returns:** *this*

___

###  minimize

▸ **minimize**(): *this*

*Inherited from [Root](root.md).[minimize](root.md#minimize)*

Set size to match largest child size.

**Returns:** *this*

___

###  moveFrame

▸ **moveFrame**(`move`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`move` | any |

**Returns:** *this*

___

###  next

▸ **next**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Root](root.md).[next](root.md#next)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  off

▸ **off**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

*Inherited from [Root](root.md).[off](root.md#off)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Root](root.md).[offset](root.md#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

*Inherited from [Root](root.md).[offset](root.md#offset)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  on

▸ **on**(`types`: string, `listener`: [NodeEventListener](../globals.md#nodeeventlistener)‹this›): *this*

*Inherited from [Root](root.md).[on](root.md#on)*

**Parameters:**

Name | Type |
------ | ------ |
`types` | string |
`listener` | [NodeEventListener](../globals.md#nodeeventlistener)‹this› |

**Returns:** *this*

___

###  padding

▸ **padding**(`pad`: number): *this*

*Inherited from [Root](root.md).[padding](root.md#padding)*

Set cell spacing for layout.

**Parameters:**

Name | Type |
------ | ------ |
`pad` | number |

**Returns:** *this*

___

###  parent

▸ **parent**(): *[Node](node.md)‹›*

*Inherited from [Root](root.md).[parent](root.md#parent)*

**Returns:** *[Node](node.md)‹›*

___

###  pin

▸ **pin**(`key`: string): *any*

*Inherited from [Root](root.md).[pin](root.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

▸ **pin**(`key`: string, `value`: any): *this*

*Inherited from [Root](root.md).[pin](root.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

*Inherited from [Root](root.md).[pin](root.md#pin)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(): *[Pin](pin.md)*

*Inherited from [Root](root.md).[pin](root.md#pin)*

**Returns:** *[Pin](pin.md)*

___

###  play

▸ **play**(`frame?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frame?` | number |

**Returns:** *this*

___

###  prepend

▸ **prepend**(`child`: [Node](node.md), `more?`: any): *this*

*Inherited from [Root](root.md).[prepend](root.md#prepend)*

**Parameters:**

Name | Type |
------ | ------ |
`child` | [Node](node.md) |
`more?` | any |

**Returns:** *this*

___

###  prependTo

▸ **prependTo**(`parent`: [Node](node.md)): *this*

*Inherited from [Root](root.md).[prependTo](root.md#prependto)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | [Node](node.md) |

**Returns:** *this*

___

###  prerender

▸ **prerender**(): *void*

*Inherited from [Root](root.md).[prerender](root.md#prerender)*

**Returns:** *void*

___

###  prev

▸ **prev**(`visible?`: boolean): *[Node](node.md)‹›*

*Inherited from [Root](root.md).[prev](root.md#prev)*

**Parameters:**

Name | Type |
------ | ------ |
`visible?` | boolean |

**Returns:** *[Node](node.md)‹›*

___

###  publish

▸ **publish**(`name`: string, `args?`: any): *number*

*Inherited from [Root](root.md).[publish](root.md#publish)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`args?` | any |

**Returns:** *number*

___

###  remove

▸ **remove**(`child?`: [Node](node.md), `more?`: any): *this*

*Inherited from [Root](root.md).[remove](root.md#remove)*

**Parameters:**

Name | Type |
------ | ------ |
`child?` | [Node](node.md) |
`more?` | any |

**Returns:** *this*

___

###  render

▸ **render**(`context`: CanvasRenderingContext2D): *void*

*Inherited from [Root](root.md).[render](root.md#render)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |

**Returns:** *void*

___

###  repeat

▸ **repeat**(`repeat`: any, `callback`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`repeat` | any |
`callback` | any |

**Returns:** *this*

___

###  rotate

▸ **rotate**(`a`: number): *this*

*Inherited from [Root](root.md).[rotate](root.md#rotate)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  row

▸ **row**(`align`: number): *this*

*Inherited from [Root](root.md).[row](root.md#row)*

**Parameters:**

Name | Type |
------ | ------ |
`align` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Root](root.md).[scale](root.md#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **scale**(`x`: number, `y`: number): *this*

*Inherited from [Root](root.md).[scale](root.md#scale)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  scaleTo

▸ **scaleTo**(`a`: any, `b`: any, `c`: any): *this*

*Inherited from [Root](root.md).[scaleTo](root.md#scaleto)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |
`b` | any |
`c` | any |

**Returns:** *this*

___

###  setFrames

▸ **setFrames**(`frames`: string | [TextureSelectionInputArray](../globals.md#textureselectioninputarray)): *this*

**`deprecated`** Use frames

**Parameters:**

Name | Type |
------ | ------ |
`frames` | string &#124; [TextureSelectionInputArray](../globals.md#textureselectioninputarray) |

**Returns:** *this*

___

###  setTimeout

▸ **setTimeout**(`callback`: function, `time`: number): *timer*

*Inherited from [Root](root.md).[setTimeout](root.md#settimeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *timer*

___

###  show

▸ **show**(): *this*

*Inherited from [Root](root.md).[show](root.md#show)*

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

*Inherited from [Root](root.md).[size](root.md#size)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

*Inherited from [Root](root.md).[skew](root.md#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **skew**(`x`: number, `y`: number): *this*

*Inherited from [Root](root.md).[skew](root.md#skew)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  spacing

▸ **spacing**(`space`: number): *this*

*Inherited from [Root](root.md).[spacing](root.md#spacing)*

Set cell spacing for row and column layout.

**Parameters:**

Name | Type |
------ | ------ |
`space` | number |

**Returns:** *this*

___

###  stop

▸ **stop**(`frame?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`frame?` | number |

**Returns:** *this*

___

###  tick

▸ **tick**(`callback`: [NodeTickListener](../globals.md#nodeticklistener)‹this›, `before`: boolean): *void*

*Inherited from [Root](root.md).[tick](root.md#tick)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› | - |
`before` | boolean | false |

**Returns:** *void*

___

###  timeout

▸ **timeout**(`callback`: function, `time`: number): *void*

*Inherited from [Root](root.md).[timeout](root.md#timeout)*

**Parameters:**

▪ **callback**: *function*

▸ (): *any*

▪ **time**: *number*

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Root](root.md).[toString](root.md#tostring)*

**Returns:** *string*

___

###  touch

▸ **touch**(): *this*

*Inherited from [Node](node.md).[touch](node.md#touch)*

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](../globals.md#transitionoptions)): *[Transition](transition.md)*

*Inherited from [Root](root.md).[tween](root.md#tween)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](../globals.md#transitionoptions) |

**Returns:** *[Transition](transition.md)*

▸ **tween**(`duration?`: number, `delay?`: number, `append?`: boolean): *[Transition](transition.md)*

*Inherited from [Root](root.md).[tween](root.md#tween)*

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

*Inherited from [Root](root.md).[untick](root.md#untick)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeTickListener](../globals.md#nodeticklistener)‹this› |

**Returns:** *void*

___

###  visible

▸ **visible**(`visible`: boolean): *this*

*Inherited from [Root](root.md).[visible](root.md#visible)*

**Parameters:**

Name | Type |
------ | ------ |
`visible` | boolean |

**Returns:** *this*

▸ **visible**(): *boolean*

*Inherited from [Root](root.md).[visible](root.md#visible)*

**Returns:** *boolean*

___

###  visit

▸ **visit**‹**P**›(`visitor`: [NodeVisitor](../interfaces/nodevisitor.md)‹P›, `payload?`: P): *false | true | void*

*Inherited from [Root](root.md).[visit](root.md#visit)*

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

*Inherited from [Root](root.md).[width](root.md#width)*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

*Inherited from [Root](root.md).[width](root.md#width)*

**Returns:** *number*
