import Stage from "../../src";
import { P2Stage } from "../common/stage-p2";
import "./texture";
import Timeout from "../common/timeout";

let P2DEBUG = false;

function Physics(ui, width, height) {
  let world = (this.world = new p2.World({
    // broadphase : new p2.SAPBroadphase(),
    gravity: [0, 0],
    defaultFriction: 0,
  }));

  world.solver.stiffness = Number.MAX_VALUE;

  let ballMater, wallMater, brickMater, paddleMater;

  ballMater = new p2.Material();
  wallMater = brickMater = paddleMater = new p2.Material();

  world.addContactMaterial(
    new p2.ContactMaterial(ballMater, wallMater, {
      restitution: 1.0,
    }),
  );

  let vwallShape = new p2.Line(25, 1);
  vwallShape.material = wallMater;

  let hwallShape = new p2.Line(18, 1);
  hwallShape.material = wallMater;

  let ballShape = new p2.Circle(0.5);
  ballShape.material = ballMater;

  let normalBrickShape = new p2.Rectangle(1.9, 1.9);
  normalBrickShape.material = brickMater;

  let smallBrickShape = new p2.Rectangle(0.9, 0.9);
  smallBrickShape.material = brickMater;

  let dropShape = new p2.Circle(0.3);

  let fullPaddleShape = new p2.Convex([
    [1.8, -0.1],
    [1.8, 0.1],
    [1.2, 0.4],
    [0.4, 0.6],
    [-0.4, 0.6],
    [-1.2, 0.4],
    [-1.8, 0.1],
    [-1.8, -0.1],
  ]);
  fullPaddleShape.material = paddleMater;

  let miniPaddleShape = new p2.Convex([
    [1.2, -0.1],
    [1.2, 0.1],
    [0.9, 0.4],
    [0.2, 0.6],
    [-0.2, 0.6],
    [-0.9, 0.4],
    [-1.2, 0.1],
    [-1.2, -0.1],
  ]);
  miniPaddleShape.material = paddleMater;

  let BALL = 1,
    WALL = 2,
    BRICK = 4,
    DROP = 8;

  vwallShape.collisionGroup = WALL;
  hwallShape.collisionGroup = WALL;
  fullPaddleShape.collisionGroup = WALL;
  miniPaddleShape.collisionGroup = WALL;
  normalBrickShape.collisionGroup = BRICK;
  smallBrickShape.collisionGroup = BRICK;
  ballShape.collisionGroup = BALL;
  dropShape.collisionGroup = DROP;

  vwallShape.collisionMask = BALL;
  hwallShape.collisionMask = BALL | DROP;
  normalBrickShape.collisionMask = BALL;
  smallBrickShape.collisionMask = BALL;
  fullPaddleShape.collisionMask = BALL | DROP;
  miniPaddleShape.collisionMask = BALL | DROP;
  ballShape.collisionMask = WALL | BRICK;
  dropShape.collisionMask = WALL;

  let leftWall = new p2.Body({
    position: [+9, -0.5],
    angle: Math.PI / 2,
    mass: 0,
  });
  leftWall.addShape(vwallShape);
  leftWall.ui = null;
  world.addBody(leftWall);

  let rightWall = new p2.Body({
    position: [-9, -0.5],
    angle: Math.PI / 2,
    mass: 0,
  });
  rightWall.addShape(vwallShape);
  rightWall.ui = null;
  world.addBody(rightWall);

  let topWall = new p2.Body({
    position: [0, +12],
    mass: 0,
  });
  topWall.addShape(hwallShape);
  topWall.ui = null;
  world.addBody(topWall);

  let bottomWall = new p2.Body({
    position: [0, -13],
    mass: 0,
  });
  bottomWall.addShape(hwallShape);
  bottomWall.isBottom = true;
  bottomWall.ui = null;
  world.addBody(bottomWall);

  let fullPaddle = new p2.Body({
    position: [0, -10.5],
    mass: 0,
  });
  fullPaddle.paddleWidth = 3;
  fullPaddle.addShape(fullPaddleShape);
  fullPaddle.isPaddle = true;
  fullPaddle.motionState = p2.Body.STATIC;
  ui.fullPaddle(fullPaddle);

  let miniPaddle = new p2.Body({
    position: [0, -10.5],
    mass: 0,
  });
  miniPaddle.paddleWidth = 2;
  miniPaddle.addShape(miniPaddleShape);
  miniPaddle.isPaddle = true;
  miniPaddle.motionState = p2.Body.STATIC;
  ui.miniPaddle(miniPaddle);

  let paddle = fullPaddle;
  world.addBody(paddle);

  function setPaddle(neo) {
    if (paddle !== neo) {
      world.removeBody(paddle);
      neo.position[0] = paddle.position[0];
      neo.velocity[0] = paddle.velocity[0];
      world.addBody((paddle = neo));
    }
  }

  function makeBall(pos) {
    let body = new p2.Body({
      mass: 1,
    });
    if (pos) {
      body.position = pos;
    }
    body.damping = 0;
    body.angularDamping = 0;
    body.addShape(ballShape);
    body.isBall = true;
    ui.newBall(body);
    world.addBody(body);
    return body;
  }

  function makeBrick(name, shape, pos) {
    let body = new p2.Body({
      mass: 0,
    });
    if (pos) {
      body.position = pos;
    }
    body.addShape(shape);
    body.isBrick = true;
    body.motionState = p2.Body.STATIC;
    ui.newBrick(body, name);
    world.addBody(body);
    return body;
  }

  function makeDrop(name) {
    let body = new p2.Body({
      mass: 1,
    });
    body.addShape(dropShape);
    body.isDrop = true;
    ui.newDrop(body, name);
    world.addBody(body);
    return body;
  }

  world.on("impact", function (evt) {
    let a = evt.bodyA,
      b = evt.bodyB;
    let ball = (a.isBall && a) || (b.isBall && b);
    let brick = (a.isBrick && a) || (b.isBrick && b);
    let bottom = (a.isBottom && a) || (b.isBottom && b);
    let paddle = (a.isPaddle && a) || (b.isPaddle && b);
    let drop = (a.isDrop && a) || (b.isDrop && b);

    if (drop) {
      world.removeBody(drop);
      if (paddle) {
        ui.catchDrop(drop);
      }
    }

    if (ball) {
      let speed = ui.ballSpeed();
      let velocity = ball.velocity;

      if (velocity[1] >= 0) {
        velocity[1] = Math.max(velocity[1], speed / 3);
      } else {
        velocity[1] = Math.min(velocity[1], -speed / 3);
      }
      let fix = speed / Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
      (velocity[0] *= fix), (velocity[1] *= fix);

      ball.angularVelocity = ball.angle = 0;

      if (brick) {
        world.removeBody(brick);
        ui.hitBrick(brick);
      } else if (bottom) {
        world.removeBody(ball);
        ui.hitBottom(bottom);
      } else if (paddle) {
        ui.hitPaddle(paddle);
      }
    }
  });

  function findBrick() {
    for (let i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBrick) {
        return world.bodies[i];
      }
    }
  }
  this.findBrick = findBrick;

  function findBall() {
    for (let i = 0; i < world.bodies.length; i++) {
      if (world.bodies[i].isBall) {
        return world.bodies[i];
      }
    }
  }
  this.findBall = findBall;

  this.initGame = function () {
    for (let i = world.bodies.length - 1; i >= 0; i--) {
      let body = world.bodies[i];
      if (body.isBrick || body.isBall || body.isDrop) {
        world.removeBody(body);
      }
    }
    setPaddle(fullPaddle);
    makeBall([0, -5]);
  };

  this.startGame = function () {
    let ball = findBall();
    let a = Math.PI * Math.random() * 0.4 - 0.2;
    let speed = ui.ballSpeed();
    ball.velocity = [speed * Math.sin(a), speed * Math.cos(a)];
  };

  this.gameOver = function () {
    for (let i = world.bodies.length - 1; i >= 0; i--) {
      let body = world.bodies[i];
      if (body.isBall) {
        world.removeBody(body);
      }
    }
  };

  this.addRow = function (row) {
    let over = false;
    for (let i = 0; i < world.bodies.length; i++) {
      let body = world.bodies[i];
      if (body.isBrick) {
        body.position[1] -= 2;
        over = over || body.position[1] < -10;
      }
    }

    for (let i = 0; i < row.length; i++) {
      let cell = row[i],
        x = (i - 3) * 2,
        y = 9;

      if (cell.type == "none") {
      } else if (cell.type == "small") {
        makeBrick(cell.color + "s", smallBrickShape, [x + 0.5, y + 0.5]);
        makeBrick(cell.color + "s", smallBrickShape, [x - 0.5, y + 0.5]);
        makeBrick(cell.color + "s", smallBrickShape, [x + 0.5, y - 0.5]);
        makeBrick(cell.color + "s", smallBrickShape, [x - 0.5, y - 0.5]);
      } else if (cell.type == "normal") {
        makeBrick(cell.color, normalBrickShape, [x, y]);
      }
    }

    if (over) {
      ui.gameOver();
    }
  };

  this.dropDown = function (brick, name) {
    let body = makeDrop(name);
    body.position[0] = brick.position[0];
    body.position[1] = brick.position[1];
    body.velocity[1] = ui.dropSpeed();
  };

  this.addBall = function () {
    let oldball = findBall();
    let newball = makeBall();
    newball.position[0] = oldball.position[0];
    newball.position[1] = oldball.position[1];
    newball.velocity[0] = -oldball.velocity[0];
    newball.velocity[1] = -oldball.velocity[1];
  };

  let paddleTo = 0;

  this.movePaddle = function (x) {
    paddleTo = x;
  };

  this.miniPaddle = function () {
    setPaddle(miniPaddle);
  };

  this.fullPaddle = function () {
    setPaddle(fullPaddle);
  };

  this.tick = function (t) {
    let balls = 0;
    for (let i = world.bodies.length - 1; i >= 0; i--) {
      let body = world.bodies[i];
      // remove ball if passed through walls
      if (Math.abs(body.position[0]) > width / 2 || Math.abs(body.position[1]) > height / 2) {
        world.removeBody(body);
      } else if (body.isBall) {
        balls++;
      }
    }
    if (balls < 1) {
      ui.gameOver();
    }

    if (paddleTo !== paddle.position[0]) {
      let padx = paddle.position[0];
      let wallLimit = 9 - paddle.paddleWidth / 2;
      let speedLimit = (ui.paddleSpeed() * t) / 1000;
      if (paddleTo > padx) {
        paddle.position[0] = Math.min(paddleTo, padx + speedLimit, wallLimit);
      } else if (paddleTo < padx) {
        paddle.position[0] = Math.max(paddleTo, padx - speedLimit, -wallLimit);
      }
    }
  };
}

