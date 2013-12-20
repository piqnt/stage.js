# Cut.js

Cut.js (name inspired from "cutout animation") is a minimal JavaScript library for developing optimized HTML5 games and visual apps from image textures.

Cut.js targets mobile devices and modern browsers and provides dynamic and intractable visual composition functionalities, but it is not a physics or all-in-one game engine.

[Demos](http://piqnt.com/cutjs/)

#### How it works

A cut.js app is a tree of cut objects. Each cut is pinned (transformed) against its parent and may include any number of image cutouts and/or other cuts as children.

Each rendering cycle consists of ticking and painting the tree. Updates are applied during ticking and on painting each cut transforms according to its pinning and pastes all of its cutouts and then delegates to its children.

Cut.js rendering is retained and pauses in each cycle unless/until it is touched directly or indirectly by updating it. 

#### Example

Following code demonstrate a simple use case. Cut.Loader and Cut.Mouse are pluggable components.

```js
  Cut.Loader.load(function(container) {
  
    var root = Cut.create();
    
    Cut.Mouse.subscribe(root, container);
  
    root.listen("resize", function(width, height) {
      this.pin({
        width : 500,
        height : 300,
        resizeMode : "in",
        resizeWidth : width,
        resizeHeight : height,
      });
    };
  
    var colors = [ "dark", "light", "red", "purple", "blue", "orange", "yellow", "green" ];
  
    var row = Cut.row().appendTo(root).pin("parent", 0.5);
    for ( var i = 0; i < colors.length; i++) {
      Cut.image("colors:dark").appendTo(row)
        .listen(Cut.Mouse.CLICK, function(ev, point) {
          this.setImage("colors:" + colors[i]);
          return true;
        });
    }
  
    return root ;
  });
  
  Cut.addTexture({
    name : "colors",
    imagePath : "colors.png",
    cutouts : [
      { name : "dark",   x : 0,  y : 0,  width : 30, height : 30 },
      { name : "light",  x : 0,  y : 30, width : 30, height : 30 },
      { name : "red",    x : 30, y : 0,  width : 30, height : 30 },
      { name : "purple", x : 30, y : 30, width : 30, height : 30 },
      { name : "blue",   x : 60, y : 0,  width : 30, height : 30 },
      { name : "orange", x : 60, y : 30, width : 30, height : 30 },
      { name : "yellow", x : 90, y : 0,  width : 30, height : 30 },
      { name : "green",  x : 90, y : 30, width : 30, height : 30 }
    ]
  });
```

### API

Note: name? means name is optional.

```js
  // Create a new plain cut instance.
  // No painting is associated with a plain cut, it is just a parent for other cuts.
  var foo = Cut.create();

  // Append/prepend bar, baz, ... to foo children.
  foo.append(bar, baz, ...);
  foo.prepend(bar, baz, ...);

  // Append/prepend bar to foo children.
  bar.appendTo(foo);
  bar.prependTo(foo);

  // Insert baz, qux, ... after/before bar.
  bar.insertNext(baz, qux, ...);
  bar.insertPrev(baz, qux, ...);

  // Insert baz after/before bar.
  baz.insertAfter(bar);
  baz.insertBefore(bar);

  // Remove bar from parent.
  bar.remove();

  // Remove bar, baz, ... from foo.
  foo.remove(bar, baz, ...);

  // Remove all foo children.
  foo.empty();

  // Get foo first/last (visible) child.
  foo.first(visible?);
  foo.last(visible?);
  
  // Get bar parent.
  bar.parent();

  // Get bar next/prev (visible) sibling.
  bar.next(visible?);
  bar.prev(visible?);

  // Get or set bar visiblity.
  bar.visible(visible?);
  bar.hide();
  bar.show();

  // Get or set single pinning value.
  bar.pin(name, value?);

  // Set one or more pinning values.
  // If `nameX` equals `nameY`, `name` shorthand can be used instead.
  bar.pin({
    alpha : "",
    textureAlpha : "", // set alpha for textures directly pasted by this cut.
    width : "", // used for pinning
    height : "", // used for pinning
    scaleX : "", 
    scaleY : "",
    skewX : "",
    skewY : "",
    rotation : ""
    pivotX : "", // scale/skew/rotation center, value is relative to self size
    pivotY : "", // 
    handleX : "", // 
    handleY : "",
    alignX : "", // 
    alignY : "",
    offsetX : "", // offsetting in pixel
    offsetY : "",
    resizeMode : "", // "in"/"out"
    resizeWidth : "",
    resizeHeight : "",
    scaleMode : "", // "in"/"out"
    scaleWidth : "",
    scaleHeight : "",
  })

  // Ticker is called on ticking before every paint, it can be used to modify the cut.
  foo.tick(ticker, beforeChildren?);

  // Register a type-listener to bar.
  foo.listen(type, listener);
  
  // Get type-listeners registered to bar.
  foo.listeners(type)

  // Call type-listeners with args.
  foo.publish(type, args)


  // Visit the tree belowe foo.
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

  // Rendering pauses unless/until at least one cut is touched directly or indirectly.
  foo.touch()


  // Create a new row.
  // A row is a cut which organizes its children as a horizontal sequence.
  var row = Cut.row(valign?)
  
  // Create a new column.
  // A column is a cut which organizes its children as a vertical sequence.
  var column = Cut.column(halign?)
  
  
  // Create a new image instance.
  // An image is a cut which pastes a cutout.
  var image = Cut.image("textureName:cutoutName");
  
  // Change image.
  image.setImage("textureName:cutoutName")
  
  // Crop image.
  image.cropX(w, x?)
  image.cropY(h, y?)
  
  // Create a new anim instance.
  // An anim is a cut which have a set of cutouts and pastes a cutout at a time.
  var anim = Cut.anim("textureName:cutoutPrefix", fps?)

  // Get or set anim fps.
  anim.fps(fps?)

  // Set anim cutouts.
  anim.setFrames("textureName:cutoutPrefix")

  anim.gotoFrame(n, resize?)

  anim.gotoLabel("cutoutName", resize?)

  anim.randomFrame()

  anim.moveFrame(n)

  anim.play(reset?)

  anim.stop(frame?)

  anim.repeat(repeat, callback?)

 
  // Create a new string (sequence) instance.
  // String is a row of anim cuts.
  Cut.string("textureName:cutoutPrefix")

  string.setFont("textureName:cutoutPrefix")
  
  // set string value
  string.setValue(value)
  
  
  // Create a new nine-patch from a cutout.
  // Use top, bottom, left and right to define the nine-patch when adding a texture.
  var np = Cut.ninePatch("textureName:cutoutName")
  
  // Set nine-patch cutout.
  np.setImage("textureName:cutoutName")
  
  // Set inner size of nine-patch.
  np.inner(width, height)
  
  // Set outer size of nine-patch.
  np.outer(width, height)

  
  Cut.addTexture({
    name : "",
    imagePath : "",
    imageRatio: "",
    filter : "",
    ratio : "",
    cutouts : [
      { name : "", x : "", y : "", width : "", height : "", top? : "", bottom? : "", left? : "", right? : ""},
      ...
    ]
  }, ...)

    
  Cut.Mouse.subscribe(rootCut, element)


  Cut.Loader.load(function(element) {
    ...
    return rootCut;
  });

```

#### Credits

Cut.js was originally started by extending [DisplayFramework](https://github.com/phonegap/phonegap-app-fast-canvas/blob/master/Android/assets/www/DisplayFramework.js) while developing mobile-optimized games at Piqnt and latter reorganized to support new features.

#### License

Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors  
Available under the MIT license