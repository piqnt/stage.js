[Stage.js API Doc](../README.md) › [Globals](../globals.md) › [AtlasDefinition](atlasdefinition.md)

# Interface: AtlasDefinition

## Hierarchy

* **AtlasDefinition**

## Index

### Properties

* [filter](atlasdefinition.md#optional-filter)
* [image](atlasdefinition.md#optional-image)
* [imagePath](atlasdefinition.md#optional-imagepath)
* [imageRatio](atlasdefinition.md#optional-imageratio)
* [map](atlasdefinition.md#optional-map)
* [name](atlasdefinition.md#optional-name)
* [ppu](atlasdefinition.md#optional-ppu)
* [ratio](atlasdefinition.md#optional-ratio)
* [textures](atlasdefinition.md#optional-textures)
* [trim](atlasdefinition.md#optional-trim)

## Properties

### `Optional` filter

• **filter**? : *function*

**`deprecated`** Use map

#### Type declaration:

▸ (`texture`: [AtlasTextureDefinition](atlastexturedefinition.md)): *[AtlasTextureDefinition](atlastexturedefinition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`texture` | [AtlasTextureDefinition](atlastexturedefinition.md) |

___

### `Optional` image

• **image**? : *object*

#### Type declaration:

* **ratio**? : *number*

* **src**: *string*

* **url**: *string*

___

### `Optional` imagePath

• **imagePath**? : *string*

**`deprecated`** Use map

___

### `Optional` imageRatio

• **imageRatio**? : *number*

**`deprecated`** Use map

___

### `Optional` map

• **map**? : *function*

#### Type declaration:

▸ (`texture`: [AtlasTextureDefinition](atlastexturedefinition.md)): *[AtlasTextureDefinition](atlastexturedefinition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`texture` | [AtlasTextureDefinition](atlastexturedefinition.md) |

___

### `Optional` name

• **name**? : *string*

___

### `Optional` ppu

• **ppu**? : *number*

___

### `Optional` ratio

• **ratio**? : *number*

**`deprecated`** Use ppu

___

### `Optional` textures

• **textures**? : *Record‹string, [AtlasTextureDefinition](atlastexturedefinition.md) | [AtlasTextureReferenceMap](../globals.md#atlastexturereferencemap) | [AtlasTextureReferenceArray](../globals.md#atlastexturereferencearray)›*

___

### `Optional` trim

• **trim**? : *number*

**`deprecated`**
