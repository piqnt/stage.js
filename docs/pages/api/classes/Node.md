# Class: Node

## Extended by

- [`Root`](Root)
- [`Sprite`](Sprite)
- [`Anim`](Anim)
- [`Monotype`](Monotype)

## Implements

- `Pinned`

## Constructors

### new Node()

> **new Node**(): [`Node`](Node)

#### Returns

[`Node`](Node)

## Properties

### MAX\_ELAPSE

> **MAX\_ELAPSE**: `number` = `Infinity`

## Methods

### align()

> **align**(`type`, `align`): [`Node`](Node)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Node`](Node)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Node`](Node)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Node`](Node)

#### Implementation of

`Pinned.alpha`

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

***

### appendTo()

> **appendTo**(`parent`): [`Node`](Node)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Node`](Node)

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

• **timer**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Node`](Node)\>

#### Returns

`void`

***

### column()

> **column**(`align`): [`Node`](Node)

#### Parameters

• **align**: `number`

#### Returns

[`Node`](Node)

***

### empty()

> **empty**(): [`Node`](Node)

#### Returns

[`Node`](Node)

***

### first()

> **first**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

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

> **hide**(): [`Node`](Node)

#### Returns

[`Node`](Node)

***

### insertAfter()

> **insertAfter**(`prev`): [`Node`](Node)

#### Parameters

• **prev**: [`Node`](Node)

#### Returns

[`Node`](Node)

***

### insertBefore()

> **insertBefore**(`next`): [`Node`](Node)

#### Parameters

• **next**: [`Node`](Node)

#### Returns

[`Node`](Node)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Node`](Node)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Node`](Node)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Node`](Node)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Node`](Node)

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

> **last**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

***

### listeners()

> **listeners**(`type`): [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>[]

***

### matrix()

> **matrix**(`relative`): [`Matrix`](Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](Matrix)

***

### maximize()

> **maximize**(): [`Node`](Node)

Set size to match parent size.

#### Returns

[`Node`](Node)

***

### minimize()

> **minimize**(): [`Node`](Node)

Set size to match largest child size.

#### Returns

[`Node`](Node)

***

### next()

> **next**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>

#### Returns

`this`

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

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

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Node`](Node)\>

#### Returns

`this`

***

### padding()

> **padding**(`pad`): [`Node`](Node)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Node`](Node)

***

### parent()

> **parent**(): [`Node`](Node)

#### Returns

[`Node`](Node)

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

> **pin**(): [`Pin`](Pin)

##### Returns

[`Pin`](Pin)

##### Implementation of

`Pinned.pin`

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

***

### prependTo()

> **prependTo**(`parent`): [`Node`](Node)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Node`](Node)

***

### prev()

> **prev**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

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

> **remove**(`child`?, `more`?): [`Node`](Node)

#### Parameters

• **child?**: [`Node`](Node)

• **more?**: `any`

#### Returns

[`Node`](Node)

***

### rotate()

> **rotate**(`a`): [`Node`](Node)

#### Parameters

• **a**: `number`

#### Returns

[`Node`](Node)

#### Implementation of

`Pinned.rotate`

***

### row()

> **row**(`align`): [`Node`](Node)

#### Parameters

• **align**: `number`

#### Returns

[`Node`](Node)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

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

> **show**(): [`Node`](Node)

#### Returns

[`Node`](Node)

***

### size()

> **size**(`w`, `h`): [`Node`](Node)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Node`](Node)

#### Implementation of

`Pinned.size`

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

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

> **spacing**(`space`): [`Node`](Node)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Node`](Node)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Node`](Node)\>

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

> **touch**(): [`Node`](Node)

#### Returns

[`Node`](Node)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](../type-aliases/TransitionOptions)

##### Returns

[`Transition`](Transition)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](Transition)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Node`](Node)\>

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

• **visitor**: `NodeVisitor`\<`P`\>

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
