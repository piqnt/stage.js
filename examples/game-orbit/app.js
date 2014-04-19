function Ship(r, f, p) {
  this.x = 0;
  this.y = 0;
  this.r = r; // radius
  this.f = -f; // rotation frequency
  this.p = p || 0; // rotation phase offset
  this.off = 0; // time to reload and ready
  this.tick = function(t, time) {
    this.off = Math.max(0, this.off - t);
    this.x = this.r * Math.sin(this.f * time / 1000 + this.p);
    this.y = this.r * Math.cos(this.f * time / 1000 + this.p);
  };
  this.remove = function() {
    this.uiRemove();
  };
}

function Bullet(speed) {
  this.x = 0;
  this.y = 0;
  this.tx = 0; // target
  this.ty = 0;
  this.vx = 0; // velocity vector
  this.vy = 0;
  this.speed = speed;
  this.shoot = function(from, to) {
    this.x = from.x;
    this.y = from.y;
    this.tx = to.x;
    this.ty = to.y;
    var dx = this.tx - this.x;
    var dy = this.ty - this.y;
    var d = M.length(dx, dy);
    this.vx = this.speed * dx / d;
    this.vy = this.speed * dy / d;
    return this;
  };
  this.tick = function(t, time) {
    var x = this.x + this.vx * t / 1000;
    var y = this.y + this.vy * t / 1000;
    if (Math.abs(x - this.tx) > Math.abs(this.x - this.tx)
        && Math.abs(y - this.ty) > Math.abs(this.y - this.ty)) {
      return true;
    }
    this.x = x;
    this.y = y;
  };
  this.remove = function() {
    this.uiRemove();
  };
}

var Asteroid = Bullet;

