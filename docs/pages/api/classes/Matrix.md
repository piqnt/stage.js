# Class: Matrix

## Constructors

### new Matrix()

> **new Matrix**(`a`, `b`, `c`, `d`, `e`, `f`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **a**: `number`

• **b**: `number`

• **c**: `number`

• **d**: `number`

• **e**: `number`

• **f**: `number`

#### Returns

[`Matrix`](/api/classes/Matrix)

### new Matrix()

> **new Matrix**(`m`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **m**: [`MatrixValue`](/api/interfaces/MatrixValue)

#### Returns

[`Matrix`](/api/classes/Matrix)

### new Matrix()

> **new Matrix**(): [`Matrix`](/api/classes/Matrix)

#### Returns

[`Matrix`](/api/classes/Matrix)

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

> **clone**(): [`Matrix`](/api/classes/Matrix)

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### concat()

> **concat**(`m`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **m**: [`MatrixValue`](/api/interfaces/MatrixValue)

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### identity()

> **identity**(): [`Matrix`](/api/classes/Matrix)

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### inverse()

> **inverse**(): [`Matrix`](/api/classes/Matrix)

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### map()

> **map**(`p`, `q`?): [`Vec2Value`](/api/interfaces/Vec2Value)

#### Parameters

• **p**: [`Vec2Value`](/api/interfaces/Vec2Value)

• **q?**: [`Vec2Value`](/api/interfaces/Vec2Value)

#### Returns

[`Vec2Value`](/api/interfaces/Vec2Value)

***

### mapX()

> **mapX**(`x`, `y`?): `number`

#### Parameters

• **x**: `number` \| [`Vec2Value`](/api/interfaces/Vec2Value)

• **y?**: `number`

#### Returns

`number`

***

### mapY()

> **mapY**(`x`, `y`?): `number`

#### Parameters

• **x**: `number` \| [`Vec2Value`](/api/interfaces/Vec2Value)

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

• **m**: [`MatrixValue`](/api/interfaces/MatrixValue)

##### Returns

`this`

***

### rotate()

> **rotate**(`angle`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **angle**: `number`

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### scale()

> **scale**(`x`, `y`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### skew()

> **skew**(`x`, `y`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](/api/classes/Matrix)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

***

### translate()

> **translate**(`x`, `y`): [`Matrix`](/api/classes/Matrix)

#### Parameters

• **x**: `number`

• **y**: `number`

#### Returns

[`Matrix`](/api/classes/Matrix)
