### Math
Stage.Math extends native Math class and adds few useful methods.

```js
// Generate a random value between `min` and `max`
// Same as: `random() * (max - min) + min`
Stage.Math.random(min = 0, max);

// Limit `num` between `min` and `max`
// Example: `limit(195, 0, 180)` returns `180`
// Same as: `num < min ? min : (num > max ? max : num)`
Stage.Math.limit(num, min, max);

// Rotate `num` between `min` and `max`
// Example: `rotate(450, 0, 360)` returns `90`
// Similar to: `min + (num - min) % (max - min)`
Stage.Math.rotate(num, min = 0, max);
```
