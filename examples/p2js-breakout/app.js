var P2_DEBUG = false;

var p2s = 0.5, ppu = 16 / p2s;

Cut(function(root, container) {
  Cut.Mouse.subscribe(root, container);

  var M = Cut.Math;
  var maxKey = "breakout-v1";
  var width = 20 * p2s, height = 26 * p2s;
  var ui = {}, shape = {}, mat = {}, rand = {};
  var score = 0, add = 1, max = 0, playing = false;

  root.viewbox(width * ppu, height * 1.12 * ppu).pin("offsetY",
      -height * 0.04 * ppu).pin("align", -0.5);

  root.MAX_ELAPSE = 100;

  var timer = new Timer();

  var paddleSpeed = 20 * p2s, dropSpeed = -6 * p2s;

  function ballSpeed() {
    return (13 + score * 0.05) * p2s;
  }

  function nextRow() {
    return 8000 - 20 * score;
  }

  rand.color = new Randomize().add("b").add("r").add("y").add("g").add("p");
  rand.bricks = new Randomize().add(function(x, y) {
    var color = rand.color.random();
    world.addBody(newBrick(color, shape.brick, [ x, y ]));
  }, function() {
    return score + 1;
  }).add(
      function(x, y) {
        var color = rand.color.random();
        world.addBody(newBrick(color + "s", shape.smallbrick, [ x + 0.5 * p2s,
            y + 0.5 * p2s ]));
        world.addBody(newBrick(color + "s", shape.smallbrick, [ x - 0.5 * p2s,
            y + 0.5 * p2s ]));
        world.addBody(newBrick(color + "s", shape.smallbrick, [ x + 0.5 * p2s,
            y - 0.5 * p2s ]));
        world.addBody(newBrick(color + "s", shape.smallbrick, [ x - 0.5 * p2s,
            y - 0.5 * p2s ]));
      }, function() {
        return Math.max(0, score * 1.1 - 60);
      }).prob(0.9);
  rand.drop = new Randomize().add("+", 0.6).add("-", 0.4).prob(0.1);

  var world = new p2.World({
    // broadphase : new p2.SAPBroadphase(),
    gravity : [ 0, 0 ],
    defaultFriction : 0
  });

  world.solver.stiffness = Number.MAX_VALUE;

  mat.ball = new p2.Material();
  mat.wall = mat.brick = mat.paddle = new p2.Material();

  world.addContactMaterial(new p2.ContactMaterial(mat.ball, mat.wall, {
    restitution : 1.0,
  }));

  shape.vwall = new p2.Line(25 * p2s, 1 * p2s);
  shape.vwall.material = mat.wall;
  shape.hwall = new p2.Line(18 * p2s, 1 * p2s);
  shape.hwall.material = mat.wall;
  shape.ball = new p2.Circle(0.5 * p2s);
  shape.ball.material = mat.ball;
  shape.brick = new p2.Rectangle(1.9 * p2s, 1.9 * p2s);
  shape.brick.material = mat.brick;
  shape.smallbrick = new p2.Rectangle(0.9 * p2s, 0.9 * p2s);
  shape.smallbrick.material = mat.brick;
  shape.drop = new p2.Circle(0.3 * p2s);

  shape.paddleFull = new p2.Convex([ [ 1.8 * p2s, -0.1 * p2s ],
      [ 1.8 * p2s, 0.1 * p2s ], [ 1.2 * p2s, 0.4 * p2s ],
      [ 0.4 * p2s, 0.6 * p2s ], [ -0.4 * p2s, 0.6 * p2s ],
      [ -1.2 * p2s, 0.4 * p2s ], [ -1.8 * p2s, 0.1 * p2s ],
      [ -1.8 * p2s, -0.1 * p2s ] ]);
  shape.paddleFull.material = mat.paddle;

  shape.paddleMini = new p2.Convex([ [ 1.2 * p2s, -0.1 * p2s ],
      [ 1.2 * p2s, 0.1 * p2s ], [ 0.9 * p2s, 0.4 * p2s ],
      [ 0.2 * p2s, 0.6 * p2s ], [ -0.2 * p2s, 0.6 * p2s ],
      [ -0.9 * p2s, 0.4 * p2s ], [ -1.2 * p2s, 0.1 * p2s ],
      [ -1.2 * p2s, -0.1 * p2s ] ]);
  shape.paddleMini.material = mat.paddle;

  var BALL = 1, WALL = 2, BRICK = 4, DROP = 8;

  shape.vwall.collisionGroup = WALL;
  shape.hwall.collisionGroup = WALL;
  shape.paddleFull.collisionGroup = WALL;
  shape.paddleMini.collisionGroup = WALL;
  shape.brick.collisionGroup = BRICK;
  shape.smallbrick.collisionGroup = BRICK;
  shape.ball.collisionGroup = BALL;
  shape.drop.collisionGroup = DROP;

  shape.vwall.collisionMask = BALL;
  shape.hwall.collisionMask = BALL | DROP;
  shape.brick.collisionMask = BALL;
  shape.smallbrick.collisionMask = BALL;
  shape.paddleFull.collisionMask = BALL | DROP;
  shape.paddleMini.collisionMask = BALL | DROP;
  shape.ball.collisionMask = WALL | BRICK;
  shape.drop.collisionMask = WALL;

  var leftWall = new p2.Body({
    position : [ +9 * p2s, -0.5 * p2s ],
    angle : Math.PI / 2,
    mass : 0,
  });
  leftWall.addShape(shape.vwall);
  leftWall.ui = null;
  world.addBody(leftWall);

  var rightWall = new p2.Body({
    position : [ -9 * p2s, -0.5 * p2s ],
    angle : Math.PI / 2,
    mass : 0
  });
  rightWall.addShape(shape.vwall);
  rightWall.ui = null;
  world.addBody(rightWall);

  var topWall = new p2.Body({
    position : [ 0, +12 * p2s ],
    mass : 0
  });
  topWall.addShape(shape.hwall);
  topWall.ui = null;
  world.addBody(topWall);

  var bottomWall = new p2.Body({
    position : [ 0, -13 * p2s ],
    mass : 0
  });
  bottomWall.addShape(shape.hwall);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  var paddle = {
    set : function(paddle) {
      if (this.current) {
        world.removeBody(this.current);
        paddle.position[0] = this.current.position[0];
        paddle.velocity[0] = this.current.velocity[0];
      }
      world.addBody(this.current = paddle);
    }
  };

  paddle.full = new p2.Body({
    position : [ 0, -10.5 * p2s ],
    mass : 0
  });
  paddle.full.paddleWidth = 3 * p2s;
  paddle.full.addShape(shape.paddleFull);
  paddle.full.isPaddle = true;
  paddle.full.ui = Cut.image("paddleFull").pin("handle", 0.5);
  paddle.full.motionState = p2.Body.STATIC;

  paddle.mini = new p2.Body({
    position : [ 0, -10.5 * p2s ],
    mass : 0
  });
  paddle.mini.paddleWidth = 2 * p2s;
  paddle.mini.addShape(shape.paddleMini);
  paddle.mini.isPaddle = true;
  paddle.mini.ui = Cut.image("paddleMini").pin("handle", 0.5);
  paddle.mini.motionState = p2.Body.STATIC;

  function newBall(p) {
    var body = new p2.Body({
      mass : 1
    });
    if (p) {
      body.position = p;
    }
    body.damping = 0;
    body.angularDamping = 0;
    body.addShape(shape.ball);
    body.isBall = true;
    body.ui = Cut.image("ball", 10).pin("handle", 0.5);
    return body;
  }

  function newDrop(name) {
    var body = new p2.Body({
      mass : 1
    });
    body.addShape(shape.drop);
    body.isDrop = name;
    body.ui = Cut.image("" + name).pin("handle", 0.5);
    return body;
  }

  function newBrick(name, shape, p) {
    var body = new p2.Body({
      mass : 0
    });
    if (p) {
      body.position = p;
    }
    body.addShape(shape);
    body.isBrick = true;
    body.ui = Cut.image("b" + name).pin("handle", 0.5);
    body.ui.drop = function() {
      this.tween(70).pin("alpha", 0).then(function() {
        this.remove();
      });
    };
    body.motionState = p2.Body.STATIC;
    return body;
  }

  world.on("impact", function(evt) {
    var a = evt.bodyA, b = evt.bodyB;
    var iball = a.isBall && a || b.isBall && b;
    var ibrick = a.isBrick && a || b.isBrick && b;
    var ibottom = a.isBottom && a || b.isBottom && b;
    var ipaddle = a.isPaddle && a || b.isPaddle && b;
    var idrop = a.isDrop && a || b.isDrop && b;

    if (idrop) {
      world.removeBody(idrop);
      var oldball;
      if (ipaddle && (oldball = anyBall())) {
        if (idrop.isDrop == "+") {
          var newball = newBall();
          newball.position[0] = oldball.position[0];
          newball.position[1] = oldball.position[1];
          newball.velocity[0] = -oldball.velocity[0];
          newball.velocity[1] = -oldball.velocity[1];
          world.addBody(newball);
        } else {
          setTimeout(function() {
            paddle.set(paddle.mini);
          }, 1);
          timer.once('mini', function() {
            setTimeout(function() {
              paddle.set(paddle.full);
            }, 1);
          }, 7500);
        }
      }
    }

    if (iball) {
      if (iball.velocity[1] >= 0) {
        iball.velocity[1] = Math.max(iball.velocity[1], ballSpeed() / 3);
      } else {
        iball.velocity[1] = Math.min(iball.velocity[1], -ballSpeed() / 3);
      }
      var s = ballSpeed() / M.length(iball.velocity[0], iball.velocity[1]);
      iball.velocity[0] *= s;
      iball.velocity[1] *= s;
      iball.angularVelocity = iball.angle = 0;

      if (ibrick) {
        world.removeBody(ibrick);
        !anyBricks() && addBrick();
        score += add;
        // add++;
        updateScore();

        var drop = rand.drop.test() && rand.drop.random();
        if (drop) {
          drop = newDrop(drop);
          drop.position[0] = ibrick.position[0];
          drop.position[1] = ibrick.position[1];
          drop.velocity[1] = dropSpeed;
          world.addBody(drop);
        }

      } else if (ipaddle) {
        add = 1;
      } else if (ibottom) {
        world.removeBody(iball);
        !anyBall() && gameover();
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

  function updateStatus() {
    updateScore();
  }

  function updateScore() {
    ui.score.setValue(score);
    ui.max.setValue(max);
  }

  var onclick;

  function gameover() {
    playing = false;
    updateStatus();
    max = Math.max(max, score);
    try {
      localStorage.setItem(maxKey, max);
    } catch (e) {
    }
    for (var i = world.bodies.length - 1; i >= 0; i--) {
      if (world.bodies[i].isBall) {
        world.removeBody(world.bodies[i]);
      }
    }
    paddle.current.ui.hide();
    start(true);
  }

  function start(over) {
    score = 0, add = 1;
    timer.empty('brick');
    try {
      max = max || localStorage.getItem(maxKey) || 0;
    } catch (e) {
    }

    if (over) {
      ui.restart.appendTo(root);
      ui.p2.tween(100).clear().pin("alpha", 0.5);
      onclick = function() {
        ui.p2.tween(100).clear().pin("alpha", 1);
        ui.restart.remove();
        clear();
        init();
        play();
      };
    } else {
      init();
      onclick = play;
    }

  }

  function clear() {
    timer.empty();
    for (var i = world.bodies.length - 1; i >= 0; i--) {
      if (world.bodies[i].isBrick || world.bodies[i].isBall
          || world.bodies[i].isDrop) {
        world.removeBody(world.bodies[i]);
      }
    }
  }

  function init() {
    updateStatus();
    paddle.set(paddle.full);
    paddle.current.ui.show();
    world.addBody(newBall([ 0, -5 * p2s ]));
    addBrick() + addBrick() + addBrick();
  }

  function play() {
    var ball = anyBall();
    var a = Math.PI * M.random(-0.2, 0.2);
    ball.velocity = [ ballSpeed() * Math.sin(a), ballSpeed() * Math.cos(a) ];
    timer.repeat('brick', addBrick, nextRow());
    playing = true;
  }

  root.on(Cut.Mouse.CLICK, function() {
    var fn = onclick;
    onclick = null;
    fn && fn();
  });

  root.tick(function(t) {
    if (playing) {
      var over = true;
      for (var i = world.bodies.length - 1; i >= 0; i--) {
        var body = world.bodies[i];
        if (Math.abs(body.position[0]) > width / 2
            || Math.abs(body.position[1]) > height / 2) {
          world.removeBody(body);
          removed = true;
        } else if (body.isBall) {
          over = false;
        }
      }
      over && gameover();
      timer.tick(t);
    }
  });

  function addBrick() {
    var over = false;
    for (var i = 0; i < world.bodies.length; i++) {
      var brick = world.bodies[i];
      if (brick.isBrick) {
        brick.position[1] -= 2 * p2s;
        over = over || brick.position[1] < -10 * p2s;
      }
    }

    for (var i = 0; i < 7; i++) {
      var bricks = rand.bricks.test() && rand.bricks.random();
      bricks && bricks((i - 3) * 2 * p2s, 9 * p2s);
    }
    over && gameover();
  }

  ui.bg = Cut.image("board").appendTo(root).pin("handle", 0.5)
      .pin("scale", ppu).attr('spy', true);

  ui.p2 = new Cut.P2(world, {
    lineWidth : 0.01,
    lineColor : "#888",
    ratio : 256,
    debug : P2_DEBUG
  });
  ui.p2.appendTo(ui.bg).pin("align", 0.5);

  var paddleTo = 0;

  ui.p2.attr('spy', true).on([ Cut.Mouse.START, Cut.Mouse.MOVE ],
      function(point) {
        paddleTo = point.x;
      });

  root.tick(function(t) {
    if (paddle.current) {
      var x = Math.max(paddle.current.paddleWidth / 2 - 9 * p2s, Math.min(
          -paddle.current.paddleWidth / 2 + 9 * p2s, paddleTo));
      var d = paddle.current.position[0] - x;
      if (Math.abs(d) > 0.001) {
        var max = paddleSpeed * t / 1000;
        paddle.current.position[0] -= Math.max(-max, Math.min(max, d));
      }
    }
  });

  ui.max = Cut.string("d_").appendTo(ui.bg).pin({
    alignX : 1,
    alignY : 1,
    offsetX : -1.5 * p2s,
    offsetY : -0.5 * p2s
  });

  ui.score = Cut.string("d_").appendTo(ui.bg).pin({
    alignX : 0,
    alignY : 1,
    offsetX : 1.5 * p2s,
    offsetY : -0.5 * p2s
  });

  ui.restart = Cut.image("restart").pin({
    handle : 0.5,
    offsetY : 0.5 * ppu,
    "scale" : ppu
  });

  start();

});
