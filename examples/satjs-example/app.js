var V = function(x, y) {
  return new SAT.Vector(x, y);
};

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(400, 400).pin("handle", -0.5);

  var world = new SAT.World();
  var poly = new SAT.Body(new SAT.Polygon(V(-60, -60), [ V(0, -30), V(30, 0),
      V(0, 30), V(-30, 0) ]), {
    solid : true
  });
  world.addBody(poly);
  world.addBody(new SAT.Body(new SAT.Polygon(V(60, 60), [ V(-20, -20),
      V(20, -20), V(20, 20), V(-20, 20) ]), {
    solid : true
  }));
  world.addBody(new SAT.Body(new SAT.Circle(V(0, 0), 30), {
    solid : true,
    heavy : true
  }));

  var time = 0;
  root.tick(function(t) {
    poly.shape.setAngle(poly.shape.angle + (Math.PI / 60));
    root.touch();
  });

  new Cut.SAT(world).appendTo(root);
});