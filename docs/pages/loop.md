
### Game Loop

Each rendering cycle consists of ticking and redrawing the application tree.
An application and its components can be updated during ticking.
Depending on application activities there can be three different follow-ups after ticking:

- If at least one component is touched then the entire application tree will be redrawn and the game loop will continue.
- If no component is touched but at least one ticking function returns `true` then the game loop will continue but the previous drawing will be retained.
- If no component is touched and no ticking function returns `true` then the application will pause until it is touched directly or indirectly.

Components can be touched directly by calling `component.touch()` but usually they are touched indirectly by other actions such as pinning or tree manipulation.

```javascript
// Register a function to be called on ticking
component.tick(
  function (millisecElapsed) {
    return continueGameLoop;
  },
  (beforeChildren = false),
);

// Touch component
component.touch();
```
