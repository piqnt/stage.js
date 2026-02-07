# Function: atlas()

> **atlas**(`def`): `Promise`\<[`Atlas`](/api/classes/Atlas)\>

Register and load an atlas.
If the atlas is already loaded, it is returned immediately.
Otherwise, it returns a promise that resolves when the atlas is loaded.

You can call this without awaiting the promise, and call `preload()` at the beginning of the app to ensure all atlases are loaded before they are used.

## Parameters

• **def**: [`AtlasDefinition`](/api/interfaces/AtlasDefinition) \| [`Atlas`](/api/classes/Atlas)

## Returns

`Promise`\<[`Atlas`](/api/classes/Atlas)\>
