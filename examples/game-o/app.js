Cut(function(root, elem) {
  TOP = typeof TOP === 'number' ? TOP : 0;
  var M = Cut.Math, Mouse = Cut.Mouse;
  Cut.Anim.FPS = 11;

  var Conf = {};

  Conf.width = 240;
  Conf.height = 120;
  Conf.max = Conf.height * 0.47;
  Conf.min = -Conf.max;
  Conf.itemSpace = 20;
  Conf.dotSpace = 6;
  Conf.speed = 0.11;
  Conf.acceleration = 0.0008 / 1000;

  Conf.ups = [ "power", "energy", "speed", "pull", "push", "slow" ];

  Conf.radius = {
    Player : 6,
    Dot : 1,
    Power : 4,
    Enemy : 5,
    Coin : 6
  };

  Conf.pull = {
    Dot : 1,
    Power : 0.1
  };

  Conf.push = {
    Enemy : 1
  };

  Conf.coinsScale = {
    c1 : 0.70,
    c2 : 0.75,
    c5 : 0.80,
    c10 : 0.90,
    c20 : 0.95,
    c50 : 1,
    c100 : 1.1
  };

  var Format = {};

  Format.coin = function(num) {
    num = num || 0;
    if (num < 10000) {
    } else if (num < 1000000) {
      num = (((num / 100) | 0) / 10) + "k";
    } else {
      num = (((num / 10000) | 0) / 100) + "M";
    }
    return "$" + num;
  };

  Format.k = function(num) {
    num = num ? ((num / 10) | 0) : 0;
    if (num < 10000) {
    } else if (num < 1000000) {
      num = (((num / 100) | 0) / 10) + "k";
    } else {
      num = (((num / 10000) | 0) / 100) + "M";
    }
    return num;
  };

  var Data = {
    key : "data"
  };

  Data.load = function() {
    var key = Data.key;
    DEBUG && console.log("game load", key);
    try {
      var data = localStorage.getItem(key);
      DEBUG && console.log("game load", key, data);
      return (data && JSON.parse(data)) || {};
    } catch (e) {
      console.log(e);
    }
    return {};
  };

  Data.save = function(data) {
    var key = Data.key;
    DEBUG && console.log("game save", key);
    try {
      data = JSON.stringify(data);
      DEBUG && console.log("game save", key, data);
      localStorage.setItem(key, data);
      return true;
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  var Sound = {};

  Sound.play = function(name) {
    // play sound here
  };

  function Game() {

    this.data = Data.load();

    var upgrades = this.data.upgrades || (this.data.upgrades = {});

    for (var i = 0; i < Conf.ups.length; i++) {
      var name = Conf.ups[i];
      upgrades[name] = upgrades[name] || 0;
    }

    upgrades.flags = Math.max(upgrades.flags || 0, 2);

    var stats = this.data.stats = this.data.stats || {};
    stats.coins = stats.coins || 0;
    stats.dist = stats.dist || 0;

    var flags = this.data.flags = this.data.flags || [];

    this.upgrade = function(name) {
      var price = this.price(name);
      DEBUG && console.log("upgrade: " + name + " at " + price);
      if (price > 0 && price <= stats.coins) {
        stats.coins -= price;
        upgrades[name] += 1;
        Data.save(this.data);
      }
      this.uiUpgrade();
    };

    this.price = function(name) {
      return Math.pow(10, (upgrades[name] || 0) + 2);
    };

    var objects = [];
    var inserted = [];

    var pointer = {};

    var time = 0;
    var lastItem = 0;
    var lastDot = 0;

    this.player = null;

    this.coins = 0;
    this.speed = 0;
    this.power = 0;
    this.energy = 0;
    this.dist = 0;

    this.tick = function(t) {
      t = Math.min(t, 100);
      for (i = inserted.length - 1; i >= 0; i--) {
        obj = inserted[i];
        if (obj.x + (obj.radius || 0) < this.dist + Conf.width) {
          inserted.splice(i, 1);
          obj.uiEnter();
          objects.push(obj);
        }
      }

      if (this.speed <= 0) {
        return;
      }

      var d, obj, px, py, x, y, dx, dy, dxy, i, f;
      d = t * this.speed;
      time += t;
      this.dist += d;
      this.power -= d;
      this.speed = Conf.speed + this.dist * Conf.acceleration
          * this.player.slow;
      this.energy -= d * this.player.energy;
      this.uiEnergy(this.energy);

      px = this.player.x;
      py = this.player.y;

      // this.player.setPower(this.power, this.player.power);

      for (i = objects.length - 1; i >= 0 && this.speed > 0; i--) {
        obj = objects[i];

        if (obj.x - (obj.radius || 0) < this.dist) {
          obj.remove();
          objects.splice(i, 1);
          continue;
        }

        dx = obj.x - px;
        dy = obj.y - py;
        dxy = M.length(dx, dy);

        if (this.player.pull && obj.pull) {
          f = this.player.pull * obj.pull;
          f = f * 5000 / dxy / dxy / dxy;
          r = Math.min(1, f * t / 1000);
          obj.x -= dx * r;
          obj.y -= dy * r;
        }

        if (this.player.push && obj.push) {
          f = this.player.push * obj.push;
          f = f * 0.3 / (1 + Math.pow(1.1, (dxy - 10 * (f + 1))));

          r = Math.min(1, f * t / 1000);
          obj.x += dx * r;
          obj.y += dy * r;
        }

        dx = obj.x - px;
        dy = obj.y - py;
        dxy = M.length(dx, dy);

        if (dxy < obj.radius + this.player.radius && obj.collide
            && obj.collide()) {
          obj.remove();
          objects.splice(i, 1);
          continue;
        }

        if (this.speed <= 0) {
          return;
        }

        obj.setPower && obj.setPower(this.power, this.player.power);

        obj.vx && (obj.x += t * obj.vx);
        obj.vy && (obj.y += t * obj.vy);

        obj.uiXY();
      }

      if (this.energy > 0) {
        if (pointer && pointer.fresh) {
          dx = pointer.x - px;
          dy = pointer.y - py;
          dxy = M.length(dx, dy);
          if (dxy < 0.1) {
            pointer.fresh = false;
          }
          dxy = Math.max(1, dxy / this.player.speed / t);
          px += dx / dxy;
          py += dy / dxy;
          pointer.x += d;
        }
        px += d;

        this.player.x = px;
        this.player.y = py;
        this.player.uiXY();

        this.setDist(this.dist);

      } else if (px < this.dist - Conf.width / 2) {
        this.end(false);
      }

      while (lastDot + Conf.dotSpace <= this.dist) {
        lastDot += Conf.dotSpace;
        if (obj = randomPattern.test() && randomPattern.random(this)) {
          var added = obj(this, lastDot + Conf.width);
          randomPattern
              .test(-added * this.dist * 0.00005 * M.random(0.8, 1.25));
        }
      }

      while (lastItem + Conf.itemSpace <= this.dist) {
        lastItem += Conf.itemSpace;
        if (obj = randomEnemy.test() && randomEnemy.random(this)
            || randomCoin.test() && randomCoin.random(this)) {
          obj(this, lastItem + Conf.width, M.random(Conf.min, Conf.max));
        }
      }

      this.uiMove(this.dist, time, d, t);
    };

    this.startFrom = function(flag) {
      if (flag < 0) {
        this.startDist = 0;
        this.startFlag = -1;
        return true;

      } else if (flag <= upgrades.flags && flags[flag]) {
        this.startDist = flags[flag];
        this.startFlag = flag;
        return true;
      }

      return false;
    };

    this.start = function() {
      DEBUG && console.log("game start");

      this.clear();

      this.coins = 0;
      this.speed = Conf.speed;
      this.power = 0;
      this.energy = 1;
      this.dist = this.startDist || 0;

      pointer = {};

      time = 0;
      lastItem = this.dist;
      lastDot = this.dist;

      randomPattern.reset();
      randomPower.reset();
      randomEnemy.reset();
      randomCoin.reset();

      this.uiCoins(this.coins);
      this.uiEnergy(this.energy);

      this.uiStart();

      this.player = this.player || new Player(this);
      this.player.x = Conf.width / 5 + this.dist;
      this.player.y = 0;
      this.player.uiXY();
      this.player.upgrade(upgrades);
      this.player.uiLive();
    };

    this.end = function(die) {
      DEBUG && console.log("game end");
      if (this.speed <= 0) {
        return;
      }
      this.speed = 0;

      var endFlag = this.startFlag + 1;
      if (endFlag < upgrades.flags) {
        while (endFlag < flags.length && flags[endFlag] <= this.dist) {
          flags.splice(endFlag, 1);
        }
        if (endFlag >= flags.length && flags.length <= upgrades.flags) {
          flags.splice(endFlag, 0, this.dist | 0);
        }
      }

      if (this.dist > stats.dist) {
        stats.dist = this.dist | 0;
      }
      stats.coins += this.coins;

      Data.save(this.data);

      this.player.uiDie(die, this.uiEnd.bind(this.ui));
    };

    this.clear = function() {
      DEBUG && console.log("game clear");

      for (var i = 0; i < objects.length; i++) {
        objects[i].remove();
      }
      objects.length = 0;

      for (var i = 0; i < inserted.length; i++) {
        inserted[i].remove();
      }
      inserted.length = 0;
    };

    this.pointer = function(x, y) {
      pointer.x = x;
      pointer.y = y;
      pointer.fresh = true;
      return this.speed > 0;
    };

    this.insert = function(obj, dot) {
      inserted.push(obj);
      if (dot && randomPower.test()) {
        obj = randomPower.random(this);
        obj(this, dot.x, dot.y);
      }
    };

    this.dots = new Pool().create(function() {
      return new Dot(this);
    }.bind(this)).exit(function(obj) {
      obj.onCheckOut();
    }).enter(function(obj) {
      obj.onCheckIn();
    }).discard(function(obj) {
      obj.uiRemove();
    }).max(127);

  }

  function Player(game) {
    this.radius = Conf.radius.Player;
    this.game = game;
    this.name = "player";
    game.uiNewPlayer(this);
  }

  Player.prototype.upgrade = function(ups) {
    this.power = 500 + ups.power * 250;
    this.energy = (1 - ups.energy / 16) / 1000;
    this.speed = 0.2 + ups.speed * 0.02;
    this.pull = ups.pull;
    this.push = ups.push;
    this.slow = 1 / (ups.slow * 0.2 + 1);
  };

  Game.prototype.newDot = function(x, y) {
    var obj = this.dots.checkOut();
    obj.x = x, obj.y = y;
    obj.vx = 0, obj.vy = 0;
    obj.uiXY();
    this.insert(obj, obj);
    return obj;
  };

  function Dot(game) {
    this.radius = Conf.radius.Dot;
    this.pull = Conf.pull.Dot;
    this.game = game;
    game.uiNewDot(this);
  }

  Dot.prototype.collide = function() {
    this.game.energy = Math.min(1.5, this.game.energy + 0.01);
    this.game.uiEnergy(this.game.energy);
    this.uiEat();
    return true;
  };

  Dot.prototype.remove = function() {
    this.game.dots.checkIn(this);
  };

  Game.prototype.newPower = function(x, y) {
    var obj = new Power(this);
    obj.x = x, obj.y = y;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Power(game) {
    this.radius = Conf.radius.Power;
    this.pull = Conf.pull.Power;
    this.game = game;
    game.uiNewPower(this);
  }

  Power.prototype.collide = function() {
    this.game.power = Math.max(this.game.player.power, this.game.power);
    this.uiEat();
    return true;
  };

  Power.prototype.remove = function() {
    this.uiRemove();
  };

  Game.prototype.newEnemy = function(name, x, y, vx, vy) {
    var obj = new Enemy(this, name);
    obj.x = x, obj.y = y;
    obj.vx = vx || 0, obj.vy = vy || 0;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Enemy(game, name) {
    this.radius = Conf.radius.Enemy;
    this.push = Conf.push.Enemy;
    this.game = game;
    this.name = name;
    game.uiNewEnemy(this);
  }

  Enemy.prototype.setPower = function(power, max) {
    if (this.dead) {
      return;
    }
    if (power <= 0) {
      if (this.weak != 0) {
        this.push = Conf.push.Enemy;
        this.weak = 0;
        this.uiMode(0);
      }
    } else if (power < max / 10) {
      if (this.weak != 1) {
        this.push = Conf.push.Enemy;
        this.weak = 1;
        this.uiMode(0);
      }
    } else if (power < max / 4) {
      if (this.weak != 2) {
        this.push = 0;
        this.weak = 2;
        this.uiMode(0.5);
      }
    } else {
      if (this.weak != 3) {
        this.push = 0;
        this.weak = 3;
        this.uiMode(1);
      }
    }
  };

  Enemy.prototype.collide = function() {
    if (this.dead) {

    } else if (this.weak == 0) {
      this.game.end(true);

    } else if (this.weak > 0) {
      this.push = 0;
      this.uiMode(-1);
      this.dead = true;
      this.vx = this.vy = 0;
      this.uiEat();
    }
    return false;
  };

  Enemy.prototype.remove = function() {
    this.uiRemove();
  };

  Game.prototype.newCoin = function(value, x, y) {
    var obj = new Coin(this, value);
    obj.x = x, obj.y = y;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Coin(game, value) {
    this.radius = Conf.radius.Coin;
    this.game = game;
    this.value = value;
    game.uiNewCoin(this);
  }

  Coin.prototype.collide = function(game) {
    this.game.coins += this.value;
    this.game.uiCoins(this.game.coins);
    this.uiEat();
    return true;
  };

  Coin.prototype.remove = function() {
    this.uiRemove();
  };

  // randomize

  var randomEnemy = new Randomize().spacing(function() {
    return M.random(5, 50) / Conf.itemSpace * 10;
  });

  randomEnemy.add(function(game, x) {
    var y = M.random(-1, 1) * (Conf.height / 2 - 10);
    return game.newEnemy("box", x, y);
  });

  randomEnemy.add(function(game, x) {
    var d = M.random() >= 0.5 ? 1 : -1;
    var y = d * Conf.height / 2;
    var vy = -d * game.speed / 2 * M.random(0.7, 1.4);
    return game.newEnemy("tri", x + 400 * game.speed, y - 400 * vy, 0, vy);
  });

  var randomCoin = new Randomize().spacing(function() {
    return M.random(20, 100) / Conf.itemSpace * 10;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(1, x, y);
  }, function(game) {
    return 1;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(2, x, y);
  }, function(game) {
    return (game.dist > 2000) ? 1 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(5, x, y);
  }, function(game) {
    return (game.dist > 5000) ? 2 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(10, x, y);
  }, function(game) {
    return (game.dist > 10000) ? 4 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(20, x, y);
  }, function(game) {
    return (game.dist > 20000) ? 8 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(50, x, y);
  }, function(game) {
    return (game.dist > 50000) ? 16 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(100, x, y);
  }, function(game) {
    return (game.dist > 100000) ? 32 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(1000, x, y);
  }, function(game) {
    return (game.dist > 100000) ? 4 * game.dist / 100000 : 0;
  });

  randomCoin.add(function(game, x, y) {
    return game.newCoin(10000, x, y);
  }, function(game) {
    return (game.dist > 100000) ? game.dist / 100000 : 0;
  });

  var randomPower = new Randomize().spacing(function() {
    return M.random(100, 400);
  });

  randomPower.add(function(game, x, y) {
    return game.newPower(x, y);
  });

  var randomPattern = new Randomize().spacing(function() {
    return 1;
  });

  randomPattern.range = function(min, max) {
    var h = M.random(min, max) * (Conf.max - Conf.min);
    var c = M.random(Conf.min + h / 2, Conf.max - h / 2);
    h *= (Math.random() >= 0.5 ? 1 : -1);
    var a = c - h / 2, b = c + h / 2;
    return {
      a : a,
      b : b,
      h : h,
      c : c
    };
  };

  // straight
  randomPattern.add(function(game, x) {
    var n = M.random(40, 50);
    var y = M.random(Conf.min, Conf.max);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, y);
    }
    return this.__lastadded = added;

  }, function(game) {
    return 1;
  });

  // step
  randomPattern.add(function(game, x) {
    var n = M.random(20, 40) | 0;
    var ab = randomPattern.range(0.2, 0.7);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, ab.a + i * ab.h / n);
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 1000 ? 0 : 1;
  });

  // stairs
  randomPattern.add(function(game, x) {
    var p = M.random(3, 6) | 0;
    var q = M.random(5, 15) | 0;
    var n = p * q;
    var ab = randomPattern.range(0.3, 0.7);

    var m = ab.h / p;

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, ab.a + ((i * ab.h / n) / m | 0) * m);
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 5000 ? 0 : 1;
  });

  // saw
  randomPattern.add(function(game, x) {
    var p = M.random(2, 6) | 0;
    var q = M.random(7, 13) | 0;
    var n = p * q;
    var ab = randomPattern.range(0.1, 0.6);

    var m = ab.h;

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, ab.a + ((-i * ab.h / q) / m | 0) * m
          + i * ab.h / q);
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 20000 ? 0 : 1;
  });

  // wave
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var a = Conf.dotSpace / M.random(10, 30), b = M.random(10, 30);
    var y = M.random(Conf.min + b, Conf.max - b);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, y + b * Math.sin(i * a));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 10000 ? 0 : 2;
  });

  // wave xy
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var a = Conf.dotSpace / M.random(10, 40), b = M.random(10, 30);
    var c = Conf.dotSpace / M.random(10, 40), d = M.random(10, 30);
    var y = M.random(Conf.min + b, Conf.max - b);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace + d * Math.cos(i * c), y + b
          * Math.sin(i * a));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 25000 ? 0 : game.dist < 15000 ? 1 : 2;
  });

  // zigzag
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var a = Conf.dotSpace / M.random(10, 40), b = M.random(10, 30);
    var y = M.random(Conf.min + b, Conf.max - b);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, y + b * zigzag(i * a));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 15000 ? 0 : 2;
  });

  // zigzag xy
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var a = Conf.dotSpace / M.random(10, 40), b = M.random(10, 30);
    var c = Conf.dotSpace / M.random(10, 40), d = M.random(10, 30);
    var y = M.random(Conf.min + b, Conf.max - b);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace + d * zagzig(i * c), y + b
          * zigzag(i * a));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 30000 ? 0 : game.dist < 17500 ? 1 : 2;
  });

  // rect
  randomPattern.add(function(game, x) {
    var n = M.random(3, 8), m = n;
    var y = M.random(Conf.min, Conf.max - m * Conf.dotSpace);

    var added = 0;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < m; j++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, y + j * Conf.dotSpace);
      }
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 70000 ? 0 : 1;
  });

  // spray
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var max = Math.min(1, game.dist / 100000);
    var min = Math.min(1, game.dist / 200000);
    var ab = randomPattern.range(min * 0.5, max * 0.7);

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + i * Conf.dotSpace, M.random(ab.a, ab.b));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 50000 ? 0 : game.dist < 75000 ? 1 : 2;
  });

  // flower
  randomPattern.add(function(game, x) {
    var n = M.random(40, 60);
    var f = M.random(0.2, 0.9) * Math.PI;
    var c = 5;

    var added = 0;
    for (var i = 0; i < n; i++) {
      added++;
      game.newDot(x + c * Math.sqrt(i + 1) * Math.sin(i * f), c
          * Math.sqrt(i + 1) * Math.cos(i * f));
    }
    return this.__lastadded = added;

  }, function(game) {
    return game.dist < 100000 ? 0 : 1;
  });

  function zigzag(t) {
    t = Cut.Math.rotate(t, -Math.PI, Math.PI) / Math.PI * 2;
    if (t > 1) {
      t = 2 - t;
    } else if (t < -1) {
      t = -2 - t;
    }
    return t;
  }

  function zagzig(t) {
    return zigzag(t + Math.PI / 2);
  }

  // ------------------- UI -------------------

  Cut.prototype.xy = (function() {
    var pin = {};
    return function(x, y) {
      pin.offsetX = x, pin.offsetY = y;
      this.pin(pin);
      return this;
    };
  })();

  Mouse(root, elem, true);

  var app = Cut.create().appendTo(root);
  var game = new Game();

  app.on("viewport", function(viewport) {
    this.pin({
      width : Conf.width,
      height : Conf.height * 1.2,
      resizeMode : "in",
      resizeWidth : viewport.width,
      resizeHeight : viewport.height - TOP,
      offsetY : TOP
    });
  });

  app.open = function(open) {
    if (typeof open == "string") {
      open = this[open];
    }
    if (this.opened === open) {
      return;
    }
    this.opened && this.opened.trigger("close");
    this.opened = open.trigger("open");
  };

  (function() {// home screen
    var home = app.home = Cut.create().appendTo(app).hide().pin({
      align : 0.5
    });

    home.on("viewport", function() {
      this.pin({
        width : this.parent().pin("width"),
        height : this.parent().pin("height")
      });

      bg.pin({
        scaleMode : "out",
        scaleWidth : this.pin("width"),
        scaleHeight : this.pin("height")
      });
    });

    game.uiUpgrade = function() {
      refresh();
    };

    home.on("open", function() {
      refresh();
      this.pin('alpha', 0).show().tween(200).pin('alpha', 1);
    });

    home.on("close", function() {
      this.tween(200).pin('alpha', 0).then(function() {
        this.hide();
      });
    });

    var bg = Cut.image("base:homebg").appendTo(home).pin("align", 0.5);

    var menu = Cut.column(0).appendTo(home).pin("align", 0.5).spacing(4);

    var tombstone = Cut.image("base:tombstone").appendTo(menu);

    var row = Cut.row().appendTo(menu).spacing(4);
    var flags = [];
    for (var i = 0; i < 6; i++) {
      var flag = Cut.image("base:play").appendTo(row).on(Mouse.CLICK,
          startFrom(i - 1));
      flags.push(flag);
    }

    function startFrom(flag) {
      return function() {
        if (flag == game.data.upgrades.flags) {
          game.upgrade("flags");
        } else if (game.startFrom(flag)) {
          app.open("play");
        }
        return true;
      };
      return null;
    }

    var row = Cut.row().appendTo(menu).spacing(4);

    var upgrades = {};

    for (var i = 0; i < Conf.ups.length; i++) {
      var name = Conf.ups[i];
      upgrades[name] = Cut.image("base:option").appendTo(row)
          .attr("name", name).on(Mouse.CLICK, function() {
            game.upgrade(this.attr("name"));
          });
    }

    function refresh() {
      for (var i = 0; i < flags.length; i++) {
        var button = flags[i].empty().pin("alpha", 0.9);
        if (i <= game.data.upgrades.flags) {
          var value = Format.k(game.data.flags[i - 1]);
          value = i > 0 ? (value || "-") : 0;
          Cut.string("base:d_").appendTo(button).pin({
            alignY : 0.5,
            alignX : 0.45,
            handle : 0.5,
            scale : 0.8,
          }).value(value);
          continue;
        }
        var price = game.price("flags");
        if (i == game.data.upgrades.flags + 1) {
          Cut.string("base:d_").value(Format.coin(price)).pin({
            alignY : 0.5,
            alignX : 0.4,
            handle : 0.5,
            alpha : 0.8,
            scale : 0.6
          }).appendTo(button);
        }
        for (var child = button.first(); child; child = child.next()) {
          child.pin("alpha", price <= game.data.stats.coins ? 1 : 0.5);
        }
      }

      tombstone.empty();
      Cut.string("base:d_").appendTo(tombstone).pin({
        alignX : 0.5,
        alignY : 1,
        offsetX : -2,
        offsetY : -6,
        alpha : 0.6,
        scale : 0.8
      }).value(0 + "-" + Format.k(game.data.stats.dist));

      Cut.string("base:d_").appendTo(tombstone).pin({
        alignX : 0.5,
        alignY : 0,
        offsetX : -4,
        offsetY : 10.5,
        alpha : 0.5,
        scale : 0.7
      }).value(Format.coin(game.data.stats.coins));

      for (var i = 0; i < Conf.ups.length; i++) {
        var name = Conf.ups[i];
        var price = game.price(name);
        var level = game.data.upgrades[name] || 0;
        var button = upgrades[name].empty().pin("alpha", 0.9);
        // image
        Cut.image("base:up_" + name).pin("align", 0.5).appendTo(button);
        // price
        Cut.string("base:d_").value(Format.coin(price)).pin({
          align : 1,
          offsetX : -1.6,
          offsetY : -1.4,
          alpha : 0.8,
          scale : 0.6
        }).appendTo(button);
        // level
        if (level <= 6) {
          Cut.image("base:up_" + level).pin({
            alignX : 0,
            alignY : 0,
            offsetX : 1.6,
            offsetY : 1.4,
            alpha : 0.8,
            scale : 0.6
          }).appendTo(button);
        }

        for (var child = button.first(); child; child = child.next()) {
          child.pin("alpha", price <= game.data.stats.coins ? 1 : 0.5);
        }
      }
    }
  })();

  (function() { // play screen
    var play = app.play = Cut.create().appendTo(app).hide().pin({
      align : 0.5
    });

    play.on("viewport", function() {
      this.pin({
        width : this.parent().pin("width"),
        height : this.parent().pin("height")
      });

      bg.pin({
        scaleMode : "out",
        scaleWidth : this.pin("width"),
        scaleHeight : this.pin("height")
      });

      var toph = TOP / this.pin("scaleX") / this.parent().pin("scaleX");
      top.pin({
        width : this.pin("width"),
        height : toph,
        offsetY : -toph
      });
    });

    play.on("open", function() {
      elem.style && (elem.style.cursor = "none");
      game.start();
      this.pin('alpha', 0).show().tween(200).pin('alpha', 1);
    });

    play.on("close", function() {
      elem.style && (elem.style.cursor = "");
      game.end();
      this.tween(200).pin('alpha', 0).then(function() {
        this.hide();
      });
    });

    play.tick(function(t) {
      game.tick(t);
    }, true);

    var bg = Cut.image("base:playbg").appendTo(play).pin("align", 0.5);
    var bgcolor = Cut.anim("base:c_").appendTo(bg).pin({
      alpha : 0.6,
      align : 0.5,
      scale : 3
    });

    var border = Cut.image("base:border").stretch().appendTo(play).pin({
      width : Conf.width,
      height : Conf.height,
      align : 0.5,
      alpha : 0.5
    });

    var top = Cut.image("base:shadow").stretch().appendTo(play);

    var field = Cut.create().appendTo(play).attr('spy', true).pin({
      width : Conf.width,
      height : Conf.height,
      alignX : 0.5,
      alignY : 0.5,
      handleY : 0
    });

    var energy = Cut.image("base:energy").stretch().appendTo(play).pin({
      alignX : 0,
      alignY : 0,
      offsetX : 3,
      offsetY : 2
    });

    var dist = Cut.string("base:d_").appendTo(play).pin({
      alignX : 0,
      alignY : 0,
      offsetX : 3,
      offsetY : 9
    });

    var coins = Cut.string("base:d_").appendTo(play).pin({
      alignX : 1,
      alignY : 0,
      offsetX : -3,
      offsetY : 3
    });

    var lastCoin = Cut.column(0.5).appendTo(play).pin({
      alignX : 0.5,
      alignY : 0,
      offsetX : 10,
      offsetY : 2
    }).append(Cut.anim("base:coin_"), Cut.string("base:d_").pin("scale", 0.8))
        .hide();

    var lastCoinTimeout = null;

    function setLastCoin(value, scale) {
      lastCoin.first().gotoLabel("coin_" + value + "_")
          .pin("scale", scale || 1);
      lastCoin.last().value(Format.coin(value)).visible(value > 100);

      lastCoin.show();
      clearTimeout(lastCoinTimeout);
      lastCoinTimeout = setTimeout(function() {
        lastCoin.hide();
      }, 1000);
    }

    var cursor = Cut.image("base:cursor").pin("handle", 0.5).appendTo(field)
        .hide();

    var l1 = Cut.create().appendTo(field);
    var l2 = Cut.create().appendTo(field);
    var l3 = Cut.create().appendTo(field);

    // var lastMouse = null;

    field.on([ Mouse.MOVE, Mouse.START ], function(point) {
      // if (lastMouse) {
      // var x = lastMouse.x - point.x + game.dist - lastMouse.dist;
      // var y = lastMouse.y - point.y;
      // x = game.player.x - x * 3;
      // y = game.player.y - y * 3;
      //
      // cursor.xy(x, y).visible(game.pointer(x, y));
      //
      // lastMouse.x = point.x;
      // lastMouse.y = point.y;
      // lastMouse.dist = game.dist;
      //
      // } else {
      cursor.xy(point.x, point.y).visible(game.pointer(point.x, point.y));
      // }

      // }).on(Mouse.START, function(point) {
      // lastMouse = {
      // x : point.x,
      // y : point.y,
      // dist : game.dist
      // };
      //
      // }).on(Mouse.END, function(point) {
      // lastMouse = null;

    });

    var colors = {
      list : randomList(bgcolor.length()),
      i : 0,
      next : function() {
        return this.list[(this.i++) % this.list.length];
      }
    };

    function randomList(size) {
      var list = [];
      for (var i = 0; i < size; i++) {
        list[i] = i;
      }
      for (var i = 0; i < size; i++) {
        var j = Math.floor(Math.random() * (size - i)) + i;
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
      return list;
    }

    game.uiStart = function() {
      DEBUG && console.log("app start");
      bgcolor.gotoFrame(colors.next());
    };

    game.uiMove = function(dist, time, d, t) {
      cursor.pin("offsetX", cursor.pin("offsetX") + d);
      field.pin("offsetX", -dist);
    };

    game.uiEnd = function() {
      DEBUG && console.log("app end");
      setTimeout(function() {
        app.open("home");
      }, 1000);
    };

    game.setDist = function(d) {
      dist.value(Format.k(d));
    };

    game.uiEnergy = function(e) {
      energy.pin("width", (Math.max(0, e) * 100 | 0) / 100 * 40);
    };

    game.uiCoins = function(n) {
      coins.value(Format.coin(n));
    };

    game.uiNewPlayer = function(obj) {
      DEBUG && console.log("player create");
      obj.ui = Cut.anim("base:" + obj.name + "_").pin("handle", 0.5).appendTo(
          l3);
      obj.uiXY = function() {
        this.ui.xy(this.x, this.y);
      };
      obj.uiLive = function(anim, callback, freeze) {
        DEBUG && console.log("player live");
        this.freeze = !!freeze;
        !this.freeze && Sound.play("start");
        // cursor.show();
        this.ui.frames("base:" + this.name + "_").show();
        !this.freeze && this.ui.play();
        callback && callback();
      };
      obj.uiDie = function(anim, callback) {
        DEBUG && console.log("player die");
        if (anim) {
          !this.freeze && Sound.play("die");
          cursor.hide();
          this.ui.frames("base:die").play().repeat(1, callback);
        } else {
          callback && callback();
        }
      };
    };

    game.uiNewDot = function(obj) {
      obj.ui = Cut.image("base:dot").pin("handle", 0.5).appendTo(l1).hide();
      obj.uiEnter = function() {
        this.ui.show();
      };
      obj.uiXY = function() {
        this.ui.xy(this.x, this.y);
      };
      obj.onCheckOut = function() {
      };
      obj.onCheckIn = function() {
        this.ui.hide();
      };
      obj.uiRemove = function() {
        this.ui.remove();
        this.ui = null;
      };
      obj.uiEat = function(e) {
        Sound.play("dot");
      };
    };

    game.uiNewPower = function(obj) {
      obj.ui = Cut.image("base:power").pin("handle", 0.5).appendTo(l2).hide();
      obj.uiEnter = function() {
        this.ui.show();
      };
      obj.uiXY = function() {
        this.ui.xy(this.x, this.y);
      };
      obj.uiEat = function() {
        Sound.play("power");
      };
      obj.uiRemove = function() {
        this.ui.remove();
        this.ui = null;
      };
    };

    game.uiNewEnemy = function(obj) {
      obj.ui = Cut.anim("base:" + obj.name).pin("handle", 0.5).appendTo(l2)
          .hide();
      obj.uiEnter = function() {
        this.ui.show();
      };
      obj.uiMode = function(weak) {
        if (weak == 0) {
          this.ui.frames("base:" + this.name + "_").play();
        } else if (weak == -1) {
          this.ui.frames("base:un" + this.name).gotoFrame(0).pin({
            "alpha" : 0.8,
            "rotation" : 0
          });
        } else if (weak == 1) {
          this.ui.frames("base:" + this.name + "z_").play();
        } else {
          this.ui.frames("base:" + this.name + "").play();
        }
      };
      obj.uiXY = function() {
        this.ui.xy(this.x, this.y);
        if (this.vx || this.vy) {
          this.ui.pin("rotation", Math.atan2(this.vx, this.vy) - Math.PI / 2);
        }
      };
      obj.uiRemove = function() {
        this.ui.remove();
        this.ui = null;
      };
      obj.uiEat = function() {
        Sound.play("enemy");
      };
    };

    game.uiNewCoin = function(obj) {
      obj.scale = Conf.coinsScale["c" + obj.value] || 1;
      obj.ui = Cut.anim("base:coin_" + obj.value + "_").pin("handle", 0.5)
          .appendTo(l2).pin("scale", obj.scale).hide();
      obj.uiEnter = function() {
        this.ui.show();
      };
      obj.uiXY = function() {
        this.ui.xy(this.x, this.y);
      };
      obj.uiRemove = function() {
        this.ui.remove();
        this.ui = null;
      };
      obj.uiEat = function() {
        setLastCoin(this.value, this.scale);
        Sound.play("coin");
      };
    };
  })();

  app.open("home");

});