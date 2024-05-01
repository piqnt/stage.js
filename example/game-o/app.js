import Stage from "../../src";
import Pool from "../common/pool";
import Randomize from "../common/randomize";

import "./textures";

const DEBUG = true;

let TOP = 0;

const PLAYFUL_COLORS = [
  "#f2f2f2",
  "#e1e1e1",
  "#ff5a82",
  "#ff5555",
  "#db4cf4",
  "#ff4edc",
  "#7d7de8",
  "#a163ff",
  "#5ba2dd",
  "#00b2de",
  "#56dc8b",
  "#62d962",
  "#a0f667",
  "#d6ff36",
  "#ecff24",
  "#fffe34",
  "#ffda3e",
  "#ffb843",
];

let Conf = {};

Conf.width = 240;
Conf.height = 120;
Conf.max = Conf.height * 0.47;
Conf.min = -Conf.max;
Conf.itemSpace = 20;
Conf.dotSpace = 6;
Conf.speed = 0.11;
Conf.acceleration = 0.0008 / 1000;

Conf.ups = ["power", "energy", "speed", "pull", "push", "slow"];

Conf.radius = {
  Player: 6,
  Dot: 1,
  Power: 4,
  Enemy: 5,
  Coin: 6,
};

Conf.pull = {
  Dot: 1,
  Power: 0.1,
};

Conf.push = {
  Enemy: 1,
};

Conf.coinsScale = {
  1: 0.7,
  2: 0.75,
  5: 0.8,
  10: 0.9,
  20: 0.95,
  50: 1,
  100: 1.1,
};

let Format = {};

Format.coin = function (num) {
  num = num || 0;
  if (num < 10000) {
  } else if (num < 1000000) {
    num = ((num / 100) | 0) / 10 + "k";
  } else {
    num = ((num / 10000) | 0) / 100 + "M";
  }
  return "$" + num;
};

Format.k = function (num) {
  num = num ? (num / 10) | 0 : 0;
  if (num < 10000) {
  } else if (num < 1000000) {
    num = ((num / 100) | 0) / 10 + "k";
  } else {
    num = ((num / 10000) | 0) / 100 + "M";
  }
  return num;
};

let Data = {
  key: "data",
};

Data.load = function () {
  let key = Data.key;
  DEBUG && console.log("game load", key);
  try {
    let data = localStorage.getItem(key);
    DEBUG && console.log("game load", key, data);
    return (data && JSON.parse(data)) || {};
  } catch (e) {
    console.log(e);
  }
  return {};
};

