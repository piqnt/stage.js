
# Class: Matrix

## Hierarchy

* **Matrix**

## Index

### Constructors

* [constructor](/api/classes/matrix#constructor)

### Properties

* [a](/api/classes/matrix#a)
* [b](/api/classes/matrix#b)
* [c](/api/classes/matrix#c)
* [d](/api/classes/matrix#d)
* [e](/api/classes/matrix#e)
* [f](/api/classes/matrix#f)

### Methods

* [clone](/api/classes/matrix#clone)
* [concat](/api/classes/matrix#concat)
* [identity](/api/classes/matrix#identity)
* [inverse](/api/classes/matrix#inverse)
* [map](/api/classes/matrix#map)
* [mapX](/api/classes/matrix#mapx)
* [mapY](/api/classes/matrix#mapy)
* [reset](/api/classes/matrix#reset)
* [rotate](/api/classes/matrix#rotate)
* [scale](/api/classes/matrix#scale)
* [skew](/api/classes/matrix#skew)
* [toString](/api/classes/matrix#tostring)
* [translate](/api/classes/matrix#translate)

## Constructors

###  constructor

\+ **new Matrix**(`a`: number, `b`: number, `c`: number, `d`: number, `e`: number, `f`: number): *[Matrix](/api/classes/matrix)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`b` | number |
`c` | number |
`d` | number |
`e` | number |
`f` | number |

**Returns:** *[Matrix](/api/classes/matrix)*

\+ **new Matrix**(`m`: [MatrixValue](/api/interfaces/matrixvalue)): *[Matrix](/api/classes/matrix)*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](/api/interfaces/matrixvalue) |

**Returns:** *[Matrix](/api/classes/matrix)*

\+ **new Matrix**(): *[Matrix](/api/classes/matrix)*

**Returns:** *[Matrix](/api/classes/matrix)*

## Properties

###  a

• **a**: *number* = 1

x-scale

___

###  b

• **b**: *number* = 0

___

###  c

• **c**: *number* = 0

___

###  d

• **d**: *number* = 1

y-scale

___

###  e

• **e**: *number* = 0

x-translate

___

###  f

• **f**: *number* = 0

y-translate

## Methods

###  clone

▸ **clone**(): *[Matrix](/api/classes/matrix)‹›*

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  concat

▸ **concat**(`m`: [MatrixValue](/api/interfaces/matrixvalue)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](/api/interfaces/matrixvalue) |

**Returns:** *this*

___

###  identity

▸ **identity**(): *this*

**Returns:** *this*

___

###  inverse

▸ **inverse**(): *[Matrix](/api/classes/matrix)‹›*

**Returns:** *[Matrix](/api/classes/matrix)‹›*

___

###  map

▸ **map**(`p`: [Vec2Value](/api/interfaces/vec2value), `q?`: [Vec2Value](/api/interfaces/vec2value)): *[Vec2Value](/api/interfaces/vec2value)*

**Parameters:**

Name | Type |
------ | ------ |
`p` | [Vec2Value](/api/interfaces/vec2value) |
`q?` | [Vec2Value](/api/interfaces/vec2value) |

**Returns:** *[Vec2Value](/api/interfaces/vec2value)*

___

###  mapX

▸ **mapX**(`x`: number | [Vec2Value](/api/interfaces/vec2value), `y?`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number &#124; [Vec2Value](/api/interfaces/vec2value) |
`y?` | number |

**Returns:** *number*

___

###  mapY

▸ **mapY**(`x`: number | [Vec2Value](/api/interfaces/vec2value), `y?`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number &#124; [Vec2Value](/api/interfaces/vec2value) |
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

▸ **reset**(`m`: [MatrixValue](/api/interfaces/matrixvalue)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`m` | [MatrixValue](/api/interfaces/matrixvalue) |

**Returns:** *this*

▸ **reset**(): *this*

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
