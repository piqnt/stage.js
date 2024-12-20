# Type Alias: TextureSelectionInput

> **TextureSelectionInput**: [`TextureSelectionInputOne`](/api/type-aliases/TextureSelectionInputOne) \| [`TextureSelectionInputMap`](/api/type-aliases/TextureSelectionInputMap) \| [`TextureSelectionInputArray`](/api/type-aliases/TextureSelectionInputArray) \| [`TextureSelectionInputFactory`](/api/type-aliases/TextureSelectionInputFactory)

Texture selection input could be one:
- texture
- sprite definition (and an atlas): atlas sprite texture
- string (with an atlas): string used as key to find sprite in the atlas, re-resolve
- hash object: use subquery as key, then re-resolve value
- array: re-resolve first item
- function: call function with subquery, then re-resolve