let stage = Stage.mount();

let STORE_KEY = "breakout-v1";

let width = 20,
  height = 26;

let state = {
  score: 0,
  combo: 1,
  max: 0,
  ready: false,
  playing: false,
};

stage.MAX_ELAPSE = 100;

stage.background("#222222");
stage
  .viewbox(width * 16, height * 1.12 * 16)
  .pin("offsetY", -height * 0.04 * 16)
  .pin("align", -0.5);

let pscale = 16;

let physics = new Physics(
  {
    newBall: function (body) {
      body.ui = Stage.sprite("ball", 10).pin({
        handle: 0.5,
        scale: 1 / pscale,
      });
    },
    newDrop: function (body, name) {
      body.ui = Stage.sprite(name).pin({
        handle: 0.5,
        scale: 1 / pscale,
      });
      body.ui.dropName = name;
    },
    newBrick: function (body, name) {
      body.ui = Stage.sprite("b" + name).pin({
        handle: 0.5,
        scale: 1 / pscale,
      });
      body.ui.drop = function () {
        this.tween(70).alpha(0).remove();
      };
    },
    hitBrick: function (brick) {
      !physics.findBrick() && addRow();
      state.score += state.combo;
      // state.combo++;
      updateScore();
      dropDown(brick);
    },
    hitPaddle: function () {
      // state.combo = 1;
    },
    hitBottom: function () {
      !physics.findBall() && gameOver();
    },
    catchDrop: function (drop) {
      let name = drop.ui.dropName;
      if (name == "+") {
        physics.addBall();
      } else if (name == "-") {
        Timeout.set(function () {
          physics.miniPaddle();
        }, 1);
        Timeout.set(
          function () {
            physics.fullPaddle();
          },
          7500,
          "mini",
        );
      }
    },
    miniPaddle: function (body) {
      body.ui = Stage.sprite("paddleMini").pin({
        handle: 0.5,
        scale: 1 / pscale,
      });
    },
    fullPaddle: function (body) {
      body.ui = Stage.sprite("paddleFull").pin({
        handle: 0.5,
        scale: 1 / pscale,
      });
    },
    gameOver: function () {
      gameOver();
    },
    paddleSpeed: function () {
      return 20;
    },
    dropSpeed: function () {
      return -6;
    },
    ballSpeed: function () {
      return 13 + state.score * 0.05;
    },
  },
  width,
  height,
);

