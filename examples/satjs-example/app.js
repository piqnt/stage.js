Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(400, 400).pin("handle", -0.5);

  var world = new SAT.World();

  var poly = new SAT.Body(P(V(60, 0), [ V(0, -30), V(30, 0), V(0, 30),
      V(-30, 0) ]), {
    solid : true
  });
  world.addBody(poly);

  world.addBody(new SAT.Body(C(V(-60, 0), 25), {
    solid : true,
    heavy : true
  }));

  world.addBody(new SAT.Body(P(V(0, 0), [ V(-20, -20), V(20, -20), V(20, 20),
      V(-20, 20) ]), {
    solid : true
  }));

  root.tick(function(t) {
    poly.shape.setAngle(poly.shape.angle + (Math.PI * t / 1000));
    root.touch();
  });

  new Cut.SAT(world).appendTo(root);
});

function V(x, y) {
  return new SAT.Vector(x, y);
};

function P(c, vs) {
  return new SAT.Polygon(c, vs);
};

function C(c, r) {
  return new SAT.Circle(c, r);
};
