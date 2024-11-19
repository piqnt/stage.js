# Class: Transition

## Implements

- `Pinned`

## Constructors

### new Transition()

> **new Transition**(`owner`, `options`): [`Transition`](Transition)

#### Parameters

• **owner**: [`Node`](Node)

• **options**: [`TransitionOptions`](../type-aliases/TransitionOptions) = `{}`

#### Returns

[`Transition`](Transition)

## Methods

### alpha()

> **alpha**(`a`, `ta`?): [`Transition`](Transition)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Transition`](Transition)

#### Implementation of

`Pinned.alpha`

***

### ~~clear()~~

> **clear**(`forward`): [`Transition`](Transition)

#### Parameters

• **forward**: `boolean`

#### Returns

[`Transition`](Transition)

#### Deprecated

this doesn't do anything anymore, call transition on the node instead.

***

### delay()

> **delay**(`delay`): [`Transition`](Transition)

#### Parameters

• **delay**: `number`

#### Returns

[`Transition`](Transition)

***

### done()

> **done**(`fn`): [`Transition`](Transition)

#### Parameters

• **fn**: [`TransitionEndListener`](../type-aliases/TransitionEndListener)

#### Returns

[`Transition`](Transition)

***

### duration()

> **duration**(`duration`): [`Transition`](Transition)

#### Parameters

• **duration**: `number`

#### Returns

[`Transition`](Transition)

***

### ease()

> **ease**(`easing`): [`Transition`](Transition)

#### Parameters

• **easing**: `string` \| `EasingFunction`

#### Returns

[`Transition`](Transition)

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

> **hide**(): [`Transition`](Transition)

#### Returns

[`Transition`](Transition)

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

### pin()

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

#### pin(key)

> **pin**(`key`): `any`

##### Parameters

• **key**: `string`

##### Returns

`any`

##### Implementation of

`Pinned.pin`

***

### remove()

> **remove**(): [`Transition`](Transition)

#### Returns

[`Transition`](Transition)

***

### rotate()

> **rotate**(`a`): [`Transition`](Transition)

#### Parameters

• **a**: `number`

#### Returns

[`Transition`](Transition)

#### Implementation of

`Pinned.rotate`

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

### size()

> **size**(`w`, `h`): [`Transition`](Transition)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Transition`](Transition)

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

### ~~then()~~

> **then**(`fn`): [`Transition`](Transition)

#### Parameters

• **fn**: [`TransitionEndListener`](../type-aliases/TransitionEndListener)

#### Returns

[`Transition`](Transition)

#### Deprecated

Use .done(fn) instead.

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](../type-aliases/TransitionOptions)

##### Returns

[`Transition`](Transition)

#### tween(duration, delay)

> **tween**(`duration`?, `delay`?): [`Transition`](Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

##### Returns

[`Transition`](Transition)

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
