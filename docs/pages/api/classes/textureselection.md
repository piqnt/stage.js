
# Class: TextureSelection

TextureSelection holds reference to one or many textures or something that
can be resolved to one or many textures. This is used to decouple resolving
references to textures from rendering them in various ways.

## Hierarchy

* **TextureSelection**

## Index

### Constructors

* [constructor](/api/classes/textureselection#constructor)

### Properties

* [atlas](/api/classes/textureselection#atlas)
* [selection](/api/classes/textureselection#selection)

### Methods

* [array](/api/classes/textureselection#array)
* [one](/api/classes/textureselection#one)

## Constructors

###  constructor

\+ **new TextureSelection**(`selection`: [TextureSelectionInput](/api/globals#textureselectioninput), `atlas?`: [Atlas](/api/classes/atlas)): *[TextureSelection](/api/classes/textureselection)*

**Parameters:**

Name | Type |
------ | ------ |
`selection` | [TextureSelectionInput](/api/globals#textureselectioninput) |
`atlas?` | [Atlas](/api/classes/atlas) |

**Returns:** *[TextureSelection](/api/classes/textureselection)*

## Properties

###  atlas

• **atlas**: *[Atlas](/api/classes/atlas)*

___

###  selection

• **selection**: *[TextureSelectionInput](/api/globals#textureselectioninput)*

## Methods

###  array

▸ **array**(`arr?`: [Texture](/api/classes/texture)[]): *[Texture](/api/classes/texture)[]*

**Parameters:**

Name | Type |
------ | ------ |
`arr?` | [Texture](/api/classes/texture)[] |

**Returns:** *[Texture](/api/classes/texture)[]*

___

###  one

▸ **one**(`subquery?`: string): *[Texture](/api/classes/texture)*

**Parameters:**

Name | Type |
------ | ------ |
`subquery?` | string |

**Returns:** *[Texture](/api/classes/texture)*
