### Application
An application is created by passing a callback function to `Stage()`.
The library will load, create and initialize all required components and then will call the provided function with the application root node and display container which normally is a Canvas element.

```javascript
// Create and start an application
Stage(function(stage, display) {

  // Set viewbox for stage, see pinning for valid modes
  stage.viewbox(width, height, mode = 'in-pad');

  // Listen to view port resize events
  stage.on('viewport', function(viewport) {
    // `viewport` attributes are `width`, `height` and `ratio`
  });

  // Pause playing
  stage.pause();

  // Resume playing
  stage.resume();
});
```
