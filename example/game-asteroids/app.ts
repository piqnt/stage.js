import Stage from "../../src";

await Stage.atlas({
  textures: {
    text: function (d) {
      d += "";
      return Stage.canvas(function (ctx) {
        let ratio = 2;
        this.size(16, 24, ratio);
        ctx.scale(ratio, ratio);
        ctx.font = "bold 24px monospace";
        ctx.fillStyle = "#ddd";
        ctx.textBaseline = "top";
        ctx.fillText(d, 0, 1);
      });
    },
  },
});

function Physics(ui) {
  const { Vec2 } = planck;

  const SHIP = 2;
  const BULLET = 4;
  const ASTEROID = 4;

  const SPACE_WIDTH = 16;
  const SPACE_HEIGHT = 9;

  const SHIP_SIZE = 0.3;
  const FIRE_RELOAD_TIME = 200;
  const BULLET_LIFE_TIME = 2000;

  const asteroidRadius = 0.9;
  const asteroidSpeed = 3;
  const asteroidLevels = 4;

  // game state
  const state = {
    level: 0,
    lives: 0,
    gameover: false,
    startGame: function () {
      this.gameover = false;
      this.level = 1;
      this.lives = 3;
    },
    crash: function () {
      this.lives--;
    },
    levelUp: function () {
      this.level++;
    },
    endGame: function () {
      this.gameover = true;
    },
  };

  let allowCrashTime = 0;
  let allowFireTime = 0;

  const asteroidBodies = [];
  const bulletBodies = [];
  let shipBody;

  const world = planck.World();

  // Todo: check if several bullets hit the same asteroid in the same time step
  world.on("pre-solve", function (contact) {
    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();

    const bodyA = contact.getFixtureA().getBody();
    const bodyB = contact.getFixtureB().getBody();

    const aship = bodyA == shipBody;
    const bship = bodyB == shipBody;
    const abullet = fixtureA.getFilterCategoryBits() & BULLET;
    const bbullet = fixtureB.getFilterCategoryBits() & BULLET;

    if ((aship || bship) && allowCrashTime < globalTime) {
      // Ship collided with something
      const ship = aship ? bodyA : bodyB;
      const asteroid = !aship ? bodyA : bodyB;

      setTimeout(function () {
        crash(ship, asteroid);
      }, 1);
    }

    if (abullet || bbullet) {
      // Bullet collided with something
      const bullet = abullet ? bodyA : bodyB;
      const asteroid = !abullet ? bodyA : bodyB;

      setTimeout(function () {
        hit(bullet, asteroid);
      }, 1);
    }
  });

  function start() {
    state.startGame();
    ui.updateStatus();
    setupShip(true);
    addAsteroids();
    ui.startGame();
  }

  function end() {
    state.endGame();
    ui.endGame();
  }

  function setupShip() {
    shipBody = world.createBody({
      type: "dynamic",
      angularDamping: 2.0,
      linearDamping: 0.5,
      position: Vec2(),
    });

    shipBody.createFixture(
      planck.Polygon([Vec2(-0.15, -0.15), Vec2(0, -0.1), Vec2(0.15, -0.15), Vec2(0, 0.2)]),
      {
        density: 1000,
        filterCategoryBits: SHIP,
        filterMaskBits: ASTEROID,
      },
    );

    allowCrashTime = globalTime + 2000;
  }

  let globalTime = 0;
  function tick(dt) {
    globalTime += dt;

    if (shipBody) {
      // Set velocities
      if (ui.activeKeys.left && !ui.activeKeys.right) {
        shipBody.applyAngularImpulse(0.1, true);
      } else if (ui.activeKeys.right && !ui.activeKeys.left) {
        shipBody.applyAngularImpulse(-0.1, true);
      }

      // Thrust: add some force in the ship direction
      if (ui.activeKeys.up) {
        let f = shipBody.getWorldVector(Vec2(0.0, 1.0));
        let p = shipBody.getWorldPoint(Vec2(0.0, 2.0));
        shipBody.applyLinearImpulse(f, p, true);
      }

      // Fire
      if (ui.activeKeys.fire && globalTime > allowFireTime) {
        const magnitude = 2;
        const angle = shipBody.Getangle + Math.PI / 2;

        // Create a bullet body
        const bulletBody = world.createDynamicBody({
          // mass : 0.05,
          position: shipBody.getWorldPoint(Vec2(0, SHIP_SIZE)),
          linearVelocity: shipBody.getWorldVector(Vec2(0, magnitude)),
          bullet: true,
        });
        bulletBody.createFixture(new planck.Circle(0.05), {
          filterCategoryBits: BULLET,
          filterMaskBits: ASTEROID,
        });
        bulletBodies.push(bulletBody);

        // Keep track of the last time we shot
        allowFireTime = globalTime + FIRE_RELOAD_TIME;

        // Remember when we should delete this bullet
        bulletBody.dieTime = globalTime + BULLET_LIFE_TIME;
      }

      wrap(shipBody);
    }

    for (let i = 0; i !== bulletBodies.length; i++) {
      const bulletBody = bulletBodies[i];

      // If the bullet is old, delete it
      if (bulletBody.dieTime <= globalTime) {
        bulletBodies.splice(i, 1);
        world.destroyBody(bulletBody);
        i--;
        continue;
      }
      wrap(bulletBody);
    }

    for (let i = 0; i !== asteroidBodies.length; i++) {
      const asteroidBody = asteroidBodies[i];
      wrap(asteroidBody);
    }
  }

  // Adds some asteroids to the scene.
  function addAsteroids() {
    while (asteroidBodies.length) {
      const asteroidBody = asteroidBodies.shift();
      world.destroyBody(asteroidBody);
      // asteroidBody.uiRemove();
    }

    for (let i = 0; i < state.level; i++) {
      const shipPosition = shipBody.getPosition();
      let x = shipPosition.x;
      let y = shipPosition.y;

      // Aviod the ship!
      while (
        Math.abs(x - shipPosition.x) < asteroidRadius * 2 &&
        Math.abs(y - shipPosition.y) < asteroidRadius * 2
      ) {
        x = rand(SPACE_WIDTH);
        y = rand(SPACE_HEIGHT);
      }

      const vx = rand(asteroidSpeed);
      const vy = rand(asteroidSpeed);
      const va = rand(asteroidSpeed);

      // Create asteroid body
      const asteroidBody = makeAsteroidBody(x, y, vx, vy, va, 0);
      asteroidBody.level = 1;
    }
  }

  function asteroidLevelRadius(level) {
    return (asteroidRadius * (asteroidLevels - level)) / asteroidLevels;
  }

  function makeAsteroidBody(x, y, vx, vy, va, level) {
    const asteroidBody = world.createKinematicBody({
      // mass : 10,
      position: Vec2(x, y),
      linearVelocity: Vec2(vx, vy),
      angularVelocity: va,
    });
    asteroidBodies.push(asteroidBody);

    const radius = asteroidLevelRadius(level);

    const n = 8;
    const path = [];
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n;
      const x = radius * (Math.sin(a) + rand(0.3));
      const y = radius * (Math.cos(a) + rand(0.3));
      path.push(Vec2(x, y));
    }

    asteroidBody.createFixture(planck.Polygon(path), {
      filterCategoryBits: ASTEROID,
      filterMaskBits: BULLET | SHIP,
    });

    return asteroidBody;
  }

  function crash(ship, asteroid) {
    if (!shipBody) {
      return;
    }

    state.crash();
    ui.updateStatus();

    // Remove the ship body for a while
    world.destroyBody(shipBody);
    shipBody = null;

    if (state.lives <= 0) {
      end();
      return;
    }
    setTimeout(function () {
      // Add ship again
      setupShip();
    }, 1000);
  }

  function hit(asteroidBody, bulletBody) {
    const aidx = asteroidBodies.indexOf(asteroidBody);
    const bidx = bulletBodies.indexOf(bulletBody);
    if (aidx != -1 && bidx != -1) {
      // Remove asteroid
      world.destroyBody(asteroidBody);
      asteroidBodies.splice(aidx, 1);
      // asteroidBody.uiRemove();

      // Remove bullet
      world.destroyBody(bulletBody);
      bulletBodies.splice(bidx, 1);
      // bulletBody.uiRemove();

      // Add new sub-asteroids
      splitAsteroid(asteroidBody);
    }

    if (asteroidBodies.length == 0) {
      state.levelUp();
      ui.updateStatus();
      addAsteroids();
    }
  }

  function splitAsteroid(parent) {
    if (parent.level < 4) {
      const angleDisturb = (Math.PI / 2) * Math.random();
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + angleDisturb;

        const r = asteroidLevelRadius(0) - asteroidLevelRadius(parent.level);
        const sp = parent.getWorldPoint(Vec2(r * Math.cos(angle), r * Math.sin(angle)));

        const vx = rand(asteroidSpeed);
        const vy = rand(asteroidSpeed);
        const va = rand(asteroidSpeed);

        const child = makeAsteroidBody(sp.x, sp.y, vx, vy, va, parent.level);
        child.level = parent.level + 1;
        child.setAngle(rand() * Math.PI);
      }
    }
  }

  // If the body is out of space bounds, wrap it to the other side
  function wrap(body) {
    const p = body.getPosition();
    p.x = wrapNumber(p.x, -SPACE_WIDTH / 2, SPACE_WIDTH / 2);
    p.y = wrapNumber(p.y, -SPACE_HEIGHT / 2, SPACE_HEIGHT / 2);
    body.setPosition(p);
  }

  function wrapNumber(num?: number, min?: number, max?: number) {
    if (typeof min === "undefined") {
      (max = 1), (min = 0);
    } else if (typeof max === "undefined") {
      (max = min), (min = 0);
    }
    if (max > min) {
      num = (num - min) % (max - min);
      return num + (num < 0 ? max : min);
    } else {
      num = (num - max) % (min - max);
      return num + (num <= 0 ? min : max);
    }
  }

  // Returns a random number between -0.5 and 0.5
  function rand(value?: number) {
    return (Math.random() - 0.5) * (value || 1);
  }

  this.start = start;
  this.world = world;
  this.state = state;
  this.spaceWidth = SPACE_WIDTH;
  this.spaceHeight = SPACE_HEIGHT;
  this.tick = tick;
  this.ratio = 64;
}

