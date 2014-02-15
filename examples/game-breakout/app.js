var P2_DEBUG = true;

Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(20 / 10, 30 / 10).pin("handle", -0.5);

  var M = Cut.Math;

  var world = new p2.World({
    gravity : [ 0, 0 ],
    defaultFriction : 0
  });

  world.solver.stiffness = Number.MAX_VALUE;

  var ballMat = new p2.Material();
  var wallMat = new p2.Material();
  var brickMat = wallMat;
  var paddleMat = wallMat;

  var leftShape = new p2.Line(25 / 10, 1 / 10);
  var leftWall = new p2.Body({
    position : [ +9 / 10, -0.5 / 10 ],
    angle : Math.PI / 2,
    mass : 0,
  });
  leftShape.material = wallMat;
  leftWall.addShape(leftShape);
  leftWall.ui = null;
  world.addBody(leftWall);

  var rightShape = new p2.Line(25 / 10, 1 / 10);
  var rightWall = new p2.Body({
    position : [ -9 / 10, -0.5 / 10 ],
    angle : Math.PI / 2,
    mass : 0
  });
  rightShape.material = wallMat;
  rightWall.addShape(rightShape);
  rightWall.ui = null;
  world.addBody(rightWall);

  var topShape = new p2.Line(18 / 10, 1 / 10);
  var topWall = new p2.Body({
    position : [ 0, +12 / 10 ],
    mass : 0
  });
  topShape.material = wallMat;
  topWall.addShape(topShape);
  topWall.ui = null;
  world.addBody(topWall);

  var bottomShape = new p2.Line(18 / 10, 1 / 10);
  var bottomWall = new p2.Body({
    position : [ 0, -13 / 10 ],
    mass : 0
  });
  bottomShape.material = wallMat;
  bottomWall.addShape(bottomShape);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  var paddleShape = new p2.Convex([ [ -0.2, 0 ], [ -0.1, 0.1 ], [ 0.1, 0.1 ],
      [ 0.2, 0 ] ]);
  paddleShape.material = paddleMat;
  var paddleBody = new p2.Body({
    position : [ 0, -10.5 / 10 ],
    mass : 0
  });
  paddleBody.addShape(paddleShape);
  paddleBody.ui = Cut.anim("base:full").pin("handle", 0.5);
  world.addBody(paddleBody);

  var ballShape = new p2.Circle(0.5 / 10);
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

  var brickShape = new p2.Capsule(1 / 10, 0.5 / 10);
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

      // p2
      if (ball.velocity[1] >= 0) {
        ball.velocity[1] = Math.max(ball.velocity[1], speed / 3);
      } else {
        ball.velocity[1] = Math.min(ball.velocity[1], -speed / 3);
      }
      var s = speed / M.length(ball.velocity[0], ball.velocity[1]);
      ball.velocity[0] *= s;
      ball.velocity[1] *= s;
      ball.angularVelocity = ball.angle = 0;

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

  var level = 0, lives = 0, speed = 0;

  function die() {
    lives--;
    start();
  }

  function levelup() {
    level++;
    start(true);
  }

  function start(addbricks) {
    speed = 20 / 10;
    if (lives <= 0) {
      lives = 3;
      level = 0;
      addbricks = true;
    }

    if (addbricks) {
      for (var i = world.bodies.length - 1; i >= 0; i--) {
        if (world.bodies[i].isBrick || world.bodies[i].isBall) {
          world.removeBody(world.bodies[i]);
        }
      }
      var bricks = LEVELS[level % LEVELS.length];
      for (var j = 0; j < bricks.length; j++) {
        for (var i = 0; i < bricks[j].length; i++) {
          var brick = bricks[j][i];
          if (brick === "x") {
            continue;
          }
          var brickBody = new p2.Body({
            position : [ (i - 3) * 2 / 10, (j + 7 - bricks.length / 2) / 10 ],
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

    var a = Math.PI * M.random(-0.2, 0.2);
    ballBody.velocity[0] = speed * Math.sin(a);
    ballBody.velocity[1] = speed * Math.cos(a);

    ballBody.position[0] = 0;
    ballBody.position[1] = -5 / 10;
  }

  start(true);

  var p2cut = Cut.p2(world, {
    lineWidth : 0.01,
    lineColor : "#888",
    ratio : 256,
    debug : P2_DEBUG
  }).appendTo(root).on(Cut.Mouse.MOVE, function(ev, point) {
    paddleBody.position[0] = Math.max(-8.5 / 10, Math.min(8.5 / 10, point.x));
  }).spy(true);

  !P2_DEBUG && Cut.image("base:bg").prependTo(p2cut).pin("align", 0.5);

});