Data.save = function (data) {
  let key = Data.key;
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

let Sound = {};

Sound.play = function (name) {
  // play sound here
};

function Game() {
  let math = Stage.math;

  let game = this;
  this.data = Data.load();

  let upgrades = this.data.upgrades || (this.data.upgrades = {});

  for (let i = 0; i < Conf.ups.length; i++) {
    let name = Conf.ups[i];
    upgrades[name] = upgrades[name] || 0;
  }

  upgrades.flags = math.max(upgrades.flags || 0, 2);

  let stats = (this.data.stats = this.data.stats || {});
  stats.coins = stats.coins || 0;
  stats.dist = stats.dist || 0;

  let flags = (this.data.flags = this.data.flags || []);

  this.upgrade = function (name) {
    let price = this.price(name);
    DEBUG && console.log("upgrade: " + name + " at " + price);
    if (price > 0 && price <= stats.coins) {
      stats.coins -= price;
      upgrades[name] += 1;
      Data.save(this.data);
    }
    this.uiUpgrade();
  };

  this.price = function (name) {
    return math.pow(10, (upgrades[name] || 0) + 2);
  };

  let objects = [];
  let inserted = [];

  let pointer = {};

  let time = 0;
  let lastItem = 0;
  let lastDot = 0;

  this.player = null;

  this.coins = 0;
  this.speed = 0;
  this.power = 0;
  this.energy = 0;
  this.dist = 0;

  this.tick = function (t) {
    t = math.min(t, 100);
    for (let i = inserted.length - 1; i >= 0; i--) {
      let obj = inserted[i];
      if (obj.x + (obj.radius || 0) < this.dist + Conf.width) {
        inserted.splice(i, 1);
        obj.uiEnter();
        objects.push(obj);
      }
    }

    if (this.speed <= 0) {
      return;
    }

    let d, obj, px, py, x, y, dx, dy, dxy, i, f;
    d = t * this.speed;
    time += t;
    this.dist += d;
    this.power -= d;
    this.speed = Conf.speed + this.dist * Conf.acceleration * this.player.slow;
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
      dxy = math.length(dx, dy);

      if (this.player.pull && obj.pull) {
        f = this.player.pull * obj.pull;
        f = (f * 5000) / dxy / dxy / dxy;
        r = math.min(1, (f * t) / 1000);
        obj.x -= dx * r;
        obj.y -= dy * r;
      }

      if (this.player.push && obj.push) {
        f = this.player.push * obj.push;
        f = (f * 0.3) / (1 + math.pow(1.1, dxy - 10 * (f + 1)));

        r = math.min(1, (f * t) / 1000);
        obj.x += dx * r;
        obj.y += dy * r;
      }

      dx = obj.x - px;
      dy = obj.y - py;
      dxy = math.length(dx, dy);

      if (dxy < obj.radius + this.player.radius && obj.collide && obj.collide()) {
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
      if (pointer.fresh) {
        dx = pointer.x - px;
        dy = pointer.y - py;
        dxy = math.length(dx, dy);
        if (dxy < 0.1) {
          pointer.fresh = false;
        }
        dxy = math.max(1, dxy / this.player.speed / t);
        px += dx / dxy;
        py += dy / dxy;
      }
      pointer.x += d;
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
      let pattern = randomPattern.test() && randomPattern.random();
      if (pattern) {
        let added = pattern.call(randomPattern, lastDot + Conf.width);
        added = added * (1 + this.dist * 0.00002 * math.random(0.8, 1.25));
        randomPattern.test(-added);
      }
    }

    while (lastItem + Conf.itemSpace <= this.dist) {
      lastItem += Conf.itemSpace;
      let enemy = randomEnemy.test() && randomEnemy.random();
      let coin = randomCoin.test() && randomCoin.random();
      if (enemy) {
        enemy.call(randomEnemy, lastItem + Conf.width, math.random(Conf.min, Conf.max));
      } else if (coin) {
        coin.call(randomCoin, lastItem + Conf.width, math.random(Conf.min, Conf.max));
      }
    }

    this.uiMove(this.dist, time, d, t);
  };

  this.startFrom = function (flag) {
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

  this.start = function () {
    DEBUG && console.log("game start");

    this.clear();

    this.coins = 0;
    this.speed = Conf.speed;
    this.power = 0;
    this.energy = 1;
    this.dist = this.startDist || 0;

    pointer = {
      x: Conf.width / 5 + this.dist,
      y: 0,
    };

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

    this.player = this.player || new Player();
    this.player.x = pointer.x;
    this.player.y = pointer.y;
    this.player.uiXY();
    this.player.upgrade(upgrades);
    this.player.uiLive();
  };

  this.end = function (die) {
    DEBUG && console.log("game end");
    if (this.speed <= 0) {
      return;
    }
    this.speed = 0;

    let endFlag = this.startFlag + 1;
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

  this.clear = function () {
    DEBUG && console.log("game clear");

    for (let i = 0; i < objects.length; i++) {
      objects[i].remove();
    }
    objects.length = 0;

    for (let i = 0; i < inserted.length; i++) {
      inserted[i].remove();
    }
    inserted.length = 0;
  };

  this.pointer = function (x, y) {
    pointer.x = x;
    pointer.y = y;
    pointer.fresh = true;
    return this.speed > 0;
  };

  this.move = function (x, y) {
    pointer.x += x * x * Conf.width * (x < 0 ? -1 : 1) * 3;
    pointer.y += y * y * Conf.height * (y < 0 ? -1 : 1) * 3;
    pointer.fresh = true;
    return this.speed > 0;
  };

  this.insert = function (obj, dot) {
    inserted.push(obj);
    if (dot && randomPower.test()) {
      obj = randomPower.random();
      obj(dot.x, dot.y);
    }
  };

  let dotspool = new Pool()
    .create(function () {
      return new Dot();
    })
    .exit(function (obj) {
      obj.onCheckOut();
    })
    .enter(function (obj) {
      obj.onCheckIn();
    })
    .discard(function (obj) {
      obj.uiRemove();
    })
    .max(127);

  function Player() {
    this.radius = Conf.radius.Player;
    this.name = "player";
    game.uiNewPlayer(this);
  }

  Player.prototype.upgrade = function (ups) {
    this.power = 500 + ups.power * 250;
    this.energy = 0.0008 * (1 - ups.energy / 8);
    this.speed = 0.2 + ups.speed * 0.02;
    this.pull = ups.pull;
    this.push = ups.push;
    this.slow = 1 / (ups.slow * 0.2 + 1);
  };

  this.newDot = function (x, y) {
    let obj = dotspool.checkOut();
    obj.x = x;
    obj.y = y;
    obj.vx = 0;
    obj.vy = 0;
    obj.uiXY();
    this.insert(obj, obj);
    return obj;
  };

  function Dot() {
    this.radius = Conf.radius.Dot;
    this.pull = Conf.pull.Dot;
    game.uiNewDot(this);
  }

  Dot.prototype.collide = function () {
    game.energy = math.min(1.5, game.energy + 0.01);
    game.uiEnergy(game.energy);
    this.uiEat();
    return true;
  };

  Dot.prototype.remove = function () {
    dotspool.checkIn(this);
  };

  this.newPower = function (x, y) {
    let obj = new Power();
    obj.x = x;
    obj.y = y;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Power() {
    this.radius = Conf.radius.Power;
    this.pull = Conf.pull.Power;
    game.uiNewPower(this);
  }

  Power.prototype.collide = function () {
    game.power = math.max(game.player.power, game.power);
    this.uiEat();
    return true;
  };

  Power.prototype.remove = function () {
    this.uiRemove();
  };

  this.newEnemy = function (name, x, y, vx, vy) {
    let obj = new Enemy(name);
    obj.x = x;
    obj.y = y;
    obj.vx = vx || 0;
    obj.vy = vy || 0;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Enemy(name) {
    this.radius = Conf.radius.Enemy;
    this.push = Conf.push.Enemy;
    this.name = name;
    game.uiNewEnemy(this);
  }

  Enemy.prototype.setPower = function (power, max) {
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

  Enemy.prototype.collide = function () {
    if (this.dead) {
    } else if (this.weak == 0) {
      game.end(true);
    } else if (this.weak > 0) {
      this.push = 0;
      this.uiMode(-1);
      this.dead = true;
      this.vx = this.vy = 0;
      this.uiEat();
    }
    return false;
  };

  Enemy.prototype.remove = function () {
    this.uiRemove();
  };

  this.newCoin = function (value, x, y) {
    let obj = new Coin(value);
    obj.x = x;
    obj.y = y;
    obj.uiXY();
    this.insert(obj);
    return obj;
  };

  function Coin(value) {
    this.radius = Conf.radius.Coin;
    this.value = value;
    game.uiNewCoin(this);
  }

  Coin.prototype.collide = function () {
    game.coins += this.value;
    game.uiCoins(game.coins);
    this.uiEat();
    return true;
  };

  Coin.prototype.remove = function () {
    this.uiRemove();
  };

  // randomize

  let randomEnemy = new Randomize().spacing(function () {
    return (math.random(5, 50) / Conf.itemSpace) * 10;
  });

  randomEnemy.add(function (x) {
    let y = math.random(-1, 1) * (Conf.height / 2 - 10);
    return game.newEnemy("box", x, y);
  });

  randomEnemy.add(function (x) {
    let d = math.random() >= 0.5 ? 1 : -1;
    let y = (d * Conf.height) / 2;
    let vy = ((-d * game.speed) / 2) * math.random(0.7, 1.4);
    return game.newEnemy("tri", x + 400 * game.speed, y - 400 * vy, 0, vy);
  });

  let randomCoin = new Randomize().spacing(function () {
    return (math.random(20, 100) / Conf.itemSpace) * 10;
  });

  randomCoin.add(
    function (x, y) {
      return game.newCoin(1, x, y);
    },
    function () {
      return 1;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(2, x, y);
    },
    function () {
      return game.dist > 1000 ? 1 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(5, x, y);
    },
    function () {
      return game.dist > 2000 ? 2 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(10, x, y);
    },
    function () {
      return game.dist > 5000 ? 4 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(20, x, y);
    },
    function () {
      return game.dist > 10000 ? 8 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(50, x, y);
    },
    function () {
      return game.dist > 20000 ? 16 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(100, x, y);
    },
    function () {
      return game.dist > 50000 ? 32 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(1000, x, y);
    },
    function () {
      return game.dist > 50000 ? (4 * game.dist) / 100000 : 0;
    },
  );

  randomCoin.add(
    function (x, y) {
      return game.newCoin(10000, x, y);
    },
    function () {
      return game.dist > 50000 ? game.dist / 100000 : 0;
    },
  );

  let randomPower = new Randomize().spacing(function () {
    return math.random(100, 400);
  });

  randomPower.add(function (x, y) {
    return game.newPower(x, y);
  });

  let randomPattern = new Randomize().spacing(function () {
    return 1;
  });

  randomPattern.range = function (min, max) {
    let h = math.random(min, max) * (Conf.max - Conf.min);
    let c = math.random(Conf.min + h / 2, Conf.max - h / 2);
    h *= math.random() >= 0.5 ? 1 : -1;
    let a = c - h / 2,
      b = c + h / 2;
    return {
      a: a,
      b: b,
      h: h,
      c: c,
    };
  };

  // straight
  randomPattern.add(
    function (x) {
      let n = math.random(40, 50);
      let y = math.random(Conf.min, Conf.max);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, y);
      }
      return (this.__lastadded = added);
    },
    function () {
      return 1;
    },
  );

  // step
  randomPattern.add(
    function (x) {
      let n = math.random(20, 40) | 0;
      let ab = randomPattern.range(0.2, 0.7);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, ab.a + (i * ab.h) / n);
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 1000 ? 0 : 1;
    },
  );

  // stairs
  randomPattern.add(
    function (x) {
      let p = math.random(3, 6) | 0;
      let q = math.random(5, 15) | 0;
      let n = p * q;
      let ab = randomPattern.range(0.3, 0.7);

      let m = ab.h / p;

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, ab.a + (((i * ab.h) / n / m) | 0) * m);
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 5000 ? 0 : 1;
    },
  );

  // saw
  randomPattern.add(
    function (x) {
      let p = math.random(2, 6) | 0;
      let q = math.random(7, 13) | 0;
      let n = p * q;
      let ab = randomPattern.range(0.1, 0.6);

      let m = ab.h;

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, ab.a + (((-i * ab.h) / q / m) | 0) * m + (i * ab.h) / q);
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 20000 ? 0 : 1;
    },
  );

  // wave
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let a = Conf.dotSpace / math.random(10, 30);
      let b = math.random(10, 30);
      let y = math.random(Conf.min + b, Conf.max - b);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, y + b * math.sin(i * a));
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 10000 ? 0 : 2;
    },
  );

  // wave xy
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let a = Conf.dotSpace / math.random(10, 40);
      let b = math.random(10, 30);
      let c = Conf.dotSpace / math.random(10, 40);
      let d = math.random(10, 30);
      let y = math.random(Conf.min + b, Conf.max - b);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace + d * math.cos(i * c), y + b * math.sin(i * a));
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 25000 ? 0 : game.dist < 15000 ? 1 : 2;
    },
  );

  // zigzag
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let a = Conf.dotSpace / math.random(10, 40);
      let b = math.random(10, 30);
      let y = math.random(Conf.min + b, Conf.max - b);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, y + b * zigzag(i * a));
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 15000 ? 0 : 2;
    },
  );

  // zigzag xy
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let a = Conf.dotSpace / math.random(10, 40);
      let b = math.random(10, 30);
      let c = Conf.dotSpace / math.random(10, 40);
      let d = math.random(10, 30);
      let y = math.random(Conf.min + b, Conf.max - b);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace + d * zagzig(i * c), y + b * zigzag(i * a));
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 30000 ? 0 : game.dist < 17500 ? 1 : 2;
    },
  );

  // rect
  randomPattern.add(
    function (x) {
      let n = math.random(3, 8);
      let m = n;
      let y = math.random(Conf.min, Conf.max - m * Conf.dotSpace);

      let added = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          added++;
          game.newDot(x + i * Conf.dotSpace, y + j * Conf.dotSpace);
        }
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 70000 ? 0 : 1;
    },
  );

  // spray
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let max = math.min(1, game.dist / 100000);
      let min = math.min(1, game.dist / 200000);
      let ab = randomPattern.range(min * 0.5, max * 0.7);

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(x + i * Conf.dotSpace, math.random(ab.a, ab.b));
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 50000 ? 0 : game.dist < 75000 ? 1 : 2;
    },
  );

  // flower
  randomPattern.add(
    function (x) {
      let n = math.random(40, 60);
      let f = math.random(0.2, 0.9) * math.PI;
      let c = 5;

      let added = 0;
      for (let i = 0; i < n; i++) {
        added++;
        game.newDot(
          x + c * math.sqrt(i + 1) * math.sin(i * f),
          c * math.sqrt(i + 1) * math.cos(i * f),
        );
      }
      return (this.__lastadded = added);
    },
    function () {
      return game.dist < 100000 ? 0 : 1;
    },
  );

  function zigzag(t) {
    t = (math.wrap(t, -math.PI, math.PI) / math.PI) * 2;
    if (t > 1) {
      t = 2 - t;
    } else if (t < -1) {
      t = -2 - t;
    }
    return t;
  }

  function zagzig(t) {
    return zigzag(t + math.PI / 2);
  }
}

