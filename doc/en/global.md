### Global Methods
```javascript

// Create a new app
Stage(function(stage, display) { });

// Create and preload a texture atlas
Stage({ });

// A function to be called before starting any app
// Can be used for preloading application assets
Stage.preload(function(done) {
  // Call `done` when loaded or failed
  done(error);
});

// Preload and execute a JS file
// URLs starting with `./` are resolved relative to current script URL
Stage.preload(src);

// Pause playing all applications
Stage.pause();

// Resume playing all applications
Stage.resume();
```
