# Cut.js

Cut.js (name inspired from "cutout animation") is a minimal JavaScript library for composing high-performance, dynamic and interactable HTML5 visual interfaces.
It works with modern browsers and mobile devices and intended to be used for game and visual app development.

[API Doc](api-doc.js)

### How it works

A Cut.js app consists of image textures, cutout (sprite) definitions and a tree structure. Each node in tree includes image cutouts and/or child nodes. Each node is pinned (transformed) against its parent and pastes its cutouts on rendering.

Each rendering cycle consists of ticking and painting the tree. Ticking is used to update the tree nodes and then on painting each node transforms according to its pinning and pastes its cutouts and then delegates to its children.

Rendering is retained and pauses in each cycle unless/until it is touched directly or indirectly by updating it.

### Sample Code

Following code demonstrate a simple use case. Cut.Loader and Cut.Mouse are pluggable components.

```js
  Cut.Loader.load(function(root, container) {

    Cut.Mouse.subscribe(root, container);

    root.viewbox(500, 300);

    var row = Cut.row(0.5).appendTo(root).pin("align", 0.5).spacing(1);
    
    var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];
    for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      
      Cut.image("color:" + color).appendTo(row)
        .listen(Cut.Mouse.MOVE, function(ev, point) {
          this.tween().clear().pin({
            scaleX : Cut.Math.random(0.8, 1.6),
            scaleY : Cut.Math.random(0.8, 1.6)
          });
          return true;
        });
    }

  });

  Cut.addTexture({
    name : "color",
    imagePath : "colors.png",
    cutouts : [
      { name : "red",    x : 0,   y : 0, width : 30, height : 30 },
      { name : "purple", x : 30,  y : 0, width : 30, height : 30 },
      { name : "blue",   x : 60,  y : 0, width : 30, height : 30 },
      { name : "orange", x : 90,  y : 0, width : 30, height : 30 },
      { name : "yellow", x : 120, y : 0, width : 30, height : 30 },
      { name : "green",  x : 150, y : 0, width : 30, height : 30 }
    ]
  });
```

### More Examples

[![Row, Dynamic](https://raw.github.com/piqnt/cut.js/master/examples/row-dynamic/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/row-dynamic/index.html)
[![Row, Static](https://raw.github.com/piqnt/cut.js/master/examples/row-static/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/row-static/index.html)
[![Column x Row](https://raw.github.com/piqnt/cut.js/master/examples/grid/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/grid/index.html)
[![Number](https://raw.github.com/piqnt/cut.js/master/examples/number/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/number/index.html)
[![Tile](https://raw.github.com/piqnt/cut.js/master/examples/tile/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/tile/index.html)
[![Stretch](https://raw.github.com/piqnt/cut.js/master/examples/stretch/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/stretch/index.html)
[![Bars](https://raw.github.com/piqnt/cut.js/master/examples/bars/thumbnail.png)](https://rawgithub.com/piqnt/cut.js/master/examples/bars/index.html)


### Projects Using Cut.js

[O!](http://piqnt.com/o/)  
[006](http://piqnt.com/006/)  
[Four](http://piqnt.com/4/four/)

Feel free to add your projects here!

### License

Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors  
Available under the MIT license