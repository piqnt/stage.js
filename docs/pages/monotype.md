
### Monotype

Monotype is a row of textures that are dynamically selected from `frames` using characters of a string, or items of an array.

```javascript
// Create a new monotype instance with frames
const monotype = Stage.monotype(frames);

// Set frames, a string referencing a map in an atlas
monotype.frames("digits");

// Set frames, a map with textures as values and frame names as keys
monotype.frames({
  '0' : zeroTexture,
  '1' : oneTexture,
  ...
});

// Set frames, a function which takes a char (or item) and returns a texture
monotype.frames(function(char) {
  // create a texture for char
  return texture;
});

// Set value, it can be a string (or an array)
// Characters (or items) are used to select frames and create a row of images
monotype.value(value);

// Get assigned value
monotype.value();
```
