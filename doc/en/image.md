### Image
An image is a node with one texture.

```javascript
// Create a new image instance
var image = Stage.image(texture);

// Change image texture
image.image(texture);

// Tile/Stretch image when pinning width and/or height
// To define borders add top, bottom, left and right to texture
image.tile();
image.stretch();
```
