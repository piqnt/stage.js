[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [TextureSelection](textureselection.md)

# Class: TextureSelection

TextureSelection holds reference to one or many textures or something that
can be resolved to one or many textures. This is used to decouple resolving
references to textures from rendering them in various ways.

## Hierarchy

* **TextureSelection**

## Index

### Constructors

* [constructor](textureselection.md#constructor)

### Properties

* [atlas](textureselection.md#atlas)
* [selection](textureselection.md#selection)

### Methods

* [array](textureselection.md#array)
* [one](textureselection.md#one)

## Constructors

###  constructor

\+ **new TextureSelection**(`selection`: [TextureSelectionInput](../globals.md#textureselectioninput), `atlas?`: [Atlas](atlas.md)): *[TextureSelection](textureselection.md)*

**Parameters:**

Name | Type |
------ | ------ |
`selection` | [TextureSelectionInput](../globals.md#textureselectioninput) |
`atlas?` | [Atlas](atlas.md) |

**Returns:** *[TextureSelection](textureselection.md)*

## Properties

###  atlas

• **atlas**: *[Atlas](atlas.md)*

___

###  selection

• **selection**: *[TextureSelectionInput](../globals.md#textureselectioninput)*

## Methods

###  array

▸ **array**(`arr?`: [Texture](texture.md)[]): *[Texture](texture.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`arr?` | [Texture](texture.md)[] |

**Returns:** *[Texture](texture.md)[]*

___

###  one

▸ **one**(`subquery?`: string): *[Texture](texture.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subquery?` | string |

**Returns:** *[Texture](texture.md)*
