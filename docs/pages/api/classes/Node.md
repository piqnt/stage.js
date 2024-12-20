# Class: Node

## Extended by

- [`Root`](/api/classes/Root)
- [`Sprite`](/api/classes/Sprite)
- [`Anim`](/api/classes/Anim)
- [`Monotype`](/api/classes/Monotype)

## Implements

- `Pinned`

## Constructors

### new Node()

> **new Node**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

## Properties

### MAX\_ELAPSE

> **MAX\_ELAPSE**: `number` = `Infinity`

## Methods

### align()

> **align**(`type`, `align`): [`Node`](/api/classes/Node)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Node`](/api/classes/Node)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Node`](/api/classes/Node)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Node`](/api/classes/Node)

#### Implementation of

`Pinned.alpha`

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

***

### appendTo()

> **appendTo**(`parent`): [`Node`](/api/classes/Node)

#### Parameters

• **parent**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

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

• **timer**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Node`](/api/classes/Node)\>

#### Returns

`void`

***

### column()

> **column**(`align`): [`Node`](/api/classes/Node)

#### Parameters

• **align**: `number`

#### Returns

[`Node`](/api/classes/Node)

***

### empty()

> **empty**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### first()

> **first**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

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

> **hide**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### insertAfter()

> **insertAfter**(`prev`): [`Node`](/api/classes/Node)

#### Parameters

• **prev**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### insertBefore()

> **insertBefore**(`next`): [`Node`](/api/classes/Node)

#### Parameters

• **next**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Node`](/api/classes/Node)

#### Parameters

• **sibling**: [`Node`](/api/classes/Node)

• **more?**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Node`](/api/classes/Node)

#### Parameters

• **sibling**: [`Node`](/api/classes/Node)

• **more?**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

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

> **last**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

***

### listeners()

> **listeners**(`type`): [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>[]

***

### matrix()

> **matrix**(`relative`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### maximize()

> **maximize**(): [`Node`](/api/classes/Node)

Set size to match parent size.

#### Returns

[`Node`](/api/classes/Node)

***

### minimize()

> **minimize**(): [`Node`](/api/classes/Node)

Set size to match largest child size.

#### Returns

[`Node`](/api/classes/Node)

***

### next()

> **next**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>

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

• **listener**: [`NodeEventListener`](/api/type-aliases/NodeEventListener)\<[`Node`](/api/classes/Node)\>

#### Returns

`this`

***

### padding()

> **padding**(`pad`): [`Node`](/api/classes/Node)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Node`](/api/classes/Node)

***

### parent()

> **parent**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

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

• ...**child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Node`](/api/classes/Node)[]

##### Returns

`this`

***

### prependTo()

> **prependTo**(`parent`): [`Node`](/api/classes/Node)

#### Parameters

• **parent**: [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### prev()

> **prev**(`visible`?): [`Node`](/api/classes/Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](/api/classes/Node)

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

> **remove**(`child`?, `more`?): [`Node`](/api/classes/Node)

#### Parameters

• **child?**: [`Node`](/api/classes/Node)

• **more?**: `any`

#### Returns

[`Node`](/api/classes/Node)

***

### rotate()

> **rotate**(`a`): [`Node`](/api/classes/Node)

#### Parameters

• **a**: `number`

#### Returns

[`Node`](/api/classes/Node)

#### Implementation of

`Pinned.rotate`

***

### row()

> **row**(`align`): [`Node`](/api/classes/Node)

#### Parameters

• **align**: `number`

#### Returns

[`Node`](/api/classes/Node)

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

> **show**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

***

### size()

> **size**(`w`, `h`): [`Node`](/api/classes/Node)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Node`](/api/classes/Node)

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

> **spacing**(`space`): [`Node`](/api/classes/Node)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Node`](/api/classes/Node)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Node`](/api/classes/Node)\>

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

> **touch**(): [`Node`](/api/classes/Node)

#### Returns

[`Node`](/api/classes/Node)

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

• **callback**: [`NodeTickListener`](/api/type-aliases/NodeTickListener)\<[`Node`](/api/classes/Node)\>

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
