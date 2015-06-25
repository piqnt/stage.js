### Mouse and Touch
Native mouse and touch events are captured, processed and published to application nodes.
Nodes receive mouse events in local coordinate, that is mouse location is specified as distance to top-left of the node.

```javascript
// Add click listener to node
node.on('click', function(point) {
  // point.x and point.y are relative to this node left and top
  // point.raw is original event
});
```

Instead of native click events, syntatic click events are created and published to nodes.
In addition to standard event types, syntatic `mousecancel` event type is also supported which is similar to `touchcancel` but is published when a `mousedown` is not followed by `mouseup`.

```javascript
// Mouse events:
Stage.Mouse.CLICK = 'click';
Stage.Mouse.START = 'touchstart mousedown';
Stage.Mouse.MOVE = 'touchmove mousemove';
Stage.Mouse.END = 'touchend mouseup';
Stage.Mouse.CANCEL = 'touchcancel mousecancel';
```
