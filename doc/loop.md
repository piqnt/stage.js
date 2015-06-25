### Game Loop
Each rendering cycle consists of ticking and redrawing application tree.
Application and its nodes can be updated during ticking.
Depending on application activities there can be three different follow-ups after ticking:

* If at least one node is touched then entire application tree will be redrawn and game loop will continue.
* If no node is touched but at least one ticking function returns `true` then game loop will continue but previous drawing will be retained.
* If no node is touched and no ticking function returns `true` then application will pause until it is touched directly or indirectly.

Nodes can be touched directly by calling `node.touch()` but usually they are touched indirectly by other actions such as pinning or tree manipulation.

```javascript
// Register a function to be called on ticking
node.tick(function(millisecElapsed) {
  return continueGameLoop;
}, beforeChildren = false);

// Touch node
node.touch();
```
