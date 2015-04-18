#### Application

```javascript
// Create and start an application
Cut(function(root, element) {
  // `root` is the root node for this application
  // `element` is the actual element displaying rendered graphics

  // Pause playing
  root.pause();

  // Resume playing
  root.resume();

  // Set viewbox for root, valid modes are 'in', 'in-pad', 'out' and 'out-crop'
  root.viewbox(width, height, mode = 'in-pad');

  // Listen to view port resize events
  root.on('viewport', function(viewport) {
    // `viewport` attributes are `width`, `height` and `ratio`
  });
});
```

#### Tree Model
Every app consists of a tree, tree's root is create by the library.

```javascript
// Create a new node instance (with no textures)
var foo = Cut.create();

// Append/prepend bar, baz, ... to foo's children
foo.append(bar, baz, ...);
foo.prepend(bar, baz, ...);

// Append/prepend bar to foo's children
bar.appendTo(foo);
bar.prependTo(foo);

// Insert baz, qux, ... after/before bar
bar.insertNext(baz, qux, ...);
bar.insertPrev(baz, qux, ...);

// Insert baz after/before bar
baz.insertAfter(bar);
baz.insertBefore(bar);

// Remove bar from parent
bar.remove();

// Remove bar, baz, ... from foo
foo.remove(bar, baz, ...);

// Remove all foo's children
foo.empty();

// Get foo's first/last (visible) child
foo.first(visible = false);
foo.last(visible = false);

// Get immediate parent
bar.parent();

// Get bar's next/prev (visible) sibling
bar.next(visible = false);
bar.prev(visible = false);

// Get bar's visiblity
bar.visible();
// Set bar's visiblity
bar.visible(visible);
bar.hide();
bar.show();

// Iterate over foo's children, `child` can not be removed
for (var child = foo.first(); child; child = child.next()) {
  // use child
}

// Iterate over foo's children, `child` can be removed
var child, next = foo.first();
while (child = next) {
  next = child.next();
  // use child
}

// Visit foo's sub-tree including foo
foo.visit({
  start : function(node) {
    return skipChildren;
  },
  end : function(node) {
    return stopVisit;
  },
  reverse : reverseChildrenOrder = false,
  visible : onlyVisibleNodes = false
});
```

#### Game Loop
Each rendering cycle consist of ticking and drawing application tree.
The application and its nodes can be updated on ticking.

If at least one node is touched during ticking the application tree will be redrawn and game loop will continue
If no node is touched but at least one ticking function returns `true` game loop will continue but previous drawing will be retained.
Otherwise the application will pause until it is touched directly or indirectly.

Nodes are usually touched indirectly by other actions such as pinning or tree manipulation,
but they can also be touched directly.

```javascript
// Register a function to be called on ticking
foo.tick(function(millisecElapsed) {
  return continueGameLoop;
}, beforeChildren = false);

// Touch foo
foo.touch();
```

#### Pinning
Pinning is a top level concept, it specifies how a node is transformed relative to its parent.

When `nameX` equals `nameY`, `name` shorthand can be used instead.

```javascript
// Get a pinning value
bar.pin(name);
// Set a pinning value
bar.pin(name, value);
// Set one or more pinning values
bar.pin({
  name : value
});

// Transformation
// `rotation` is applied after scale and skew
bar.pin({
  scaleX : 1,
  scaleY : 1,
  skewX : 0,
  skewY : 0,
  rotation : 0
});

// Size
// For some nodes, such as images, it is set automatically
bar.pin({
  height : height,
  width : width
});

// Positioning
// For values defined as ratio of width/height, 0 is top/left and 1 is bottom/right
bar.pin({
  // Pin point on parent used for positioning
  // Defined as ratio of parent's width/height
  alignX : 0,
  alignY : 0,
  // Pin point on self used for positioning
  // Defined as ratio of AABB or base width/height if pivoted
  // Defaults to align values
  handleX : 0,
  handleY : 0,
  // Distance from align point on parent to handle point on self in pixel
  offsetX : 0,
  offsetY : 0,
  // Relative location on self used as scale/skew/rotation center, see handle
  pivotX : 0,
  pivotY : 0
});
// To summarize it, child's distance from parent's top-left is:
// align * parentSize - handle * selfSize + offset

// Transparency
bar.pin({
  // Transparency applied to self and children
  alpha : 1,
  // Transparency applied only to self textures
  textureAlpha : 1
});

// Scale to new width/height, if mode is set scale proportionally
// Valid modes are 'in', 'in-pad', 'out' and 'out-crop'
bar.pin({
  scaleMode : mode,
  scaleWidth : width,
  scaleHeight : height
});
```

#### Events

```javascript
// Register a listener to foo
// Event `name` can be one or an array of strings or spaced separated strings
foo.on(name, listener);

// Unregister a listener from foo.
foo.off(name, listener);

// Get listeners registered to foo
foo.listeners(name);

// Call listeners with args, returns number of called listeners
foo.publish(name, args);
```

#### Mouse and Touch
Mouse class is used to capture mouse and touch events.

