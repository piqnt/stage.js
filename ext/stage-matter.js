/**
 * Matter.js viewer for Stage.js
 */
Stage.Matter = function(engine) {
  Stage.Matter._super.call(this);

  var Engine = Matter.Engine;
  var Composite = Matter.Composite;
  var Events = Matter.Events;
  var Runner = Matter.Runner || Engine;

  engine.render = {
    controller : {
      create : function(options) {
        return options;
      },
      clear : function() {
      },
      world : function(engine) {
      },
      setBackground : function() {
      }
    }
  };
  engine.input = {
    mouse : {
      sourceEvents : {}
    }
  };

  var self = this;
  var world = this.world = engine.world;

  Events.on(world, 'addBody', function(ev) {
    self.addRenderable(ev.body);
  });

  Events.on(world, 'removeBody', function(ev) {
    self.removeRenderable(ev.body);
  });

  Events.on(engine, 'afterTick', function(ev) {
    var bodies = Composite.allBodies(world);
    for (var i = 0; i < bodies.length; i++) {
      if (!bodies[i].isSleeping) {
        self.updateRenderable(bodies[i]);
      }
    }
  });

  var bodies = Composite.allBodies(world);
  for (var i = 0; i < bodies.length; i++) {
    self.addRenderable(bodies[i]);
  }

  var runner = Runner.runner(engine);
  var time = 0;
  this.tick(function(t) {
    time += t;
    runner(time);
    return true;
  });
};

Stage.Matter._super = Stage;
Stage.Matter.prototype = Stage._create(Stage.Matter._super.prototype);
Stage.Matter.prototype.constructor = Stage.Matter;

Stage.Matter.prototype.addRenderable = function(body) {
  if (!body.ui) {
    var texture = null;
    if (body.circleRadius) {
      texture = this.drawCircle(body.circleRadius, body.render);
    } else if (body.vertices) {
      texture = this.drawConvex(body.vertices, body.position, body.render);
    }
    if (texture) {
      body.ui = Stage.image(texture).pin('handle', 0.5).appendTo(this);
    }
    this.updateRenderable(body);
  }
};

Stage.Matter.prototype.removeRenderable = function(body) {
  if (body.ui) {
    body.ui.remove();
  }
};

Stage.Matter.prototype.updateRenderable = (function() {
  var pin = {};
  return function(body) {
    if (body.ui) {
      pin.offsetX = body.position.x;
      pin.offsetY = body.position.y;
      pin.rotation = body.angle;
      body.ui.pin(pin);
    }
  };
})();

Stage.Matter.prototype.drawCircle = function(radius, options) {
  var lineWidth = options.lineWidth;

  var width = radius * 2 + lineWidth * 2;
  var height = radius * 2 + lineWidth * 2;
  var ratio = 1;

  return Stage.canvas(function(ctx) {

    this.size(width, height, ratio);

    ctx.scale(ratio, ratio);
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
    if (options.fillStyle) {
      ctx.fillStyle = options.fillStyle;
      ctx.fill();
    }
    ctx.lineTo(width/2, height/2);
    ctx.lineWidth = options.lineWidth;
    ctx.strokeStyle = options.strokeStyle;
    ctx.stroke();
  });
};

Stage.Matter.prototype.drawConvex = function(verts, base, options) {
  var lineWidth = options.lineWidth;

  if (!verts.length) {
    return;
  }

  var x0 = base.x, y0 = base.y;

  var width = 0, height = 0;
  var ratio = 1;

  for (var i = 0; i < verts.length; i++) {
    var v = verts[i], x = v.x, y = v.y;
    width = Math.max(Math.abs(x - x0), width);
    height = Math.max(Math.abs(y - y0), height);
  }

  return Stage.canvas(function(ctx) {

    this.size(2 * width + 2 * lineWidth, 2 * height + 2 * lineWidth, ratio);

    ctx.scale(ratio, ratio);
    ctx.beginPath();
    for (var i = 0; i < verts.length; i++) {
      var v = verts[i], x = v.x - x0 + width + lineWidth, y = v.y - y0 + height
          + lineWidth;
      if (i == 0)
        ctx.moveTo(x, y);
      else
        ctx.lineTo(x, y);
    }

    if (verts.length > 2) {
      ctx.closePath();
    }

    if (options.fillStyle) {
      ctx.fillStyle = options.fillStyle;
      ctx.fill();
      ctx.closePath();
    }

    ctx.lineCap = "round";
    ctx.lineWidth = options.lineWidth;
    ctx.strokeStyle = options.strokeStyle;
    ctx.stroke();
  });
};

(function() {
  var origin = Matter.Composite.addBody;
  Matter.Composite.addBody = function(composite, body) {
    var world = composite;
    while (world.parent)
      world = world.parent;
    Matter.Events.trigger(world, "addBody", {
      body : body
    });
    return origin.apply(this, arguments);
  };
})();

(function() {
  var origin = Matter.Composite.removeBody;
  Matter.Composite.removeBody = function(composite, body) {
    var world = composite;
    while (world.parent)
      world = world.parent;
    Matter.Events.trigger(world, "removeBody", {
      body : body
    });
    return origin.apply(this, arguments);
  };
})();