let board = Stage.sprite("board").appendTo(stage).pin("handle", 0.5).attr("spy", true);

let p2view = new P2Stage(physics.world, {
  lineWidth: 1 / pscale,
  lineColor: "#888",
  ratio: 4 * pscale,
  debug: P2DEBUG,
})
  .attr("spy", true)
  .pin({
    align: 0.5,
    scale: pscale,
  })
  .appendTo(board);

p2view.on([Stage.POINTER_START, Stage.POINTER_MOVE], function (point) {
  physics.movePaddle(point.x);
});

let maxscore = Stage.monotype("d_")
  .appendTo(board)
  .pin({
    alignX: 1,
    alignY: 1,
    offsetX: -1.5 * 16,
    offsetY: -0.5 * 16,
  });

let myscore = Stage.monotype("d_")
  .appendTo(board)
  .pin({
    alignX: 0,
    alignY: 1,
    offsetX: 1.5 * 16,
    offsetY: -0.5 * 16,
  });

let restart = Stage.sprite("restart").appendTo(board).pin({
  align: 0.5,
});

stage.on("click", function () {
  if (!state.playing) {
    startGame();
  }
});

stage.tick(function (t) {
  if (state.playing) {
    physics.tick(t);
  }
});

try {
  state.max = localStorage.getItem(STORE_KEY) || 0;
} catch (e) {}

