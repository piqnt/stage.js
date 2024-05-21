## Setup

An application is created by calling `Stage.mount()`.
It creates and sets up the root component with a canvas element, starts rendering, and returns the root component.

```javascript
// Create and start an application (with a default full page canvas)
const stage = Stage.mount();

// Create and start an application with a custom canvas element
const stage = Stage.mount({
  canvas: document.getElementById("game-canvas"),
});

// Set viewbox for stage, see pinning for valid modes
stage.viewbox(width, height, (mode = "in-pad"));

// Listen to view port resize events
stage.on("viewport", function (viewport) {
  // `viewport` properties are `width`, `height` and `ratio`
});

// Pause playing
stage.pause();

// Resume playing
stage.resume();
```

## Global Methods

```javascript

// Mount and start a new app
let stage = Stage.mount();

// Create and preload a texture atlas
Stage.atlas({ ... });

// Pause playing all applications
Stage.pause();

// Resume playing all applications
Stage.resume();
```
