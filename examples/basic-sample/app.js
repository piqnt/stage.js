// Create new app
Cut(function(root, container) {

  // Subscribe to Cut.Mouse
  Cut.Mouse(root, container);

  // Set view box
  root.viewbox(300, 200);

  // Create an image and append it to root
  var box = Cut.image('box').appendTo(root);
  
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

// Register an image texture
Cut({
  imagePath : 'sample.png',
  cutouts : [
    { name : 'box', x : 0, y : 0, width : 30, height : 30 }
  ]
});