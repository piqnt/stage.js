### Setup

An application is created by calling `Stage.mount()`.
This will set up the root component with a canvas element, start the application, and return the root component.

```javascript
// Create and start an application (with a default full page canvas)
const app = Stage.mount();

// Create and start an application with a custom canvas element
const app = Stage.mount({
  canvas: document.getElementById("game-canvas"),
});

// Set viewbox for stage, see pinning for valid modes
app.viewbox(width, height, (mode = "in-pad"));

// Listen to view port resize events
app.on("viewport", function (viewport) {
  // `viewport` attributes are `width`, `height` and `ratio`
});

// Pause playing
app.pause();

// Resume playing
app.resume();
```


### Global Methods

```javascript

// Mount and start a new app
let app = Stage.mount();

// Create and preload a texture atlas
Stage.atlas({ ... });

// Pause playing all applications
Stage.pause();

// Resume playing all applications
Stage.resume();
```
