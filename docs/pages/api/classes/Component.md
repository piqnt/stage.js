# Class: Component

## Extended by

- [`Root`](/api/classes/Root)
- [`Sprite`](/api/classes/Sprite)
- [`Anim`](/api/classes/Anim)
- [`Monotype`](/api/classes/Monotype)

## Implements

- `Pinned`

## Constructors

### new Component()

> **new Component**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

## Properties

### MAX\_ELAPSE

> **MAX\_ELAPSE**: `number` = `Infinity`

## Methods

### align()

> **align**(`type`, `align`): [`Component`](/api/classes/Component)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Component`](/api/classes/Component)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Component`](/api/classes/Component)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Component`](/api/classes/Component)

#### Implementation of

`Pinned.alpha`

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

***

### appendTo()

> **appendTo**(`parent`): [`Component`](/api/classes/Component)

#### Parameters

• **parent**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### attr()

#### attr(name, value)

> **attr**(`name`, `value`): `this`

##### Parameters

• **name**: `string`

• **value**: `any`

##### Returns

`this`

#### attr(name)

> **attr**(`name`): `any`

##### Parameters

• **name**: `string`

##### Returns

`any`

***

### clearTimeout()

> **clearTimeout**(`timer`): `void`

#### Parameters

• **timer**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Component`](/api/classes/Component)\>

#### Returns

`void`

***

### column()

> **column**(`align`): [`Component`](/api/classes/Component)

#### Parameters

• **align**: `number`

#### Returns

[`Component`](/api/classes/Component)

***

### empty()

> **empty**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### first()

> **first**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

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

#### fit(fit)

> **fit**(`fit`): `this`

##### Parameters

• **fit**: `object`

##### Returns

`this`

***

### height()

#### height(h)

> **height**(`h`): `this`

##### Parameters

• **h**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.height`

#### height()

> **height**(): `number`

##### Returns

`number`

##### Implementation of

`Pinned.height`

***

### hide()

> **hide**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### insertAfter()

> **insertAfter**(`prev`): [`Component`](/api/classes/Component)

#### Parameters

• **prev**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### insertBefore()

> **insertBefore**(`next`): [`Component`](/api/classes/Component)

#### Parameters

• **next**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Component`](/api/classes/Component)

#### Parameters

• **sibling**: [`Component`](/api/classes/Component)

• **more?**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Component`](/api/classes/Component)

#### Parameters

• **sibling**: [`Component`](/api/classes/Component)

• **more?**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### label()

#### label()

> **label**(): `string`

##### Returns

`string`

#### label(label)

> **label**(`label`): `this`

##### Parameters

• **label**: `string`

##### Returns

`this`

***

### last()

> **last**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

***

### listeners()

> **listeners**(`type`): [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>[]

***

### matrix()

> **matrix**(`relative`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### maximize()

> **maximize**(): [`Component`](/api/classes/Component)

Set size to match parent size.

#### Returns

[`Component`](/api/classes/Component)

***

### minimize()

> **minimize**(): [`Component`](/api/classes/Component)

Set size to match largest child size.

#### Returns

[`Component`](/api/classes/Component)

***

### next()

> **next**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>

#### Returns

`this`

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Implementation of

`Pinned.offset`

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.offset`

***

### on()

> **on**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`ComponentEventListener`](/api/type-aliases/ComponentEventListener)\<[`Component`](/api/classes/Component)\>

#### Returns

`this`

***

### padding()

> **padding**(`pad`): [`Component`](/api/classes/Component)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Component`](/api/classes/Component)

***

### parent()

> **parent**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### pin()

#### pin(key)

> **pin**(`key`): `any`

##### Parameters

• **key**: `string`

##### Returns

`any`

##### Implementation of

`Pinned.pin`

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: `string`

• **value**: `any`

##### Returns

`this`

##### Implementation of

`Pinned.pin`

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: `object`

##### Returns

`this`

##### Implementation of

`Pinned.pin`

#### pin()

> **pin**(): [`Pin`](/api/classes/Pin)

##### Returns

[`Pin`](/api/classes/Pin)

##### Implementation of

`Pinned.pin`

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Component`](/api/classes/Component)[]

##### Returns

`this`

***

### prependTo()

> **prependTo**(`parent`): [`Component`](/api/classes/Component)

#### Parameters

• **parent**: [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### prev()

> **prev**(`visible`?): [`Component`](/api/classes/Component)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Component`](/api/classes/Component)

***

### publish()

> **publish**(`name`, `args`?): `number`

#### Parameters

• **name**: `string`

• **args?**: `any`

#### Returns

`number`

***

### remove()

> **remove**(`child`?, `more`?): [`Component`](/api/classes/Component)

#### Parameters

• **child?**: [`Component`](/api/classes/Component)

• **more?**: `any`

#### Returns

[`Component`](/api/classes/Component)

***

### rotate()

> **rotate**(`a`): [`Component`](/api/classes/Component)

#### Parameters

• **a**: `number`

#### Returns

[`Component`](/api/classes/Component)

#### Implementation of

`Pinned.rotate`

***

### row()

> **row**(`align`): [`Component`](/api/classes/Component)

#### Parameters

• **align**: `number`

#### Returns

[`Component`](/api/classes/Component)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Implementation of

`Pinned.scale`

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.scale`

#### scale(s)

> **scale**(`s`): `this`

##### Parameters

• **s**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.scale`

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

***

### show()

> **show**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### size()

> **size**(`w`, `h`): [`Component`](/api/classes/Component)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Component`](/api/classes/Component)

#### Implementation of

`Pinned.size`

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

##### Implementation of

`Pinned.skew`

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.skew`

***

### spacing()

> **spacing**(`space`): [`Component`](/api/classes/Component)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Component`](/api/classes/Component)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Component`](/api/classes/Component)\>

• **before**: `boolean` = `false`

#### Returns

`void`

***

### timeout()

> **timeout**(`callback`, `time`): `void`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`void`

***

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

***

### touch()

> **touch**(): [`Component`](/api/classes/Component)

#### Returns

[`Component`](/api/classes/Component)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](/api/type-aliases/TransitionOptions)

##### Returns

[`Transition`](/api/classes/Transition)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](/api/classes/Transition)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`ComponentTickListener`](/api/type-aliases/ComponentTickListener)\<[`Component`](/api/classes/Component)\>

#### Returns

`void`

***

### visible()

#### visible(visible)

> **visible**(`visible`): `this`

##### Parameters

• **visible**: `boolean`

##### Returns

`this`

#### visible()

> **visible**(): `boolean`

##### Returns

`boolean`

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

***

### width()

#### width(w)

> **width**(`w`): `this`

##### Parameters

• **w**: `number`

##### Returns

`this`

##### Implementation of

`Pinned.width`

#### width()

> **width**(): `number`

##### Returns

`number`

##### Implementation of

`Pinned.width`
