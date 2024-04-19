import Stage from "../../src";
import bezier from "../common/bezier";

import "./textures";

let actions = {};
let levels = {};

levels[1] = function () {
  let math = Stage.math;

  let runway = [
    [-66, -111],
    [132, -2],
  ];
  let station1 = [52, 120];
  let station2 = [-38, 68];
  let station3 = [-141, 2];
  let station4 = [-78, -91];

  let path = function () {
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
  let items = [];
  let removeing = [];
  let selected = null;
  let level;

  this.start = function (l) {
    level = levels[l]();
    ui.map(l);
    loop();
  };

  function loop() {
    let plane = new Plane();
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
      let item = items[i];
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
    let i = items.indexOf(plane);
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

    let queue = [];

    this.ui = ui.plane(this);

    this.queue = function () {
      let list = Array.prototype.concat.apply([], arguments);
      queue.push.apply(queue, list);
      return this;
    };

    this.tick = function (t) {
      if (queue.length) {
        let done = queue[0](t, this);
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
      let dx = x - this.x;
      let dy = y - this.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      let m = (this.s * speed * t) / d;
      let nx, ny;
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
        let that = items[i];
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
        let action = queue[0];
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

actions.enter = function (enter) {
  return function (t, item) {
    item.x = enter[0];
    item.y = enter[1];
    return true;
  };
};

actions.land = function (rw) {
  let fn = null,
    p = {};
  return function (t, item) {
    item.z = 1;
    if (!fn) {
      let points = [
        [item.x, item.y],
        [item.x, item.y],
        [2 * rw[0][0] - 1 * rw[1][0], 2 * rw[0][1] - 1 * rw[1][1]],
        rw[0],
      ];
      fn = travel(bezier(points));
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
};

actions.takeoff = function (rw, exit) {
  return function (t, item) {
    item.z = 0.5;
    if (item.move(rw[1][0], rw[1][1], t, 2)) {
      let fn = null,
        p = {};
      return function (t, item) {
        item.z = 1;
        if (!fn) {
          let points = [
            rw[1],
            [2 * rw[1][0] - 1 * rw[0][0], 2 * rw[1][1] - 1 * rw[0][1]],
            [exit[0], exit[1]],
            [exit[0], exit[1]],
          ];
          fn = travel(bezier(points));
        }
        if (fn(t, 0.1, p) & item.reloc(p.x, p.y)) {
          item.remove();
          return true;
        }
      };
    }
  };
};

actions.taxi = function (to) {
  return function (t, item) {
    item.z = 0;
    if (item.move(to[0], to[1], t, 0.4)) {
      return true;
    }
  };
};

actions.delay = function (time) {
  return function (t, item) {
    item.z = 0;
    while ((time -= t) > 0) {
      return false;
    }
    return true;
  };
};

actions.stop = function (time) {
  let cont = false;
  let action = function (t, item) {
    item.z = 0;
    return cont;
  };
  action.click = function () {
    cont = true;
  };
  return action;
};

function travel(fn, e) {
  e = e || 0.01;
  let prog = 0;
  return function (t, speed, xy) {
    xy = fn(prog, xy);
    let x = xy.x,
      y = xy.y;
    xy = fn(prog + e, xy);
    let dx = xy.x - x,
      dy = xy.y - y;
    prog += (e * (t * speed)) / Math.sqrt(dx * dx + dy * dy);
    xy = fn(prog, xy);
    return prog >= 1;
  };
}

let stage = Stage.mount();

stage.background("#222222");
stage.viewbox(1024, 1024, "out-crop").pin("align", -0.5);
stage.MAX_ELAPSE = 20;

Stage.sprite("bg").appendTo(stage).pin("handle", 0.5);

let map;

let game = new Game({
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
    let ui = Stage.sprite("plane").pin("handle", 0.5);
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
