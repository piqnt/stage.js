var P2_DEBUG = false;

var p2s = 0.1;

Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);

  root.on("resize", function(width, height) {
    this.pin({
      offsetX : (width / 2) | 0,
      offsetY : (height / 2) | 0,
    });
  });

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

  var leftShape = new p2.Line(25 * p2s, 1 * p2s);
  var leftWall = new p2.Body({
    position : [ +9 * p2s, -0.5 * p2s ],
    angle : Math.PI / 2,
    mass : 0,
  });
  leftShape.material = wallMat;
  leftWall.addShape(leftShape);
  leftWall.ui = null;
  world.addBody(leftWall);

  var rightShape = new p2.Line(25 * p2s, 1 * p2s);
  var rightWall = new p2.Body({
    position : [ -9 * p2s, -0.5 * p2s ],
    angle : Math.PI / 2,
    mass : 0
  });
  rightShape.material = wallMat;
  rightWall.addShape(rightShape);
  rightWall.ui = null;
  world.addBody(rightWall);

  var topShape = new p2.Line(18 * p2s, 1 * p2s);
  var topWall = new p2.Body({
    position : [ 0, +12 * p2s ],
    mass : 0
  });
  topShape.material = wallMat;
  topWall.addShape(topShape);
  topWall.ui = null;
  world.addBody(topWall);

  var bottomShape = new p2.Line(18 * p2s, 1 * p2s);
  var bottomWall = new p2.Body({
    position : [ 0, -13 * p2s ],
    mass : 0
  });
  bottomShape.material = wallMat;
  bottomWall.addShape(bottomShape);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  var paddleShape = new p2.Convex([ [ 0.2, -0.01 ], [ 0.2, 0.01 ],
      [ 0.15, 0.05 ], [ 0.05, 0.06 ], [ -0.05, 0.06 ], [ -0.15, 0.05 ],
      [ -0.2, 0.01 ], [ -0.2, -0.01 ] ]);
  paddleShape.material = paddleMat;
  var paddleBody = new p2.Body({
    position : [ 0, -10.5 * p2s ],
    mass : 0
  });
  paddleBody.addShape(paddleShape);
  paddleBody.ui = Cut.anim("tiles:full").pin("handle", 0.5);
  world.addBody(paddleBody);

  var ballShape = new p2.Circle(0.5 * p2s);
  ballShape.material = ballMat;
  var ballBody = new p2.Body({
    position : [ 0, 0 ],
    mass : 1
  });
  ballBody.damping = 0;
  ballBody.angularDamping = 0;
  ballBody.addShape(ballShape);
  ballBody.isBall = true;
  ballBody.ui = Cut.anim("tiles:ball_", 10).pin("handle", 0.5).play();

  var brickShape = new p2.Capsule(1 * p2s, 0.5 * p2s);
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
        !anyBall() && die();
      } else if (brick) {
        world.removeBody(brick);
        !anyBricks() && levelup();
      }
    }
  });

  function anyBricks() {
    for (var i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBrick) {
        return true;
      }
    }
  }

  function anyBall() {
    for (var i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBall) {
        return true;
      }
    }
  }

  var level = 0, lives = 0, score = 0, speed = 0;

  function updateMessage(msg) {
    message.setValue(msg);
  }

  function updateStatus(msg) {
    status.setValue("Level: " + (level + 1) + "  Lives: " + lives);
  }

  function die() {
    lives--;
    (lives <= 0) ? gameover() : start();
  }

  function gameover() {
    updateStatus();
    clear();
    init();
  }

  function init() {
    level = 0, lives = 3, over = true;
    updateMessage("Click to start!");
    paddleBody.ui.hide();
    logo.tween(500).clear(true).pin("alpha", 1);
  }

  root.on("click", function() {
    if (over) {
      over = false;
      updateMessage("");
      paddleBody.ui.show();
      logo.tween(500).clear(false).pin("alpha", 0).then(start);
    }
  });

  function levelup() {
    level++;
    clear();
    start();
  }

  function clear() {
    for (var i = world.bodies.length - 1; i >= 0; i--) {
      if (world.bodies[i].isBrick || world.bodies[i].isBall) {
        world.removeBody(world.bodies[i]);
      }
    }
  }

  function start() {

    speed = 20 * p2s;

    updateStatus();

    tri.tween(200).clear(true).pin("alpha", 1).tween(200, 500).pin("alpha", 0);
    two.tween(200, 1000).clear(true).pin("alpha", 1).tween(200, 500).pin(
        "alpha", 0);
    one.tween(200, 2000).clear(true).pin("alpha", 1).tween(200, 500).pin(
        "alpha", 0);

    if (!anyBricks()) {
      var bricks = LEVELS[level % LEVELS.length];
      for (var j = 0; j < bricks.length; j++) {
        for (var i = 0; i < bricks[j].length; i++) {
          var brick = bricks[j][i];
          if (brick === "x") {
            continue;
          }
          var brickBody = new p2.Body(
              {
                position : [ (i - 3) * 2 * p2s,
                    (j + 7 - bricks.length / 2) * p2s ],
                mass : 0
              });
          brickBody.addShape(brickShape);
          brickBody.isBrick = true;
          brickBody.ui = Cut.anim("tiles:b" + brick + "_").pin("handle", 0.5);
          brickBody.ui.drop = function() {
            this.repeat(1, function() {
              this.remove();
            }).fps(24);
          };
          world.addBody(brickBody);
        }
      }
    }

    setTimeout(function() {
      world.addBody(ballBody);

      var a = Math.PI * M.random(-0.2, 0.2);
      ballBody.velocity[0] = speed * Math.sin(a);
      ballBody.velocity[1] = speed * Math.cos(a);

      ballBody.position[0] = 0;
      ballBody.position[1] = -5 * p2s;
    }, 3000);
  }

  var p2cut = Cut.p2(world, {
    lineWidth : 0.01,
    lineColor : "#888",
    ratio : 256,
    debug : P2_DEBUG
  }).appendTo(root).on(
      Cut.Mouse.MOVE,
      function(ev, point) {
        paddleBody.position[0] = Math.max(-8.5 * p2s, Math.min(8.5 * p2s,
            point.x));
      }).spy(true).pin("scale", 16 / p2s);

  var tri = Cut.image("tiles:tri").prependTo(p2cut).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  var two = Cut.image("tiles:two").prependTo(p2cut).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  var one = Cut.image("tiles:one").prependTo(p2cut).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  var logo = Cut.image("logo:logo").prependTo(p2cut).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  var bg = Cut.image("bg:prerendered").prependTo(p2cut).pin("align", 0.5)
      .visible(!P2_DEBUG);
  var status = Cut.string("font:_").appendTo(bg).pin({
    alignX : 0.5,
    alignY : 1,
    offsetY : -0.5 * p2s,
  });

  var message = Cut.string("font:_").appendTo(bg).pin({
    alignX : 0.5,
    alignY : 1,
    offsetY : -4 * p2s,
  });

  init();

});
