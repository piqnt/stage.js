/**
 * SAT.js viewer
 */
(function() {

  Stage.SAT = Viewer;

  Viewer._super = Stage;
  Viewer.prototype = Stage._create(Viewer._super.prototype);

  function Viewer(world, options) {
    Viewer._super.call(this);
    this.label('SAT');

    var self = this;
    this.world = world;

    this.options = {
      lineWidth : 2,
      lineColor : '#000000',
      fillColor : function() {
        var red = Stage.Math.random(192, 256) | 0;
        var green = Stage.Math.random(192, 256) | 0;
        var blue = Stage.Math.random(192, 256) | 0;
        return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
      },
      ratio : 2,
      get : function(key) {
        var value = this[key];
        return typeof value === 'function' ? value() : value;
      },
      extend : function(options) {
        return Stage._extend({}, this, options);
      }
    }.extend(options);

    world.onAddBody = function(e) {
      self.addRenderable(e.body);
    };
    world.onRemoveBody = function(e) {
      self.removeRenderable(e.body);
    };

    // Add initial bodies
    for (var i = 0; i < world.bodies.length; i++) {
      this.addRenderable(world.bodies[i]);
    }

    this.tick(function(t) {
      this.simulate(t);
    });

    var dragPoint = {}, dragShape = null;
    this.attr('spy', true).on(Stage.Mouse.START, function(point) {
      dragPoint = {
        x : point.x,
        y : point.y
      };
      dragShape = null;
      for (var i = 0; i < this.world.bodies.length; i++) {
        var body = this.world.bodies[i];
        if (SAT.pointIn(point, body.shape)) {
          dragShape = body.shape;
          break;
        }
      }

    }).on(Stage.Mouse.MOVE, function(point) {
      if (dragShape) {
        dragShape.pos.x -= dragPoint.x - point.x;
        dragShape.pos.y -= dragPoint.y - point.y;
      }
      dragPoint = {
        x : point.x,
        y : point.y
      };

    }).on(Stage.Mouse.END, function(point) {
      dragShape = null;
    });
  }

  Viewer.prototype.simulate = function(t) {
    this.world.simulate();

    for (var i = 0; i < this.world.bodies.length; i++) {
      var body = this.world.bodies[i];
      body.ui && body.ui.pin({
        offsetX : body.shape.pos.x,
        offsetY : body.shape.pos.y,
        rotation : body.shape.angle
      });
    }
  };

  Viewer.prototype.addRenderable = function(obj) {

    obj.ui = Stage.create().appendTo(this);

    var texture = null;
    var shape = obj.shape;

    if (shape instanceof SAT.Circle) {
      texture = this.drawCircle(shape.r);

    } else {
      if (shape.points.length) {
        texture = this.drawConvex(shape.points);
      }
    }

    Stage.image(texture).appendTo(obj.ui).pin({
      handle : 0.5
    });

  };

  Viewer.prototype.removeRenderable = function(obj) {
    obj.ui && obj.ui.remove();
  };

  Viewer.prototype.drawCircle = function(radius, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    var width = radius * 2 + lineWidth * 2;
    var height = radius * 2 + lineWidth * 2;
    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(width, height, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  };

  Viewer.prototype.drawConvex = function(verts, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    if (!verts.length) {
      return;
    }

    var width = 0, height = 0;
    var ratio = options.ratio;

    for (var i = 0; i < verts.length; i++) {
      var v = verts[i], x = v.x, y = v.y;
      width = Math.max(Math.abs(x), width);
      height = Math.max(Math.abs(y), height);
    }

    return Stage.canvas(function(ctx) {
      this.size(2 * width + 2 * lineWidth, 2 * height + 2 * lineWidth, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      for (var i = 0; i < verts.length; i++) {
        var v = verts[i], x = v.x + width + lineWidth, y = v.y + height
            + lineWidth;
        if (i == 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
      }

      if (verts.length > 2) {
        ctx.closePath();
      }

      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.closePath();
      }

      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  };

})();
