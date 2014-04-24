Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(800, 600).pin('handle', -0.5);

  var world = Physics(function(world) {

    world.add(Physics.body('circle', {
      x : Math.random() * 200 - 100,
      y : Math.random() * 200 - 100,
      vx : 0.3,
      radius : 80
    }));

    world.add(Physics.body('circle', {
      x : Math.random() * 200 - 100,
      y : Math.random() * 200 - 100,
      vx : -0.3,
      radius : 40
    }));

    world.add([ Physics.behavior('constant-acceleration'),
        Physics.behavior('body-impulse-response'),
        Physics.behavior('edge-collision-detection', {
          aabb : Physics.aabb(-400, -300, 400, 300),
          restitution : 0.99,
          cof : 0.8
        }) ]);

  });

  new Cut.PJS(world).appendTo(root);

});