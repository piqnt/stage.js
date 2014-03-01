// Create new app
Cut(function(root, container) {

  // Subscribe to Cut.Mouse
  Cut.Mouse(root, container);

  // Set view box
  root.viewbox(500, 300);

  // Create an image node
  Cut.image("base:box").appendTo(root)
    // on mouse click on this node
    .on(Cut.Mouse.CLICK, function(ev, point) {
      // Tween scale values of this node
      this.tween().clear().pin({
        scaleX : Math.random() + 0.5,
        scaleY : Math.random() + 0.5
      });
      return true;
    });

});

// Register an image texture
Cut.addTexture({
  name : "base",
  imagePath : "base.png",
  cutouts : [
    { name : "box", x : 0, y : 0, width : 30, height : 30 }
  ]
});