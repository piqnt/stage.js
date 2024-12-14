# Class: Matrix

## Constructors

### new Matrix()

> **new Matrix**(`a`, `b`, `c`, `d`, `e`, `f`): [`Matrix`](Matrix)

#### Parameters

• **a**: `number`

• **b**: `number`

• **c**: `number`

• **d**: `number`

• **e**: `number`

• **f**: `number`

#### Returns

[`Matrix`](Matrix)

### new Matrix()

> **new Matrix**(`m`): [`Matrix`](Matrix)

#### Parameters

• **m**: [`MatrixValue`](../interfaces/MatrixValue)

#### Returns

[`Matrix`](Matrix)

### new Matrix()

> **new Matrix**(): [`Matrix`](Matrix)

#### Returns

[`Matrix`](Matrix)

## Properties

### a

> **a**: `number` = `1`

x-scale

***

### b

> **b**: `number` = `0`

***

### c

> **c**: `number` = `0`

***

### d

> **d**: `number` = `1`

y-scale

***

### e

> **e**: `number` = `0`

x-translate

***

### f

> **f**: `number` = `0`

y-translate

## Methods

### clone()

> **clone**(): [`Matrix`](Matrix)

#### Returns

[`Matrix`](Matrix)

***

### concat()

> **concat**(`m`): [`Matrix`](Matrix)

#### Parameters

• **m**: [`MatrixValue`](../interfaces/MatrixValue)

#### Returns

[`Matrix`](Matrix)

***

### identity()

> **identity**(): [`Matrix`](Matrix)

#### Returns

[`Matrix`](Matrix)

***

### inverse()

> **inverse**(): [`Matrix`](Matrix)

#### Returns

[`Matrix`](Matrix)

***

### map()

> **map**(`p`, `q`?): [`Vec2Value`](../interfaces/Vec2Value)

#### Parameters

• **p**: [`Vec2Value`](../interfaces/Vec2Value)

• **q?**: [`Vec2Value`](../interfaces/Vec2Value)

#### Returns

[`Vec2Value`](../interfaces/Vec2Value)

***

### mapX()

> **mapX**(`x`, `y`?): `number`

#### Parameters

• **x**: `number` \| [`Vec2Value`](../interfaces/Vec2Value)

• **y?**: `number`

#### Returns

`number`

***

### mapY()

> **mapY**(`x`, `y`?): `number`

#### Parameters

• **x**: `number` \| [`Vec2Value`](../interfaces/Vec2Value)

• **y?**: `number`

#### Returns

`number`

***

### reset()

#### reset(a, b, c, d, e, f)

> **reset**(`a`, `b`, `c`, `d`, `e`, `f`): `this`

##### Parameters

• **a**: `number`

• **b**: `number`

• **c**: `number`

• **d**: `number`

• **e**: `number`

• **f**: `number`

##### Returns

`this`

#### reset(m)

> **reset**(`m`): `this`

##### Parameters

• **m**: [`MatrixValue`](../interfaces/MatrixValue)

##### Returns

`this`

***

### rotate()

> **rotate**(`angle`): [`Matrix`](Matrix)

#### Parameters

• **angle**: `number`

#### Returns

[`Matrix`](Matrix)

***

### scale()

> **scale**(`x`, `y`): [`Matrix`](Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](Matrix)

***

### skew()

> **skew**(`x`, `y`): [`Matrix`](Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](Matrix)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

***

### translate()

> **translate**(`x`, `y`): [`Matrix`](Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](Matrix)