function Space() {

  var speed = 4; // asteroids speed
  var acc = 0.00001; // asteroids acceleration
  var explode = 6; // explode radius
  var collide = 6; // collision radius
  var off = 1200; // ship realod time

  var time = 0;

  var planet = {
    life : 0,
    down : 0,
    up : 0,
    next : 0
  };

  var next = {};
  var ships = [];
  var bullets = [];
  var asteroids = [];

  this.start = function() {
    time = 0;
    planet.life = 16, planet.up = 0, planet.down = 0;

    if (ships.length == 0) {
      ships.push(this.uiAddShip(new Ship(8, 2, 0)));
      ships.push(this.uiAddShip(new Ship(8, 2, Math.PI / 3 * 2)));
      ships.push(this.uiAddShip(new Ship(8, 2, Math.PI / 3 * 4)));
      this.uiAddPlanet(planet);
      this.uiAddNext(next);
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
      var bullet = bullets[i];
      bullet.remove();
      bullets.splice(i, 1);
    }
    for (var j = asteroids.length - 1; j >= 0; j--) {
      var asteroid = asteroids[j];
      asteroid.remove();
      asteroids.splice(j, 1);
    }

    for (var s = ships.length - 1; s >= 0; s--) {
      var ship = ships[s];
      ship.off = 0;
    }

    next.uiNext(ships[planet.next]);
  };

  var randomAsteroid = new Randomize().spacing(function() {
    return M.random(2, 3) * 180 / (time / 1000 + 180) * 1000;
  }, 0).add(function() {
    var a = M.random(0, 2 * Math.PI);
    var r = M.random(120, 180);
    return new Asteroid(speed + time * acc).shoot({
      x : r * Math.sin(a),
      y : r * Math.cos(a)
    }, {
      x : 0,
      y : 0
    });
  });

  this.tick = function(t) {
    t = Math.min(t, 100);
    time += t;

    next.uiUpdate();

    for (var s = ships.length - 1; s >= 0; s--) {
      var ship = ships[s];
      ship.tick(t, time);
      ship.uiUpdate();
    }

    for (var j = asteroids.length - 1; j >= 0; j--) {
      var asteroid = asteroids[j];
      if (M.length(asteroid.x, asteroid.y) < collide || asteroid.tick(t, time)) {
        planet.life--;
        asteroid.remove();
        asteroids.splice(j, 1);
        planet.down++;
      }
      asteroid.uiUpdate();
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
      var bullet = bullets[i];
      if (bullet.tick(t, time)) {
        for (var j = asteroids.length - 1; j >= 0; j--) {
          var asteroid = asteroids[j];
          if (M.length(asteroid.x - bullet.x, asteroid.y - bullet.y) < explode) {
            asteroid.remove();
            asteroids.splice(j, 1);
            planet.life = Math.min(16, planet.life + 1);
            planet.up++;
          }
        }
        this.uiExplode(bullet);
        bullet.remove();
        bullets.splice(i, 1);
      }
      bullet.uiUpdate();
    }

    var asteroid = randomAsteroid.test(t).random();
    asteroid && asteroids.push(this.uiAddAsteroid(asteroid()));

    planet.uiUpdate();

    if (planet.life == 0) {
      this.uiGameover();
    }
  };

  this.shoot = function(loc) {
    var ship = ships[planet.next];
    if (ship.off <= 0) {
      ship.off = off;
      var bullet = new Bullet(25).shoot(ship, loc);
      bullets.push(bullet);
      this.uiAddBullet(bullet);
      planet.next = ++planet.next % ships.length;
      next.uiNext(ships[planet.next]);
    }
  };
}

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(150, 150).pin('handle', -0.5);

  var ui = {};

  root.on('viewport', function(width, height) {
    ui.bg.pin({
      resizeMode : 'out',
      resizeWidth : width,
      resizeHeight : height
    });
  });

  ui.bg = Cut.image('base:bg').pin('handle', 0.5).appendTo(root);

  ui.status = Cut.row().spacing(2).pin({
    offset : 1,
    align : -0.5,
    handle : 0
  }).appendTo(root);
  ui.up = Cut.string('base:d_').appendTo(ui.status);
  ui.down = Cut.string('base:d_').appendTo(ui.status);

  var space = new Space(root);

  space.uiAddPlanet = function(obj) {
    obj.ui = Cut.image('base:planet').pin('handle', 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    obj.uiUpdate = function() {
      this.ui.pin('alpha', Math.min(1, Math.max(0, this.life / 16)));
      ui.up.setValue((this.up > 0 ? '+' : '') + this.up);
      ui.down.setValue(-this.down);
    };
    return obj;
  };

  space.uiAddBullet = function(obj) {
    obj.ui = Cut.image('base:bullet').pin('handle', 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    obj.uiUpdate = function() {
      this.ui.pin({
        offsetX : this.x,
        offsetY : this.y
      });
    };
    return obj;
  };

  space.uiAddShip = function(obj) {
    obj.ui = Cut.image('base:ship').pin('handle', 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    obj.uiUpdate = function() {
      this.ui.pin('alpha', 1 / (this.off / 100 + 1));
      this.ui.pin({
        offsetX : this.x,
        offsetY : this.y
      });
    };
    return obj;
  };

  space.uiAddAsteroid = function(obj) {
    obj.ui = Cut.image('base:asteroid').pin('handle', 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    obj.uiUpdate = function() {
      this.ui.pin({
        offsetX : this.x,
        offsetY : this.y
      });
    };
    return obj;
  };

  space.uiAddNext = function(obj) {
    obj.ui = Cut.image('base:next').pin('align', 0.5);
    var _next;
    obj.uiNext = function(next) {
      this.ui.appendTo(next.ui);
      _next = next;
    };
    obj.uiUpdate = function() {
      _next && this.ui.pin('alpha', _next.off <= 0 ? 1 : 0.6);
    };
    return obj;
  };

  space.uiExplode = function(loc) {
    Cut.image('base:explosion').pin('handle', 0.5).pin({
      offsetX : loc.x,
      offsetY : loc.y
    }).appendTo(root).pin('scale', 0.1).tween(50).pin({
      scaleX : 1,
      scaleY : 1
    }).tween(200).pin('alpha', 0).then(function() {
      this.remove();
    });
  };

  space.uiGameover = function() {
    this.start();
  };

  root.tick(function(t) {
    space.tick(t);
  });

  root.on(Cut.Mouse.START, function(ev, point) {
    space.shoot(point);
  });

  space.start();

});

var M = Cut.Math;