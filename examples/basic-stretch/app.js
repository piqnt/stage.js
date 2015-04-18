Cut(function(root) {

  root.viewbox(200, 200);

  Cut.image('box').stretch().appendTo(root).pin({
    width : 64,
    height : 64,
    align : 0.5
  }).on(Cut.Mouse.CLICK, function() {
    this.tween().clear().pin({
      width : Cut.Math.random(32, 96),
      height : Cut.Math.random(32, 96)
    });
    return true;
  });

});