// UI
let stage = Stage.mount();

let game = new Game();

stage.on("viewport", function (viewport) {
  this.pin({
    width: Conf.width,
    height: Conf.height * 1.2,
    scaleMode: "in-pad",
    scaleWidth: viewport.width,
    scaleHeight: viewport.height - TOP,
    offsetY: TOP,
  });
});

const screens = {};
let activeScreen = null;

function setActiveScreen(view) {
  if (typeof view == "string") {
    view = screens[view];
  }
  if (activeScreen === view) {
    return;
  }
  activeScreen && activeScreen.trigger("screen-close");
  activeScreen = view.trigger("screen-open");
}

function createHomeScreen() {
  // home screen
  let homeScreen = Stage.component().label("HomeScreen").appendTo(stage).hide().pin({
    align: 0.5,
  });

  screens.home = homeScreen;

  homeScreen.on("viewport", function () {
    this.pin({
      width: this.parent().pin("width"),
      height: this.parent().pin("height"),
    });

    bg.pin({
      scaleMode: "out",
      scaleWidth: this.pin("width"),
      scaleHeight: this.pin("height"),
    });
  });

  game.uiUpgrade = function () {
    refresh();
  };

  homeScreen.on("screen-open", function () {
    refresh();
    this.pin("alpha", 0).show().tween(200).pin("alpha", 1);
  });

  homeScreen.on("screen-close", function () {
    this.tween(200).pin("alpha", 0).hide();
  });

  let bg = Stage.sprite("homebg").appendTo(homeScreen).pin("align", 0.5);

  let menu = Stage.column(0).appendTo(homeScreen).pin("align", 0.5).spacing(4);

  let tombstone = Stage.sprite("tombstone").appendTo(menu);

  let row1 = Stage.row().appendTo(menu).spacing(4);
  let flags = [];
  for (let i = 0; i < 6; i++) {
    let flag = Stage.sprite("play")
      .appendTo(row1)
      .on(Stage.POINTER_CLICK, startFrom(i - 1));
    flags.push(flag);
  }

  function startFrom(flag) {
    return function () {
      if (flag == game.data.upgrades.flags) {
        game.upgrade("flags");
      } else if (game.startFrom(flag)) {
        setActiveScreen("play");
      }
      return true;
    };
    return null;
  }

  let row2 = Stage.row().appendTo(menu).spacing(4);

  let upgrades = {};

  for (let i = 0; i < Conf.ups.length; i++) {
    let name = Conf.ups[i];
    upgrades[name] = Stage.sprite("option")
      .appendTo(row2)
      .attr("name", name)
      .on(Stage.POINTER_CLICK, function () {
        game.upgrade(this.attr("name"));
      });
  }

  function refresh() {
    for (let i = 0; i < flags.length; i++) {
      let button = flags[i].empty().pin("alpha", 0.9);
      if (i <= game.data.upgrades.flags) {
        let value = Format.k(game.data.flags[i - 1]);
        value = i > 0 ? value || "-" : 0;
        Stage.monotype("d")
          .appendTo(button)
          .pin({
            alignY: 0.5,
            alignX: 0.45,
            handle: 0.5,
            scale: 0.8,
          })
          .value(value);
        continue;
      }
      let price = game.price("flags");
      if (i == game.data.upgrades.flags + 1) {
        Stage.monotype("d")
          .value(Format.coin(price))
          .pin({
            alignY: 0.5,
            alignX: 0.4,
            handle: 0.5,
            alpha: 0.8,
            scale: 0.6,
          })
          .appendTo(button);
      }
      for (let child = button.first(); child; child = child.next()) {
        child.pin("alpha", price <= game.data.stats.coins ? 1 : 0.5);
      }
    }

    tombstone.empty();
    Stage.monotype("d")
      .appendTo(tombstone)
      .pin({
        alignX: 0.5,
        alignY: 1,
        offsetX: -2,
        offsetY: -6,
        alpha: 0.6,
        scale: 0.8,
      })
      .value(0 + "-" + Format.k(game.data.stats.dist));

    Stage.monotype("d")
      .appendTo(tombstone)
      .pin({
        alignX: 0.5,
        alignY: 0,
        offsetX: -4,
        offsetY: 10.5,
        alpha: 0.5,
        scale: 0.7,
      })
      .value(Format.coin(game.data.stats.coins));

    for (let i = 0; i < Conf.ups.length; i++) {
      let name = Conf.ups[i];
      let price = game.price(name);
      let level = game.data.upgrades[name] || 0;
      let button = upgrades[name].empty().pin("alpha", 0.9);
      // sprite
      Stage.sprite("up_" + name)
        .pin("align", 0.5)
        .appendTo(button);
      // price
      Stage.monotype("d")
        .value(Format.coin(price))
        .pin({
          align: 1,
          offsetX: -1.6,
          offsetY: -1.4,
          alpha: 0.8,
          scale: 0.6,
        })
        .appendTo(button);
      // level
      if (level <= 6) {
        Stage.monotype("up")
          .pin({
            alignX: 0,
            alignY: 0,
            offsetX: 1.6,
            offsetY: 1.4,
            alpha: 0.8,
            scale: 0.6,
          })
          .appendTo(button)
          .value(level);
      }

      for (let child = button.first(); child; child = child.next()) {
        child.pin("alpha", price <= game.data.stats.coins ? 1 : 0.5);
      }
    }
  }
}

