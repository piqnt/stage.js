# Class: Transition

## Implements

- `Pinned`

## Constructors

### new Transition()

> **new Transition**(`owner`, `options`): [`Transition`](/api/classes/Transition)

#### Parameters

• **owner**: [`Component`](/api/classes/Component)

• **options**: [`TransitionOptions`](/api/type-aliases/TransitionOptions) = `{}`

#### Returns

[`Transition`](/api/classes/Transition)

## Methods

### alpha()

> **alpha**(`a`, `ta`?): [`Transition`](/api/classes/Transition)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

#### Implementation of

`Pinned.alpha`

***

### delay()

> **delay**(`delay`): [`Transition`](/api/classes/Transition)

#### Parameters

• **delay**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

***

### done()

> **done**(`fn`): [`Transition`](/api/classes/Transition)

#### Parameters

• **fn**: [`TransitionEndListener`](/api/type-aliases/TransitionEndListener)

#### Returns

[`Transition`](/api/classes/Transition)

***

### duration()

> **duration**(`duration`): [`Transition`](/api/classes/Transition)

#### Parameters

• **duration**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

***

### ease()

> **ease**(`easing`): [`Transition`](/api/classes/Transition)

#### Parameters

• **easing**: `string` \| `EasingFunction`

#### Returns

[`Transition`](/api/classes/Transition)

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

> **hide**(): [`Transition`](/api/classes/Transition)

#### Returns

[`Transition`](/api/classes/Transition)

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

> **remove**(): [`Transition`](/api/classes/Transition)

#### Returns

[`Transition`](/api/classes/Transition)

***

### rotate()

> **rotate**(`a`): [`Transition`](/api/classes/Transition)

#### Parameters

• **a**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

#### Implementation of

`Pinned.rotate`

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

### size()

> **size**(`w`, `h`): [`Transition`](/api/classes/Transition)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

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

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](/api/type-aliases/TransitionOptions)

##### Returns

[`Transition`](/api/classes/Transition)

#### tween(duration, delay)

> **tween**(`duration`?, `delay`?): [`Transition`](/api/classes/Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

##### Returns

[`Transition`](/api/classes/Transition)

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