const stage = Stage.mount();
const activeKeys = {};
const KEY_NAMES = {
  32: "fire",
  37: "right",
  38: "up",
  39: "left",
  40: "down",
};

const physics = new Physics({
  startGame: startGame,
  endGame: endGame,
  updateStatus: updateStatus,
  activeKeys: activeKeys,
});

stage.background("#222222");
stage.on("viewport", function (size) {
  meta.pin({
    scaleMode: "in-pad",
    scaleWidth: size.width,
    scaleHeight: size.height,
  });
  world.pin({
    scaleMode: "in-pad",
    scaleWidth: size.width,
    scaleHeight: size.height,
  });
});

const world = new Stage.planck(physics.world, { ratio: 80 })
  .pin({
    handle: -0.5,
    width: physics.spaceWidth,
    height: physics.spaceHeight,
  })
  .appendTo(stage);

stage.tick(physics.tick);

const meta = Stage.component().pin({ width: 1000, height: 1000 }).appendTo(stage);

const status = Stage.monotype("text").pin({ align: 0, offset: 20 }).appendTo(meta);

const gameover = Stage.monotype("text")
  .value("Game Over!")
  .pin({ align: 0.5, scale: 1.6 })
  .appendTo(meta);

function startGame() {
  gameover.hide();
}

function endGame() {
  gameover.show();
}

function updateStatus() {
  status.value("Level: " + physics.state.level + " Lives: " + physics.state.lives);
}

document.onkeydown = function (evt) {
  if (physics.state.gameover) {
    physics.start();
  }
  activeKeys[KEY_NAMES[evt.keyCode]] = true;
};

document.onkeyup = function (evt) {
  activeKeys[KEY_NAMES[evt.keyCode]] = false;
};

physics.start();
