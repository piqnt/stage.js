[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [Transition](transition.md)

# Class: Transition

## Hierarchy

* **Transition**

## Implements

* Pinned

## Index

### Constructors

* [constructor](transition.md#constructor)

### Methods

* [alpha](transition.md#alpha)
* [clear](transition.md#clear)
* [delay](transition.md#delay)
* [done](transition.md#done)
* [duration](transition.md#duration)
* [ease](transition.md#ease)
* [height](transition.md#height)
* [hide](transition.md#hide)
* [offset](transition.md#offset)
* [pin](transition.md#pin)
* [remove](transition.md#remove)
* [rotate](transition.md#rotate)
* [scale](transition.md#scale)
* [size](transition.md#size)
* [skew](transition.md#skew)
* [then](transition.md#then)
* [tween](transition.md#tween)
* [width](transition.md#width)

## Constructors

###  constructor

\+ **new Transition**(`owner`: [Node](node.md), `options`: [TransitionOptions](../globals.md#transitionoptions)): *[Transition](transition.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`owner` | [Node](node.md) | - |
`options` | [TransitionOptions](../globals.md#transitionoptions) | {} |

**Returns:** *[Transition](transition.md)*

## Methods

###  alpha

▸ **alpha**(`a`: number, `ta?`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`ta?` | number |

**Returns:** *this*

___

###  clear

▸ **clear**(`forward`: boolean): *this*

**`deprecated`** this doesn't do anything anymore, call transition on the node instead.

**Parameters:**

Name | Type |
------ | ------ |
`forward` | boolean |

**Returns:** *this*

___

###  delay

▸ **delay**(`delay`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`delay` | number |

**Returns:** *this*

___

###  done

▸ **done**(`fn`: [TransitionEndListener](../globals.md#transitionendlistener)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | [TransitionEndListener](../globals.md#transitionendlistener) |

**Returns:** *this*

___

###  duration

▸ **duration**(`duration`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`duration` | number |

**Returns:** *this*

___

###  ease

▸ **ease**(`easing`: [EasingFunctionName](../globals.md#easingfunctionname) | [EasingFunction](../globals.md#easingfunction)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`easing` | [EasingFunctionName](../globals.md#easingfunctionname) &#124; [EasingFunction](../globals.md#easingfunction) |

**Returns:** *this*

___

###  height

▸ **height**(`h`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`h` | number |

**Returns:** *this*

▸ **height**(): *number*

**Returns:** *number*

___

###  hide

▸ **hide**(): *this*

**Returns:** *this*

___

###  offset

▸ **offset**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **offset**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  pin

▸ **pin**(`key`: string, `value`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *this*

▸ **pin**(`obj`: object): *this*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | object |

**Returns:** *this*

▸ **pin**(`key`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

###  remove

▸ **remove**(): *this*

**Returns:** *this*

___

###  rotate

▸ **rotate**(`a`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |

**Returns:** *this*

___

###  scale

▸ **scale**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **scale**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  size

▸ **size**(`w`: number, `h`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |
`h` | number |

**Returns:** *this*

___

###  skew

▸ **skew**(`value`: [Vec2Value](../interfaces/vec2value.md)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](../interfaces/vec2value.md) |

**Returns:** *this*

▸ **skew**(`x`: number, `y`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *this*

___

###  then

▸ **then**(`fn`: [TransitionEndListener](../globals.md#transitionendlistener)): *this*

**`deprecated`** Use .done(fn) instead.

**Parameters:**

Name | Type |
------ | ------ |
`fn` | [TransitionEndListener](../globals.md#transitionendlistener) |

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](../globals.md#transitionoptions)): *[Transition](transition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](../globals.md#transitionoptions) |

**Returns:** *[Transition](transition.md)*

▸ **tween**(`duration?`: number, `delay?`: number): *[Transition](transition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`duration?` | number |
`delay?` | number |

**Returns:** *[Transition](transition.md)*

___

###  width

▸ **width**(`w`: number): *this*

**Parameters:**

Name | Type |
------ | ------ |
`w` | number |

**Returns:** *this*

▸ **width**(): *number*

**Returns:** *number*
