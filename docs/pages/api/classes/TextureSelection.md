# Class: TextureSelection

TextureSelection holds reference to one or many textures or something that
can be resolved to one or many textures. This is used to decouple resolving
references to textures from rendering them in various ways.

## Constructors

### new TextureSelection()

> **new TextureSelection**(`selection`, `atlas`?): [`TextureSelection`](TextureSelection)

#### Parameters

• **selection**: [`TextureSelectionInput`](../type-aliases/TextureSelectionInput)

• **atlas?**: [`Atlas`](Atlas)

#### Returns

[`TextureSelection`](TextureSelection)

## Properties

### atlas

> **atlas**: [`Atlas`](Atlas)

***

### selection

> **selection**: [`TextureSelectionInput`](../type-aliases/TextureSelectionInput)

## Methods

### array()

> **array**(`arr`?): [`Texture`](Texture)[]

#### Parameters

• **arr?**: [`Texture`](Texture)[]

#### Returns

[`Texture`](Texture)[]

***

### one()

> **one**(`subquery`?): [`Texture`](Texture)

#### Parameters

• **subquery?**: `string`

#### Returns

[`Texture`](Texture)
