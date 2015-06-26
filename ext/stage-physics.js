/**
 * PhysicsJS viewer for Stage.js
 */
(function() {

  Stage.PJS = Viewer;

  Viewer._super = Stage;
  Viewer.prototype = Stage._create(Viewer._super.prototype);

  function Viewer(world, options) {
    Viewer._super.call(this);
    this.label('PhysicsJS');

    var self = this;
    this.world = world;

    this.options = {
      lineWidth : 2,
      lineColor : '#000000',
      fillColor : function() {
        var red = Stage.Math.random(192, 256) | 0;
        var green = Stage.Math.random(192, 256) | 0;
        var blue = Stage.Math.random(192, 256) | 0;
        return '#' + red.toString(16) + green.toString(16) + blue.toString(16);
      },
      ratio : 1,
      get : function(key) {
        var value = this[key];
        return typeof value === 'function' ? value() : value;
      },
      extend : function(options) {
        return Stage._extend({}, this, options);
      }
    }.extend(options);

    var subscribe = world.subscribe || world.on;
    subscribe.call(world, 'add:body', function(data) {
      data.body && self.addRenderable(data.body);
    });
    subscribe.call(world, 'remove:body', function(data) {
      data.body && self.removeRenderable(data.body);
    });

    var bodies = world.getBodies();
    for (var i = 0; i < bodies.length; i++) {
      var body = bodies[i];
      this.addRenderable(body);
    }

    var time = Date.now();
    this.tick(function(t) {
      time += t;
      world.step(time);
      var bodies = world.getBodies();
      for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (body.ui) {
          body.ui.pin({
            offsetX : body.state.pos.get(0),
            offsetY : body.state.pos.get(1),
            rotation : body.state.angular.pos
          });
        }
      }
    });
  }

  Viewer.prototype.addRenderable = function(obj) {
    if (obj.ui || !obj.geometry) {
      return;
    }
    var geometry = obj.geometry;
    var texture = null;
    if ('circle' == geometry.name) {
      texture = this.drawCircle(geometry.radius);
      // } else {
      // if (shape.points.length) {
      // texture = this.drawConvex(shape.points);
      // }
    }
    obj.ui = Stage.create().append(Stage.image(texture).pin({
      handle : 0.5
    })).appendTo(this);
  };

  Viewer.prototype.removeRenderable = function(obj) {
    obj.ui && obj.ui.remove();
    return this;
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
      ctx.lineCap = 'round';
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  };

})();