function createPlayScreen() {
  // play screen
  let playScreen = Stage.component().label("PlayScreen").appendTo(stage).hide().pin({
    align: 0.5,
  });

  screens.play = playScreen;

  playScreen.on("viewport", function () {
    this.pin({
      width: this.parent().pin("width"),
      height: this.parent().pin("height"),
    });

    bg.pin({
      scaleMode: "out",
      scaleWidth: this.pin("width"),
      scaleHeight: this.pin("height"),
    });

    let toph = TOP / this.pin("scaleX") / this.parent().pin("scaleX");
    top.pin({
      width: this.pin("width"),
      height: toph,
      offsetY: -toph,
    });
  });

  playScreen.on("screen-open", function () {
    stage.dom.style && (stage.dom.style.cursor = "none");
    game.start();
    this.pin("alpha", 0).show().tween(200).pin("alpha", 1);
  });

  playScreen.on("screen-close", function () {
    stage.dom.style && (stage.dom.style.cursor = "");
    game.end();
    this.tween(200).pin("alpha", 0).hide();
  });

  playScreen.tick(function (t) {
    game.tick(t);
  }, true);

  let bg = Stage.sprite("playbg").appendTo(playScreen).pin("align", 0.5);

  let border = Stage.sprite("border").stretch().appendTo(playScreen).pin({
    width: Conf.width,
    height: Conf.height,
    align: 0.5,
    alpha: 0.5,
  });

  let top = Stage.sprite("shadow").stretch().appendTo(playScreen);

  let field = Stage.component().appendTo(playScreen).attr("spy", true).pin({
    width: Conf.width,
    height: Conf.height,
    alignX: 0.5,
    alignY: 0.5,
    handleY: 0,
  });

  let energy = Stage.sprite("energy").stretch().appendTo(playScreen).pin({
    alignX: 0,
    alignY: 0,
    offsetX: 3,
    offsetY: 2,
  });

  let dist = Stage.monotype("d").appendTo(playScreen).pin({
    alignX: 0,
    alignY: 0,
    offsetX: 3,
    offsetY: 9,
  });

  let coins = Stage.monotype("d").appendTo(playScreen).pin({
    alignX: 1,
    alignY: 0,
    offsetX: -3,
    offsetY: 3,
  });

  let lastCoin = Stage.column(0.5)
    .appendTo(playScreen)
    .pin({
      alignX: 0.5,
      alignY: 0,
      offsetX: 10,
      offsetY: 2,
    })
    .append(Stage.sprite(), Stage.monotype("d").pin("scale", 0.8))
    .hide();

  let lastCoinTimeout = null;

  function setLastCoin(value, scale) {
    lastCoin
      .first()
      .texture("coin_" + value)
      .pin("scale", scale || 1);
    lastCoin
      .last()
      .value(Format.coin(value))
      .visible(value > 100);

    lastCoin.show();
    clearTimeout(lastCoinTimeout);
    lastCoinTimeout = setTimeout(function () {
      lastCoin.hide();
    }, 1000);
  }

  let cursor = Stage.sprite("cursor").pin("handle", 0.5).appendTo(field).hide();

  let l1 = Stage.component().appendTo(field);
  let l2 = Stage.component().appendTo(field);
  let l3 = Stage.component().appendTo(field);

  function setCursor(point) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      console.log(point.x, point.y);
      console.trace();
      return;
    }
    const isActive = game.pointer(point.x, point.y);
    cursor.offset(point);
    cursor.visible(isActive);
  }

  field.on(Stage.POINTER_START, setCursor);
  field.on(Stage.POINTER_MOVE, setCursor);

  let bgcolors = randomizeArray(PLAYFUL_COLORS);

  game.uiStart = function () {
    DEBUG && console.log("app start");
    stage.background(bgcolors());
  };

  game.uiMove = function (dist, time, d, t) {
    let x = cursor.pin("offsetX");
    cursor.pin("offsetX", x + d);
    field.pin("offsetX", -dist);
  };

  game.uiEnd = function () {
    DEBUG && console.log("app end");
    setTimeout(function () {
      setActiveScreen("home");
      stage.background("#000");
    }, 1000);
  };

  game.setDist = function (d) {
    dist.value(Format.k(d));
  };

  game.uiEnergy = function (e) {
    energy.pin("width", (((Math.max(0, e) * 100) | 0) / 100) * 40);
  };

  game.uiCoins = function (n) {
    coins.value(Format.coin(n));
  };

  game.uiNewPlayer = function (player) {
    DEBUG && console.log("player create");
    player.ui = Stage.anim(player.name).pin("handle", 0.5).appendTo(l3);
    player.uiXY = function () {
      this.ui.offset(this);
    };
    player.uiLive = function (anim, callback, freeze) {
      DEBUG && console.log("player live");
      this.freeze = !!freeze;
      !this.freeze && Sound.play("start");
      // cursor.show();
      this.ui.frames(this.name).show();
      !this.freeze && this.ui.play();
      callback && callback();
    };
    player.uiDie = function (anim, callback) {
      DEBUG && console.log("player die");
      if (anim) {
        !this.freeze && Sound.play("die");
        cursor.hide();
        this.ui.frames("die").play().repeat(1, callback);
      } else {
        callback && callback();
      }
    };
  };

  game.uiNewDot = function (obj) {
    obj.ui = Stage.sprite("dot").pin("handle", 0.5).appendTo(l1).hide();
    obj.uiEnter = function () {
      this.ui.show();
    };
    obj.uiXY = function () {
      this.ui.offset(this);
    };
    obj.onCheckOut = function () {};
    obj.onCheckIn = function () {
      this.ui.hide();
    };
    obj.uiRemove = function () {
      this.ui.remove();
      this.ui = null;
    };
    obj.uiEat = function (e) {
      Sound.play("dot");
    };
  };

  game.uiNewPower = function (obj) {
    obj.ui = Stage.sprite("power").pin("handle", 0.5).appendTo(l2).hide();
    obj.uiEnter = function () {
      this.ui.show();
    };
    obj.uiXY = function () {
      this.ui.offset(this);
    };
    obj.uiEat = function () {
      Sound.play("power");
    };
    obj.uiRemove = function () {
      this.ui.remove();
      this.ui = null;
    };
  };

  game.uiNewEnemy = function (obj) {
    obj.ui = Stage.anim(obj.name + "_live")
      .pin("handle", 0.5)
      .appendTo(l2)
      .hide();
    obj.uiEnter = function () {
      this.ui.show();
    };
    obj.uiMode = function (weak) {
      if (weak == 0) {
        this.ui.frames(this.name + "_live").play();
      } else if (weak == -1) {
        this.ui
          .frames(this.name + "_dead")
          .gotoFrame(0)
          .pin({
            alpha: 0.8,
            rotation: 0,
          });
      } else if (weak == 1) {
        this.ui.frames(this.name + "_weak").play();
      } else {
        this.ui.frames(this.name + "_mix").play();
      }
    };
    obj.uiXY = function () {
      this.ui.offset(this);
      if (this.vx || this.vy) {
        this.ui.pin("rotation", Math.atan2(this.vx, this.vy) - Math.PI / 2);
      }
    };
    obj.uiRemove = function () {
      this.ui.remove();
      this.ui = null;
    };
    obj.uiEat = function () {
      Sound.play("enemy");
    };
  };

  game.uiNewCoin = function (obj) {
    obj.scale = Conf.coinsScale[obj.value] || 1;
    obj.ui = Stage.sprite("coin_" + obj.value)
      .pin("handle", 0.5)
      .appendTo(l2)
      .pin("scale", obj.scale)
      .hide();
    obj.uiEnter = function () {
      this.ui.show();
    };
    obj.uiXY = function () {
      this.ui.offset(this);
    };
    obj.uiRemove = function () {
      this.ui.remove();
      this.ui = null;
    };
    obj.uiEat = function () {
      setLastCoin(this.value, this.scale);
      Sound.play("coin");
    };
  };
}

createHomeScreen();
createPlayScreen();
setActiveScreen("home");

function randomizeArray(list) {
  // shuffle
  for (let i = list.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  let i = 0;
  return function () {
    return list[i++ % list.length];
  };
}
