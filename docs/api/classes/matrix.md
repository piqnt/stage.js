[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Matrix](matrix.md)

# Class: Matrix

## Hierarchy

* **Matrix**

## Index

### Constructors

* [constructor](matrix.md#constructor)

### Properties

* [a](matrix.md#a)
* [b](matrix.md#b)
* [c](matrix.md#c)
* [d](matrix.md#d)
* [e](matrix.md#e)
* [f](matrix.md#f)

### Methods

* [clone](matrix.md#clone)
* [concat](matrix.md#concat)
* [identity](matrix.md#identity)
* [inverse](matrix.md#inverse)
* [map](matrix.md#map)
* [mapX](matrix.md#mapx)
* [mapY](matrix.md#mapy)
* [reset](matrix.md#reset)
* [rotate](matrix.md#rotate)
* [scale](matrix.md#scale)
* [skew](matrix.md#skew)
* [toString](matrix.md#tostring)
* [translate](matrix.md#translate)

## Constructors

###  constructor

\+ **new Matrix**(`a`: number, `b`: number, `c`: number, `d`: number, `e`: number, `f`: number): *[Matrix](matrix.md)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`b` | number |
`c` | number |
`d` | number |
`e` | number |
`f` | number |

**Returns:** *[Matrix](matrix.md)*

\+ **new Matrix**(`m`: [MatrixValue](../interfaces/matrixvalue.md)): *[Matrix](matrix.md)*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](../interfaces/matrixvalue.md) |

**Returns:** *[Matrix](matrix.md)*

\+ **new Matrix**(): *[Matrix](matrix.md)*

**Returns:** *[Matrix](matrix.md)*

## Properties

###  a

• **a**: *number* = 1

___

###  b

• **b**: *number* = 0

___

###  c

• **c**: *number* = 0

___

###  d

• **d**: *number* = 1

___

###  e

• **e**: *number* = 0

___

###  f

• **f**: *number* = 0

## Methods

###  clone

▸ **clone**(): *[Matrix](matrix.md)‹›*

**Returns:** *[Matrix](matrix.md)‹›*

___

###  concat

▸ **concat**(`m`: [MatrixValue](../interfaces/matrixvalue.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](../interfaces/matrixvalue.md) |

**Returns:** *this*

___

###  identity

▸ **identity**(): *this*

**Returns:** *this*

___

###  inverse

▸ **inverse**(): *[Matrix](matrix.md)‹›*

**Returns:** *[Matrix](matrix.md)‹›*

___

###  map

▸ **map**(`p`: [Vec2Value](../interfaces/vec2value.md), `q?`: [Vec2Value](../interfaces/vec2value.md)): *[Vec2Value](../interfaces/vec2value.md)*

**Parameters:**

Name | Type |
------ | ------ |
`p` | [Vec2Value](../interfaces/vec2value.md) |
`q?` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *[Vec2Value](../interfaces/vec2value.md)*

___

###  mapX

▸ **mapX**(`x`: number | [Vec2Value](../interfaces/vec2value.md), `y?`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number &#124; [Vec2Value](../interfaces/vec2value.md) |
`y?` | number |

**Returns:** *number*

___

###  mapY

▸ **mapY**(`x`: number | [Vec2Value](../interfaces/vec2value.md), `y?`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number &#124; [Vec2Value](../interfaces/vec2value.md) |
`y?` | number |

**Returns:** *number*

___

###  reset

▸ **reset**(`a`: number, `b`: number, `c`: number, `d`: number, `e`: number, `f`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`b` | number |
`c` | number |
`d` | number |
`e` | number |
`f` | number |

**Returns:** *this*

▸ **reset**(`m`: [MatrixValue](../interfaces/matrixvalue.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](../interfaces/matrixvalue.md) |

**Returns:** *this*

___

###  rotate

▸ **rotate**(`angle`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`angle` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  toString

▸ **toString**(): *string*

**Returns:** *string*

___

###  translate

▸ **translate**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*
