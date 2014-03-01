function Ship(r, f, p) {
  this.x = 0;
  this.y = 0;
  this.r = r;
  this.f = -f;
  this.p = p || 0;
  this.off = 0;
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
  this.tx = 0;
  this.ty = 0;
  this.vx = 0;
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

function Game(root) {

  var speed = 4;
  var acc = 0.00001;
  var explode = 6;
  var collide = 6;
  var off = 1200;

  var ui = {};

  var time = 0;
  var next = 0;
  var life = 0, up = 0, down = 0;

  var planet = {};

  var ships = [ uiAddShip(new Ship(8, 2, 0)),
      uiAddShip(new Ship(8, 2, Math.PI / 3 * 2)),
      uiAddShip(new Ship(8, 2, Math.PI / 3 * 4)) ];
  var bullets = [];
  var asteroids = [];

  ui.status = Cut.row().spacing(2).pin({
    offset : 1,
    align : -0.5,
    handle : 0
  }).appendTo(root);
  ui.up = Cut.string("base:d_").appendTo(ui.status);
  ui.down = Cut.string("base:d_").appendTo(ui.status);

  function start() {
    time = 0;
    life = 16, up = 0, down = 0;

    ui.up.setValue(up);
    ui.down.setValue(down);

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

    ui.next.appendTo(ships[next].ui);
  }

  var asteroidRandom = new X.Randomize().spacing(function() {
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

  root
      .tick(function(t) {
        t = Math.min(t, 100);
        time += t;

        ui.next.pin("alpha", ships[next].off <= 0 ? 1 : 0.6);

        for (var s = ships.length - 1; s >= 0; s--) {
          var ship = ships[s];
          ship.tick(t, time);
          var alpha = 1 / (ship.off / 100 + 1);
          ship.ui.pin("alpha", alpha);
          ship.ui.xy(ship.x, ship.y);
        }

        for (var j = asteroids.length - 1; j >= 0; j--) {
          var asteroid = asteroids[j];
          if (M.length(asteroid.x, asteroid.y) < collide
              || asteroid.tick(t, time)) {
            life--;
            asteroid.remove();
            asteroids.splice(j, 1);
            ui.down.setValue("-" + ++down);
          }
          asteroid.ui.xy(asteroid.x, asteroid.y);
        }

        for (var i = bullets.length - 1; i >= 0; i--) {
          var bullet = bullets[i];
          if (bullet.tick(t, time)) {
            for (var j = asteroids.length - 1; j >= 0; j--) {
              var asteroid = asteroids[j];
              if (M.length(asteroid.x - bullet.x, asteroid.y - bullet.y) < explode) {
                asteroid.remove();
                asteroids.splice(j, 1);
                life = Math.min(16, life + 1);
                ui.up.setValue("+" + ++up);
              }
            }
            Cut.image("base:explosion").pin("handle", 0.5).xy(bullet.x,
                bullet.y).appendTo(root).pin("scale", 0.1).tween(50).pin({
              scaleX : 1,
              scaleY : 1
            }).tween(200).pin("alpha", 0);
            bullet.remove();
            bullets.splice(i, 1);
          }

          bullet.ui.xy(bullet.x, bullet.y);
        }

        var asteroid = asteroidRandom.test(t).random();
        asteroid && asteroids.push(uiAddAsteroid(asteroid()));

        planet.ui.pin("alpha", Math.min(1, Math.max(0, life / 16)));

        if (life == 0) {
          start();
        }
      });

  ui.next = Cut.image("base:next").pin("align", 0.5);
  root.on(Cut.Mouse.START, function(ev, point) {
    var ship = ships[next];
    if (ship.off <= 0) {
      ship.off = off;
      var bullet = new Bullet(25).shoot(ship, point);
      bullets.push(bullet);
      uiAddBullet(bullet);
      next = ++next % ships.length;
      ui.next.appendTo(ships[next].ui);
    }
  });

  planet.ui = Cut.image("base:planet").pin("handle", 0.5).appendTo(root);

  function uiAddShip(obj) {
    obj.ui = Cut.image("base:ship").pin("handle", 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    return obj;
  }

  function uiAddAsteroid(obj) {
    obj.ui = Cut.image("base:asteroid").pin("handle", 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    return obj;
  }

  function uiAddBullet(obj) {
    obj.ui = Cut.image("base:bullet").pin("handle", 0.5).appendTo(root);
    obj.uiRemove = function() {
      this.ui.remove();
    };
    return obj;
  }
}

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(150, 150).pin("handle", -0.5);

  root.on("viewport", function(width, height) {
    bg.pin({
      resizeMode : "out",
      resizeWidth : width,
      resizeHeight : height
    });
  });

  var bg = Cut.image("base:bg").pin("handle", 0.5).appendTo(root);

  var game = new Game(root);

});

Cut.prototype.xy = function(x, y) {
  this.pin({
    offsetX : x,
    offsetY : y
  });
  return this;
};

Cut.prototype.x = function(x) {
  if (!arguments.length) {
    return this.pin("offsetX");
  }
  this.pin("offsetX", x);
  return this;
};

Cut.prototype.y = function(y) {
  if (!arguments.length) {
    return this.pin("offsetY");
  }
  this.pin("offsetY", y);
  return this;
};

var M = Cut.Math;