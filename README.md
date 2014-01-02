# Cut.js

Cut.js (name inspired from "cutout animation") is a minimal JavaScript library for composing high-performance and intractable HTML5 visual interfaces from images textures.

Cut.js targets mobile devices and modern browsers and intended to be used for game and visual app development but it is not a physics or all-in-one game engine.

[API Doc](api-doc.js) - [Demos](http://piqnt.com/cutjs/) 

#### How it works

A cut.js app is a tree of cut objects, each pinned (transformed) against its parent and may include any number of image cutouts and/or other cuts as children.

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

#### Credits

Cut.js was originally started by extending [DisplayFramework](https://github.com/phonegap/phonegap-app-fast-canvas/blob/master/Android/assets/www/DisplayFramework.js) while developing mobile-optimized games at Piqnt and latter reorganized to support new features.

#### License

Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
Available under the MIT license