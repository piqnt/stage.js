
### Events

Event listeners can be registered and unregistered to components, listeners are called when an event is published to an component.
Some events may be published to multiple components, but events do not propagate by default.

```javascript
// Register a listener to component
// Event `name` can be one or an array of strings or spaced separated strings
component.on(name, listener);

// Unregister a listener from component.
component.off(name, listener);

// Get listeners registered to component
// Returns an array or undefined
component.listeners(name);

// Call listeners with args
// Returns number of listeners called
component.publish(name, args);
```

### Pointer Events

Native mouse and touch events are captured, processed and published to application components.
Components receive mouse events in local coordinates, i.e. mouse location is specified as the distance to the top-left of the component.

```javascript
// Add click listener to component
component.on("click", function (point) {
  // point.x and point.y are relative to this component left and top
  // point.raw is original event
});
```

Instead of native click events, synthetic click events are created and published to components.
In addition to standard event types, a synthetic `mousecancel` event type is also supported which is similar to `touchcancel` but is published when a `mousedown` is not followed by `mouseup`.

```javascript
// Mouse events:
Stage.POINTER_CLICK = "click";
Stage.POINTER_START = "touchstart mousedown";
Stage.POINTER_MOVE = "touchmove mousemove";
Stage.POINTER_END = "touchend mouseup";
Stage.POINTER_CANCEL = "touchcancel mousecancel";
```
