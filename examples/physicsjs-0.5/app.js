Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(800, 600).pin('handle', -0.5);

  var world = Physics(function(world) {

    world.add(Physics.body('circle', {
      x : 0,
      y : 0,
      radius : 30
    }));

    world.add(Physics.body('circle', {
      x : Math.random() * 200 - 100,
      y : Math.random() * 200 - 100,
      radius : 45,
      mass : 2,
      vx : Math.random() - 0.5,
      vy : Math.random() - 0.5,
      angularVelocity : 0.01
    }));

    world.add(Physics.body('circle', {
      x : Math.random() * 200 - 100,
      y : Math.random() * 200 - 100,
      radius : 60,
      mass : 1.5,
      vx : Math.random() - 0.5,
      vy : Math.random() - 0.5
    }));

    world.add(Physics.behavior('edge-collision-detection', {
      aabb : Physics.aabb(-400, -300, 400, 300),
      restitution : 0.99,
      cof : 0.99
    }));
    world.add(Physics.behavior('body-impulse-response'));

    // add gravity
    world.add(Physics.behavior('constant-acceleration'));

  });

  new Cut.PJS(world).appendTo(root);

});