```javascript
// Add click listener to bar
bar.on(Cut.Mouse.CLICK, function(point) {
  // point.x and point.y are relative to this node left and top
  // point.raw is original event
  return trueToStopPropagating;
});

// Mouse events:
Cut.Mouse.CLICK = 'click';
Cut.Mouse.START = 'touchstart mousedown';
Cut.Mouse.MOVE = 'touchmove mousemove';
Cut.Mouse.END = 'touchend mouseup';
Cut.Mouse.CANCEL = 'touchcancel';
```

#### Texture
Textures are drawable objects which are used by tree nodes to draw graphics on the Canvas surface.

#### Texture Atlas
A texture atlas (sprite sheet) consists of a set of named textures which are referenced by name in the application.

Atlases are usually created using static image files. Images referenced in atlases are automatically preloaded.

```javascript
// Adding texture atlas
Cut({
  name : 'mario', // optional
  image : {
    src : 'mario.png',
    ratio : 1, // optional, for high res images
  }
  textures : {
    stand : { x : 0,   y : 0, width : 40, height : 60 },
    walk : [
      { x : 40,  y : 0, width : 40, height : 60 },
      { x : 80,  y : 0, width : 40, height : 60 },
      { x : 120, y : 0, width : 40, height : 60 }
    ],
    number : {
      '0' : { x : 0,  y : 60, width : 10, height : 14 },
      '1' : { x : 10, y : 60, width : 10, height : 14 },
      '2' : { x : 20, y : 60, width : 10, height : 14 },
      '3' : { x : 30, y : 60, width : 10, height : 14 },
      '4' : { x : 40, y : 60, width : 10, height : 14 },
      '5' : { x : 50, y : 60, width : 10, height : 14 },
      '6' : { x : 60, y : 60, width : 10, height : 14 },
      '7' : { x : 70, y : 60, width : 10, height : 14 },
      '8' : { x : 80, y : 60, width : 10, height : 14 },
      '9' : { x : 90, y : 60, width : 10, height : 14 }
    }
  }
});

Cut.image('mario:stand');

Cut.anim('mario:walk');

Cut.string('mario:number');
```

#### Image
An image is a node with one texture.

```javascript
// Create a new image instance
var image = Cut.image(texture);

// Change image texture
image.image(texture);

// Tile/Stretch image when pinning width and/or height
// To define borders add top, bottom, left and right to texture
image.tile();
image.stretch();
```

#### Animation
An animation is a node with an array of textures as frames.

```javascript
// Create a new anim instance
var anim = Cut.anim(textures, fps = 15);

// Get or set animation frame per second
anim.fps();
anim.fps(fps);

// Set anim frames, `textures` can be array or a selector
anim.frames(textures);

// Go to n-th frame
anim.gotoFrame(n);

// Move n frames forward or backward if n is negative
anim.moveFrame(n);

// Get number of frames
anim.length();

// Start playing (from `frame`)
anim.play(frame = null);

// Stop playing (and jump to `frame`)
anim.stop(frame = null);

// Play `repeat * length` frames and then stop and call `callback`
anim.repeat(repeat, callback = null);
```

#### Row and Column
A row/column is a node which organizes its children as a horizontal/vertical sequence.

```javascript
// Create a new row/column
var row = Cut.row(childrenVerticalAlign = 0);
var column = Cut.column(childrenHorizontalAlign = 0);

// Make foo a row/column
foo.row(childrenVerticalAlign = 0);
foo.column(childrenHorizontalAlign = 0);

// Add spacing between row/column cells
foo.spacing(space);
```

#### String
String is a row of images, but images are dynamically created using `frames` and `value`.

```javascript
// Create a new string instance
var string = Cut.string(textures);

// Value is a string or array, each char/item is used to create an image using
// frames
string.value(value);

// Set an array of named textures as frames
string.frames([texture, ...]);

// Use a function to dynamicly create string frames
string.frames(function(charOrItem) {
  return texture;
});
```

#### Box (experimental)
A box resizes to wrap its children. It can be applied to tiled/stretched
images to create variable size components such as windows and buttons.

```javascript
// Create a new box
var box = Cut.box();

// Make foo a box
foo = foo.box();
```

#### Tweening
Tweening can only be applied to pinning values.

```javascript
// Create a tweening entry
var tween = foo.tween(duration = 400, delay = 0);

// Stop and clear tweening queue
tween.clear(jumpToEnd = false);

// Set pinning values and start tweening
tween.pin(pinning);

// Set easing for tweening, it can be either a function or an identifier
// defined as 'name[-mode][(params)]', for example 'quad' or 'poly-in-out(3)'
tween.ease(easing);

// Available easing names are: linear, quad, cubic, quart, quint, poly(p),
// sin/sine, exp, circle/circ, bounce, elastic(a, p), back(s)
// Available easing modes are: in, out, in-out, out-in

// Callback when tweening is over
tween.then(function() {
  // this === foo
});

// Add another tweening to the queue
var nextTween = tween.tween(duration = 400, delay = 0);
```

#### Global Methods
```javascript

// Create a new app
Cut(function(root, element) { });

// Create and preload a texture atlas
Cut({ });

// A function to be called before starting any app
// Can be used for preloading application assets
Cut.preload(function(done) {
  // Call `done` when loaded or failed
  done(error);
});

// Start loading and playing all applications
// Called inernally by a platform loader
Cut.start(config);

// Pause playing all applications
// Called inernally by a platform loader
Cut.pause();

// Resume playing all applications
// Called inernally by a platform loader
Cut.resume();

```
