#Cut.js (alpha)

Cut.js (name inspired from "cutout animation") is a minimal but functionally complete JavaScript library for making optimized HTML5 sprite games and visual apps.

Cut.js target environments are mobile devices and modern browsers.

Cut.js is not a physics or full-fledged game engine, it only provides UI functionalities.

[Demo](http://piqnt.github.io/cut.js/examples/sandbox/)

#### How it works

A cut.js app is a tree of *cut* objects.
Each cut is *pinned* (transformed) against its parent and may include any number of image *cutouts* and/or other cuts as children.

Each *rendering* cycle consists of *ticking* and *painting*.
Cuts apply updates during ticking. On painting each cut transforms according to its pinning and *pastes* all of its cutouts and then delegates to its children.
Cut.js rendering is retained and will pause in each cycle unless/until it is *touched* directly or indirectly by updating it.

#### Usage

Following code demonstrate a simple use case. `Cut.Loader` is made available by including a loader file specific to target platform. `Mouse` is not part of cut.js but provided for convenience.


```js
Cut.Loader.load(function(container) {

  var root = Cut.create();

  Mouse.listen(root, container);

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

    cell.attr(Mouse.ON_CLICK, function(ev, point) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      this.setImage("colors:" + color);
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

#### Credits

Cut.js was originally started by extending [DisplayFramework](https://github.com/phonegap/phonegap-app-fast-canvas/blob/master/Android/assets/www/DisplayFramework.js) while developing mobile-optimized games at Piqnt and latter reorganized to support new features.
