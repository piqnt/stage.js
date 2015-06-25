### Game Loop
Each rendering cycle consist of ticking and drawing application tree.
The application and its nodes can be updated during ticking.
Depending on application activities there can be three follow-up after ticking:

* At least one node is touched: entire application tree will be redrawn and game loop will continue
* No node is touched but at least one ticking function returns `true`: game loop will continue but previous drawing will be retained
* No node is touched and no ticking function returns `true`: the application will pause until it is touched directly or indirectly

Nodes are usually touched indirectly by other actions such as pinning or tree manipulation, but they can also be touched directly.

```javascript
// Register a function to be called on ticking
node.tick(function(millisecElapsed) {
  return continueGameLoop;
}, beforeChildren = false);

// Touch node
node.touch();
```
