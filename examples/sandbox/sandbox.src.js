// create shortcut
var C = Cut, U = Cut.Utils;

// see loader
CutLoader.load(function() {

  // root cut
  var root = new Cut().id("root");

  // only register root
  Mouse.listen(root, true);

  // tick tween.js
  root.addTicker(TWEEN.update, true);

  root.resize = function(width, height) {
    // resize to fit in screen
    this.inn({
      width : 500,
      height : 500,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  };

  var column = C.column().appendTo(root).inn("align", 0.5);
  for ( var j = 0; j < 9; j++) {
    var row = C.row().id("row-" + j).appendTo(column);
    for ( var i = 0; i < 9; i++) {
      // colors as frames
      var box = C.anim("boxes:box_").id("box-" + j + "-" + i).appendTo(row);

      box.attr(Mouse.ON_MOVE, function(ev, point) {
        animateBox(this);
        return true;
      });
    }
  }

  return root ;
});

var last = null;

function animateBox(box) {

  if (box == last)
    return;
  last = box;

  // random color
  box.randomFrame();

  // animate box using tween.js
  if (!box.tween) {
    // initial tweening values
    box.tween = new TWEEN.Tween({
      scaleX : 1,
      scaleY : 1,
      skewX : 0,
      skewY : 0,
      rotation : 0,
      pivotX : 0.5,
      pivotY : 0.5
    });
  } else {
    box.tween.stop();
  }

  box.tween.to({
    scaleX : U.random(0.9, 1.4),
    scaleY : U.random(0.9, 1.4),
    skewX : U.random(0, 0.4),
    skewY : U.random(0, 0.4),
    rotation : U.random(-Math.PI, Math.PI),
    pivotX : U.random(0.3, 0.7),
    pivotY : U.random(0.3, 0.7)
  }, U.random(2000, 5000)).onUpdate(function() {
    box.inn().update(this);
  }).start();

}

// register texture(s)
Cut.addTexture({
  name : "boxes",
  imagePath : "boxes.png",
  imageRatio : 2,
  cuts : [
    { name : "box_d", x : 0,  y : 0,  width : 30, height : 30 },
    { name : "box_l", x : 0,  y : 30, width : 30, height : 30 },
    { name : "box_r", x : 30, y : 0,  width : 30, height : 30 },
    { name : "box_p", x : 30, y : 30, width : 30, height : 30 },
    { name : "box_b", x : 60, y : 0,  width : 30, height : 30 },
    { name : "box_o", x : 60, y : 30, width : 30, height : 30 },
    { name : "box_y", x : 90, y : 0,  width : 30, height : 30 },
    { name : "box_g", x : 90, y : 30, width : 30, height : 30 }
  ]
});