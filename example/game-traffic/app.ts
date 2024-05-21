import Stage from "../../src";
import bezier from "../common/bezier";

import "./textures";

interface Point {
  x: number;
  y: number;
}

const levels = {};

levels[1] = function () {
  const math = Stage.math;

  const runway = [
    [-66, -111],
    [132, -2],
  ];
  const station1 = [52, 120];
  const station2 = [-38, 68];
  const station3 = [-141, 2];
  const station4 = [-78, -91];

  const path = function () {
    return [
      actions.enter([-500, math.random(-200, 200)]),
      actions.land(runway),
      actions.taxi(station1),
      actions.taxi(station2),
      actions.delay(1000),
      actions.taxi(station3),
      actions.taxi(station4),
      actions.stop(),
      actions.taxi(runway[0]),
      actions.takeoff(runway, [500, math.random(-300, 300)]),
    ];
  };

  return {
    addPlane: function (plane) {
      plane.queue(path());
    },
    delay: function () {
      return math.random() * 3000 + 5000;
    },
  };
};

function Game(ui) {
  const items = [];
  const removeing = [];
  let selected = null;
  let level;

  this.start = function (l) {
    level = levels[l]();
    ui.map(l);
    loop();
  };

  function loop() {
    const plane = new Plane();
    level.addPlane(plane);
    addPlane(plane);
    ui.timeout(loop, level.delay());
  }

  this.click = function () {
    if (selected) {
      selected.deselect();
      selected = null;
    }
  };

  this.tick = function (t) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.tick(t);
    }

    let obj;
    while ((obj = removeing.pop())) {
      delPlane(obj);
    }
  };

  function addPlane(plane) {
    items.push(plane);
    plane.ui.add();
    return this;
  }

  function delPlane(plane) {
    const i = items.indexOf(plane);
    if (i >= 0) {
      items.splice(i, 1);
    }
    plane.ui.remove();
    return this;
  }

  function Plane() {
    this.a = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.s = 0.1;

    const queue = [];

    this.ui = ui.plane(this);

    this.queue = function () {
      const list = Array.prototype.concat.apply([], arguments);
      queue.push.apply(queue, list);
      return this;
    };

    this.tick = function (t) {
      if (queue.length) {
        const done = queue[0](t, this);
        if (done) {
          queue.shift();
          if (typeof done == "object" || typeof done == "function") {
            queue.unshift(done);
          }
        }
        this.ui.update();
      }
    };

    this.move = function (x, y, t, speed) {
      const dx = x - this.x;
      const dy = y - this.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const m = (this.s * speed * t) / d;
      let nx;
      let ny;
      if (m >= 1) {
        nx = x;
        ny = y;
      } else {
        nx = this.x + dx * m;
        ny = this.y + dy * m;
      }
      return this.reloc(nx, ny) && m >= 1;
    };

    this.reloc = function (x, y) {
      let dx = x - this.x;
      let dy = y - this.y;
      this.a = Math.atan2(dy, dx);

      for (let i = 0; i < items.length; i++) {
        const that = items[i];
        if (this == that) {
          continue;
        }
        dx = x - that.x;
        dy = y - that.y;
        if (dx * dx + dy * dy < 240) {
          if (this.z == 0 && that.z == 0) {
            return false;
          } else {
            this.remove();
            that.remove();
            ui.explode(this);
            ui.explode(that);
            return false;
          }
        }
      }
      (this.x = x), (this.y = y);
      return true;
    };

    this.remove = function () {
      removeing.push(this);
      return this;
    };

    this.click = function () {
      if (queue.length) {
        const action = queue[0];
        action.click && action.click();
      }
      // selected && selected.deselect();
      // this.select();
      return true;
    };

    this.select = function () {
      selected = this;
      this.isActive = true;
      this.ui.update();
      // for ( var id in this.state.links) {
      // var state = this.state.links[id].end;
      // state.select();
      // }
      return this;
    };

    this.deselect = function () {
      this.isActive = false;
      this.ui.update();
      return this;
    };
  }
}

