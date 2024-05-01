
# Interface: AtlasDefinition

## Hierarchy

* **AtlasDefinition**

## Index

### Properties

* [filter](/api/interfaces/atlasdefinition#optional-filter)
* [image](/api/interfaces/atlasdefinition#optional-image)
* [imagePath](/api/interfaces/atlasdefinition#optional-imagepath)
* [imageRatio](/api/interfaces/atlasdefinition#optional-imageratio)
* [map](/api/interfaces/atlasdefinition#optional-map)
* [name](/api/interfaces/atlasdefinition#optional-name)
* [ppu](/api/interfaces/atlasdefinition#optional-ppu)
* [ratio](/api/interfaces/atlasdefinition#optional-ratio)
* [textures](/api/interfaces/atlasdefinition#optional-textures)
* [trim](/api/interfaces/atlasdefinition#optional-trim)

## Properties

### `Optional` filter

• **filter**? : *function*

**`deprecated`** Use map

#### Type declaration:

▸ (`texture`: [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition)): *[AtlasTextureDefinition](/api/interfaces/atlastexturedefinition)*

**Parameters:**

Name | Type |
------ | ------ |
`texture` | [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition) |

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

▸ (`texture`: [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition)): *[AtlasTextureDefinition](/api/interfaces/atlastexturedefinition)*

**Parameters:**

Name | Type |
------ | ------ |
`texture` | [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition) |

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

• **textures**? : *Record‹string, [AtlasTextureDefinition](/api/interfaces/atlastexturedefinition) | [AtlasTextureReferenceMap](/api/globals#atlastexturereferencemap) | [AtlasTextureReferenceArray](/api/globals#atlastexturereferencearray)›*

___

### `Optional` trim

• **trim**? : *number*

**`deprecated`**
