Cut(function(root, container) {

  var Mouse = Cut.Mouse, Util = {};

  // few useful functions
  Util.random = function(min, max) {
    if (min == max) {
      return min;
    }
    return Math.random() * (max - min) + min;
  };

  Util.dist = function(a, b) {
    var x = a, y = b;
    if (typeof a === 'object') {
      x = a.x, y = a.y;
    }
    if (typeof b === 'object') {
      x = b.x - x, y = b.y - y;
    }
    return Math.sqrt(x * x + y * y);
  };

  Util.diff = function(a, b) {
    return {
      x : b.x - a.x,
      y : b.y - a.y
    };
  };

  Util.unitvect = function(a, m) {
    m = m || 1;
    var length = Math.sqrt(a.x * a.x + a.y * a.y);
    return {
      x : a.x / length * m,
      y : a.y / length * m
    };
  };

  // enable mouse
  Mouse(root, container);

  // set viewbox and put its zero point on center
  root.viewbox(150, 150);

  // add the background
  Cut.image('bg:black').pin('align', 0.5).on('viewport', function() {
    // on viewport change scale it to fill root
    this.pin({
      scaleMode : 'out',
      scaleWidth : root.pin('width'),
      scaleHeight : root.pin('height')
    });
  }).appendTo(root);

  // keep track of active view
  var openview = null;

  // open a view
  function open(view) {
    openview && openview.hide();
    openview = view.show();
  }

  // game home view
  var homeview = Cut.create().appendTo(root).hide().on('viewport', function() {
    this.pin({
      width : root.pin('width'),
      height : root.pin('height')
    });
  });

  // start button
  var startbtn = Cut.image("base:play").appendTo(homeview).pin('align', 0.5);
  startbtn.on(Mouse.CLICK, function() {
    play();
  });

  // open home view
  function home() {
    open(homeview);
  }

  // game play view
  var playview = Cut.create().appendTo(root).hide().on('viewport', function() {
    this.pin({
      width : root.pin('width'),
      height : root.pin('height')
    });
  });

  var spacepanel = Cut.create().appendTo(playview).pin('align', 0.5);

  // score number
  var scorenum = Cut.string('digit:').pin('scale', 0.8);
  // life number
  var lifenum = Cut.string('digit:').pin('scale', 0.8).hide();
  // align score and life number on a row and place it on top-left
  Cut.row().spacing(2).pin({
    offset : 2,
    align : 0,
    handle : 0
  }).appendTo(root).append(scorenum, lifenum);

  // some static values
  var PLANET_R = 6; // planet collision radius
  var EXPLODE_R = 6; // explode radius
  var RELOAD = 1000; // reload time
  var LIFE = 3;

  // game objects
  var bullets = [];
  var asteroids = [];
  var ships = [];
  var planet = new Planet();

  // game state
  var life = 0;
  var score = 0;
  var offset = 0;
  var time = 0;
  var nextAsteroid = 0;

  // open play view and start game
  function play() {
    life = LIFE;
    score = 0;
    offset = 0;
    time = 0;
    nextAsteroid = 0;

    while (ships.length)
      ships.pop().remove();

    while (asteroids.length)
      asteroids.pop().remove();

    while (bullets.length)
      bullets.pop().remove();

    ships.push(new Ship(8, 2, offset).add(spacepanel).next());

    planet.add(spacepanel);

    open(playview);
  }

  // on gameover go back to home
  function gameover() {
    home();
  }

  spacepanel.on(Mouse.START, function(point) {
    if (ships[0].ready()) {
      var bullet = new Bullet(25, ships[0], point).add(spacepanel);
      bullets.push(bullet);
      ships[0].remove();
      ships.splice(0, 1);
      if (!ships.length) {
        ships.push(new Ship(8, 2, offset += 0.4).add(spacepanel));
      }
      ships[0].next();
    }
  }).attr('spy', true);

  // game loop
  spacepanel.tick(function(t) {

    // avoid jumps
    t = Math.min(t, 100);

    // total time
    time += t;

    // if less than 3 ships and first is ready
    if (ships.length < 3 && ships[ships.length - 1].ready()) {
      // add another ship
      ships.push(new Ship(8, 2, offset += 0.4).add(spacepanel));
    }

    // tick all ships
    for (var s = ships.length - 1; s >= 0; s--) {
      var ship = ships[s];
      ship.tick(t, time);
    }

    // tick all asteroids
    for (var j = asteroids.length - 1; j >= 0; j--) {
      var asteroid = asteroids[j];
      // if hit planet
      if (asteroid.tick(t, time)) {
        life--;
        asteroid.remove();
        asteroids.splice(j, 1);
      }
    }

    // tick all asteroids
    for (var i = bullets.length - 1; i >= 0; i--) {
      var bullet = bullets[i];
      // if arrived at target
      if (bullet.tick(t, time)) {
        explode(bullet);
        bullet.remove();
        bullets.splice(i, 1);
      }
    }

    if ((nextAsteroid -= t) < 0) {
      nextAsteroid = Util.random(2, 3) * 180 / (time / 1000 + 180) * 1000;
      var a = Util.random(0, 2 * Math.PI);
      var r = Util.random(120, 180);
      var speed = Util.random(0.7, 1.7) * (4 + time * 0.00001);
      var asteroid = new Asteroid(speed, {
        x : r * Math.sin(a),
        y : r * Math.cos(a)
      }).add(spacepanel);
      asteroids.push(asteroid);
    }

    planet.tick(t, time);

    scorenum.value(score);
    lifenum.value(life);

    if (life == 0) {
      gameover();
    }
  });

  function Planet() {
    this.x = 0;
    this.y = 0;

    var img = Cut.image('base:planet').pin('handle', 0.5);

    this.add = function(parent) {
      img.appendTo(parent);
      return this;
    };

    this.remove = function() {
      img.remove();
      return this;
    };

    this.tick = function(t, time) {
      img.pin('alpha', Math.min(1, Math.max(0, Math.pow(life / LIFE, 2))));
    };
  }

  function Ship(radius, freq, offset) {
    this.x = 0;
    this.y = 0;

    var img = Cut.image('base:ship').pin('handle', 0.5);
    var readyimg = Cut.image('base:next').pin('align', 0.5).appendTo(img)
        .hide();

    var ready = RELOAD; // time to reload and ready

    this.add = function(parent) {
      img.appendTo(parent);
      return this;
    };

    this.remove = function() {
      img.remove();
      return this;
    };

    var pin = {}; // to be reused

    this.tick = function(t, time) {
      ready = Math.max(0, ready - t);
      this.x = radius * Math.sin(-freq * time / 1000 + offset);
      this.y = radius * Math.cos(-freq * time / 1000 + offset);

      pin.alpha = 100 / (ready + 100);
      pin.offsetX = this.x;
      pin.offsetY = this.y;
      img.pin(pin);
      readyimg.pin('alpha', ready <= 0);
    };

    this.next = function() {
      readyimg.show();
      return this;
    };

    this.ready = function() {
      return ready <= 0;
    };
  }

  function Asteroid(speed, from) {
    this.x = from.x;
    this.y = from.y;

    // calculate velocity
    var v = Util.unitvect(Util.diff(from, planet), speed);

    var img = Cut.image('base:asteroid').pin('handle', 0.5);

    this.add = function(parent) {
      img.appendTo(parent);
      return this;
    };

    this.remove = function() {
      img.remove();
      return this;
    };

    var pin = {}; // to be reused

    this.tick = function(t, time) {
      this.x += v.x * t / 1000;
      this.y += v.y * t / 1000;

      pin.offsetX = this.x;
      pin.offsetY = this.y;
      img.pin(pin);

      return Util.dist(this, planet) < PLANET_R;
    };
  }

  function Bullet(speed, from, to) {

    this.x = from.x;
    this.y = from.y;

    // calculate velocity
    var v = Util.unitvect(Util.diff(from, to), speed);

    // save target by value
    var target = {
      x : to.x,
      y : to.y
    };

    var img = Cut.image('base:bullet').pin('handle', 0.5);

    this.add = function(parent) {
      img.appendTo(parent);
      return this;
    };

    this.remove = function() {
      img.remove();
      return this;
    };

    var pin = {}; // to be reused

    this.tick = function(t, time) {
      this.x += v.x * t / 1000;
      this.y += v.y * t / 1000;

      pin.offsetX = this.x;
      pin.offsetY = this.y;
      img.pin(pin);

      return Util.dist(this, target) < 1;
    };
  }

  function explode(bullet) {
    Cut.image('base:explosion').pin('handle', 0.5).pin({
      offsetX : bullet.x,
      offsetY : bullet.y
    }).appendTo(spacepanel).pin('scale', 0.1).tween(50).pin({
      scale : 1
    }).then(function() {
      for (var a = asteroids.length - 1; a >= 0; a--) {
        var asteroid = asteroids[a];
        var dist = Util.dist(asteroid, bullet);
        if (dist < EXPLODE_R) {
          asteroid.remove();
          asteroids.splice(a, 1);
          // life = Math.min(LIFE, life + 1);
          score++;
        }
      }
    }).tween(200).pin('alpha', 0).then(function() {
      this.remove();
    });
  }

  home();

});