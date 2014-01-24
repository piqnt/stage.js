# Cut.js

Cut.js (name inspired from "cutout animation") is a minimal JavaScript library for composing high-performance, dynamic and interactable HTML5 visual interfaces from images textures. It works with modern browsers and mobile devices and intended to be used for game and visual app development.

[API Doc](api-doc.js)

#### How it works

A cut.js app consists of image textures, cutout (sprite) definitions and a tree structure. Each node in tree includes image cutouts and/or child nodes. Each node is pinned (transformed) against its parent and pastes its cutouts on rendering.

Each rendering cycle consists of ticking and painting the tree. Ticking is used to update the tree nodes and then on painting each node transforms according to its pinning and pastes its cutouts and then delegates to its children.

Rendering is retained and pauses in each cycle unless/until it is touched directly or indirectly by updating it.

#### Example

Following code demonstrate a simple use case. Cut.Loader and Cut.Mouse are pluggable components.

```js
  Cut.Loader.load(function(root, container) {

    Cut.Mouse.subscribe(root, container);

    // scale and resize to cover container
    var viewport = Cut.create().appendTo(root).pin({
          width : 500,
          height : 300
      }).listen("resize", function(width, height) {
        this.pin({
          resizeMode : "in",
          resizeWidth : width,
          resizeHeight : height
        });
      };

    var colors = [ "dark", "light", "red", "purple", "blue", "orange", "yellow", "green" ];

    // create a row and align it to center
    var row = Cut.row().appendTo(viewport).pin("align", 0.5);
    for ( var i = 0; i < colors.length; i++) {
      Cut.image("colors:dark").appendTo(row)
        .listen(Cut.Mouse.CLICK, function(ev, point) {
          this.setImage("colors:" + colors[i]);
          return true;
        });
    }

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

#### Credits

Cut.js was originally started by extending [DisplayFramework](https://github.com/phonegap/phonegap-app-fast-canvas/blob/master/Android/assets/www/DisplayFramework.js) while developing mobile-optimized games at Piqnt and latter reorganized to support new features.

#### License

Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors  
Available under the MIT license