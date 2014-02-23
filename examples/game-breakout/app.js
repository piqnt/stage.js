var P2_DEBUG = false;

var p2s = 0.1;

Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);

  root.on("viewport", function(width, height) {
    this.pin({
      offsetX : (width / 2) | 0,
      offsetY : (height / 2) | 0,
    });
  });

  var ui = {}, sound = {};

  var M = Cut.Math;

  var world = new p2.World({
    gravity : [ 0, 0 ],
    defaultFriction : 0
  });

  world.solver.stiffness = Number.MAX_VALUE;

  var mat = {};

  mat.ball = new p2.Material();
  mat.wall = new p2.Material();
  mat.brick = mat.wall;
  mat.paddle = mat.wall;

  world.addContactMaterial(new p2.ContactMaterial(mat.ball, mat.wall, {
    restitution : 1.0,
  }));

  var shape = {};

  shape.v = new p2.Line(25 * p2s, 1 * p2s);
  shape.v.material = mat.wall;

  shape.h = new p2.Line(18 * p2s, 1 * p2s);
  shape.h.material = mat.wall;

  shape.ball = new p2.Circle(0.5 * p2s);
  shape.ball.material = mat.ball;

  shape.paddleFull = new p2.Convex([ [ 0.18, -0.01 ], [ 0.18, 0.01 ],
      [ 0.12, 0.05 ], [ 0.04, 0.06 ], [ -0.04, 0.06 ], [ -0.12, 0.05 ],
      [ -0.18, 0.01 ], [ -0.18, -0.01 ] ]);
  shape.paddleFull.material = mat.paddle;

  shape.paddleMini = new p2.Convex([ [ 0.12, -0.01 ], [ 0.12, 0.01 ],
      [ 0.09, 0.05 ], [ 0.02, 0.06 ], [ -0.02, 0.06 ], [ -0.09, 0.05 ],
      [ -0.12, 0.01 ], [ -0.12, -0.01 ] ]);
  shape.paddleMini.material = mat.paddle;

  shape.brick = new p2.Capsule(1 * p2s, 0.5 * p2s);
  shape.brick.material = mat.brick;

  shape.drop = new p2.Circle(0.5 * p2s);

  var BALL = 1, WALL = 2, BRICK = 4, DROP = 8;

  shape.v.collisionGroup = WALL;
  shape.h.collisionGroup = WALL;
  shape.paddleFull.collisionGroup = WALL;
  shape.paddleMini.collisionGroup = WALL;
  shape.brick.collisionGroup = BRICK;
  shape.ball.collisionGroup = BALL;
  shape.drop.collisionGroup = DROP;

  shape.v.collisionMask = BALL;
  shape.h.collisionMask = BALL | DROP;
  shape.brick.collisionMask = BALL;
  shape.paddleFull.collisionMask = BALL | DROP;
  shape.paddleMini.collisionMask = BALL | DROP;
  shape.ball.collisionMask = WALL | BRICK;
  shape.drop.collisionMask = WALL;

  var leftWall = new p2.Body({
    position : [ -9 * p2s, -0.5 * p2s ],
    angle : -Math.PI / 2,
    mass : 0,
  });
  leftWall.addShape(shape.v);
  leftWall.ui = null;
  world.addBody(leftWall);

  var rightWall = new p2.Body({
    position : [ +9 * p2s, -0.5 * p2s ],
    angle : Math.PI / 2,
    mass : 0
  });
  rightWall.addShape(shape.v);
  rightWall.ui = null;
  world.addBody(rightWall);

  var topWall = new p2.Body({
    position : [ 0, +12 * p2s ],
    mass : 0,
    angle : Math.PI
  });
  topWall.addShape(shape.h);
  topWall.ui = null;
  world.addBody(topWall);

  var bottomWall = new p2.Body({
    position : [ 0, -13 * p2s ],
    mass : 0
  });
  bottomWall.addShape(shape.h);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  var paddleFull = new p2.Body({
    position : [ 0, -10.5 * p2s ],
    mass : 0
  });
  paddleFull.addShape(shape.paddleFull);
  paddleFull.isPaddle = true;
  paddleFull.ui = Cut.image("tiles:paddleFull").pin("handle", 0.5);

  world.addBody(paddle = paddleFull);

  var paddleMini = new p2.Body({
    position : [ 0, -10.5 * p2s ],
    mass : 0
  });
  paddleMini.addShape(shape.paddleMini);
  paddleMini.isPaddle = true;
  paddleMini.ui = Cut.image("tiles:paddleMini").pin("handle", 0.5);

  function newBall() {
    var body = new p2.Body({
      mass : 1
    });
    body.damping = 0;
    body.angularDamping = 0;
    body.addShape(shape.ball);
    body.isBall = true;
    body.ui = Cut.anim("tiles:ball_", 10).pin("handle", 0.5).play();
    return body;
  }

  function newDrop(name) {
    var body = new p2.Body({
      mass : 1
    });
    body.addShape(shape.drop);
    body.isDrop = name;
    body.ui = Cut.image("tiles:" + name).pin("handle", 0.5);
    return body;
  }

  function newBrick(color) {
    var body = new p2.Body({
      mass : 0
    });
    body.addShape(shape.brick);
    body.isBrick = true;
    body.ui = Cut.anim("tiles:b" + color + "_").pin("handle", 0.5);
    body.ui.drop = function() {
      this.repeat(1, function() {
        this.remove();
      }).fps(24);
    };
    return body;
  }

  var miniPaddle;

  function setPaddle(newpaddle) {
    if (paddle == newpaddle) {
      return;
    }
    newpaddle.position[0] = paddle.position[0];
    newpaddle.position[1] = paddle.position[1];
    newpaddle.velocity[0] = -paddle.velocity[0];
    newpaddle.velocity[1] = -paddle.velocity[1];
    world.removeBody(paddle);
    world.addBody(paddle = newpaddle);
  }

  world.on("impact", function(evt) {
    var a = evt.bodyA, b = evt.bodyB;
    var iball = a.isBall && a || b.isBall && b;
    var ibrick = a.isBrick && a || b.isBrick && b;
    var ibottom = a.isBottom && a || b.isBottom && b;
    var idrop = a.isDrop && a || b.isDrop && b;
    var ipaddle = a.isPaddle && a || b.isPaddle && b;

    if (idrop && idrop.world) {
      idrop.world.removeBody(idrop);
      var oldball;
      if (ipaddle && (oldball = anyBall())) {
        if (idrop.isDrop == "+") {
          sound.powerup.play();
          var newball = newBall();
          newball.position[0] = oldball.position[0];
          newball.position[1] = oldball.position[1];
          newball.velocity[0] = -oldball.velocity[0];
          newball.velocity[1] = -oldball.velocity[1];
          world.addBody(newball);
        } else {
          sound.powerdown.play();
          setPaddle(paddleMini);
          clearTimeout(miniPaddle);
          miniPaddle = setTimeout(function() {
            setPaddle(paddleFull);
          }, 5000);
        }
      }
    }

    if (iball) {
      if (iball.velocity[1] >= 0) {
        iball.velocity[1] = Math.max(iball.velocity[1], speed / 3);
      } else {
        iball.velocity[1] = Math.min(iball.velocity[1], -speed / 3);
      }
      var s = speed / M.length(iball.velocity[0], iball.velocity[1]);
      iball.velocity[0] *= s;
      iball.velocity[1] *= s;
      iball.angularVelocity = iball.angle = 0;

      if (ibottom) {
        world.removeBody(iball);
        !anyBall() && die();

      } else if (ibrick) {
        world.removeBody(ibrick);
        score++;
        sound.brick.play();
        updateStatus();
        if (!anyBricks()) {
          levelup();
        } else if (Math.random() > 0.8) {
          var drop = newDrop(Math.random() > 0.4 ? "+" : "-");
          drop.position[0] = ibrick.position[0];
          drop.position[1] = ibrick.position[1];
          drop.velocity[1] = -speed / 4;
          world.addBody(drop);
        }
      }
    }
  });

  function anyBricks() {
    for (var i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBrick) {
        return world.bodies[i];
      }
    }
  }

  function anyBall() {
    for (var i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBall) {
        return world.bodies[i];
      }
    }
  }

  var level = 0, lives = 0, score = 0, speed = 0;

  function updateMessage(msg) {
    ui.message.setValue(msg);
  }

  function updateStatus() {
    ui.status.setValue("Level: " + (level + 1) + "  Lives: " + lives
        + "  Score: " + score);
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
    level = 0, lives = 3, score = 0, over = true;
    updateMessage("Click to start!");
    paddle.ui.hide();
    ui.logo.tween(500).clear(true).pin("alpha", 1);
  }

  root.on("click", function() {
    if (over) {
      over = false;
      updateMessage("");
      paddle.ui.show();
      ui.logo.tween(500).clear(false).pin("alpha", 0).then(start);
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

    speed = 16 * p2s;

    updateStatus();

    if (!P2_DEBUG) {
      ui.tri.tween(200).clear(true).pin("alpha", 1).then(function() {
        sound.countdown.play();
      }).tween(200, 500).pin("alpha", 0);
      ui.two.tween(200, 1000).clear(true).pin("alpha", 1).then(function() {
        sound.countdown.play();
      }).tween(200, 500).pin("alpha", 0);
      ui.one.tween(200, 2000).clear(true).pin("alpha", 1).then(function() {
        sound.countdown.play();
      }).tween(200, 500).pin("alpha", 0);
    }

    if (!anyBricks()) {
      var bricks = LEVELS[level % LEVELS.length];
      for (var j = 0; j < bricks.length; j++) {
        for (var i = 0; i < bricks[j].length; i++) {
          var color = bricks[j][i];
          if (color === "x") {
            continue;
          }
          var brickBody = newBrick(color);
          brickBody.position = [ (i - 3) * 2 * p2s,
              (j + 7 - bricks.length / 2) * p2s ];
          world.addBody(brickBody);
        }
      }
    }

    setTimeout(function() {
      var ballBody = newBall();
      var a = Math.PI * M.random(-0.2, 0.2);
      ballBody.velocity = [ speed * Math.sin(a), speed * Math.cos(a) ];
      ballBody.position = [ 0, -5 * p2s ];
      world.addBody(ballBody);
      sound.recover.play();
    }, P2_DEBUG ? 0 : 3000);
  }

  ui.p2 = Cut.p2(world, {
    lineWidth : 0.01,
    lineColor : "#888",
    ratio : 256,
    debug : P2_DEBUG
  }).appendTo(root).on(Cut.Mouse.MOVE, function(ev, point) {
    paddle.position[0] = Math.max(-8.5 * p2s, Math.min(8.5 * p2s, point.x));
  }).spy(true).pin("scale", 16 / p2s);

  ui.tri = Cut.image("tiles:tri").prependTo(ui.p2).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  ui.two = Cut.image("tiles:two").prependTo(ui.p2).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  ui.one = Cut.image("tiles:one").prependTo(ui.p2).pin("align", 0.5).pin(
      "alpha", 0).visible(!P2_DEBUG);
  ui.logo = Cut.image("logo:logo").prependTo(ui.p2).pin("align", 0.5).pin(
      "alpha", 0);
  ui.bg = Cut.image("bg:prerendered").prependTo(ui.p2).pin("align", 0.5)
      .visible(!P2_DEBUG);
  ui.status = Cut.string("font:_").appendTo(ui.bg).pin({
    alignX : 0.5,
    alignY : 1,
    offsetY : -0.5 * p2s,
  });
  ui.message = Cut.string("font:_").appendTo(ui.bg).pin({
    alignX : 0.5,
    alignY : 1,
    offsetY : -4 * p2s,
  });

  sound.brick = new Howl({
    urls : [ 'sfx/brickDeath.mp3', 'sfx/brickDeath.ogg', 'sfx/brickDeath.wav' ]
  });
  sound.powerup = new Howl({
    urls : [ 'sfx/powerup.mp3', 'sfx/powerup.ogg', 'sfx/powerup.wav' ]
  });
  sound.powerdown = new Howl({
    urls : [ 'sfx/powerdown.mp3', 'sfx/powerdown.ogg', 'sfx/powerdown.wav' ]
  });
  sound.recover = new Howl({
    urls : [ 'sfx/recover.mp3', 'sfx/recover.ogg', 'sfx/recover.wav' ]
  });
  sound.countdown = new Howl({
    urls : [ 'sfx/countdownBlip.mp3', 'sfx/countdownBlip.ogg',
        'sfx/countdownBlip.wav' ]
  });

  init();

});