initGame();

function initGame() {
  if (!state.ready) {
    p2view.tween(100).pin("alpha", 1);
    restart.hide();
    (state.score = 0), (state.combo = 1);
    updateStatus();
    physics.initGame();
    addRow() + addRow() + addRow();
  }
  state.ready = true;
}

function startGame() {
  initGame();
  state.ready = false;
  physics.startGame();
  Timeout.loop(function () {
    addRow();
    return nextTime();
  }, nextTime());
  state.playing = true;
}

function gameOver() {
  state.playing = false;
  updateStatus();
  state.max = Math.max(state.max, state.score);
  try {
    localStorage.setItem(STORE_KEY, state.max);
  } catch (e) {}
  physics.gameOver();
  restart.show();
  p2view.tween(100).pin("alpha", 0.5);
  Timeout.reset();
}

function updateStatus() {
  updateScore();
}

function updateScore() {
  myscore.setValue(state.score);
  maxscore.setValue(state.max);
}

function nextTime() {
  return 8000 - 20 * state.score;
}

function addRow() {
  let row = [];
  for (let i = 0; i < 7; i++) {
    if (Math.random() < 0.1) {
      row.push({
        type: "none",
      });
      continue;
    }
    let color = ["b", "r", "y", "g", "p"][(Math.random() * 5) | 0];
    let one = state.score + 1,
      four = Math.max(0, state.score * 1.1 - 60);
    if (Math.random() < one / (four + one)) {
      row.push({
        type: "normal",
        color: color,
      });
    } else {
      row.push({
        type: "small",
        color: color,
      });
    }
  }
  physics.addRow(row);
}

function dropDown(brick) {
  let random = Math.random();
  if (random < 0.06) {
    physics.dropDown(brick, "+");
  } else if (random < 0.1) {
    physics.dropDown(brick, "-");
  }
}
