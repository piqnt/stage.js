# Class: TextureSelection

TextureSelection holds reference to one or many textures or something that
can be resolved to one or many textures. This is used to decouple resolving
references to textures from rendering them in various ways.

## Constructors

### new TextureSelection()

> **new TextureSelection**(`selection`, `atlas`?): [`TextureSelection`](/api/classes/TextureSelection)

#### Parameters

• **selection**: [`TextureSelectionInput`](/api/type-aliases/TextureSelectionInput)

• **atlas?**: [`Atlas`](/api/classes/Atlas)

#### Returns

[`TextureSelection`](/api/classes/TextureSelection)

## Properties

### atlas

> **atlas**: [`Atlas`](/api/classes/Atlas)

***

### selection

> **selection**: [`TextureSelectionInput`](/api/type-aliases/TextureSelectionInput)

## Methods

### array()

> **array**(`arr`?): [`Texture`](/api/classes/Texture)[]

#### Parameters

• **arr?**: [`Texture`](/api/classes/Texture)[]

#### Returns

[`Texture`](/api/classes/Texture)[]

***

### one()

> **one**(`subquery`?): [`Texture`](/api/classes/Texture)

#### Parameters

• **subquery?**: `string`

#### Returns

[`Texture`](/api/classes/Texture)
