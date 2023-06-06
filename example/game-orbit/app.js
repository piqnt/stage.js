import Stage from '../../src';
import './textures.js';

// Game logic
function Game(gameui) {

  // self
  var game = this;

  // use enhanced Stage.math
  var math = Stage.math;

  // constant values
  var PLANET = 6; // planet collision radius
  var EXPLODE = 6; // explode radius
  var RELOAD = 1000; // reload time
  var LIFE = 3;

  var planet = new Planet();
  var orbits = [];
  var bullets = [];
  var asteroids = [];

  game.life = 0;
  game.score = 0;

  // total spend time
  var time = 0;

  var nextOrbitPosition = 0;
  var nextAsteroidTime = 0;

  // start/reset game
  this.start = function() {
    time = 0;

    nextOrbitPosition = 0;
    nextAsteroidTime = 0;

    game.life = LIFE;
    game.score = 0;

    while (orbits.length)
      orbits.pop().remove();

    while (asteroids.length)
      asteroids.pop().remove();

    while (bullets.length)
      bullets.pop().remove();

    new Orbit(8, 2, nextOrbitPosition).add().first();

    planet.add();
  };

  this.tick = function(t) {

    // avoid jumps
    t = math.min(t, 100);

    // total time
    time += t;

    // if less than 3 orbits and last is ready add another orbit
    if (orbits.length < 3 && orbits[orbits.length - 1].ready()) {
      new Orbit(8, 2, nextOrbitPosition += 0.4).add();
    }

    // tick all orbits
    for (var i = orbits.length - 1; i >= 0; i--) {
      var orbit = orbits[i];
      orbit.tick(t, time);
    }

    // tick all asteroids
    for (var i = asteroids.length - 1; i >= 0; i--) {
      var asteroid = asteroids[i];
      // if hit planet
      if (asteroid.tick(t, time)) {
        game.life--;
        asteroid.remove();
        asteroids.splice(i, 1);
      }
    }

    // tick all bullets
    for (var i = bullets.length - 1; i >= 0; i--) {
      var bullet = bullets[i];
      // if arrived at target
      if (bullet.tick(t, time)) {
        gameui.explode(bullet);
        bullet.remove();
        bullets.splice(i, 1);
      }
    }

    // if it's time to add next asteroid
    if ((nextAsteroidTime -= t) < 0) {
      nextAsteroidTime = math.random(2, 3) * 180 / (time / 1000 + 180) * 1000;
      // create an asteroid at a random angle and radius
      var a = math.random(0, 2 * math.PI);
      var r = math.random(120, 180);
      var velocity = math.random(0.7, 1.7) * (4 + time * 0.00001);
      new Asteroid({
        x : r * math.sin(a),
        y : r * math.cos(a)
      }, velocity).add();
    }

    planet.tick(t, time);

    gameui.status(game);

    if (game.life == 0) {
      gameui.gameover();
    }
  };

  this.shoot = function(target) {
    if (orbits[0].ready()) {
      new Bullet(orbits[0], target, 25).add();
      orbits[0].remove();
      orbits.splice(0, 1);

      if (!orbits.length) {
        new Orbit(8, 2, nextOrbitPosition += 0.4).add();
      }
      orbits[0].first();
    }
  };

  this.explode = function(loc) {
    for (var i = asteroids.length - 1; i >= 0; i--) {
      var asteroid = asteroids[i];
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

    var ui = gameui.planet(this);

    this.add = function() {
      ui.add();
      return this;
    };

    this.remove = function() {
      ui.remove();
      return this;
    };

    this.tick = function(t, time) {
      this.life = math.min(1, math.max(0, math.pow(game.life / LIFE, 2)));
      ui.update();
    };
  }

  function Asteroid(from, velocity) {
    this.x = from.x;
    this.y = from.y;

    // calculate velocity vector
    velocity = unitVect({
      x : planet.x - from.x,
      y : planet.y - from.y
    }, velocity);

    var ui = gameui.asteroid(this);

    this.add = function() {
      asteroids.push(this);
      ui.add();
      return this;
    };

    this.remove = function() {
      ui.remove();
      return this;
    };

    this.tick = function(t, time) {
      this.x += velocity.x * t / 1000;
      this.y += velocity.y * t / 1000;

      ui.update();

      return vectDist(this, planet) < PLANET;
    };
  }

  function Orbit(radius, freq, offset) {
    this.x = 0;
    this.y = 0;
    this._first = false;

    this._ready = RELOAD; // time to reload and ready

    var ui = gameui.orbit(this);

    this.add = function() {
      orbits.push(this);
      ui.add();
      return this;
    };

    this.remove = function() {
      ui.remove();
      return this;
    };

    this.tick = function(t, time) {
      this._ready = math.max(0, this._ready - t);
      var angle = -freq * time / 1000 + offset;
      this.x = radius * math.sin(angle);
      this.y = radius * math.cos(angle);

      ui.update();
    };

    this.first = function() {
      this._first = true;
      return this;
    };

    this.ready = function() {
      return this._ready <= 0;
    };
  }

  function Bullet(from, target, velocity) {
    this.x = from.x;
    this.y = from.y;

    // copy target location
    target = {
      x : target.x,
      y : target.y
    };

    // calculate velocity vector
    velocity = unitVect({
      x : target.x - from.x,
      y : target.y - from.y
    }, velocity);

    var ui = gameui.bullet(this);

    this.add = function() {
      bullets.push(this);
      ui.add();
      return this;
    };

    this.remove = function() {
      ui.remove();
      return this;
    };

    this.tick = function(t, time) {
      this.x += velocity.x * t / 1000;
      this.y += velocity.y * t / 1000;

      ui.update();

      return vectDist(this, target) < 1;
    };
  }

  // unit vector multiplied
  function unitVect(vect, m) {
    m = m || 1;
    var length = math.sqrt(vect.x * vect.x + vect.y * vect.y);
    return {
      x : vect.x / length * m,
      y : vect.y / length * m
    };
  }

  // distance between two point/vector
  function vectDist(a, b) {
    var x = b.x - a.x, y = b.y - a.y;
    return math.sqrt(x * x + y * y);
  }
}

// UI
var root = Stage.mount();

// set viewbox
root.viewbox(150, 150);

// add the background
Stage.sprite('background').pin('align', 0.5).on('viewport', function() {
  // on viewport change scale it to fill root
  this.pin({
    scaleMode : 'out',
    scaleWidth : root.width(),
    scaleHeight : root.height()
  });
}).appendTo(root);

// an element which views only one child at a time
var singleView = Stage.create().appendTo(root);
singleView.view = function(active) {
  if (active.parent() !== this) {
    active.remove().appendTo(this);
  }
  if (!active.visible()) {
    active.show();
  }
  for (var child = this.first(); child; child = child.next()) {
    active !== child && child.visible() && child.hide();
  }
};

// game home view
var homeView = Stage.create().on('viewport', function() {
  this.pin({
    width : root.width(),
    height : root.height()
  });
}).hide().appendTo(root);

// start button
Stage.sprite('play').pin('align', 0.5).on(Stage.Mouse.CLICK, function() {
  startGame();
}).appendTo(homeView);

// game play view
var playView = Stage.create().on('viewport', function() {
  this.pin({
    width : root.width(),
    height : root.height()
  });
}).hide().appendTo(root);

var space = Stage.create().pin('align', 0.5).appendTo(playView);

// score number
var score = Stage.string('digit').scale(0.8);

// life number
var life = Stage.string('digit').scale(0.8);

// place score and life in a row on top-left
Stage.row().spacing(2).pin({
  offset : 2,
  align : 0,
  handle : 0
}).appendTo(root).append(life, score);

// create a game with ui callbacks
var game = new Game({
  status : function(game) {
    score.value(game.score);
    life.value(game.life);
  },
  planet : function(obj) {
    var img = Stage.sprite('planet').pin('handle', 0.5);
    return {
      add : function() {
        img.appendTo(space);
        this.update();
      },
      update : function() {
        img.alpha(obj.life);
      },
      remove : function() {
        img.remove();
      }
    };
  },
  asteroid : function(obj) {
    var img = Stage.sprite('asteroid').pin('handle', 0.5);
    return {
      add : function() {
        img.appendTo(space);
        this.update();
      },
      update : function() {
        img.offset(obj);
      },
      remove : function() {
        img.remove();
      }
    };
  },
  orbit : function(obj) {
    var img = Stage.sprite('orbit').pin('handle', 0.5);
    var ring = Stage.sprite('first').pin('align', 0.5).appendTo(img).hide();
    return {
      add : function() {
        img.appendTo(space);
        this.update();
      },
      update : function() {
        img.offset(obj);
        img.alpha(100 / (obj._ready + 100));
        ring.alpha(obj._ready <= 0).visible(obj._first);
      },
      remove : function() {
        img.remove();
      }
    };
  },
  bullet : function(obj) {
    var img = Stage.sprite('bullet').pin('handle', 0.5);
    return {
      add : function() {
        img.appendTo(space);
        this.update();
      },
      update : function() {
        img.offset(obj);
      },
      remove : function() {
        img.remove();
      }
    };
  },
  explode : function(obj) {
    var explosion = Stage.sprite('explosion').pin('handle', 0.5).offset(obj)
        .scale(0.1).appendTo(space);
    explosion.tween(50).scale(1).then(function() {
      game.explode(obj);
    }).tween(200).alpha(0).remove();
  },
  gameover : function() {
    gameOver();
  }
});

// on start game view play and start game
function startGame() {
  game.start();
  singleView.view(playView);
}

// on game over view home
function gameOver() {
  singleView.view(homeView);
}

space.on(Stage.Mouse.START, function(point) {
  game.shoot({
    x : point.x,
    y : point.y
  });
}).attr('spy', true);

// game loop
space.tick(function(t) {
  game.tick(t);
});

singleView.view(homeView);
