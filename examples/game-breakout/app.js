Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(20, 30).pin("handle", -0.5);

  var world = new p2.World({
    gravity : [ 0, 0 ],
    defaultFriction : 0
  });

  world.solver.stiffness = Number.MAX_VALUE;

  var ballMat = new p2.Material();
  var wallMat = new p2.Material();
  var brickMat = wallMat;
  var paddleMat = wallMat;

  var leftShape = new p2.Line(25);
  var leftWall = new p2.Body({
    position : [ +9, -0.5 ],
    angle : Math.PI / 2,
    mass : 0,
  });
  leftShape.material = wallMat;
  leftWall.addShape(leftShape);
  leftWall.ui = null;
  world.addBody(leftWall);

  var rightShape = new p2.Line(25);
  var rightWall = new p2.Body({
    position : [ -9, -0.5 ],
    angle : Math.PI / 2,
    mass : 0
  });
  rightShape.material = wallMat;
  rightWall.addShape(rightShape);
  rightWall.ui = null;
  world.addBody(rightWall);

  var topShape = new p2.Line(18);
  var topWall = new p2.Body({
    position : [ 0, +12 ],
    mass : 0
  });
  topShape.material = wallMat;
  topWall.addShape(topShape);
  topWall.ui = null;
  world.addBody(topWall);

  var bottomShape = new p2.Line(18);
  var bottomWall = new p2.Body({
    position : [ 0, -13 ],
    mass : 0
  });
  bottomShape.material = wallMat;
  bottomWall.addShape(bottomShape);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  var paddleShape = new p2.Capsule(15, 0.5);
  paddleShape.material = paddleMat;
  var paddleBody = new p2.Body({
    position : [ 0, -10.5 ],
    mass : 0
  });
  paddleBody.addShape(paddleShape);
  paddleBody.ui = Cut.anim("base:full").pin("handle", 0.5);
  world.addBody(paddleBody);

  var ballShape = new p2.Circle(0.5);
  ballShape.material = ballMat;
  var ballBody = new p2.Body({
    position : [ 0, 0 ],
    mass : 1
  });
  ballBody.damping = 0;
  ballBody.angularDamping = 0;
  ballBody.addShape(ballShape);
  ballBody.isBall = true;
  ballBody.ui = Cut.anim("base:ball_", 10).pin("handle", 0.5).play();

  var brickShape = new p2.Capsule(1, 0.5);
  brickShape.material = brickMat;

  world.addContactMaterial(new p2.ContactMaterial(ballMat, wallMat, {
    restitution : 1.0,
  }));

  world.on("impact", function(evt) {
    var a = evt.bodyA, b = evt.bodyB;
    var ball = a.isBall && a || b.isBall && b;
    var brick = a.isBrick && a || b.isBrick && b;
    var bottom = a.isBottom && a || b.isBottom && b;
    if (ball) {
      if (bottom) {
        world.removeBody(ball);
        var more = false;
        for (var i = 0; i < world.bodies.length; i++) {
          if (world.bodies[i].isBall) {
            more = true;
            break;
          }
        }
        !more && die();
      } else if (brick) {
        world.removeBody(brick);
        var more = false;
        for (var i = 0; i < world.bodies.length; i++) {
          if (world.bodies[i].isBrick) {
            more = true;
            break;
          }
        }
        !more && levelup();
      }
    }
  });

  var p2cut = Cut.p2(world, {
    lineWidth : 0.015,
    ratio : 128
  }).appendTo(root).on(Cut.Mouse.MOVE, function(ev, point) {
    paddleBody.position[0] = Math.max(-8.5, Math.min(8.5, point.x));
  }).spy(true);
  Cut.image("base:bg").prependTo(p2cut).pin("align", 0.5);

  var level = 0, lives = 0;

  function die() {
    lives--;
    start();
  }

  function levelup() {
    level++;
    start(true);
  }

  function start(addbricks) {
    console.log(lives, level);
    if (lives <= 0) {
      lives = 3;
      level = 0;
      addbricks = true;
    }

    if (addbricks) {
      for (var i = 0; i < world.bodies.length; i++) {
        if (world.bodies[i].isBrick) {
          world.removeBody(world.bodies[i]);
        }
      }
      var bricks = LEVELS[level % LEVELS.length];
      for (var i = 0; i < bricks.length; i++) {
        for (var j = 0; j < bricks[i].length; j++) {
          var brick = bricks[i][j];
          if (brick === "x") {
            continue;
          }
          var brickBody = new p2.Body({
            position : [ (j - 3) * 2, (i + 5) ],
            mass : 0
          });
          brickBody.addShape(brickShape);
          brickBody.isBrick = true;
          brickBody.ui = Cut.anim("base:b" + brick + "_").pin("handle", 0.5);
          world.addBody(brickBody);
        }
      }
    }

    world.addBody(ballBody);
    ballBody.velocity[0] = Math.random() * 20 - 10;
    ballBody.velocity[1] = 20;
    ballBody.position[0] = 0;
    ballBody.position[1] = -5;
  }

  start(true);
});
