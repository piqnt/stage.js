/*
 * CutJS viewer for PhysicsJS
 */

Physics.renderer('cutjs', function(proto) {
  return {
    init : function(options) {
      proto.init.call(this, options);
    },
    drawMeta : function(meta) {
    },
    createView : function(data) {
    },
    drawBody : function(body, view) {
      if (body && view) {
        view.pin({
          offsetX : body.state.pos.x || body.state.pos.get(0),
          offsetY : body.state.pos.y || body.state.pos.get(1),
          rotation : body.state.angular.pos
        });
      }
    }
  };
});

Cut.PJS = function(world, options) {
  Cut.PJS.prototype._super.apply(this, arguments);

  var self = this;
  this.world = world;

  options = options || {};

  this.ratio = options.ratio || 1;

  this.lineWidth = 'lineWidth' in options ? Cut._function(options.lineWidth)
      : Cut._function(2);
  this.lineColor = 'lineColor' in options ? Cut._function(options.lineColor)
      : Cut._function('#000000');
  this.fillColor = 'fillColor' in options ? Cut._function(options.fillColor)
      : Cut._function(Cut.PJS.randomColor);

  world.subscribe('add:body', function(data) {
    data.body && self.addRenderable(data.body);
  });

  world.subscribe('remove:body', function(data) {
    data.body && self.removeRenderable(data.body);
  });

  var bodies = world.getBodies();
  for (var i = 0; i < bodies.length; i++) {
    this.addRenderable(bodies[i]);
  }

  var time = 0;
  this.tick(function(t) {
    time += t;
    world.step(time);
    // if (!world.isPaused()) {
    world.render();
    // }
  });

  world.add(Physics.renderer('cutjs', {}));

};

Cut.PJS.prototype = Cut._create(Cut.prototype);
Cut.PJS.prototype._super = Cut;
Cut.PJS.prototype.constructor = Cut.PJS;

Cut.PJS.prototype.addRenderable = function(obj) {
  console.log('add');
  if (obj.view || !obj.geometry) {
    return;
  }
  var geometry = obj.geometry;
  var cutout = null;
  if ('circle' == geometry.name) {
    cutout = this.drawCircle(geometry.radius);
    // } else {
    // if (shape.points.length) {
    // cutout = this.drawConvex(shape.points);
    // }
  }
  obj.view = Cut.create().append(Cut.image(cutout).pin({
    handle : 0.5
  })).appendTo(this);
};

Cut.PJS.prototype.removeRenderable = function(obj) {
  console.log('remove');
  obj.view && obj.view.remove();
  return this;
};

Cut.PJS.prototype.drawCircle = function(radius, options) {
  options = this.options(options);
  var lineWidth = options.lineWidth, lineColor = options.lineColor, fillColor = options.fillColor;

  var width = radius * 2 + lineWidth * 2;
  var height = radius * 2 + lineWidth * 2;

  return Cut.Out.drawing(width, height, this.ratio, function(ctx, ratio) {
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

Cut.PJS.prototype.drawConvex = function(verts, options) {
  options = this.options(options);
  var lineWidth = options.lineWidth, lineColor = options.lineColor, fillColor = options.fillColor;

  if (!verts.length) {
    return;
  }

  var width = 0, height = 0;
  for (var i = 0; i < verts.length; i++) {
    var v = verts[i], x = v.x, y = v.y;
    width = Math.max(Math.abs(x), width);
    height = Math.max(Math.abs(y), height);
  }

  var cutout = Cut.Out.drawing(2 * width + 2 * lineWidth, 2 * height + 2
      * lineWidth, this.ratio, function(ctx, ratio) {
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

  return cutout;
};

Cut.PJS.prototype.options = function(options) {
  options = typeof options === 'object' ? options : {};
  options.lineWidth = options.lineWidth || this.lineWidth();
  options.lineColor = options.lineColor || this.lineColor();
  options.fillColor = options.fillColor || this.fillColor();
  return options;
};

Cut.PJS.randomColor = function() {
  var red = Cut.Math.random(192, 256) | 0;
  var green = Cut.Math.random(192, 256) | 0;
  var blue = Cut.Math.random(192, 256) | 0;
  return '#' + red.toString(16) + green.toString(16) + blue.toString(16);
};