const actions = {
  enter: function (enter: [number, number]) {
    return function (t, item) {
      item.x = enter[0];
      item.y = enter[1];
      return true;
    };
  },

  land: function (rw) {
    let fn = null;
    const p: Point = {} as any;
    return function (t, item) {
      item.z = 1;
      if (!fn) {
        const points = [
          [item.x, item.y],
          [item.x, item.y],
          [2 * rw[0][0] - 1 * rw[1][0], 2 * rw[0][1] - 1 * rw[1][1]],
          rw[0],
        ];
        fn = travel(bezier(points).object);
      }
      if (fn(t, 0.1, p) & item.reloc(p.x, p.y)) {
        return function (t, item) {
          item.z = 0.5;
          if (item.move(rw[1][0], rw[1][1], t, 0.6)) {
            return true;
          }
        };
      }
    };
  },

  takeoff: function (rw, exit) {
    return function (t, item) {
      item.z = 0.5;
      if (item.move(rw[1][0], rw[1][1], t, 2)) {
        let fn = null;
        const p: Point = {} as any;
        return function (t, item) {
          item.z = 1;
          if (!fn) {
            const points = [
              rw[1],
              [2 * rw[1][0] - 1 * rw[0][0], 2 * rw[1][1] - 1 * rw[0][1]],
              [exit[0], exit[1]],
              [exit[0], exit[1]],
            ];
            fn = travel(bezier(points).object);
          }
          if (fn(t, 0.1, p) & item.reloc(p.x, p.y)) {
            item.remove();
            return true;
          }
        };
      }
    };
  },
  taxi: function (to) {
    return function (t, item) {
      item.z = 0;
      if (item.move(to[0], to[1], t, 0.4)) {
        return true;
      }
    };
  },
  delay: function (time) {
    return function (t, item) {
      item.z = 0;
      while ((time -= t) > 0) {
        return false;
      }
      return true;
    };
  },
  stop: function () {
    let cont = false;
    const action = function (t, item) {
      item.z = 0;
      return cont;
    };
    action.click = function () {
      cont = true;
    };
    return action;
  },
};

interface Point {
  x: number;
  y: number;
}

function travel(fn: (t: number, xy: Point) => Point, e = 0.01) {
  let prog = 0;
  return function (t: number, speed: number, xy: Point) {
    xy = fn(prog, xy);
    const x = xy.x;
    const y = xy.y;
    xy = fn(prog + e, xy);
    const dx = xy.x - x;
    const dy = xy.y - y;
    prog += (e * (t * speed)) / Math.sqrt(dx * dx + dy * dy);
    xy = fn(prog, xy);
    return prog >= 1;
  };
}

const stage = Stage.mount();

stage.background("#222222");
stage.viewbox(1024, 1024, "out-crop").pin("align", -0.5);
stage.MAX_ELAPSE = 20;

Stage.sprite("bg").appendTo(stage).pin("handle", 0.5);

let map;

const game = new Game({
  map: function (l) {
    map && stage.remove(map);
    map = Stage.sprite("map-" + l)
      .pin({
        align: 0,
        handle: 0.5,
      })
      .appendTo(stage);
  },
  plane: function (obj) {
    const ui = Stage.sprite("plane").pin("handle", 0.5);
    ui.on("click", function () {
      return obj.click();
    });
    return {
      add: function () {
        ui.appendTo(stage);
      },
      update: function () {
        ui.offset(obj).rotate(obj.a);
      },
      remove: function (obj) {
        ui.remove();
      },
    };
  },
  timeout: function (fn, delay) {
    stage.timeout(fn, delay);
  },
  explode: function (obj) {
    Stage.sprite("explode")
      .appendTo(stage)
      .pin({
        handle: 0.5,
        offsetX: obj.x,
        offsetY: obj.y,
        alpha: 0.1,
      })
      .tween(100)
      .pin({
        alpha: 1,
      })
      .tween(500)
      .pin({
        alpha: 0,
      })
      .remove();
  },
});

stage.on("click", function () {
  game.click();
});

stage.tick(function (t) {
  game.tick(t);
  return true;
});

game.start(1);
