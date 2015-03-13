/**
 * CutJS viewer for Matter.js
 */
Cut.Matter = function(engine) {
  Cut.Matter._super.call(this);

  var Engine = Matter.Engine, Composite = Matter.Composite, Events = Matter.Events;

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
      self.updateRenderable(bodies[i]);
    }
  });

  var bodies = Composite.allBodies(world);
  for (var i = 0; i < bodies.length; i++) {
    self.addRenderable(bodies[i]);
  }

  var runner = Engine.runner(engine);
  var time = 0;
  this.tick(function(t) {
    time += t;
    runner(time);
    this.touch();
  });

};

Cut.Matter._super = Cut;
Cut.Matter.prototype = Cut._create(Cut.Matter._super.prototype);
Cut.Matter.prototype.constructor = Cut.Matter;

Cut.Matter.prototype.addRenderable = function(body) {
  if (!body.ui) {
    var cutout = null;
    if (body.circleRadius) {
      cutout = this.drawCircle(body.circleRadius, body.render);
    } else if (body.vertices) {
      cutout = this.drawConvex(body.vertices, body.position, body.render);
    }
    if (cutout) {
      body.ui = Cut.image(cutout).pin('handle', 0.5).appendTo(this);
    }
    this.updateRenderable(body);
  }
};

Cut.Matter.prototype.removeRenderable = function(body) {
  if (body.ui) {
    body.ui.remove();
  }
};

Cut.Matter.prototype.updateRenderable = (function() {
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

Cut.Matter.prototype.drawCircle = function(radius, options) {
  var lineWidth = options.lineWidth;

  var width = radius * 2 + lineWidth * 2;
  var height = radius * 2 + lineWidth * 2;
  var ratio = 1;

  return Cut.Out.drawing(function(ctx) {

    this.size(width, height, ratio);

    ctx.scale(ratio, ratio);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
    if (options.fillStyle) {
      ctx.fillStyle = options.fillStyle;
      ctx.fill();
    }
    ctx.lineWidth = options.lineWidth;
    ctx.strokeStyle = options.strokeStyle;
    ctx.stroke();
  });
};

Cut.Matter.prototype.drawConvex = function(verts, base, options) {
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

  return Cut.Out.drawing(function(ctx) {

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