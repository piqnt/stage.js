# Class: Root

## Extends

- [`Node`](Node)

## Constructors

### new Root()

> **new Root**(): [`Root`](Root)

#### Returns

[`Root`](Root)

#### Overrides

[`Node`](Node).[`constructor`](Node#constructors)

## Properties

### canvas

> **canvas**: `HTMLCanvasElement` = `null`

***

### context

> **context**: `CanvasRenderingContext2D` = `null`

***

### dom

> **dom**: `HTMLCanvasElement` = `null`

***

### MAX\_ELAPSE

> **MAX\_ELAPSE**: `number` = `Infinity`

#### Inherited from

[`Node`](Node).[`MAX_ELAPSE`](Node#max_elapse)

***

### mounted

> **mounted**: `boolean` = `false`

***

### paused

> **paused**: `boolean` = `false`

***

### sleep

> **sleep**: `boolean` = `false`

## Methods

### align()

> **align**(`type`, `align`): [`Root`](Root)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`align`](Node#align)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Root`](Root)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`alpha`](Node#alpha)

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`append`](Node#append)

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`append`](Node#append)

***

### appendTo()

> **appendTo**(`parent`): [`Root`](Root)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`appendTo`](Node#appendto)

***

### attr()

#### attr(name, value)

> **attr**(`name`, `value`): `this`

##### Parameters

• **name**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`attr`](Node#attr)

#### attr(name)

> **attr**(`name`): `any`

##### Parameters

• **name**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](Node).[`attr`](Node#attr)

***

### background()

> **background**(`color`): [`Root`](Root)

#### Parameters

• **color**: `string`

#### Returns

[`Root`](Root)

***

### camera()

> **camera**(`matrix`): [`Root`](Root)

#### Parameters

• **matrix**: [`Matrix`](Matrix)

#### Returns

[`Root`](Root)

***

### clearTimeout()

> **clearTimeout**(`timer`): `void`

#### Parameters

• **timer**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Root`](Root)\>

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`clearTimeout`](Node#cleartimeout)

***

### column()

> **column**(`align`): [`Root`](Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`column`](Node#column)

***

### empty()

> **empty**(): [`Root`](Root)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`empty`](Node#empty)

***

### first()

> **first**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`first`](Node#first)

***

### fit()

#### fit(width, height, mode)

> **fit**(`width`, `height`, `mode`?): `this`

##### Parameters

• **width**: `number`

• **height**: `number`

• **mode?**: [`FitMode`](../type-aliases/FitMode)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`fit`](Node#fit)

#### fit(fit)

> **fit**(`fit`): `this`

##### Parameters

• **fit**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`fit`](Node#fit)

***

### height()

#### height(h)

> **height**(`h`): `this`

##### Parameters

• **h**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`height`](Node#height)

#### height()

> **height**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](Node).[`height`](Node#height)

***

### hide()

> **hide**(): [`Root`](Root)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`hide`](Node#hide)

***

### insertAfter()

> **insertAfter**(`prev`): [`Root`](Root)

#### Parameters

• **prev**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`insertAfter`](Node#insertafter)

***

### insertBefore()

> **insertBefore**(`next`): [`Root`](Root)

#### Parameters

• **next**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`insertBefore`](Node#insertbefore)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Root`](Root)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`insertNext`](Node#insertnext)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Root`](Root)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`insertPrev`](Node#insertprev)

***

### label()

#### label()

> **label**(): `string`

##### Returns

`string`

##### Inherited from

[`Node`](Node).[`label`](Node#label)

#### label(label)

> **label**(`label`): `this`

##### Parameters

• **label**: `string`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`label`](Node#label)

***

### last()

> **last**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`last`](Node#last)

***

### listeners()

> **listeners**(`type`): [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>[]

#### Inherited from

[`Node`](Node).[`listeners`](Node#listeners)

***

### matrix()

> **matrix**(`relative`): [`Matrix`](Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](Matrix)

#### Inherited from

[`Node`](Node).[`matrix`](Node#matrix)

***

### maximize()

> **maximize**(): [`Root`](Root)

Set size to match parent size.

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`maximize`](Node#maximize)

***

### minimize()

> **minimize**(): [`Root`](Root)

Set size to match largest child size.

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`minimize`](Node#minimize)

***

### mount()

> **mount**(`configs`): `void`

#### Parameters

• **configs**: `RootConfig` = `{}`

#### Returns

`void`

***

### next()

> **next**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`next`](Node#next)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Root`](Root)\>

#### Returns

`this`

#### Inherited from

[`Node`](Node).[`off`](Node#off)

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`offset`](Node#offset)

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`offset`](Node#offset)

***

### on()

> **on**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Root`](Root)\>

#### Returns

`this`

#### Inherited from

[`Node`](Node).[`on`](Node#on)

***

### padding()

> **padding**(`pad`): [`Root`](Root)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`padding`](Node#padding)

***

### parent()

> **parent**(): [`Node`](Node)

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`parent`](Node#parent)

***

### pause()

> **pause**(): [`Root`](Root)

#### Returns

[`Root`](Root)

***

### pin()

#### pin(key)

> **pin**(`key`): `any`

##### Parameters

• **key**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin()

> **pin**(): [`Pin`](Pin)

##### Returns

[`Pin`](Pin)

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`prepend`](Node#prepend)

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`prepend`](Node#prepend)

***

### prependTo()

> **prependTo**(`parent`): [`Root`](Root)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`prependTo`](Node#prependto)

***

### prev()

> **prev**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`prev`](Node#prev)

***

### publish()

> **publish**(`name`, `args`?): `number`

#### Parameters

• **name**: `string`

• **args?**: `any`

#### Returns

`number`

#### Inherited from

[`Node`](Node).[`publish`](Node#publish)

***

### remove()

> **remove**(`child`?, `more`?): [`Root`](Root)

#### Parameters

• **child?**: [`Node`](Node)

• **more?**: `any`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`remove`](Node#remove)

***

### resume()

> **resume**(): [`Root`](Root)

#### Returns

[`Root`](Root)

***

### rotate()

> **rotate**(`a`): [`Root`](Root)

#### Parameters

• **a**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`rotate`](Node#rotate)

***

### row()

> **row**(`align`): [`Root`](Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`row`](Node#row)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`scale`](Node#scale)

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`scale`](Node#scale)

***

### setTimeout()

> **setTimeout**(`callback`, `time`): (`t`) => `boolean`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`Function`

##### Parameters

• **t**: `number`

##### Returns

`boolean`

#### Inherited from

[`Node`](Node).[`setTimeout`](Node#settimeout)

***

### show()

> **show**(): [`Root`](Root)

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`show`](Node#show)

***

### size()

> **size**(`w`, `h`): [`Root`](Root)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`size`](Node#size)

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`skew`](Node#skew)

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`skew`](Node#skew)

***

### spacing()

> **spacing**(`space`): [`Root`](Root)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Root`](Root)

#### Inherited from

[`Node`](Node).[`spacing`](Node#spacing)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Root`](Root)\>

• **before**: `boolean` = `false`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`tick`](Node#tick)

***

### timeout()

> **timeout**(`callback`, `time`): `void`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`timeout`](Node#timeout)

***

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`Node`](Node).[`toString`](Node#tostring)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](../type-aliases/TransitionOptions)

##### Returns

[`Transition`](Transition)

##### Inherited from

[`Node`](Node).[`tween`](Node#tween)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](Transition)

##### Inherited from

[`Node`](Node).[`tween`](Node#tween)

***

### unmount()

> **unmount**(): [`Root`](Root)

#### Returns

[`Root`](Root)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Root`](Root)\>

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`untick`](Node#untick)

***

### viewbox()

#### viewbox(viewbox)

> **viewbox**(`viewbox`): `this`

Set viewbox.

##### Parameters

• **viewbox**: [`Viewbox`](../type-aliases/Viewbox)

##### Returns

`this`

#### viewbox(width, height, mode)

> **viewbox**(`width`?, `height`?, `mode`?): `this`

##### Parameters

• **width?**: `number`

• **height?**: `number`

• **mode?**: [`FitMode`](../type-aliases/FitMode)

##### Returns

`this`

***

### viewport()

#### viewport()

> **viewport**(): [`Viewport`](../type-aliases/Viewport)

Set/Get viewport.
This is used along with viewbox to determine the scale and position of the viewbox within the viewport.
Viewport is the size of the container, for example size of the canvas element.
Viewbox is provided by the user, and is the ideal size of the content.

##### Returns

[`Viewport`](../type-aliases/Viewport)

#### viewport(width, height, ratio)

> **viewport**(`width`, `height`, `ratio`?): `this`

##### Parameters

• **width**: `number`

• **height**: `number`

• **ratio?**: `number`

##### Returns

`this`

#### viewport(viewbox)

> **viewport**(`viewbox`): `this`

##### Parameters

• **viewbox**: [`Viewport`](../type-aliases/Viewport)

##### Returns

`this`

***

### visible()

#### visible(visible)

> **visible**(`visible`): `this`

##### Parameters

• **visible**: `boolean`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`visible`](Node#visible)

#### visible()

> **visible**(): `boolean`

##### Returns

`boolean`

##### Inherited from

[`Node`](Node).[`visible`](Node#visible)

***

### visit()

> **visit**\<`P`\>(`visitor`, `payload`?): `boolean` \| `void`

#### Type Parameters

• **P**

#### Parameters

• **visitor**: `NodeVisitor`\<`P`\>

• **payload?**: `P`

#### Returns

`boolean` \| `void`

#### Inherited from

[`Node`](Node).[`visit`](Node#visit)

***

### width()

#### width(w)

> **width**(`w`): `this`

##### Parameters

• **w**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`width`](Node#width)

#### width()

> **width**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](Node).[`width`](Node#width)
