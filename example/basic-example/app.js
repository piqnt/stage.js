// Create new app
Stage(function(stage) {

  // Set view box
  stage.viewbox(300, 200);

  // Create an image and append it to stage
  var box = Stage.image('box').appendTo(stage);
  
  // Align box to center
  box.pin('align', 0.5);
  
  // On mouse click...
  box.on('click', function(point) {
    // ...tween scale values of this node
    this.tween().clear().ease('bounce').pin({
      scaleX : Math.random() + 0.5,
      scaleY : Math.random() + 0.5
    });
  });
});

// Adding a texture
Stage({
  image : 'sample.png',
  textures : {
    box : { x : 0, y : 0, width : 30, height : 30 }
  }
});