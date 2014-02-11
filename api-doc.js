//
// ### Cut
// The tree nodes are called cut.

// Create new plain cut instance.
// No painting is associated with a plain cut, it is just a parent for other cuts.
var foo = Cut.create();

// Append/prepend bar, baz, ... to foo's children.
foo.append(bar, baz, etc);
foo.prepend(bar, baz, etc);

// Append/prepend bar to foo's children.
bar.appendTo(foo);
bar.prependTo(foo);

// Insert baz, qux, ... after/before bar.
bar.insertNext(baz, qux, etc);
bar.insertPrev(baz, qux, etc);

// Insert baz after/before bar.
baz.insertAfter(bar);
baz.insertBefore(bar);

// Remove bar from parent.
bar.remove();

// Remove bar, baz, ... from foo.
foo.remove(bar, baz, etc);

// Remove all foo's children.
foo.empty();

// Get foo's first/last (visible) child.
foo.first(visible = false);
foo.last(visible = false);

// Get immediate parent.
bar.parent();

// Get bar's next/prev (visible) sibling.
bar.next(visible = false);
bar.prev(visible = false);

// Get bar's visiblity.
bar.visible();
// Set bar's visiblity.
bar.visible(visible);
bar.hide();
bar.show();

// Register a ticker to be called on ticking (before painting).
// It can be used to modify the cut.
foo.tick(ticker, beforeChildren = false);

// Register a type-listener to bar.
// `type` can be array or spaced string of multiple values.
foo.on(type, listener);

// Get type-listeners registered to bar.
foo.listeners(type);

// Call type-listeners with args.
foo.publish(type, args);

// Visit foo's sub-tree.
foo.visit({
  start : function() {
    return skipChildren ? true : false;
  },
  end : function() {
    return stopVisit ? true : false;
  },
  reverse : reverseChildrenOrder ? true : false,
  visible : onlyVisibleCuts ? true : false
});

// Rendering pauses unless/until at least one cut is touched directly or
// indirectly.
foo.touch();

//
// ### Pinning
// Pinnint is a top level concept, it refers to transforming a node/cut relative
// to its parent.

// Get a pinning value.
bar.pin(name);
// Set a pinning value.
bar.pin(name, value);

// Set one or more pinning values.
// If `nameX` equals `nameY`, `name` shorthand can be used instead.
// For relative values 0 is top/left and 1 is bottom/right.
bar.pin({
  // Transparency applied to self and children.
  alpha : "",
  // Transparency applied to only to self textures.
  textureAlpha : "",
  scaleX : "",
  scaleY : "",
  skewX : "",
  skewY : "",
  rotation : "",
  // Set automatically based on cut type, used for relative pinning values.
  width : "",
  height : "",
  // Relative location on self used as scale/skew/rotation center.
  pivotX : "",
  pivotY : "",
  // Relative location on self used for positioning .
  handleX : "",
  handleY : "",
  // Relative location on parent used for positioning.
  alignX : "",
  alignY : "",
  // Positioning offset in pixel.
  offsetX : "",
  offsetY : "",
  // Scale to width/height.
  scaleMode : "", // "in" or "out", optional, if specified scale proportionally.
  scaleWidth : "",
  scaleHeight : "",
  // Scale to width/height and then resize to fill width/height.
  resizeMode : "", // "in" or "out", optional, if specified scale
  // proportionally.
  resizeWidth : "",
  resizeHeight : "",
});

//
// ### Tweening
// Tweening can only be applied to pinning values.

// Create a tweening entry.
var tween = foo.tween(duration = 400, delay = 0);

// Clear tweening queue.
tween.clear(jumpToEnd = false);

// Set pinning values and start tweening. Currently short-hand names are not
// supported for tweening.
tween.pin(pinning);

//
// ### Row
// A row is a cut which organizes its children as a horizontal sequence.

// Create a new row.
var row = Cut.row(valign = 0);

//
// ### Column
// A column is a cut which organizes its children as a vertical sequence.

// Create a new column.
var column = Cut.column(halign = 0);

//
// ### Image
// An image is a cut which pastes a cutout.

// Create a new image instance.
var image = Cut.image(cutout);

// Change image.
image.setImage(cutout);

// Crop image.
image.cropX(w, x = 0);
image.cropY(h, y = 0);

// Tile image to cover pin width and height. To define tile border use top,
// bottom, left and right with texture cutouts.
image.tile();

// Stretch image to cover pin width and height. To define stretch border use
// top, bottom, left and right with texture cutouts.
image.stretch();

//
// ### Anim(Clip)
// An anim is a cut which have a set of cutouts and pastes a cutout at a time.

// Create a new anim instance.
var anim = Cut.anim(cutouts, fps = Cut.Anim.FPS);

// Get or set anim fps.
anim.fps();
anim.fps(fps);

// Set anim cutouts.
anim.setFrames(cutouts);

anim.gotoFrame(n, resize = false);

anim.randomFrame();

anim.moveFrame(n);

anim.play(reset = false);

anim.stop(frame = null);

anim.repeat(repeat, callback = null);

//
// ### String
// String is a row of image cuts.

// Create a new string (sequence) instance.
Cut.string(cutouts);

string.setFont(cutouts);

// set string value
string.setValue(value);

//
// ### Cutout
// There are two ways to define a cutout (sprite): Canvas drawing and image
// textures.

//
// ### Canvas Drawing
//
cutout = Cut.Out.drawing(name = "random", width, height, ratio = 1, function(
    context, ratio) {
  // Draw to context. `this` is the created cutout.
});

//
// ### Textures
// Register a texture, images are automatically loaded by Cut.Loader.
Cut.addTexture({
  name : "",
  imagePath : "",
  imageRatio : "",
  filter : "",
  ratio : "",
  cutouts : [ {
    name : "",
    x : "",
    y : "",
    width : "",
    height : "",
    // Optional, used by tiled and stretched images.
    top : "",
    bottom : "",
    left : "",
    right : ""
  }, etc ]
}, etc);

// Single cutout
cutout = "textureName:cutoutName";

// Multiple cutout
cutouts = "textureName:cutoutPrefix";

//
// ### Loader
// Loaders are used to start and run apps.

// Load an app with root node and container element.
Cut.Loader.load(function(root, container) {
  // add cuts to root
  foo.appendTo(root);
});

//
// ### Mouse(Touch)
// Mouse class is used to capture and process mouse and touch events.  

// Subscribe root.
Cut.Mouse.subscribe(root, container, captureAnyMove = false);

// Add click listener to bar, other mouse/touch event types are start, end and
// move.
bar.on(Cut.Mouse.CLICK, function(event, point) {
  // point is relative to this cut
});

//
// ### Extending Cut
//

// Home extends Cut.
function Home() {
  Home.prototype._super.apply(this, arguments);
  // ...
}
Home.prototype = new Cut(Cut.Proto);
Home.prototype._super = Cut;
Home.prototype.constructor = Home;
