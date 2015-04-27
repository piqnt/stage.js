Stage(function(stage, container) {
  var Mouse = Stage.Mouse, M = Stage.Math;
  stage.viewbox(1024, 1024, 'out-crop').pin('align', -0.5);
  stage.MAX_ELAPSE = 20;

  Stage.image('bg').appendTo(stage).pin('handle', 0.5);

  function ui_explosion(obj) {
    Stage.image('explode').appendTo(stage).pin({
      handle : 0.5,
      offsetX : obj.x,
      offsetY : obj.y,
      alpha : 0.1
    }).tween(100).pin({
      alpha : 1
    }).tween(500).pin({
      alpha : 0
    }).then(function() {
      this.remove();
    });
  }

  function ui_addPlane(obj) {
    obj.ui = Stage.image('plane').pin({
      handle : 0.5
    }).appendTo(stage).on(Mouse.CLICK, function() {
      return obj.click();
    });
  }

  function ui_upPlane(obj) {
    obj.ui.pin({
      rotation : obj.a,
      offsetX : obj.x,
      offsetY : obj.y
    });
  }

  function ui_delPlane(obj) {
    obj.ui.remove();
  }

  stage.on(Mouse.CLICK, function(ev, point) {
    // alert(point.x + ":" + point.y); //use this to find points
    mp_click();
  });

  stage.tick(function(t) {
    mp_tick(t);
    return true;
  });

  var loc_runway = [ [ -66, -111 ], [ 132, -2 ] ];
  var loc_station1 = [ 52, 120 ];
  var loc_station2 = [ -38, 68 ];
  var loc_station3 = [ -141, 2 ];
  var loc_station4 = [ -78, -91 ];

  function prog() {
    return [ do_enter([ -500, M.random(-200, 200) ]), do_land(loc_runway),
        do_taxi(loc_station1), do_taxi(loc_station2), do_delay(1000),
        do_taxi(loc_station3), do_taxi(loc_station4), do_stop(),
        do_taxi(loc_runway[0]),
        do_takeoff(loc_runway, [ 500, M.random(-300, 300) ]) ];
  }

  function newPlane() {
    mp_addPlane(new Plane(0.1).queue(prog()));
    stage.timeout(newPlane, Math.random() * 3000 + 5000);
  }

  function start() {
    newPlane();
  }

  var mp_items = [];
  var mp_removeing = [];
  var mp_selected = null;

  function mp_click() {
    if (mp_selected) {
      mp_selected.deselect();
      mp_selected = null;
    }
  }

  function mp_tick(t) {
    for (var i = 0; i < mp_items.length; i++) {
      var item = mp_items[i];
      item.tick(t);
    }

    var obj;
    while (obj = mp_removeing.pop()) {
      mp_delPlane(obj);
    }
  }

  function mp_addPlane(obj) {
    mp_items.push(obj);
    ui_addPlane(obj);
  }

  function mp_delPlane(obj) {
    var i = mp_items.indexOf(obj);
    if (i >= 0) {
      mp_items.splice(i, 1);
    }
    ui_delPlane(obj);
    return this;
  }

  function Plane(speed) {
    this.a = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.s = speed;

    var actions = [];

    this.queue = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].length) {
          actions.push.apply(actions, arguments[i]);
        } else {
          actions.push(arguments[i]);
        }
      }
      return this;
    };

    this.tick = function(t) {
      if (actions.length) {
        var action = actions[0];
        var next = action(t, this);
        if (next) {
          actions.shift();
          if (typeof next == 'object' || typeof next == 'function') {
            actions.unshift(next);
          }
        }
        ui_upPlane(this);
      }
    };

    this.move = function(x, y, t, speed) {
      var dx = x - this.x;
      var dy = y - this.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var m = this.s * speed * t / d;
      var nx, ny;
      if (m >= 1) {
        nx = x;
        ny = y;
      } else {
        nx = this.x + dx * m;
        ny = this.y + dy * m;
      }
      return this.reloc(nx, ny) && m >= 1;
    };

    this.reloc = function(x, y) {
      var dx = x - this.x;
      var dy = y - this.y;
      this.a = Math.atan2(dy, dx);

      for (var i = 0; i < mp_items.length; i++) {
        var that = mp_items[i];
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
            ui_explosion(this);
            ui_explosion(that);
            return false;
          }
        }
      }
      this.x = x, this.y = y;
      return true;
    };

    this.remove = function() {
      mp_removeing.push(this);
      return this;
    };

    this.click = function() {
      if (actions.length) {
        var action = actions[0];
        action.click && action.click();
      }
      // mp_selected && mp_selected.deselect();
      // this.select();
      return true;
    };

    this.select = function() {
      mp_selected = this;
      this.isActive = true;
      ui_upPlane(this);
      // for ( var id in this.state.links) {
      // var state = this.state.links[id].end;
      // state.select();
      // }
      return this;
    };

    this.deselect = function() {
      this.isActive = false;
      ui_upPlane(this);
      return this;
    };
  }

  function do_enter(enter) {
    return (function(t, item) {
      item.x = enter[0];
      item.y = enter[1];
      return true;
    });
  }

  function do_land(rw) {
    var fn = null, p = {};
    return (function(t, item) {
      item.z = 1;
      if (!fn) {
        // console.log(item.x + ':' + item.y);
        var points = [ [ item.x, item.y ], [ item.x, item.y ],
            [ 2 * rw[0][0] - 1 * rw[1][0], 2 * rw[0][1] - 1 * rw[1][1] ], rw[0] ];
        fn = travel(bezier(points));
      }
      if (fn(t, 0.1, p) & item.reloc(p.x, p.y)) {
        return (function(t, item) {
          item.z = 0.5;
          if (item.move(rw[1][0], rw[1][1], t, 0.6)) {
            return true;
          }
        });
      }
    });
  }

  function do_takeoff(rw, exit) {
    return (function(t, item) {
      item.z = 0.5;
      if (item.move(rw[1][0], rw[1][1], t, 2)) {
        var fn = null, p = {};
        return (function(t, item) {
          item.z = 1;
          if (!fn) {
            var points = [ rw[1],
                [ 2 * rw[1][0] - 1 * rw[0][0], 2 * rw[1][1] - 1 * rw[0][1] ],
                [ exit[0], exit[1] ], [ exit[0], exit[1] ] ];
            fn = travel(bezier(points));
          }
          if (fn(t, 0.1, p) & item.reloc(p.x, p.y)) {
            item.remove();
            return true;
          }
        });
      }
    });
  }

  function do_taxi(to) {
    return (function(t, item) {
      item.z = 0;
      if (item.move(to[0], to[1], t, 0.4)) {
        return true;
      }
    });
  }

  function do_delay(time) {
    return (function(t, item) {
      item.z = 0;
      while ((time -= t) > 0) {
        return false;
      }
      return true;
    });
  }

  function do_stop(time) {
    var cont = false;
    var action = (function(t, item) {
      item.z = 0;
      return cont;
    });
    action.click = function() {
      cont = true;
    };
    return action;
  }

  start();

  function travel(fn, e) {
    e = e || 0.01;
    var time = 0;
    return function(t, speed, p) {
      p = fn(time, p);
      var x = p.x, y = p.y;
      p = fn(time + e, p);
      var dx = p.x - x, dy = p.y - y;
      time += e * (t * speed) / Math.sqrt(dx * dx + dy * dy);
      p = fn(time, p);
      return time >= 1;
    };
  }
});

Stage.prototype.timeout = function(fn, time) {
  this.tick(function timer(t) {
    if ((time -= t) < 0) {
      this.untick(timer);
      fn.call(this);
    } else {
      return true;
    }
  });
};
