# Class: Root

## Extends

- [`Component`](/api/classes/Component)

## Constructors

### new Root()

> **new Root**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Overrides

[`Component`](/api/classes/Component).[`constructor`](/api/classes/Component#constructors)

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

[`Component`](/api/classes/Component).[`MAX_ELAPSE`](/api/classes/Component#max_elapse)

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

[`Component`](/api/classes/Component).[`align`](/api/classes/Component#align)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Root`](/api/classes/Root)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`alpha`](/api/classes/Component#alpha)

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`append`](/api/classes/Component#append)

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`append`](/api/classes/Component#append)

***

### appendTo()

> **appendTo**(`parent`): [`Root`](/api/classes/Root)

#### Parameters

• **parent**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`appendTo`](/api/classes/Component#appendto)

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

[`Component`](/api/classes/Component).[`attr`](/api/classes/Component#attr)

#### attr(name)

> **attr**(`name`): `any`

##### Parameters

• **name**: `string`

##### Returns

`any`

##### Inherited from

[`Component`](/api/classes/Component).[`attr`](/api/classes/Component#attr)

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

• **timer**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`void`

#### Inherited from

[`Component`](/api/classes/Component).[`clearTimeout`](/api/classes/Component#cleartimeout)

***

### column()

> **column**(`align`): [`Root`](/api/classes/Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`column`](/api/classes/Component#column)

***

### empty()

> **empty**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`empty`](/api/classes/Component#empty)

***

### first()

> **first**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

#### Inherited from

[`Component`](/api/classes/Component).[`first`](/api/classes/Component#first)

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

[`Component`](/api/classes/Component).[`fit`](/api/classes/Component#fit)

#### fit(fit)

> **fit**(`fit`): `this`

##### Parameters

• **fit**: `object`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`fit`](/api/classes/Component#fit)

***

### height()

#### height(h)

> **height**(`h`): `this`

##### Parameters

• **h**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`height`](/api/classes/Component#height)

#### height()

> **height**(): `number`

##### Returns

`number`

##### Inherited from

[`Component`](/api/classes/Component).[`height`](/api/classes/Component#height)

***

### hide()

> **hide**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`hide`](/api/classes/Component#hide)

***

### insertAfter()

> **insertAfter**(`prev`): [`Root`](/api/classes/Root)

#### Parameters

• **prev**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`insertAfter`](/api/classes/Component#insertafter)

***

### insertBefore()

> **insertBefore**(`next`): [`Root`](/api/classes/Root)

#### Parameters

• **next**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`insertBefore`](/api/classes/Component#insertbefore)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **sibling**: [`Component`](/api/classes/Component)

• **more?**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`insertNext`](/api/classes/Component#insertnext)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **sibling**: [`Component`](/api/classes/Component)

• **more?**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`insertPrev`](/api/classes/Component#insertprev)

***

### label()

#### label()

> **label**(): `string`

##### Returns

`string`

##### Inherited from

[`Component`](/api/classes/Component).[`label`](/api/classes/Component#label)

#### label(label)

> **label**(`label`): `this`

##### Parameters

• **label**: `string`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`label`](/api/classes/Component#label)

***

### last()

> **last**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

#### Inherited from

[`Component`](/api/classes/Component).[`last`](/api/classes/Component#last)

***

### listeners()

> **listeners**(`type`): [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>[]

#### Inherited from

[`Component`](/api/classes/Component).[`listeners`](/api/classes/Component#listeners)

***

### matrix()

> **matrix**(`relative`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](/api/classes/Matrix)

#### Inherited from

[`Component`](/api/classes/Component).[`matrix`](/api/classes/Component#matrix)

***

### maximize()

> **maximize**(): [`Root`](/api/classes/Root)

Set size to match parent size.

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`maximize`](/api/classes/Component#maximize)

***

### minimize()

> **minimize**(): [`Root`](/api/classes/Root)

Set size to match largest child size.

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`minimize`](/api/classes/Component#minimize)

***

### mount()

> **mount**(`configs`): `void`

#### Parameters

• **configs**: `RootConfig` = `{}`

#### Returns

`void`

***

### next()

> **next**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

#### Inherited from

[`Component`](/api/classes/Component).[`next`](/api/classes/Component#next)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`this`

#### Inherited from

[`Component`](/api/classes/Component).[`off`](/api/classes/Component#off)

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`offset`](/api/classes/Component#offset)

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`offset`](/api/classes/Component#offset)

***

### on()

> **on**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`this`

#### Inherited from

[`Component`](/api/classes/Component).[`on`](/api/classes/Component#on)

***

### padding()

> **padding**(`pad`): [`Root`](/api/classes/Root)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`padding`](/api/classes/Component#padding)

***

### parent()

> **parent**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

#### Inherited from

[`Component`](/api/classes/Component).[`parent`](/api/classes/Component#parent)

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

[`Component`](/api/classes/Component).[`pin`](/api/classes/Component#pin)

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`pin`](/api/classes/Component#pin)

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: `object`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`pin`](/api/classes/Component#pin)

#### pin()

> **pin**(): [`Pin`](/api/classes/Pin)

##### Returns

[`Pin`](/api/classes/Pin)

##### Inherited from

[`Component`](/api/classes/Component).[`pin`](/api/classes/Component#pin)

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`prepend`](/api/classes/Component#prepend)

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`prepend`](/api/classes/Component#prepend)

***

### prependTo()

> **prependTo**(`parent`): [`Root`](/api/classes/Root)

#### Parameters

• **parent**: [`Component`](/api/classes/Component)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`prependTo`](/api/classes/Component#prependto)

***

### prev()

> **prev**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

#### Inherited from

[`Component`](/api/classes/Component).[`prev`](/api/classes/Component#prev)

***

### publish()

> **publish**(`name`, `args`?): `number`

#### Parameters

• **name**: `string`

• **args?**: `any`

#### Returns

`number`

#### Inherited from

[`Component`](/api/classes/Component).[`publish`](/api/classes/Component#publish)

***

### remove()

> **remove**(`child`?, `more`?): [`Root`](/api/classes/Root)

#### Parameters

• **child?**: [`Component`](/api/classes/Component)

• **more?**: `any`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`remove`](/api/classes/Component#remove)

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

[`Component`](/api/classes/Component).[`rotate`](/api/classes/Component#rotate)

***

### row()

> **row**(`align`): [`Root`](/api/classes/Root)

#### Parameters

• **align**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`row`](/api/classes/Component#row)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`scale`](/api/classes/Component#scale)

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`scale`](/api/classes/Component#scale)

#### scale(s)

> **scale**(`s`): `this`

##### Parameters

• **s**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`scale`](/api/classes/Component#scale)

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

[`Component`](/api/classes/Component).[`setTimeout`](/api/classes/Component#settimeout)

***

### show()

> **show**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`show`](/api/classes/Component#show)

***

### size()

> **size**(`w`, `h`): [`Root`](/api/classes/Root)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`size`](/api/classes/Component#size)

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`skew`](/api/classes/Component#skew)

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`skew`](/api/classes/Component#skew)

***

### spacing()

> **spacing**(`space`): [`Root`](/api/classes/Root)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Root`](/api/classes/Root)

#### Inherited from

[`Component`](/api/classes/Component).[`spacing`](/api/classes/Component#spacing)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Root`](/api/classes/Root)\>

• **before**: `boolean` = `false`

#### Returns

`void`

#### Inherited from

[`Component`](/api/classes/Component).[`tick`](/api/classes/Component#tick)

***

### timeout()

> **timeout**(`callback`, `time`): `void`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`void`

#### Inherited from

[`Component`](/api/classes/Component).[`timeout`](/api/classes/Component#timeout)

***

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`Component`](/api/classes/Component).[`toString`](/api/classes/Component#tostring)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](/api/type-aliases/TransitionOptions)

##### Returns

[`Transition`](/api/classes/Transition)

##### Inherited from

[`Component`](/api/classes/Component).[`tween`](/api/classes/Component#tween)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](/api/classes/Transition)

##### Inherited from

[`Component`](/api/classes/Component).[`tween`](/api/classes/Component#tween)

***

### unmount()

> **unmount**(): [`Root`](/api/classes/Root)

#### Returns

[`Root`](/api/classes/Root)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Root`](/api/classes/Root)\>

#### Returns

`void`

#### Inherited from

[`Component`](/api/classes/Component).[`untick`](/api/classes/Component#untick)

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

[`Component`](/api/classes/Component).[`visible`](/api/classes/Component#visible)

#### visible()

> **visible**(): `boolean`

##### Returns

`boolean`

##### Inherited from

[`Component`](/api/classes/Component).[`visible`](/api/classes/Component#visible)

***

### visit()

> **visit**\<`P`\>(`visitor`, `payload`?): `boolean` \| `void`

#### Type Parameters

• **P**

#### Parameters

• **visitor**: `ComponentVisitor`\<`P`\>

• **payload?**: `P`

#### Returns

`boolean` \| `void`

#### Inherited from

[`Component`](/api/classes/Component).[`visit`](/api/classes/Component#visit)

***

### width()

#### width(w)

> **width**(`w`): `this`

##### Parameters

• **w**: `number`

##### Returns

`this`

##### Inherited from

[`Component`](/api/classes/Component).[`width`](/api/classes/Component#width)

#### width()

> **width**(): `number`

##### Returns

`number`

##### Inherited from

[`Component`](/api/classes/Component).[`width`](/api/classes/Component#width)
