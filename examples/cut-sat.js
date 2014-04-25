/**
 * CutJS viewer for SAT.js
 */
Cut.SAT = function(world, options) {
  Cut.SAT.prototype._super.apply(this, arguments);

  var self = this;
  this.world = world;

  this.options = Cut._options({
    lineWidth : 2,
    lineColor : '#000000',
    fillColor : Cut.SAT.randomColor,
    ratio : 2
  }).mixin(options);

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
  this.spy(true).on(Cut.Mouse.START, function(ev, point) {
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

  }).on(Cut.Mouse.MOVE, function(ev, point) {
    if (dragShape) {
      dragShape.pos.x -= dragPoint.x - point.x;
      dragShape.pos.y -= dragPoint.y - point.y;
    }
    dragPoint = {
      x : point.x,
      y : point.y
    };

  }).on(Cut.Mouse.END, function(ev, point) {
    dragShape = null;
  });
};

Cut.SAT.prototype = Cut._create(Cut.prototype);
Cut.SAT.prototype._super = Cut;
Cut.SAT.prototype.constructor = Cut.SAT;

Cut.SAT.prototype.simulate = function(t) {
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

Cut.SAT.prototype.addRenderable = function(obj) {

  obj.ui = Cut.create().appendTo(this);

  var cutout = null;
  var shape = obj.shape;

  if (shape instanceof SAT.Circle) {
    cutout = this.drawCircle(shape.r);

  } else {
    if (shape.points.length) {
      cutout = this.drawConvex(shape.points);
    }
  }

  Cut.image(cutout).appendTo(obj.ui).pin({
    handle : 0.5
  });

};

Cut.SAT.prototype.removeRenderable = function(obj) {
  obj.ui && obj.ui.remove();
};

Cut.SAT.prototype.drawCircle = function(radius, options) {
  options = this.options.extend(options);
  var lineWidth = options.get('lineWidth'), lineColor = options
      .get('lineColor'), fillColor = options.get('fillColor');

  var width = radius * 2 + lineWidth * 2;
  var height = radius * 2 + lineWidth * 2;

  return Cut.Out.drawing(width, height, options.ratio, function(ctx, ratio) {
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

Cut.SAT.prototype.drawConvex = function(verts, options) {
  options = this.options.extend(options);
  var lineWidth = options.get('lineWidth'), lineColor = options
      .get('lineColor'), fillColor = options.get('fillColor');

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
      * lineWidth, options.ratio, function(ctx, ratio) {
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

  return cutout;
};

Cut.SAT.randomColor = function() {
  var red = Cut.Math.random(192, 256) | 0;
  var green = Cut.Math.random(192, 256) | 0;
  var blue = Cut.Math.random(192, 256) | 0;
  return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
};