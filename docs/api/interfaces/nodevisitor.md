[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [NodeVisitor](nodevisitor.md)

# Interface: NodeVisitor ‹**D**›

## Type parameters

▪ **D**

## Hierarchy

* **NodeVisitor**

## Index

### Properties

* [end](nodevisitor.md#optional-end)
* [reverse](nodevisitor.md#optional-reverse)
* [start](nodevisitor.md#optional-start)
* [visible](nodevisitor.md#optional-visible)

## Properties

### `Optional` end

• **end**? : *function*

#### Type declaration:

▸ (`node`: [Node](../classes/node.md), `data?`: D): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](../classes/node.md) |
`data?` | D |

___

### `Optional` reverse

• **reverse**? : *boolean*

___

### `Optional` start

• **start**? : *function*

#### Type declaration:

▸ (`node`: [Node](../classes/node.md), `data?`: D): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](../classes/node.md) |
`data?` | D |

___

### `Optional` visible

• **visible**? : *boolean*
