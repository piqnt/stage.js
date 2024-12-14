
### Transition

Transition (tweening) is used to apply smooth changes to pinning values.

```javascript
// Start a new transition
const transition = component.tween({
  duration: 400,
  delay: 0,
  append: false,
});

// When `append` is true new entry is appended to current entries otherwise replaces them

// Set pinning values and start transition
// Pinning shortcut methods, such as `.scale()`, can also be used
transition.pin(pinning);

// Set easing function for transition, it can be either a function or an identifier
// defined as 'name[-mode][(params)]', for example 'quad' or 'poly-in-out(3)'
// Names: linear, quad, cubic, quart, quint, poly(p), sin/sine,
//        exp, circle/circ, bounce, elastic(a, p), back(s)
// Modes: in, out, in-out, out-in
transition.ease(easing);

// Set duration in milliseconds
transition.duration(ms);

// Set delay in milliseconds
transition.delay(ms);

// Callback when transition is done
transition.done(function () {
  // this === component
});

// Remove this component when transition ends
transition.remove();

// Hide this component when transition ends
transition.hide();

// Create and chain a new transition to this entry
const nextTransition = transition.tween((duration = 400), (delay = 0));
```
