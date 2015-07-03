### String
String is a row of images which are dynamically selected from `frames` using characters of a string `value` (or items of an array `value`).

```javascript
// Create a new string instance with frames
var string = Stage.string(frames);

// Set frames, a string referencing a map in an atlas 
string.frames("digits");

// Set frames, a map with textures as values and frame names as keys 
string.frames({
  '0' : zeroTexture,
  '1' : oneTexture,
  ...
});

// Set frames, a function which takes a char (or item) and returns a texture
string.frames(function(char) {
  // create a texture for char
  return texture;
});

// Set value, it can be a string (or an array)
// Characters (or items) are used to select frames and create a row of images
string.value(value);

// Get assigned value
string.value();
```
