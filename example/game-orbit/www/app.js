Stage.preload('./textures.js');

// game logic
function Game(ui) {

  // useful functions
  var Util = {};
  Util.unitVect = function(vect, m) {
    m = m || 1;
    var length = Math.sqrt(vect.x * vect.x + vect.y * vect.y);
    return {
      x : vect.x / length * m,
      y : vect.y / length * m
    };
  };
  Util.dist = function(a, b) {
    var x = b.x - a.x, y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  };
  Util.random = function(min, max) {
    if (min == max) {
      return min;
    }
    return Math.random() * (max - min) + min;
  };

  // constant values
  var PLANET = 6; // planet collision radius
  var EXPLODE = 6; // explode radius
  var RELOAD = 1000; // reload time
  var LIFE = 3;

  var planet = new Planet();
  var orbits = [];
  var bullets = [];
  var asteroids = [];

  var game = this;
  game.life = 0;
  game.score = 0;

  // total spend time
  var time = 0;

  var nextOrbitPosition = 0;
  var nextAsteroidTime = 0;

  // start game
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
    t = Math.min(t, 100);

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
        ui.explode(bullet);
        bullet.remove();
        bullets.splice(i, 1);
      }
    }

    // if it's time to add next asteroid
    if ((nextAsteroidTime -= t) < 0) {
      nextAsteroidTime = Util.random(2, 3) * 180 / (time / 1000 + 180) * 1000;
      // create an asteroid at a random angle and radius
      var a = Util.random(0, 2 * Math.PI);
      var r = Util.random(120, 180);
      var velocity = Util.random(0.7, 1.7) * (4 + time * 0.00001);
      new Asteroid({
        x : r * Math.sin(a),
        y : r * Math.cos(a)
      }, velocity).add();
    }

    planet.tick(t, time);

    ui.update(game);

    if (game.life == 0) {
      ui.gameOver();
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

  this.explode = function(log) {
    for (var i = asteroids.length - 1; i >= 0; i--) {
      var asteroid = asteroids[i];
      if (Util.dist(asteroid, log) < EXPLODE) {
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

    var img;

    this.add = function(parent) {
      img = ui.planet.add();
      return this;
    };

    this.remove = function() {
      ui.planet.remove(this, img);
      return this;
    };

    this.tick = function(t, time) {
      this.life = Math.min(1, Math.max(0, Math.pow(game.life / LIFE, 2)));
      ui.planet.update(this, img);
    };
  }

  function Asteroid(from, velocity) {
    this.x = from.x;
    this.y = from.y;

    // calculate velocity vector
    velocity = Util.unitVect({
      x : planet.x - from.x,
      y : planet.y - from.y
    }, velocity);

    var img;

    this.add = function(parent) {
      asteroids.push(this);
      img = ui.asteroid.add(this);
      ui.asteroid.update(this, img);
      return this;
    };

    this.remove = function() {
      ui.asteroid.remove(this, img);
      return this;
    };

    this.tick = function(t, time) {
      this.x += velocity.x * t / 1000;
      this.y += velocity.y * t / 1000;

      ui.asteroid.update(this, img);

      return Util.dist(this, planet) < PLANET;
    };
  }

  function Orbit(radius, freq, offset) {
    this.x = 0;
    this.y = 0;
    this._first = false;

    this._ready = RELOAD; // time to reload and ready

    var img;

    this.add = function() {
      orbits.push(this);
      img = ui.orbit.add(this);
      return this;
    };

    this.remove = function() {
      ui.orbit.remove(this, img);
      return this;
    };

    this.tick = function(t, time) {
      this._ready = Math.max(0, this._ready - t);
      var angle = -freq * time / 1000 + offset;
      this.x = radius * Math.sin(angle);
      this.y = radius * Math.cos(angle);

      ui.orbit.update(this, img);
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
    velocity = Util.unitVect({
      x : target.x - from.x,
      y : target.y - from.y
    }, velocity);

    var img;

    this.add = function(parent) {
      bullets.push(this);
      img = ui.bullet.add(this);
      return this;
    };

    this.remove = function() {
      ui.bullet.remove(this, img);
      return this;
    };

    this.tick = function(t, time) {
      this.x += velocity.x * t / 1000;
      this.y += velocity.y * t / 1000;

      ui.bullet.update(this, img);

      return Util.dist(this, target) < 1;
    };
  }
}

// game user interface
Stage(function(root) {
  var Mouse = Stage.Mouse;

  // create a game with ui callbacks
  var game = new Game({
    update : function(game) {
      score.value(game.score);
      life.value(game.life);
    },
    planet : {
      add : function(obj) {
        return Stage.image('planet').pin('handle', 0.5).appendTo(space);
      },
      update : function(obj, ui) {
        ui.alpha(this.life);
      },
      remove : function(obj, ui) {
        ui.remove();
      }
    },
    asteroid : {
      add : function(obj) {
        return Stage.image('asteroid').pin('handle', 0.5).appendTo(space);
      },
      update : function(obj, ui) {
        ui.offset(obj);
      },
      remove : function(obj, ui) {
        ui.remove();
      }
    },
    orbit : {
      add : function(obj) {
        var img = Stage.image('orbit').pin('handle', 0.5).appendTo(space);
        img.ring = Stage.image('first').pin('align', 0.5).appendTo(img).hide();
        return img;
      },
      update : function(obj, ui) {
        ui.offset(obj);
        ui.alpha(100 / (obj._ready + 100));
        ui.ring.alpha(obj._ready <= 0).visible(obj._first);
      },
      remove : function(obj, ui) {
        ui.remove();
      }
    },
    bullet : {
      add : function(obj) {
        return Stage.image('bullet').pin('handle', 0.5).appendTo(space);
      },
      update : function(obj, ui) {
        ui.offset(obj);
      },
      remove : function(obj, ui) {
        ui.remove();
      }
    },
    explode : function(obj) {
      var explosion = Stage.image('explosion').pin('handle', 0.5).offset(obj)
          .scale(0.1).appendTo(space);
      explosion.tween(50).scale(1).then(function() {
        game.explode(obj);
      }).tween(200).alpha(0).then(function() {
        this.remove();
      });
    },
    gameOver : function() {
      gameOver();
    }
  });

  // set viewbox
  root.viewbox(150, 150);

  // add the background
  Stage.image('background').pin('align', 0.5).on('viewport', function() {
    // on viewport change scale it to fill root
    this.pin({
      scaleMode : 'out',
      scaleWidth : root.width(),
      scaleHeight : root.height()
    });
  }).appendTo(root);

  // active view
  var activeView = null;

  // open a view
  function open(view) {
    activeView && activeView.hide();
    activeView = view.show();
  }

  // game home view
  var homeView = Stage.create().on('viewport', function() {
    this.pin({
      width : root.width(),
      height : root.height()
    });
  }).hide().appendTo(root);

  // start button
  Stage.image('play').pin('align', 0.5).on(Mouse.CLICK, function() {
    startGame();
  }).appendTo(homeView);

  // open home view
  function viewHome() {
    open(homeView);
  }

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

  function startGame() {
    game.start();
    open(playView);
  }

  // on gameover go back to home
  function gameOver() {
    viewHome();
  }

  space.on(Mouse.START, function(point) {
    game.shoot({
      x : point.x,
      y : point.y
    });
  }).attr('spy', true);

  // game loop
  space.tick(function(t) {
    game.tick(t);
  });

  viewHome();

});
