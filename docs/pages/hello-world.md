
## Example

```js
// Define and preload a texture
await Stage.atlas({
  image: "digit.png",
  name: "example",
  textures: {
    digit: {
      0: { x: 0 * 8, y: 20, width: 8, height: 8 },
      1: { x: 1 * 8, y: 20, width: 8, height: 8 },
      2: { x: 2 * 8, y: 20, width: 8, height: 8 },
      3: { x: 3 * 8, y: 20, width: 8, height: 8 },
      4: { x: 4 * 8, y: 20, width: 8, height: 8 },
      5: { x: 5 * 8, y: 20, width: 8, height: 8 },
      6: { x: 6 * 8, y: 20, width: 8, height: 8 },
      7: { x: 7 * 8, y: 20, width: 8, height: 8 },
      8: { x: 8 * 8, y: 20, width: 8, height: 8 },
      9: { x: 9 * 8, y: 20, width: 8, height: 8 },
    }
  },
});

// Create and mount a new app
const app = Stage.mount();

// Set view box
app.viewbox(300, 200);

// Create a scores component and append it to app
const score = Stage.monotype("example:digit");
score.appendTo(app);

// Align box to center
score.pin("align", 0.5);

score.setValue(state.clicked);

// keep all game state in one object
const state = {
  clicked: 0;
};

// Add a click event listener
score.on("click", function (point) {

  // Increase clicked count and update the component
  state.clicked += 1;
  score.setValue(state.clicked);

  // Use transition to smoothly resize scale score component
  this.tween()
    .ease("bounce")
    .pin({
      scaleX: Math.random() * 2 + 0.5,
      scaleY: Math.random() * 2 + 0.5,
    });
});
```
