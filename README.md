[![Stage](https://s3.amazonaws.com/piqnt.com/stage.js/stage.png)](http://piqnt.com/stage.js/)

Stage.js is a 2D HTML5 JavaScript library for cross-platform game development, it is lightweight, fast and open-source.

[**Check out examples and demos!**](http://piqnt.com/stage.js/)

[Install](#installation) · [Usage](#usage) · [Resources](#resources) · [API Doc](#api-doc) · [Development](#development) · [License](#license)

[中文手册](https://github.com/shakiba/stage.js/wiki/%E4%B8%AD%E6%96%87%E6%89%8B%E5%86%8C)


## Introduction

Canvas is the graphic component of HTML5 game development, but it only has a drawing API and there is no data model like the DOM to compose your application.
You need to manually draw your application and manage rendering cycles to play it.
Moreover, mouse events are only available at the entire Canvas level and they also need to be processed manually.

Stage.js provides a DOM-like tree data model to compose your application and internally manages rendering cycles and the drawing of your application.
It also processes and distributes mouse and touch events to targeted tree nodes.
A Stage.js application consists of a tree of nodes. Each node is pinned (transformed) against its parent and has zero, one or more image textures.

Each rendering cycle consists of ticking and drawing tree nodes. On ticking, nodes adjust themselves to recent updates while on drawing each node transforms according to its pinning and draws its textures.

Rendering is retained and is paused when there is no change.

### Example

```js
// Create new app
Stage(function(stage) {

  // Set view box
  stage.viewbox(300, 200);

  // Create an image and append it to stage
  var box = Stage.image('box').appendTo(stage);

  // Align box to center
  box.pin('align', 0.5);

  // On mouse click...
  box.on('click', function(point) {
    // ...tween scale values of this node
    this.tween().ease('bounce').pin({
      scaleX : Math.random() + 0.5,
      scaleY : Math.random() + 0.5
    });
  });
});

// Adding a texture
Stage({
  image : 'sample.png',
  textures : {
    box : { x : 0, y : 0, width : 30, height : 30 }
  }
});
```


## Installation

#### Download
Latest builds are available in the project [releases page](https://github.com/shakiba/stage.js/releases/latest).

#### NPM

```
npm install stage-js --save
```

#### Bower

```
bower install stage-js --save
```


## Usage

#### Browser

Include an appropriate build file from `dist` directory in your HTML page before your application. For example:

```html
<script src="path/to/stage.web.min.js"></script>
<script src="path/to/your-app.js"></script>
```

#### Browserify, CommonJS, Node.js
Generally it is preferred to directly include a browser build file in HTML pages, however it is also possible to use CommonJS require instead, for example:

```js
var Stage = require('stage-js/platform/web');
```

See `platform` directory for other available modules.


## Resources

[Introduction to Stage.js](http://www.sitepoint.com/introduction-to-stage-js/)  by Baljeet Rathi, SitePoint

[中文手册](https://github.com/shakiba/stage.js/wiki/%E4%B8%AD%E6%96%87%E6%89%8B%E5%86%8C)  by Villor 紫刃


## API Doc

### Application
An application is created by passing a callback function to `Stage()`.
The library will load, create and initialize all required components and will then call the provided function with the application root node and display the container which is normally a Canvas element.

```javascript
// Create and start an application
Stage(function(stage, display) {

  // Set viewbox for stage, see pinning for valid modes
  stage.viewbox(width, height, mode = 'in-pad');

  // Listen to view port resize events
  stage.on('viewport', function(viewport) {
    // `viewport` attributes are `width`, `height` and `ratio`
  });

  // Pause playing
  stage.pause();

  // Resume playing
  stage.resume();
});
```


### Tree Model
Every app consists of a tree. The tree's root is provided as `stage`.

```javascript
// Create a new node instance (with no textures)
var node = Stage.create();

// Append/prepend child to parent's children (accepts array)
parent.append(child);
parent.prepend(child);

// Append/prepend child to parent's children
child.appendTo(parent);
child.prependTo(parent);

// Insert sibling after/before child (accepts array)
child.insertNext(sibling);
child.insertPrev(sibling);

// Insert sibling after/before child
sibling.insertAfter(child);
sibling.insertBefore(child);

// Remove child from its parent
child.remove();

// Remove child from parent (accepts array)
parent.remove(child);

// Remove all of parent's children
parent.empty();

// Get parent's first/last (visible) child
parent.first(onlyVisible = false);
parent.last(onlyVisible = false);

// Get immediate parent
child.parent();

// Get child's next/prev (visible) sibling
child.next(onlyVisible = false);
child.prev(onlyVisible = false);

// Get node's visiblity
node.visible();
// Set node's visiblity
node.visible(visible);
node.hide();
node.show();

// Iterate over parent's children, child can not be removed
for (var child = parent.first(); child; child = child.next()) {
  // use child
}

// Iterate over parent's children, child can be removed
var child, next = parent.first();
while (child = next) {
  next = child.next();
  // use child
}

// Visit node's sub-tree including node itself
node.visit({
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


### Game Loop
Each rendering cycle consists of ticking and redrawing the application tree.
Application and its nodes can be updated during ticking.
Depending on application activities there can be three different follow-ups after ticking:

* If at least one node is touched then the entire application tree will be redrawn and the game loop will continue.
* If no node is touched but at least one ticking function returns `true` then the game loop will continue but the previous drawing will be retained.
* If no node is touched and no ticking function returns `true` then the application will pause until it is touched directly or indirectly.

Nodes can be touched directly by calling `node.touch()` but usually they are touched indirectly by other actions such as pinning or tree manipulation.

```javascript
// Register a function to be called on ticking
node.tick(function(millisecElapsed) {
  return continueGameLoop;
}, beforeChildren = false);

// Touch node
node.touch();
```


### Pinning
Pinning specifies how a node is attached to its parent.
Pinning consists of size, transformation, positioning and transparency.

```javascript
// Get a pinning value
node.pin(name);

// Set a pinning value
node.pin(name, value);

// Set one or more pinning values
node.pin({
  name : value,
  ...
});
```

When `nameX` equals `nameY`, `name` shorthand can be used instead.

#### Size
For some nodes, such as images, strings, rows and columns, size is set automatically.

```javascript
node.pin({
  height : height,
  width : width
});

// Shortcut for setting size:
node.size(width, height);
node.width(width);
node.height(height);

// Shortcut for getting size:
node.width();
node.height();
```

#### Transformation
Transformation consists of scaling, skewing and rotating. Rotation is applied after scaling and skewing.

```javascript
node.pin({
  scaleX : 1,
  scaleY : 1,
  skewX : 0,
  skewY : 0,
  rotation : 0
});

// Shortcut for setting transformation:
node.scale(x, y = x);
node.scale({ x : x, y : y });
node.skew(x, y = x);
node.skew({ x : x, y : y });
node.rotate(angle);
```

#### Positioning
When positioning, *handle* point on self is positioned at *offset* distance from *align* point on the parent.
Handle and align are defined as a ratio of width/height, 0 is top/left and 1 is bottom/right.
Handle defaults to the align value when it is not specified.

```javascript
node.pin({
  alignX : 0,
  alignY : 0,
  handleX : 0,
  handleY : 0,
  offsetX : 0,
  offsetY : 0
});

// Shortcut methods for setting positioning:
node.offset(x, y);
node.offset({ x : x, y : y });
```

By default an axis-aligned bounding box (AABB) after transformation is used for positioning, 
however it is possible to use a non-transformed box by setting a pivot location. 
Pivot location is defined as ratio of non-transformed width/height and is used as central point on self for scale, skew and rotation.

```javascript
node.pin({
  pivotX : 0,
  pivotY : 0
});
```

#### Transparency
Transparency can be applied to both node textures and subtree nodes or only node textures.

```javascript
node.pin({
  alpha : 1,
  textureAlpha : 1
});

// Shortcut methods for setting transparency:
node.alpha(alpha);
node.alpha(alpha, textureAlpha);
```

#### Scale To
Scale to a new width/height, if mode is set to scale proportionally. Valid modes are:
 - `in`: maximum scale which keeps node edges inside the scaleWidth/Height
 - `in-pad`: like `in`, but evenly pads node to fill the entire scaleWidth/Height
 - `out`: minimum scale which keeps node edges outside scaleWidth/Height
 - `out-crop`: like `out`, but evenly crops it to scaleWidth/Height

```javascript
node.pin({
  scaleMode : mode,
  scaleWidth : width,
  scaleHeight : height
});

// Shortcut method:
node.scaleTo(width, height, mode);
```


### Events
Event listeners can be registered and unregistered to nodes, listeners are called when an event is published to a node.
Some events may be published to multiple nodes, but events do not propagate.

```javascript
// Register a listener to node
// Event `name` can be one or an array of strings or spaced separated strings
node.on(name, listener);

// Unregister a listener from node.
node.off(name, listener);

// Get listeners registered to node
// Returns an array or undefined
node.listeners(name);

// Call listeners with args
// Returns number of listeners called
node.publish(name, args);
```


### Mouse and Touch
Native mouse and touch events are captured, processed and published to application nodes.
Nodes receive mouse events in local coordinates, i.e. mouse location is specified as the distance to the top-left of the node.

```javascript
// Add click listener to node
node.on('click', function(point) {
  // point.x and point.y are relative to this node left and top
  // point.raw is original event
});
```

Instead of native click events, syntatic click events are created and published to nodes.
In addition to standard event types, a syntactic `mousecancel` event type is also supported which is similar to `touchcancel` but is published when a `mousedown` is not followed by `mouseup`.

```javascript
// Mouse events:
Stage.Mouse.CLICK = 'click';
Stage.Mouse.START = 'touchstart mousedown';
Stage.Mouse.MOVE = 'touchmove mousemove';
Stage.Mouse.END = 'touchend mouseup';
Stage.Mouse.CANCEL = 'touchcancel mousecancel';
```


### Texture
Textures are drawable objects which are used by tree nodes to draw graphics on the Canvas surface.

### Texture Atlas
A texture atlas (sprite sheet) consists of a set of named textures which are referenced by name in an application.

Atlases are usually created using static image files. Images referenced in atlases are automatically preloaded.

```javascript
// Adding texture atlas
Stage({
  name : 'mario', // optional
  image : {
    src : 'mario.png',
    ratio : 1, // optional, for high-res images
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

Stage.image('mario:stand');

Stage.anim('mario:walk').play();

Stage.string('mario:number').value(100);
```

If image src starts with `./` it will be resolved relative to the current script URL.


### Image
An image is a node with one texture.

```javascript
// Create a new image instance
var image = Stage.image(texture);

// Change image texture
image.image(texture);

// Tile/Stretch image when pinning width and/or height
// To define borders add top, bottom, left and right to texture
image.tile();
image.stretch();
```


### Animation
An animation or anim is a node with an array of textures as frames.

```javascript
// Create a new anim instance
var anim = Stage.anim(textures, fps = 15);

// Get or set animation frame-per-second
anim.fps();
anim.fps(fps);

// Set animation frames, `textures` can be an array or a texture selector
anim.frames(textures);

// Go to n-th frame
anim.gotoFrame(n);

// Move n frames forward (or backward if n is negative)
anim.moveFrame(n);

// Get number of frames
anim.length();

// Start playing (from `frameName` if specified)
anim.play(frameName = undefined);

// Stop playing (and jump to `frameName` if specified)
anim.stop(frameName = undefined);

// Play `repeat * length` frames and then stop and call `callback`
anim.repeat(repeat, callback = null);
```


### String
String is a row of images which are dynamically selected from `frames` using characters of a string `value` (or items of an array `value`).

```javascript
// Create a new string instance with frames
var string = Stage.string(frames);

// Set frames, a string referencing a map in an atlas 
string.frames("digits");

// Set frames, a map with textures as values and frame names as keys 
string.frames({
  '0' : zeroTexture,
  '1' : oneTexture,
  ...
});

// Set frames, a function which takes a char (or item) and returns a texture
string.frames(function(char) {
  // create a texture for char
  return texture;
});

// Set value, it can be a string (or an array)
// Characters (or items) are used to select frames and create a row of images
string.value(value);

// Get assigned value
string.value();
```


### Row and Column
A row/column is a node which organizes its children as a horizontal/vertical sequence.

```javascript
// Create a new row/column
var row = Stage.row(childrenAlignY = 0);
var column = Stage.column(childrenAlignX = 0);

// Make node a row/column
node.row(childrenAlignY = 0);
node.column(childrenAlignX = 0);

// Add spacing between row/column cells
node.spacing(space);
```


### Box (experimental)
A box resizes to wrap its children. It can be applied to tiled/stretched
images to create variable size components such as windows and buttons.

```javascript
// Create a new box
var box = Stage.box();

// Make node a box
node = node.box();
```


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


### Global Methods
```javascript

// Create a new app
Stage(function(stage, display) { });

// Create and preload a texture atlas
Stage({ });

// A function to be called before starting any app
// Can be used for preloading application assets
Stage.preload(function(done) {
  // Call `done` when loaded or failed
  done(error);
});

// Preload and execute a JS file
// URLs starting with `./` are resolved relative to current script URL
Stage.preload(src);

// Pause playing all applications
Stage.pause();

// Resume playing all applications
Stage.resume();
```


## Development
To try examples with a live build run following command and check output for the URL to open in your browser:
```
npm run dev
```


## License
Copyright 2020 Ali Shakiba http://shakiba.me/stage.js  
Available under the MIT License
