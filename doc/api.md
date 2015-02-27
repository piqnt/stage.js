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

  // Set view box for root. Valid `mode` values are 'in' and 'out'
  root.viewbox(width, height, mode = "in");

  // Listen to view port resize events
  root.on("viewport", function(viewport) {
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
foo.append(bar, baz, etc);
foo.prepend(bar, baz, etc);

// Append/prepend bar to foo's children
bar.appendTo(foo);
bar.prependTo(foo);

// Insert baz, qux, ... after/before bar
bar.insertNext(baz, qux, etc);
bar.insertPrev(baz, qux, etc);

// Insert baz after/before bar
baz.insertAfter(bar);
baz.insertBefore(bar);

// Remove bar from parent
bar.remove();

// Remove bar, baz, ... from foo
foo.remove(bar, baz, etc);

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

// Iterate over foo's children, `child` can not be remove
for (var child = foo.first(); child; child = child.next()) {
  // use child
}

// Iterate over foo's children, `child` can be remove
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
#### Events

```javascript
// Register a listener to foo. Event `name` can be one or an array of strings or
// spaced separated strings
foo.on(name, listener);

// Unregister a listener from foo.
foo.off(name, listener);

// Get listeners registered to foo
foo.listeners(name);

// Call listeners with args, returns number of called listeners
foo.publish(name, args);
```

#### Ticks
Before every painting the tree is ticked, it is when the app and nodes have
the chance to update. If at least one node is touched during ticking
rendering cycles will continue otherwise it would pause until it is touched.

```javascript
// Register a ticker to be called on ticking
foo.tick(function(millisecElapsed) {
}, beforeChildren = false);

// Rendering pauses unless/until at least one node is touched directly or
// indirectly
foo.touch();
```

#### Pinning
Pinning is a top level concept, it refers to transforming a node relative
to its parent

```javascript
// Get a pinning value
bar.pin(name);
// Set a pinning value
bar.pin(name, value);
// Set one or more pinning values
bar.pin({
  name : value
});

// Transparency
bar.pin({
  // Transparency applied to self and children
  alpha : 1,
  // Transparency applied only to self textures
  textureAlpha : 1
});

// When `nameX` equals `nameY`, `name` shorthand can be used instead

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
// Usually are set automatically depending on node type
bar.pin({
  height : height,
  width : width
});

// Positioning
// For width/height ratio 0 is top/left and 1 is bottom/right
bar.pin({
  // Relative location on self used as scale/skew/rotation center. See handle
  pivotX : 0,
  pivotY : 0,
  // Pin point on parent used for positioning, as ratio of parent width/height
  alignX : 0,
  alignY : 0,
  // Pin point on self used for positioning, defaults to align values,
  // as ratio of aabb or origin (if pivoted) width/height
  handleX : 0,
  handleY : 0,
  // Distance from parent align to self handle in pixel
  offsetX : 0,
  offsetY : 0
});

// Scale to new width/height
// Optionally use "in" and "out" as mode to scale proportionally
bar.pin({
  scaleMode : mode,
  scaleWidth : width,
  scaleHeight : height
});

// Scale to new width/height and then resize to fill width/height
// Optionally use "in" and "out" as mode to scale proportionally
bar.pin({
  resizeMode : mode,
  resizeWidth : width,
  resizeHeight : height
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
// "name[-mode][(params)]", for example "quad" or "poly-in-out(3)".
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

#### Image
An image is a node which pastes a cutout.

```javascript
// Create a new image instance
var image = Cut.image(cutout);

// Change image
image.image(cutout);

// Crop image
image.cropX(w, x = 0);
image.cropY(h, y = 0);

// Tile/Stretch image when pinning width and/or height are changed. To define
// borders use top, bottom, left and right with cutout definition
image.tile();
image.stretch();
```

#### Animation
An anim is a node which have a set of cutouts as frames.

```javascript
// Create a new anim instance
var anim = Cut.anim(cutouts, fps = Cut.Anim.FPS);

// Get or set anim fps
anim.fps();
anim.fps(fps);

// Set anim frames as cutout prefix. See Cutout section for more
anim.frames(cutouts);

// Set anim frames as cutout array. See Cutout section for more
anim.frames(array);

// Go to n-th frame
anim.gotoFrame(n);

// Move n frames
anim.moveFrame(n);

// Get number of frames
anim.length();

// Start playing (from `frame`)
anim.play(frame = null);

// Stop playing (and go to `frame`)
anim.stop(frame = null);

// Play `repeat * length` frames and then stop and call callback
anim.repeat(repeat, callback = null);
```

#### Row and Column
A row/column is a node which organizes its children as a horizontal/vertical
sequence.

```javascript
// Create a new row/column
var row = Cut.row(childrenVerticalAlign = 0);
var column = Cut.column(childrenHorizontalAlign = 0);

// Add spacing between row/column cells
row.spacing(space);
```

#### String
String is a row of images, but images are dynamically assigned using frames
and value.

```javascript
// Create a new string instance
var string = Cut.string(cutouts);

// Value is a string or array, each char/item is used to create an image using
// frames
string.value(value);

// Set string frames as cutout prefix. See Cutout section for more
string.frames(cutouts);

// Set string frames. 'factory' func takes a char/item and return a cutout
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

#### Textures and Cutouts
Image cutouts are used to refrence graphics to be painted.

```javascript
// Cutouts are usually added to an app by adding textures
Cut({
  name : textureName, // optional
  imagePath : textureImagePath,
  imageRatio : 1,
  cutouts : [ { // list of cutoutDefs or cutouts
    name : cutoutName,
    x : x,
    y : y,
    width : width,
    height : height,
    top : 0,
    bottom : 0,
    left : 0,
    right : 0
  }, etc ],

  // `cutouts` are passed through `map`, they can be modifed here
  map : function(cutoutDef) {
    return cutoutDef;
  },

  // `factory` is called when a cutoutName is not found in `cutouts`
  factory : function(cutoutName) {
    // Dynamically create a cutoutDef or cutout
    return cutoutDef; // or cutout
  }
}, etc);

// Then texture cutouts can be referenced in your app
// Note that `textureName:` is optional

// Single selection:
Cut.image("textureName:cutoutName");
// Multiple selection:
Cut.anim("textureName:cutoutPrefix");
Cut.string("textureName:cutoutPrefix");
```

#### Drawing (experimental)

```javascript
// Cutouts can also be created using Canvas drawing
cutout = Cut.Out.drawing(width, height, ratio = 1, function(context, ratio) {
  // context is a 2D Canvas context created using width and height
  // this === create cutout
});

// It can be use to create an image for example:
Cut.image(Cut.Out.drawing(params));

// There is also a shorthand for that
Cut.drawing(params);

// Canvas drawing can also be used in `texture.cutout` and `texture.factory` to
// creat cutouts instead of using cutoutDef
Cut({
  name : textureName,

  cutouts : [ Cut.Out.drawing(), etc ],

  factory : function(cutoutName) {
    return Cut.Out.drawing();
  }
}, etc);
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
Cut.Mouse.CLICK = "click";
Cut.Mouse.START = "touchstart mousedown";
Cut.Mouse.MOVE = "touchmove mousemove";
Cut.Mouse.END = "touchend mouseup";
Cut.Mouse.CANCEL = "touchcancel";
```
