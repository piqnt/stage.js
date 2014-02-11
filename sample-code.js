
  Cut.Loader.load(function(root, container) {

    Cut.Mouse.subscribe(root, container);

    root.viewbox(500, 300);

    var row = Cut.row(0.5).appendTo(root).pin("align", 0.5).spacing(1);
    
    var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];
    for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      
      Cut.image("color:" + color).appendTo(row)
        .on(Cut.Mouse.MOVE, function(ev, point) {
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