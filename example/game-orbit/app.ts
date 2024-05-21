import Stage from "../../src";
import "./textures";

// Game logic
function Game(gameui) {
  // self
  const game = this;

  // use enhanced Stage.math
  const math = Stage.math;

  // constant values
  const PLANET = 6; // planet collision radius
  const EXPLODE = 6; // explode radius
  const RELOAD = 1000; // reload time
  const LIFE = 3;

  const planet = new Planet();
  const orbits = [];
  const bullets = [];
  const asteroids = [];

  game.life = 0;
  game.score = 0;

  // total spend time
  let time = 0;

  let nextOrbitPosition = 0;
  let nextAsteroidTime = 0;

  // start/reset game
  this.start = function () {
    time = 0;

    nextOrbitPosition = 0;
    nextAsteroidTime = 0;

    game.life = LIFE;
    game.score = 0;

    while (orbits.length) orbits.pop().remove();

    while (asteroids.length) asteroids.pop().remove();

    while (bullets.length) bullets.pop().remove();

    new Orbit(8, 2, nextOrbitPosition).add().first();

    planet.add();
  };

  this.tick = function (t) {
    // avoid jumps
    t = math.min(t, 100);

    // total time
    time += t;

    // if less than 3 orbits and last is ready add another orbit
    if (orbits.length < 3 && orbits[orbits.length - 1].ready()) {
      new Orbit(8, 2, (nextOrbitPosition += 0.4)).add();
    }

    // tick all orbits
    for (let i = orbits.length - 1; i >= 0; i--) {
      const orbit = orbits[i];
      orbit.tick(t, time);
    }

    // tick all asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];
      // if hit planet
      if (asteroid.tick(t, time)) {
        game.life--;
        asteroid.remove();
        asteroids.splice(i, 1);
      }
    }

    // tick all bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      // if arrived at target
      if (bullet.tick(t, time)) {
        gameui.explode(bullet);
        bullet.remove();
        bullets.splice(i, 1);
      }
    }

    // if it's time to add next asteroid
    if ((nextAsteroidTime -= t) < 0) {
      nextAsteroidTime = ((math.random(2, 3) * 180) / (time / 1000 + 180)) * 1000;
      // create an asteroid at a random angle and radius
      const a = math.random(0, 2 * math.PI);
      const r = math.random(120, 180);
      const velocity = math.random(0.7, 1.7) * (4 + time * 0.00001);
      new Asteroid(
        {
          x: r * math.sin(a),
          y: r * math.cos(a),
        },
        velocity,
      ).add();
    }

    planet.tick(t, time);

    gameui.status(game);

    if (game.life == 0) {
      gameui.gameover();
    }
  };

  this.shoot = function (target) {
    if (orbits[0].ready()) {
      new Bullet(orbits[0], target, 25).add();
      orbits[0].remove();
      orbits.splice(0, 1);

      if (!orbits.length) {
        new Orbit(8, 2, (nextOrbitPosition += 0.4)).add();
      }
      orbits[0].first();
    }
  };

  this.explode = function (loc) {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];
      if (vectDist(asteroid, loc) < EXPLODE) {
        asteroid.remove();
        asteroids.splice(i, 1);
        // game.life = Math.min(LIFE, game.life + 1);
        game.score++;
      }
    }
  };

  function Planet() {
    this.x = 0;
    this.y = 0;

    const ui = gameui.planet(this);

    this.add = function () {
      ui.add();
      return this;
    };

    this.remove = function () {
      ui.remove();
      return this;
    };

    this.tick = function (t, time) {
      this.life = math.min(1, math.max(0, math.pow(game.life / LIFE, 2)));
      ui.update();
    };
  }

  function Asteroid(from, velocity) {
    this.x = from.x;
    this.y = from.y;

    // calculate velocity vector
    velocity = unitVect(
      {
        x: planet.x - from.x,
        y: planet.y - from.y,
      },
      velocity,
    );

    const ui = gameui.asteroid(this);

    this.add = function () {
      asteroids.push(this);
      ui.add();
      return this;
    };

    this.remove = function () {
      ui.remove();
      return this;
    };

    this.tick = function (t, time) {
      this.x += (velocity.x * t) / 1000;
      this.y += (velocity.y * t) / 1000;

      ui.update();

      return vectDist(this, planet) < PLANET;
    };
  }

  function Orbit(radius, freq, offset) {
    this.x = 0;
    this.y = 0;
    this._first = false;

    this._ready = RELOAD; // time to reload and ready

    const ui = gameui.orbit(this);

    this.add = function () {
      orbits.push(this);
      ui.add();
      return this;
    };

    this.remove = function () {
      ui.remove();
      return this;
    };

    this.tick = function (t, time) {
      this._ready = math.max(0, this._ready - t);
      const angle = (-freq * time) / 1000 + offset;
      this.x = radius * math.sin(angle);
      this.y = radius * math.cos(angle);

      ui.update();
    };

    this.first = function () {
      this._first = true;
      return this;
    };

    this.ready = function () {
      return this._ready <= 0;
    };
  }

  function Bullet(from, target, velocity) {
    this.x = from.x;
    this.y = from.y;

    // copy target location
    target = {
      x: target.x,
      y: target.y,
    };

    // calculate velocity vector
    velocity = unitVect(
      {
        x: target.x - from.x,
        y: target.y - from.y,
      },
      velocity,
    );

    const ui = gameui.bullet(this);

    this.add = function () {
      bullets.push(this);
      ui.add();
      return this;
    };

    this.remove = function () {
      ui.remove();
      return this;
    };

    this.tick = function (t, time) {
      this.x += (velocity.x * t) / 1000;
      this.y += (velocity.y * t) / 1000;

      ui.update();

      return vectDist(this, target) < 1;
    };
  }

  // unit vector multiplied
  function unitVect(vect, m) {
    m = m || 1;
    const length = math.sqrt(vect.x * vect.x + vect.y * vect.y);
    return {
      x: (vect.x / length) * m,
      y: (vect.y / length) * m,
    };
  }

  // distance between two point/vector
  function vectDist(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return math.sqrt(x * x + y * y);
  }
}

