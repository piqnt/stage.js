#### Application

```javascript
// Create an app with root node and canvas element
Cut(function(root, canvas) {
  // Your apps goes here, add nodes to the `root`
  // `canvas` is the actual element displaying rendered graphics

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
// Create new plain node instance. No painting is associated with a plain node,
// it is just a parent for other nodes
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

// Visit foo's sub-tree
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

#### Ticks
In each rendering cycle and before painting, entire application tree is ticked.
The application and nodes can be update on ticking.
If at least one node is touched during ticking, rendering cycles will continue otherwise it will pause until it is touched.

```javascript
// Register a ticker to be called on ticking
foo.tick(function(millisecElapsed) {}, beforeChildren = false);

// Rendering pauses unless/until at least one node is touched directly or
// indirectly
foo.touch();
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
// Subscribe root to Mouse events
Cut.Mouse(root, canvas);

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

#### Tweening
Tweening can only be applied to pinning values.

```javascript
// Create a tweening entry
var tween = foo.tween(duration = 400, delay = 0);

// Stop and clear tweening queue
tween.clear(jumpToEnd = false);

// Set pinning values and start tweening
tween.pin(pinning);

// Set easing for tweening, it can be either a function or an identifier as
// 'name[-mode][(params)]', for example 'quad' or 'poly-in-out(3)'.
tween.ease(easing);

// Available names are: linear, quad, cubic, quart, quint, poly(p),
// sin/sine, exp, circle/circ, bounce, elastic(a, p), back(s)
// Available modes are: in, out, in-out, out-in

// Callback when tweening is over
tween.then(function() {
  // this === foo
});

// Add another tweening to queue
var nextTween = tween.tween(duration = 400, delay = 0);
```

#### Texture and Cutout
Application graphics are defined as cutout (sprites) and usually created by adding textures (sprite sheet).

```javascript
// Adding texture
Cut({
  name : textureName, // optional
  imagePath : textureImagePath,
  imageRatio : 1,
  cutouts : [ {
    name : cutoutName,
    x : x,
    y : y,
    width : width,
    height : height,
    top : 0,
    bottom : 0,
    left : 0,
    right : 0
  }, ... ],

  // `cutouts` are passed through `map`, they can be modifed here
  map : function(cutout) {
    return cutout;
  },

  // `factory` is called when a cutoutName is not found in `cutouts`
  factory : function(cutoutName) {
    // Dynamically create a cutout
    return cutout;
  }
}, ...);
```

After registering a texture, its cutouts can be referenced and used by name. Note that `textureName:` is optional.

```javascript
// Single selection:
Cut.image('textureName:cutoutName');

// Multiple selection:
Cut.anim('textureName:cutoutPrefix');
Cut.string('textureName:cutoutPrefix');
```

#### Image
An image is a node with one cutout.

```javascript
// Create a new image instance
var image = Cut.image(cutout);

// Change image
image.image(cutout);

// Crop image
image.cropX(w, x = 0);
image.cropY(h, y = 0);

// Tile/Stretch image when pinning width and/or height. To define
// borders use top, bottom, left and right with cutout definition
image.tile();
image.stretch();
```

#### Animation
An animation (clip) is a node which have a set of cutouts as frames.

```javascript
// Create a new anim instance
var anim = Cut.anim(cutouts, fps = Cut.Anim.FPS);

// Get or set frame per second
anim.fps();
anim.fps(fps);

// Set anim frames as cutout prefix, see Cutout section for more
anim.frames("[textureName:]cutoutPrefix");

// Set anim frames as cutout array
anim.frames([cutout, ...]);

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

// Play `repeat * length` frames and then stop and call back
anim.repeat(repeat, callback = null);
```

#### Row and Column
A row/column is a node which organizes its children as a horizontal/vertical
sequence.

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
var string = Cut.string(cutouts);

// Value is a string or array, each char/item is used to create an image using
// frames
string.value(value);

// Set string frames, see Cutout section for more
string.frames(cutouts);

// Use a function to dynamicly create string frames
string.frames(function(charOrItem) {
  return cutout;
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

// Add padding around box
box.padding(pad);
```

#### Drawing (experimental)
Cutouts can also be created using Canvas API instead of image textures, they can be used with image and anim nodes.

```javascript
// Create a drawing cutout
var cutout = Cut.Out.drawing(function(context, ratio) {
  // this === cutout

  // Set available drawing size and initial cutout size
  // This method sets associate Canvas size and clears it 
  // Returns the same cutout object
  this.size(width, height, ratio = 1);
});

// A drawing cutout can be used to create an image node
var image = Cut.image(cutout);

// There is a shorthand for creating images using drawing cutout
var image = Cut.drawing(drawingFunction);

// A drawing can also be used in textures
Cut({
  cutouts : [ Cut.Out.drawing(), ... ],
  factory : function(name) {
    return Cut.Out.drawing();
  }
});
```
