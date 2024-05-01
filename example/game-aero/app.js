import Stage from "../../src";

let math = Stage.math;

// Textures
await Stage.atlas({
  image: {
    src: "./main.png",
    ratio: 4,
  },
  textures: {
    drone: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
});

// Game logic

function World() {
  this.objects = [];
  this.running = false;
}

World.prototype.add = function (obj) {
  this.objects.push(obj);
  obj.added(this);
};

World.prototype.size = function (width, height) {
  this.width = width;
  this.height = height;
  this.xMin = -(this.xMax = this.width / 2);
  this.yMin = -(this.yMax = this.height / 2);
  return this;
};

World.prototype.run = function (run) {
  this.running = run !== false;
};

World.prototype.tick = function (t) {
  if (this.running) {
    t = math.min(100, t);
    for (let i = 0, n = this.objects.length; i < n; i++) {
      this.objects[i].tick(t);
    }
  }
};

function Drone(vMin, vMax, aMax) {
  this.x = 0;
  this.y = 0;
  this.vMin = vMin;
  this.vMax = vMax;
  this.aMax = aMax;
  this.vx = vMin;
  this.vy = 0;
  this.v = vMin;
  this.dir = 0;
  this.rotation = 0;
  this.accMain = 0;
  this.accSide = 0;
  this.accX = 0;
  this.accY = 0;
  this.accCX = null;
  this.accCY = null;
  this.uiCreate();
}

Drone.prototype.added = function (world) {
  this.world = world;
  this.uiAdd(world);
};

Drone.prototype.tick = function (t) {
  if (!t) {
    return;
  }

  let m = 0;
  let n = 0;

  if (this.accCX !== null && this.accCY !== null) {
    let p = this.x - this.accCX;
    let q = this.y - this.accCY;
    let inn = p * this.vx + q * this.vy;
    let out = p * this.vy - q * this.vx;
    let b = (out * 2) / t;
    let v2 = this.v * this.v;
    let d = b * b - 4 * v2 * (v2 + (inn * 2) / t);
    if (d >= 0) {
      d = math.sqrt(d);
      let m1 = (((b - d) / 2 / v2) * this.v) / t;
      let m2 = (((-b - d) / 2 / v2) * this.v) / t;
      m = math.abs(m1) <= math.abs(m2) ? -m1 : m2;
    }
    // var x = this.accCY - this.y;
    // var y = -(this.accCX - this.x);
    // var out = x * this.vy - y * this.vx;
    // var inn = x * this.vx + y * this.vy;
    // if (out < 0) {
    // m = out / inn / t / (this.aMax / this.v);
    // }
  } else if (this.accX !== 0 || this.accY !== 0) {
    let x = this.accX;
    let y = this.accY;
    let d = math.length(x, y);
    m = ((x * this.vy - y * this.vx) / this.v / d) * this.aMax;
  } else if (this.accMain !== 0 || this.accSide !== 0) {
    n = this.accMain * 0.001;
    m = this.accSide * this.aMax;
  }

  if (m || n) {
    m = math.clamp(m, -this.aMax, this.aMax);
    m = m / this.v;

    this.vx += +this.vx * n * t;
    this.vy += +this.vy * n * t;

    this.vx += +this.vy * m * t;
    this.vy += -this.vx * m * t;

    let v = math.length(this.vx, this.vy);
    this.v = math.clamp(v, this.vMin, this.vMax);
    v = this.v / v;
    this.vx *= v;
    this.vy *= v;

    let dir = math.atan2(this.vy, this.vx);
    this.rotation =
      (this.rotation * (200 - t) + math.wrap(this.dir - dir, -math.PI, math.PI)) / 200;
    this.dir = dir;
  } else {
    this.rotation = (this.rotation * (200 - t)) / 200;
  }

  this.x = math.wrap(this.x + this.vx * t, this.world.xMin, this.world.xMax);
  this.y = math.wrap(this.y + this.vy * t, this.world.yMin, this.world.yMax);

  this.uiUpdate();
};

// Extending game logic and adding UI callbacks

Drone.prototype.uiCreate = function () {
  this.ui = Stage.component().pin("handle", 0.5);
  this.ui.drone = Stage.sprite("drone").pin("handle", 0.5).appendTo(this.ui);
  this.ui.shadow = Stage.sprite("drone")
    .pin("handle", 0.5)
    .pin({
      alpha: 0.2,
      offsetX: 30,
      offsetY: 30,
    })
    .appendTo(this.ui);
  this.uiUpdate();
};

Drone.prototype.uiAdd = function (world) {
  this.ui.appendTo(world.ui);
};

Drone.prototype.uiRemove = function () {
  this.ui.remove();
};

Drone.prototype.uiUpdate = function () {
  this.ui.offset(this);
  let scaley = 1 - (math.abs(this.rotation) / math.PI) * 400;
  this.ui.drone.rotate(this.dir).scale(1, scaley);
  this.ui.shadow.rotate(this.dir).scale(1, scaley);
};

// UI

let stage = Stage.mount();

stage.viewbox(300, 300).pin("handle", -0.5);

// Create game world
let world = new World();
world.ui = stage;

let speed = 100 / 1000;
let acc = (speed * 2) / 1000;
let drone = new Drone(speed, speed * 2, acc);
world.add(drone);

stage.on("viewport", function () {
  world.size(this.pin("width"), this.pin("height"));
});

stage.tick(function (t) {
  world.tick(t);
});

// Controls

// Keyboard
let keyboard = {
  down: function (keyCode) {
    this[keyCode] = true;
    this.update();
  },
  up: function (keyCode) {
    this[keyCode] = false;
    this.update();
  },
  update: function () {
    drone.accMain = this[38] ? +1 : this[40] ? -1 : 0;
    drone.accSide = this[37] ? +1 : this[39] ? -1 : 0;
    drone.accX = this[65] ? -1 : this[68] ? +1 : 0;
    drone.accY = this[87] ? -1 : this[83] ? +1 : 0;
  },
};
document.onkeydown = function (e) {
  world.run(true);
  stage.touch();
  e = e || window.event;
  keyboard.down(e.keyCode);
};
document.onkeyup = function (e) {
  e = e || window.event;
  keyboard.up(e.keyCode);
};

// Pointer
stage
  .on(Stage.POINTER_START, function (point) {
    world.run(true);
    stage.touch();
    tilt.watch(true);
    drone.accCX = point.x;
    drone.accCY = point.y;
  })
  .on(Stage.POINTER_END, function (point) {
    tilt.watch(false);
    drone.accCX = drone.accCY = null;
  })
  .on(Stage.POINTER_MOVE, function (point) {
    if (drone.accCX !== null && drone.accCY !== null) {
      drone.accCX = point.x;
      drone.accCY = point.y;
    }
  });

// Tilting
let tilt = {
  time: 0,
  watching: false,
  watch: function (watch) {
    this.time = 0;
    this.watching = !!watch;
  },
  update: function (a, b, g, o) {
    let now;
    if (!this.watching || (now = Date.now()) - this.time < 300) {
      return;
    }
    if (this.time === 0) {
      (this.a0 = a), (this.b0 = b), (this.g0 = g);
      this.time = now;
      return;
    } else {
      (this.a = a), (this.b = b), (this.g = g), (this.o = o);
      this.time = now;
    }
    let x = math.wrap(this.g - this.g0, -180, 180) / 180;
    let y = math.wrap(this.b - this.b0, -180, 180) / 180;
    let min = 0.05;
    drone.accX = x > min ? 1 : x < -min ? -1 : 0;
    drone.accY = y > min ? 1 : y < -min ? -1 : 0;
    // console.log((a|0)+', '+(b|0)+', '+(g|0)+','+(o||'-'));
  },
};
window.addEventListener("deviceorientation", function (e) {
  return;
  tilt.update(e.alpha, e.beta, e.gamma, window.orientation);
});
