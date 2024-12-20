# Class: Root

## Extends

- [`Node`](/api/classes/Node)

## Constructors

### new Root()

> **new Root**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Overrides

[`Node`](/api/classes/Node).[`constructor`](/api/classes/Node#constructors)

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

[`Node`](/api/classes/Node).[`MAX_ELAPSE`](/api/classes/Node#max_elapse)

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

> **align**(`type`, `align`): [`Root`](/api/classes/Root)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`align`](/api/classes/Node#align)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Root`](/api/classes/Root)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`alpha`](/api/classes/Node#alpha)

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`append`](/api/classes/Node#append)

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`append`](/api/classes/Node#append)

***

### appendTo()

> **appendTo**(`parent`): [`Root`](/api/classes/Root)

#### Parameters

• **parent**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`appendTo`](/api/classes/Node#appendto)

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

[`Node`](/api/classes/Node).[`attr`](/api/classes/Node#attr)

#### attr(name)

> **attr**(`name`): `any`

##### Parameters

• **name**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](/api/classes/Node).[`attr`](/api/classes/Node#attr)

***

### background()

> **background**(`color`): [`Root`](/api/classes/Root)

#### Parameters

• **color**: `string`

#### Returns

[`Root`](/api/classes/Root)

***

### camera()

> **camera**(`matrix`): [`Root`](/api/classes/Root)

#### Parameters

• **matrix**: [`Matrix`](/api/classes/Matrix)

#### Returns

[`Root`](/api/classes/Root)

***

### clearTimeout()

> **clearTimeout**(`timer`): `void`

#### Parameters

• **timer**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`void`

#### Inherited from

[`Node`](/api/classes/Node).[`clearTimeout`](/api/classes/Node#cleartimeout)

***

### column()

> **column**(`align`): [`Root`](/api/classes/Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`column`](/api/classes/Node#column)

***

### empty()

> **empty**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`empty`](/api/classes/Node#empty)

***

### first()

> **first**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

#### Inherited from

[`Node`](/api/classes/Node).[`first`](/api/classes/Node#first)

***

### fit()

#### fit(width, height, mode)

> **fit**(`width`, `height`, `mode`?): `this`

##### Parameters

• **width**: `number`

• **height**: `number`

• **mode?**: [`FitMode`](/api/type-aliases/FitMode)

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`fit`](/api/classes/Node#fit)

#### fit(fit)

> **fit**(`fit`): `this`

##### Parameters

• **fit**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`fit`](/api/classes/Node#fit)

***

### height()

#### height(h)

> **height**(`h`): `this`

##### Parameters

• **h**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`height`](/api/classes/Node#height)

#### height()

> **height**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](/api/classes/Node).[`height`](/api/classes/Node#height)

***

### hide()

> **hide**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`hide`](/api/classes/Node#hide)

***

### insertAfter()

> **insertAfter**(`prev`): [`Root`](/api/classes/Root)

#### Parameters

• **prev**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`insertAfter`](/api/classes/Node#insertafter)

***

### insertBefore()

> **insertBefore**(`next`): [`Root`](/api/classes/Root)

#### Parameters

• **next**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`insertBefore`](/api/classes/Node#insertbefore)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **sibling**: [`Node`](/api/classes/Node)

• **more?**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`insertNext`](/api/classes/Node#insertnext)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **sibling**: [`Node`](/api/classes/Node)

• **more?**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`insertPrev`](/api/classes/Node#insertprev)

***

### label()

#### label()

> **label**(): `string`

##### Returns

`string`

##### Inherited from

[`Node`](/api/classes/Node).[`label`](/api/classes/Node#label)

#### label(label)

> **label**(`label`): `this`

##### Parameters

• **label**: `string`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`label`](/api/classes/Node#label)

***

### last()

> **last**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

#### Inherited from

[`Node`](/api/classes/Node).[`last`](/api/classes/Node#last)

***

### listeners()

> **listeners**(`type`): [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>[]

#### Inherited from

[`Node`](/api/classes/Node).[`listeners`](/api/classes/Node#listeners)

***

### matrix()

> **matrix**(`relative`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](/api/classes/Matrix)

#### Inherited from

[`Node`](/api/classes/Node).[`matrix`](/api/classes/Node#matrix)

***

### maximize()

> **maximize**(): [`Root`](/api/classes/Root)

Set size to match parent size.

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`maximize`](/api/classes/Node#maximize)

***

### minimize()

> **minimize**(): [`Root`](/api/classes/Root)

Set size to match largest child size.

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`minimize`](/api/classes/Node#minimize)

***

### mount()

> **mount**(`configs`): `void`

#### Parameters

• **configs**: `RootConfig` = `{}`

#### Returns

`void`

***

### next()

> **next**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

#### Inherited from

[`Node`](/api/classes/Node).[`next`](/api/classes/Node#next)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`this`

#### Inherited from

[`Node`](/api/classes/Node).[`off`](/api/classes/Node#off)

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`offset`](/api/classes/Node#offset)

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`offset`](/api/classes/Node#offset)

***

### on()

> **on**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`this`

#### Inherited from

[`Node`](/api/classes/Node).[`on`](/api/classes/Node#on)

***

### padding()

> **padding**(`pad`): [`Root`](/api/classes/Root)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`padding`](/api/classes/Node#padding)

***

### parent()

> **parent**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

#### Inherited from

[`Node`](/api/classes/Node).[`parent`](/api/classes/Node#parent)

***

### pause()

> **pause**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

***

### pin()

#### pin(key)

> **pin**(`key`): `any`

##### Parameters

• **key**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](/api/classes/Node).[`pin`](/api/classes/Node#pin)

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`pin`](/api/classes/Node#pin)

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`pin`](/api/classes/Node#pin)

#### pin()

> **pin**(): [`Pin`](/api/classes/Pin)

##### Returns

[`Pin`](/api/classes/Pin)

##### Inherited from

[`Node`](/api/classes/Node).[`pin`](/api/classes/Node#pin)

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`prepend`](/api/classes/Node#prepend)

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`prepend`](/api/classes/Node#prepend)

***

### prependTo()

> **prependTo**(`parent`): [`Root`](/api/classes/Root)

#### Parameters

• **parent**: [`Node`](/api/classes/Node)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`prependTo`](/api/classes/Node#prependto)

***

### prev()

> **prev**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

#### Inherited from

[`Node`](/api/classes/Node).[`prev`](/api/classes/Node#prev)

***

### publish()

> **publish**(`name`, `args`?): `number`

#### Parameters

• **name**: `string`

• **args?**: `any`

#### Returns

`number`

#### Inherited from

[`Node`](/api/classes/Node).[`publish`](/api/classes/Node#publish)

***

### remove()

> **remove**(`child`?, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **child?**: [`Node`](/api/classes/Node)

• **more?**: `any`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`remove`](/api/classes/Node#remove)

***

### resume()

> **resume**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

***

### rotate()

> **rotate**(`a`): [`Root`](/api/classes/Root)

#### Parameters

• **a**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`rotate`](/api/classes/Node#rotate)

***

### row()

> **row**(`align`): [`Root`](/api/classes/Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`row`](/api/classes/Node#row)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`scale`](/api/classes/Node#scale)

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`scale`](/api/classes/Node#scale)

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

[`Node`](/api/classes/Node).[`setTimeout`](/api/classes/Node#settimeout)

***

### show()

> **show**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`show`](/api/classes/Node#show)

***

### size()

> **size**(`w`, `h`): [`Root`](/api/classes/Root)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`size`](/api/classes/Node#size)

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`skew`](/api/classes/Node#skew)

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`skew`](/api/classes/Node#skew)

***

### spacing()

> **spacing**(`space`): [`Root`](/api/classes/Root)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Node`](/api/classes/Node).[`spacing`](/api/classes/Node#spacing)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Root`](/api/classes/Root)\>

• **before**: `boolean` = `false`

#### Returns

`void`

#### Inherited from

[`Node`](/api/classes/Node).[`tick`](/api/classes/Node#tick)

***

### timeout()

> **timeout**(`callback`, `time`): `void`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`void`

#### Inherited from

[`Node`](/api/classes/Node).[`timeout`](/api/classes/Node#timeout)

***

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`Node`](/api/classes/Node).[`toString`](/api/classes/Node#tostring)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](/api/type-aliases/TransitionOptions)

##### Returns

[`Transition`](/api/classes/Transition)

##### Inherited from

[`Node`](/api/classes/Node).[`tween`](/api/classes/Node#tween)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](/api/classes/Transition)

##### Inherited from

[`Node`](/api/classes/Node).[`tween`](/api/classes/Node#tween)

***

### unmount()

> **unmount**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`void`

#### Inherited from

[`Node`](/api/classes/Node).[`untick`](/api/classes/Node#untick)

***

### viewbox()

#### viewbox(viewbox)

> **viewbox**(`viewbox`): `this`

Set viewbox.

##### Parameters

• **viewbox**: [`Viewbox`](/api/type-aliases/Viewbox)

##### Returns

`this`

#### viewbox(width, height, mode)

> **viewbox**(`width`?, `height`?, `mode`?): `this`

##### Parameters

• **width?**: `number`

• **height?**: `number`

• **mode?**: [`FitMode`](/api/type-aliases/FitMode)

##### Returns

`this`

***

### viewport()

#### viewport()

> **viewport**(): [`Viewport`](/api/type-aliases/Viewport)

Set/Get viewport.
This is used along with viewbox to determine the scale and position of the viewbox within the viewport.
Viewport is the size of the container, for example size of the canvas element.
Viewbox is provided by the user, and is the ideal size of the content.

##### Returns

[`Viewport`](/api/type-aliases/Viewport)

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

• **viewbox**: [`Viewport`](/api/type-aliases/Viewport)

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

[`Node`](/api/classes/Node).[`visible`](/api/classes/Node#visible)

#### visible()

> **visible**(): `boolean`

##### Returns

`boolean`

##### Inherited from

[`Node`](/api/classes/Node).[`visible`](/api/classes/Node#visible)

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

[`Node`](/api/classes/Node).[`visit`](/api/classes/Node#visit)

***

### width()

#### width(w)

> **width**(`w`): `this`

##### Parameters

• **w**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](/api/classes/Node).[`width`](/api/classes/Node#width)

#### width()

> **width**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](/api/classes/Node).[`width`](/api/classes/Node#width)
