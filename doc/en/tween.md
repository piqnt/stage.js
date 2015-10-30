### Tweening
Tweening is used to apply smooth transitions to pinning values.

```javascript
// Create a tweening entry
// When `append` is true new entry is appended to current entries otherwise replaces them
var tween = node.tween(duration = 400, delay = 0, append = false);

// Set pinning values and start tweening
// Pinning shortcut methods, such as `.scale()`, can also be used
tween.pin(pinning);

// Set easing for tweening, it can be either a function or an identifier
// defined as 'name[-mode][(params)]', for example 'quad' or 'poly-in-out(3)'
// Names: linear, quad, cubic, quart, quint, poly(p), sin/sine, 
//        exp, circle/circ, bounce, elastic(a, p), back(s)
// Modes: in, out, in-out, out-in
tween.ease(easing);

// Set duration in milliseconds
tween.duration(ms);

// Set delay in milliseconds
tween.delay(ms);

// Callback when tweening is done
tween.done(function() {
  // this === node
});

// Remove this node when tweening ends
tween.remove();

// Hide this node when tweening ends
tween.hide();

// Create and chain a new tweening to this entry
var nextTween = tween.tween(duration = 400, delay = 0);
```
