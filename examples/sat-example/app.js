var V = function(x, y) {
  return new SAT.Vector(x, y);
};
var P = function(pos, points) {
  return new SAT.Polygon(pos, points);
};
var C = function(pos, r) {
  return new SAT.Circle(pos, r);
};
var B = function(pos, w, h) {
  return new SAT.Box(pos, w, h);
};

Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container);
  root.viewbox(400, 400).pin("handle", 0);

  var world = new SAT.World();
  var poly;
  world.addBody(poly = new SAT.Body(P(V(160, 120),
      [ V(0, 0), V(60, 0), V(100, 40), V(60, 80), V(0, 80) ]).translate(-50,
      -40), {
    solid : true
  }));
  world.addBody(new SAT.Body(P(V(10, 10), [ V(0, 0), V(30, 0), V(30, 30),
      V(0, 30) ]), {
    solid : true
  }));
  world.addBody(new SAT.Body(C(V(50, 200), 30), {
    solid : true,
    heavy : true
  }));

  // var time = 0;
  // root.tick(function(t) {
  // poly.shape.rotate(Math.PI * (time += t) / 1000);
  // root.touch();
  // });

  new Cut.SAT(world).appendTo(root);
}, "example1");

Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container);
  root.viewbox(640, 640).pin("handle", 0);

  var world = new SAT.World({
    loopCount : 5
  });
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      world.addBody(new SAT.Body(C(V((40 * i) + 20, (40 * j) + 20), 18), {
        solid : true
      }));
    }
  }

  new Cut.SAT(world).appendTo(root);
}, "example2");