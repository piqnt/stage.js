# Cut.js (alpha)

Cut.js is a minimal JavaScript library for making optimized HTML5 games and visual apps from image textures.

Cut.js targets mobile devices and modern browsers and provides dynamic and intractable visual composition functionalities but it is not a physics or all-in-one game engine.

The name is inspired from "cutout animation".

[Demo](http://piqnt.github.io/cut.js/examples/sandbox/)


#### How it works

A cut.js app is a tree of *cut* objects.
Each cut is *pinned* (transformed) against its parent and may include any number of image *cutouts* and/or other cuts as children.

Each *rendering* cycle consists of *ticking* and *painting* the tree.
Cuts apply updates during ticking. On painting each cut transforms according to its pinning and *pastes* all of its cutouts and then delegates to its children.
Cut.js rendering is retained and will pause in each cycle unless/until it is *touched* directly or indirectly by updating it.

#### Usage

Following code demonstrate a simple use case. `Cut.Loader` and `Cut.Mouse` are pluggable and specific to target platform.


```js
Cut.Loader.load(function(container) {

  var root = Cut.create();

  Cut.Mouse.listen(root, container);

  root.resize = function(width, height) {
    // resize to fit in screen
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
  for ( var i = 0; i < 9; i++) {
    var cell = Cut.image("colors:dark").appendTo(row);

    cell.listen(Cut.Mouse.CLICK, function(ev, point) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      this.setImage("colors:" + color);
      return true;
    });
  }

  return root ;
});

Cut.addTexture({
  name : "colors",
  imagePath : "colors.png",
  sprites : [
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

#### API

##### Basic

```
  Cut.create()
  
  cut.tick(ticker [, before])
  cut.id(id)
  cut.attr(name [, value])
  cut.listen(type, listener)
  cut.listeners(type)
  cut.publish(name, args)
  cut.visit(visitor)
  cut.visible(visible)
  cut.hide()
  cut.show()
  cut.parent()
  cut.next([all])
  cut.prev([all])
  cut.first([all])
  cut.last([all])
  cut.appendTo(parent)
  cut.prependTo(parent)
  cut.remove()
  cut.append(child, ...)
  cut.prepend(child, ...)
  cut.removeChild(child)
  cut.empty()
  cut.touch()
  cut.pin(name [, value])/cut.pin({...})
    alpha
    textureAlpha
    width, height
    scaleX, scaleY (scale)
    skewX, skewY (skew)
    rotation
    pivotX, pivotY (pivot)
    offsetX, offsetY (offset)
    resizeMode
    resizeWidth, resizeHeight
    scaleMode
    scaleWidth, scaleHeight
    alignX, alignY (align)
    handleX, handleY (handle)
  
  Cut.image(selector)
  image.setImage(selector)
  image.cropX(w [, x])
  image.cropY(h [, y])
  
  Cut.anim(selector, [fps])
  anim.fps([fps])
  anim.setFrames(selector)
  anim.gotoFrame(frame [, resize])
  anim.randomFrame()
  anim.moveFrame(frame)
  anim.gotoLabel(label [, resize])
  anim.repeat(repeat [, callback])
  anim.play([reset])
  anim.stop([frame])
  
  Cut.string(selector)
  string.setFont(selector)
  string.setValue(value)
  
  Cut.row(valign)
  cut.row(valign)
  
  Cut.column(halign)
  cut.column(halign)
  
  Cut.ninePatch(selector)
  ninePatch.setImage(selector)
  ninePatch.inner(width, height)
  ninePatch.outer(width, height)
  
  Cut.addTexture()
```

##### Advanced


#### Credits

Cut.js was originally started by extending [DisplayFramework](https://github.com/phonegap/phonegap-app-fast-canvas/blob/master/Android/assets/www/DisplayFramework.js) while developing mobile-optimized games at Piqnt and latter reorganized to support new features.

#### License

Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors

Available under the MIT license


-----

Keywords: html5, javascript, canvas, android, ios, win8, phonegap, cordova, mobile, game, sprite sheet, cutout
