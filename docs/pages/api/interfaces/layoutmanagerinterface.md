
# Interface: LayoutManagerInterface

## Hierarchy

* **LayoutManagerInterface**

## Index

### Methods

* [align](/api/interfaces/layoutmanagerinterface#align)
* [append](/api/interfaces/layoutmanagerinterface#append)
* [empty](/api/interfaces/layoutmanagerinterface#empty)
* [fit](/api/interfaces/layoutmanagerinterface#fit)
* [getBoxHeight](/api/interfaces/layoutmanagerinterface#getboxheight)
* [getBoxWidth](/api/interfaces/layoutmanagerinterface#getboxwidth)
* [getFirst](/api/interfaces/layoutmanagerinterface#getfirst)
* [getHeight](/api/interfaces/layoutmanagerinterface#getheight)
* [getLast](/api/interfaces/layoutmanagerinterface#getlast)
* [getNext](/api/interfaces/layoutmanagerinterface#getnext)
* [getParent](/api/interfaces/layoutmanagerinterface#getparent)
* [getPin](/api/interfaces/layoutmanagerinterface#getpin)
* [getPinProp](/api/interfaces/layoutmanagerinterface#getpinprop)
* [getPrev](/api/interfaces/layoutmanagerinterface#getprev)
* [getTextureTransparency](/api/interfaces/layoutmanagerinterface#gettexturetransparency)
* [getTransform](/api/interfaces/layoutmanagerinterface#gettransform)
* [getTransparency](/api/interfaces/layoutmanagerinterface#gettransparency)
* [getWidth](/api/interfaces/layoutmanagerinterface#getwidth)
* [insertAfter](/api/interfaces/layoutmanagerinterface#insertafter)
* [insertBefore](/api/interfaces/layoutmanagerinterface#insertbefore)
* [maximize](/api/interfaces/layoutmanagerinterface#maximize)
* [minimize](/api/interfaces/layoutmanagerinterface#minimize)
* [prepend](/api/interfaces/layoutmanagerinterface#prepend)
* [remove](/api/interfaces/layoutmanagerinterface#remove)
* [setAlignX](/api/interfaces/layoutmanagerinterface#setalignx)
* [setAlignY](/api/interfaces/layoutmanagerinterface#setaligny)
* [setFirst](/api/interfaces/layoutmanagerinterface#setfirst)
* [setLast](/api/interfaces/layoutmanagerinterface#setlast)
* [setNext](/api/interfaces/layoutmanagerinterface#setnext)
* [setOffsetX](/api/interfaces/layoutmanagerinterface#setoffsetx)
* [setOffsetY](/api/interfaces/layoutmanagerinterface#setoffsety)
* [setParent](/api/interfaces/layoutmanagerinterface#setparent)
* [setPinProp](/api/interfaces/layoutmanagerinterface#setpinprop)
* [setPrev](/api/interfaces/layoutmanagerinterface#setprev)
* [updatePin](/api/interfaces/layoutmanagerinterface#updatepin)

## Methods

###  align

▸ **align**(`component`: [Component](/api/classes/component), `type`: "row" | "column", `align`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`type` | "row" &#124; "column" |
`align` | number |

**Returns:** *void*

___

###  append

▸ **append**(`component`: [Component](/api/classes/component), `child`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  empty

▸ **empty**(`component`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  fit

▸ **fit**(`component`: [Component](/api/classes/component), `width`: number, `height`: number, `mode`: [FitMode](/api/globals#fitmode)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`width` | number |
`height` | number |
`mode` | [FitMode](/api/globals#fitmode) |

**Returns:** *void*

___

###  getBoxHeight

▸ **getBoxHeight**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  getBoxWidth

▸ **getBoxWidth**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  getFirst

▸ **getFirst**(`component`: [Component](/api/classes/component), `visible`: boolean): *[Component](/api/classes/component) | null*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`visible` | boolean |

**Returns:** *[Component](/api/classes/component) | null*

___

###  getHeight

▸ **getHeight**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  getLast

▸ **getLast**(`component`: [Component](/api/classes/component), `visible`: boolean): *[Component](/api/classes/component) | null*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`visible` | boolean |

**Returns:** *[Component](/api/classes/component) | null*

___

###  getNext

▸ **getNext**(`component`: [Component](/api/classes/component), `visible`: boolean): *[Component](/api/classes/component) | null*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`visible` | boolean |

**Returns:** *[Component](/api/classes/component) | null*

___

###  getParent

▸ **getParent**(`component`: [Component](/api/classes/component)): *[Component](/api/classes/component) | null*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *[Component](/api/classes/component) | null*

___

###  getPin

▸ **getPin**(`component`: [Component](/api/classes/component)): *[Pin](/api/classes/pin)*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *[Pin](/api/classes/pin)*

___

###  getPinProp

▸ **getPinProp**(`component`: [Component](/api/classes/component), `key`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`key` | string |

**Returns:** *any*

___

###  getPrev

▸ **getPrev**(`component`: [Component](/api/classes/component), `visible`: boolean): *[Component](/api/classes/component) | null*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`visible` | boolean |

**Returns:** *[Component](/api/classes/component) | null*

___

###  getTextureTransparency

▸ **getTextureTransparency**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  getTransform

▸ **getTransform**(`component`: [Component](/api/classes/component)): *[Matrix](/api/classes/matrix)*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *[Matrix](/api/classes/matrix)*

___

###  getTransparency

▸ **getTransparency**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  getWidth

▸ **getWidth**(`component`: [Component](/api/classes/component)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *number*

___

###  insertAfter

▸ **insertAfter**(`component`: [Component](/api/classes/component), `sibling`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`sibling` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  insertBefore

▸ **insertBefore**(`component`: [Component](/api/classes/component), `sibling`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`sibling` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  maximize

▸ **maximize**(`component`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  minimize

▸ **minimize**(`component`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  prepend

▸ **prepend**(`component`: [Component](/api/classes/component), `child`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`child` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  remove

▸ **remove**(`component`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setAlignX

▸ **setAlignX**(`component`: [Component](/api/classes/component), `value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`value` | number |

**Returns:** *void*

___

###  setAlignY

▸ **setAlignY**(`component`: [Component](/api/classes/component), `value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`value` | number |

**Returns:** *void*

___

###  setFirst

▸ **setFirst**(`component`: [Component](/api/classes/component), `first`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`first` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setLast

▸ **setLast**(`component`: [Component](/api/classes/component), `last`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`last` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setNext

▸ **setNext**(`component`: [Component](/api/classes/component), `next`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`next` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setOffsetX

▸ **setOffsetX**(`component`: [Component](/api/classes/component), `value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`value` | number |

**Returns:** *void*

___

###  setOffsetY

▸ **setOffsetY**(`component`: [Component](/api/classes/component), `value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`value` | number |

**Returns:** *void*

___

###  setParent

▸ **setParent**(`component`: [Component](/api/classes/component), `parent`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`parent` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  setPinProp

▸ **setPinProp**(`component`: [Component](/api/classes/component), `key`: string, `value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`key` | string |
`value` | any |

**Returns:** *void*

___

###  setPrev

▸ **setPrev**(`component`: [Component](/api/classes/component), `prev`: [Component](/api/classes/component)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`prev` | [Component](/api/classes/component) |

**Returns:** *void*

___

###  updatePin

▸ **updatePin**(`component`: [Component](/api/classes/component), `data`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](/api/classes/component) |
`data` | object |

**Returns:** *void*
