
### Sprite

A sprite is an component with one texture.

```javascript
// Create a new sprite instance
let sprite = Stage.sprite(texture);

// Change sprite texture
sprite.image(texture);

// Tile/Stretch sprite when pinning width and/or height
// To define borders add top, bottom, left and right to texture
sprite.tile();
sprite.stretch();
```
