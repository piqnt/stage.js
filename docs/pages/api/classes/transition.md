# Class: Transition

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

### height()

> **height**(`h`): `this`

#### Parameters

• **h**: `number`

#### Returns

`this`

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

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

***

### pin()

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: keyof [`SetPinType`](/api/interfaces/SetPinType)

• **value**: `any`

##### Returns

`this`

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: [`SetPinType`](/api/interfaces/SetPinType)

##### Returns

`this`

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

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

#### scale(s)

> **scale**(`s`): `this`

##### Parameters

• **s**: `number`

##### Returns

`this`

***

### size()

> **size**(`w`, `h`): [`Transition`](/api/classes/Transition)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Transition`](/api/classes/Transition)

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](/api/interfaces/Vec2Value)

##### Returns

`this`

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

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

> **width**(`w`): `this`

#### Parameters

• **w**: `number`

#### Returns

`this`
