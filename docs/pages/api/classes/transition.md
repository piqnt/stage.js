
# Class: Transition

## Hierarchy

* **Transition**

## Implements

* Pinned

## Index

### Constructors

* [constructor](/api/classes/transition#constructor)

### Methods

* [alpha](/api/classes/transition#alpha)
* [clear](/api/classes/transition#clear)
* [delay](/api/classes/transition#delay)
* [done](/api/classes/transition#done)
* [duration](/api/classes/transition#duration)
* [ease](/api/classes/transition#ease)
* [height](/api/classes/transition#height)
* [hide](/api/classes/transition#hide)
* [offset](/api/classes/transition#offset)
* [pin](/api/classes/transition#pin)
* [remove](/api/classes/transition#remove)
* [rotate](/api/classes/transition#rotate)
* [scale](/api/classes/transition#scale)
* [size](/api/classes/transition#size)
* [skew](/api/classes/transition#skew)
* [then](/api/classes/transition#then)
* [tween](/api/classes/transition#tween)
* [width](/api/classes/transition#width)

## Constructors

###  constructor

\+ **new Transition**(`owner`: [Node](/api/classes/node), `options`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`owner` | [Node](/api/classes/node) | - |
`options` | [TransitionOptions](/api/globals#transitionoptions) | {} |

**Returns:** *[Transition](/api/classes/transition)*

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

▸ **done**(`fn`: [TransitionEndListener](/api/globals#transitionendlistener)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | [TransitionEndListener](/api/globals#transitionendlistener) |

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

▸ **ease**(`easing`: [EasingFunctionName](/api/globals#easingfunctionname) | [EasingFunction](/api/globals#easingfunction)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`easing` | [EasingFunctionName](/api/globals#easingfunctionname) &#124; [EasingFunction](/api/globals#easingfunction) |

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

▸ **offset**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

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

▸ **scale**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

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

▸ **skew**(`value`: [Vec2Value](/api/interfaces/vec2value)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vec2Value](/api/interfaces/vec2value) |

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

▸ **then**(`fn`: [TransitionEndListener](/api/globals#transitionendlistener)): *this*

**`deprecated`** Use .done(fn) instead.

**Parameters:**

Name | Type |
------ | ------ |
`fn` | [TransitionEndListener](/api/globals#transitionendlistener) |

**Returns:** *this*

___

###  tween

▸ **tween**(`opts?`: [TransitionOptions](/api/globals#transitionoptions)): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`opts?` | [TransitionOptions](/api/globals#transitionoptions) |

**Returns:** *[Transition](/api/classes/transition)*

▸ **tween**(`duration?`: number, `delay?`: number): *[Transition](/api/classes/transition)*

**Parameters:**

Name | Type |
------ | ------ |
`duration?` | number |
`delay?` | number |

**Returns:** *[Transition](/api/classes/transition)*

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
