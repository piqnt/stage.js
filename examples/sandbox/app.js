Cut.Loader.load(function(canvas) {

  var root = Cut.create().id("root");

  // only register root
  Cut.Mouse.subscribe(root, canvas, true);

  // tick tween.js
  root.tick(TWEEN.update, true);

  root.listen("resize", function(width, height) {
    // resize to fit in screen
    this.pin({
      width : 400,
      height : 400,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var j = 0, i = 0;
  var column = Cut.column().appendTo(root).pin("align", 0.5);
  for (j = 0; j < 9; j++) {
    var row = Cut.row().id("row-" + j).appendTo(column);
    for (i = 0; i < 9; i++) {
      // colors as frames
      var cell = Cut.anim("colors:color_").id("cell-" + j + "-" + i).appendTo(
          row);
      cell.listen(Cut.Mouse.MOVE, function(ev, point) {
        animateCell(this);
        return true;
      });
    }
  }

  return root;
});

var last = null;

function animateCell(cell) {

  if (cell == last)
    return;
  last = cell;

  // random color
  cell.randomFrame();

  // animate cell using tween.js
  if (!cell.tween) {
    // initial tweening values
    cell.tween = new TWEEN.Tween({
      scaleX : 1,
      scaleY : 1,
      skewX : 0,
      skewY : 0,
      rotation : 0,
      pivotX : 0.5,
      pivotY : 0.5
    });
  } else {
    cell.tween.stop();
  }

  cell.tween.to({
    scaleX : Cut.Math.random(0.9, 1.4),
    scaleY : Cut.Math.random(0.9, 1.4),
    skewX : Cut.Math.random(0, 0.4),
    skewY : Cut.Math.random(0, 0.4),
    rotation : Cut.Math.random(-Math.PI, Math.PI),
    pivotX : Cut.Math.random(0.3, 0.7),
    pivotY : Cut.Math.random(0.3, 0.7)
  }, Cut.Math.random(2000, 5000)).onUpdate(function() {
    cell.pin(this);
  }).start();

}

// register texture(s)
Cut.addTexture({
  name : "colors",
  imagePath : "colors.png",
  imageRatio : 2,
  sprites : [
    { name : "color_dark",   x : 0,  y : 0,  width : 30, height : 30 },
    { name : "color_light",  x : 0,  y : 30, width : 30, height : 30 },
    { name : "color_red",    x : 30, y : 0,  width : 30, height : 30 },
    { name : "color_purple", x : 30, y : 30, width : 30, height : 30 },
    { name : "color_orange", x : 60, y : 0,  width : 30, height : 30 },
    { name : "color_blue",   x : 60, y : 30, width : 30, height : 30 },
    { name : "color_yellow", x : 90, y : 0,  width : 30, height : 30 },
    { name : "color_green",  x : 90, y : 30, width : 30, height : 30 }
  ]
});