// UI
const stage = Stage.mount();

// set viewbox
stage.viewbox(150, 150);

// add the background
Stage.sprite("background")
  .pin("align", 0.5)
  .on("viewport", function () {
    // on viewport change scale it to fill stage
    this.pin({
      scaleMode: "out",
      scaleWidth: stage.width(),
      scaleHeight: stage.height(),
    });
  })
  .appendTo(stage);

// a component which views only one child at a time
const singleView = Stage.component().appendTo(stage);

function setSingleView(active: Stage.Component) {
  if (active.parent() !== singleView) {
    active.remove().appendTo(singleView);
  }
  if (!active.visible()) {
    active.show();
  }
  for (let child = singleView.first(); child; child = child.next()) {
    active !== child && child.visible() && child.hide();
  }
}

// game home view
const homeView = Stage.component()
  .on("viewport", function () {
    this.pin({
      width: stage.width(),
      height: stage.height(),
    });
  })
  .hide()
  .appendTo(stage);

// start button
Stage.sprite("play")
  .pin("align", 0.5)
  .on("click", function () {
    startGame();
  })
  .appendTo(homeView);

// game play view
const playView = Stage.component()
  .on("viewport", function () {
    this.pin({
      width: stage.width(),
      height: stage.height(),
    });
  })
  .hide()
  .appendTo(stage);

const space = Stage.component().pin("align", 0.5).appendTo(playView);

// score number
const score = Stage.monotype("digit").scale(0.8);

// life number
const life = Stage.monotype("digit").scale(0.8);

// place score and life in a row on top-left
Stage.row()
  .spacing(2)
  .pin({
    offset: 2,
    align: 0,
    handle: 0,
  })
  .appendTo(stage)
  .append(life, score);

// create a game with ui callbacks
const game = new Game({
  status: function (game) {
    score.value(game.score);
    life.value(game.life);
  },
  planet: function (obj) {
    const img = Stage.sprite("planet").pin("handle", 0.5);
    return {
      add: function () {
        img.appendTo(space);
        this.update();
      },
      update: function () {
        img.alpha(obj.life);
      },
      remove: function () {
        img.remove();
      },
    };
  },
  asteroid: function (obj) {
    const img = Stage.sprite("asteroid").pin("handle", 0.5);
    return {
      add: function () {
        img.appendTo(space);
        this.update();
      },
      update: function () {
        img.offset(obj);
      },
      remove: function () {
        img.remove();
      },
    };
  },
  orbit: function (obj) {
    const img = Stage.sprite("orbit").pin("handle", 0.5);
    const ring = Stage.sprite("first").pin("align", 0.5).appendTo(img).hide();
    return {
      add: function () {
        img.appendTo(space);
        this.update();
      },
      update: function () {
        img.offset(obj);
        img.alpha(100 / (obj._ready + 100));
        ring.alpha(obj._ready <= 0).visible(obj._first);
      },
      remove: function () {
        img.remove();
      },
    };
  },
  bullet: function (obj) {
    const img = Stage.sprite("bullet").pin("handle", 0.5);
    return {
      add: function () {
        img.appendTo(space);
        this.update();
      },
      update: function () {
        img.offset(obj);
      },
      remove: function () {
        img.remove();
      },
    };
  },
  explode: function (obj) {
    const explosion = Stage.sprite("explosion")
      .pin("handle", 0.5)
      .offset(obj)
      .scale(0.1)
      .appendTo(space);
    explosion
      .tween(50)
      .scale(1)
      .then(function () {
        game.explode(obj);
      })
      .tween(200)
      .alpha(0)
      .remove();
  },
  gameover: function () {
    gameOver();
  },
});

// on start game view play and start game
function startGame() {
  game.start();
  setSingleView(playView);
}

// on game over view home
function gameOver() {
  setSingleView(homeView);
}

space
  .on(Stage.POINTER_START, function (point) {
    game.shoot({
      x: point.x,
      y: point.y,
    });
  })
  .attr("spy", true);

// game loop
space.tick(function (t) {
  game.tick(t);
});

setSingleView(homeView);
