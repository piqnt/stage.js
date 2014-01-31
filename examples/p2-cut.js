function P2Cut(world, root, container) {

  var self = this;
  this.world = world;
  this.root = root;

  this.maxSubSteps = 3;
  this.timeStep = 1 / 60;

  this.lineWidth = 0.025;

  world.on("addBody", function(e) {
    self.addRenderable(e.body);

  }).on("removeBody", function(e) {
    self.removeRenderable(e.body);

  }).on("addSpring", function(e) {
    self.addRenderable(e.spring);

  }).on("removeSpring", function(e) {
    self.removeRenderable(e.spring);
  });

  this.drawContacts = false;
  this.toggleContact = function(toggle) {
    if (arguments.length) {
      this.drawContacts = toggle;
    } else {
      this.drawContacts = !this.drawContacts;
    }
    return this;
  };

  // Add initial bodies
  for (var i = 0; i < world.bodies.length; i++) {
    this.addRenderable(world.bodies[i]);
  }
  for (var i = 0; i < world.springs.length; i++) {
    this.addRenderable(world.springs[i]);
  }
}

P2Cut.ratio = 128;

var X = p2.vec2.fromValues(1, 0);
var worldAnchorA = p2.vec2.fromValues(0, 0);
var worldAnchorB = p2.vec2.fromValues(0, 0);

P2Cut.prototype.step = function() {
  this.lastTime = this.lastTime || Date.now() / 1000;
  var now = Date.now() / 1000, t = now - this.lastTime;
  this.lastTime = now;
  this.world.step(this.timeStep, t, this.maxSubSteps);

  for (var i = 0; i < world.bodies.length; i++) {
    var body = world.bodies[i];
    if (body.ui) {
      body.ui.pin({
        offsetX : body.position[0],
        offsetY : -body.position[1],
        rotation : -body.angle
      });
    }
  }
  for (var i = 0; i < world.springs.length; i++) {
    var spring = world.springs[i];

    spring.getWorldAnchorA(worldAnchorA);
    spring.getWorldAnchorB(worldAnchorB);

    var ax = worldAnchorA[0];
    var ay = worldAnchorA[1];
    var bx = worldAnchorB[0];
    var by = worldAnchorB[1];

    // Spring position is the mean point between the anchors
    var x = (ax + bx) / 2;
    var y = (ay + by) / 2;

    // Compute distance vector between anchors, in screen coords
    var dx = ax - bx;
    var dy = ay - by;

    var a = Math.atan2(dx, dy) + Math.PI / 2;

    var s = Cut.Math.length(dx, dy) / spring.restLength;

    spring.ui.pin({
      offsetX : x,
      offsetY : -y,
      scaleX : s,
      scaleY : 1 / s,
      rotation : a
    });

  }

  // Clear contacts
  // this.contactGraphics.clear();
  // if (this.drawContacts) {
  // this.stage.removeChild(this.contactGraphics);
  // this.stage.addChild(this.contactGraphics);
  //
  // var g = this.contactGraphics;
  // g.lineStyle(this.lineWidth, 0x000000, 1);
  // for (var i = 0; i !== this.world.narrowphase.contactEquations.length; i++)
  // {
  // var eq = this.world.narrowphase.contactEquations[i], bi = eq.bi, bj =
  // eq.bj, ri = eq.ri, rj = eq.rj, xi = (bi.position[0]), yi = (h -
  // bi.position[1]), xj = (bj.position[0]), yj = (h - bj.position[1]);
  //
  // g.moveTo(xi, yi);
  // g.lineTo(xi + ri[0], yi - ri[1]);
  //
  // g.moveTo(xj, yj);
  // g.lineTo(xj + rj[0], yj - rj[1]);
  //
  // }
  // }

};

P2Cut.prototype.addRenderable = function(obj) {

  var lineWidth = this.lineWidth;
  var fillColor = "#" + randomPastelHex();
  var lineColor = "#000000";

  var zero = [ 0, 0 ];

  var cutout = null;

  if (obj instanceof p2.Body && obj.shapes.length) {

    if (obj.concavePath && !this.debugPolygons) {
      // var path = [];
      // for (var j = 0; j !== obj.concavePath.length; j++) {
      // var v = obj.concavePath[j];
      // path.push([ v[0], -v[1] ]);
      // }
      // if (path.length) {
      // sprite = P2Cut.drawPath(path, lineColor, fillColor, lineWidth);
      // }

    } else {
      for (var i = 0; i < obj.shapes.length; i++) {
        var shape = obj.shapes[i];
        var offset = obj.shapeOffsets[i] || zero;
        var angle = obj.shapeAngles[i] || 0;

        if (shape instanceof p2.Circle) {
          cutout = P2Cut.drawCircle(offset[0], offset[1], angle, shape.radius,
              lineWidth, lineColor, fillColor);

        } else if (shape instanceof p2.Particle) {
          cutout = P2Cut.drawCircle(offset[0], offset[1], angle, 2 * lineWidth,
              0, lineColor, lineColor);

        } else if (shape instanceof p2.Plane) {
          cutout = P2Cut
              .drawPlane(-10, 10, 10, lineWidth, lineColor, fillColor);

        } else if (shape instanceof p2.Line) {
          // sprite = P2Cut.drawLine(shape.length, lineColor, lineWidth);

        } else if (shape instanceof p2.Rectangle) {
          cutout = P2Cut.drawRectangle(offset[0], offset[1], angle,
              shape.width, shape.height, lineWidth, lineColor, fillColor);

        } else if (shape instanceof p2.Capsule) {
          // sprite = P2Cut.drawCapsule(offset[0], -offset[1], angle,
          // shape.length,
          // shape.radius, lineColor, fillColor, lineWidth);

        } else if (shape instanceof p2.Convex) {
          // Scale verts
          // var verts = [], vrot = p2.vec2.create();
          // for (var j = 0; j !== shape.vertices.length; j++) {
          // var v = shape.vertices[j];
          // p2.vec2.rotate(vrot, v, angle);
          // verts.push([ (vrot[0] + offset[0]), -(vrot[1] + offset[1]) ]);
          // }
          //
          // sprite = P2Cut.drawConvex(verts, shape.triangles, lineColor,
          // fillColor, lineWidth, this.debugPolygons,
          // [ offset[0], -offset[1] ]);
        }
      }
    }

  } else if (obj instanceof p2.Spring) {
    cutout = P2Cut.drawSpring(obj.restLength, lineWidth);
  }

  if (cutout) {
    obj.ui = Cut.image(cutout).appendTo(this.root).pin("handle", 0.5);
  }
};

P2Cut.prototype.removeRenderable = function(obj) {
  obj.ui && obj.ui.remove();
};

P2Cut.drawPath = function(path, color, fillColor, lineWidth) {
  ctx.lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  ctx.color = typeof (color) == "undefined" ? 0x000000 : color;

  var xmin = Infinity, xmax = -xmin;
  var ymin = Infinity, ymax = -ymin;
  for (var i = 0; i < path.length; i++) {
    xmin = Math.min(v[0], xmin);
    ymin = Math.min(v[1], ymin);
    xmax = Math.max(v[0], xmin);
    ymax = Math.max(v[1], ymin);
  }

  return Cut.Out.drawing(xmax - xmin, ymax - ymin, function(ctx) {

    ctx.setTransform(1, 0, 0, 1, xmin, xmax);

    ctx.lineWidth = lineWidth;
    ctx.color = color;

    for (var i = 0; i < path.length; i++) {
      var v = path[i], x = v[0], y = v[1];
      if (i == 0) {
        ctx.moveTo(x - xmin, y - ymin);
      } else {
        ctx.lineTo(x - xmin, y - ymin);
      }
    }

    if (path.length > 2 && typeof (fillColor) == "number") {
      ctx.closePath();
      ctx.fill = fillColor;
      ctx.fill();
    }
  });
};

P2Cut.drawLine = function(len, color, lineWidth) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  color = typeof (color) == "undefined" ? 0x000000 : color;

  return Cut.Out.drawing(len, lineWidth, function(ctx) {
    ctx.lineWidth = lineWidth;
    ctx.color = color;

    ctx.setTransform(1, 0, 0, 1, xmin, xmax);

    g.moveTo(-len / 2, 0);
    g.lineTo(len / 2, 0);
  });

};

P2Cut.drawRectangle = function(x, y, angle, w, h, lineWidth, lineColor,
    fillColor) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  lineColor = typeof (color) == "undefined" ? "#000000" : lineColor;

  var width = w + 2 * lineWidth;
  var height = h + 2 * lineWidth;

  return Cut.Out.drawing(width, height, P2Cut.ratio, function(ctx) {
    ctx.scale(P2Cut.ratio, P2Cut.ratio);
    ctx.beginPath();
    ctx.rect(lineWidth, lineWidth, w, h);
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  });
};

P2Cut.drawPlane = function(x0, x1, max, lineWidth, lineColor, fillColor) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  lineColor = typeof (color) == "undefined" ? "#000000" : lineColor;

  return Cut.Out.drawing(max * 2, max * 2, P2Cut.ratio, function(ctx) {
    ctx.scale(P2Cut.ratio, P2Cut.ratio);

    if (fillColor) {
      ctx.beginPath();
      ctx.rect(0, max, 2 * max, 2 * max);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.closePath();
    }
    ctx.beginPath();
    ctx.moveTo(0, max);
    ctx.lineTo(2 * max, max);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = lineColor;
    ctx.setLineDash && ctx.setLineDash([ 0.12, 0.06 ]);
    ctx.mozDash = [ 0.12, 0.06 ];
    ctx.stroke();
  });

};

P2Cut.drawCircle = function(x, y, angle, radius, lineWidth, lineColor,
    fillColor) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  lineColor = typeof (color) == "undefined" ? "#000000" : lineColor;

  var width = radius * 2 + lineWidth * 2;
  var height = radius * 2 + lineWidth * 2;

  return Cut.Out.drawing(width, height, P2Cut.ratio, function(ctx) {
    ctx.scale(P2Cut.ratio, P2Cut.ratio);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.moveTo(radius + lineWidth, radius + lineWidth);
    ctx.lineTo(lineWidth, radius + lineWidth);

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  });
};

P2Cut.drawSpring = function(length, lineWidth, lineColor) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  lineColor = typeof (color) == "undefined" ? 0xffffff : lineColor;

  length = Math.max(length, lineWidth * 10);

  var N = 12;
  var dx = length / N;
  var dy = 0.2 * length;

  return Cut.Out.drawing(length, dy * 2, P2Cut.ratio, function(ctx) {
    ctx.scale(P2Cut.ratio, P2Cut.ratio);

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.lineJoin = "round";

    ctx.moveTo(0, dy);
    for (var i = 1; i < N; i++) {
      var x = dx * i;
      var y = dy;
      if (i <= 1 || i >= N - 1) {
        // Do nothing
      } else if (i % 2 === 0) {
        y -= dy / 2;
      } else {
        y += dy / 2;
      }
      ctx.lineTo(x, y);
    }
    ctx.lineTo(length, dy);

    ctx.stroke();
  });
};

P2Cut.drawCapsule = function(g, x, y, angle, len, radius, color, fillColor,
    lineWidth) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  color = typeof (color) == "undefined" ? 0x000000 : color;
  g.lineStyle(lineWidth, color, 1);

  // Draw circles at ends
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  g.beginFill(fillColor);
  g.drawCircle(-len / 2 * c + x, -len / 2 * s + y, radius);
  g.drawCircle(len / 2 * c + x, len / 2 * s + y, radius);
  g.endFill();

  // Draw rectangle
  g.lineStyle(lineWidth, color, 0);
  g.beginFill(fillColor);
  g.moveTo(-len / 2 * c + radius * s + x, -len / 2 * s + radius * c + y);
  g.lineTo(len / 2 * c + radius * s + x, len / 2 * s + radius * c + y);
  g.lineTo(len / 2 * c - radius * s + x, len / 2 * s - radius * c + y);
  g.lineTo(-len / 2 * c - radius * s + x, -len / 2 * s - radius * c + y);
  g.endFill();

  // Draw lines in between
  g.lineStyle(lineWidth, color, 1);
  g.moveTo(-len / 2 * c + radius * s + x, -len / 2 * s + radius * c + y);
  g.lineTo(len / 2 * c + radius * s + x, len / 2 * s + radius * c + y);
  g.moveTo(-len / 2 * c - radius * s + x, -len / 2 * s - radius * c + y);
  g.lineTo(len / 2 * c - radius * s + x, len / 2 * s - radius * c + y);

};

P2Cut.drawConvex = function(g, verts, triangles, color, fillColor, lineWidth,
    debug, offset) {
  lineWidth = typeof (lineWidth) == "number" ? lineWidth : 1;
  color = typeof (color) == "undefined" ? 0x000000 : color;
  if (!debug) {
    g.lineStyle(lineWidth, color, 1);
    g.beginFill(fillColor);
    for (var i = 0; i !== verts.length; i++) {
      var v = verts[i], x = v[0], y = v[1];
      if (i == 0)
        g.moveTo(x, y);
      else
        g.lineTo(x, y);
    }
    g.endFill();
    if (verts.length > 2) {
      g.moveTo(verts[verts.length - 1][0], verts[verts.length - 1][1]);
      g.lineTo(verts[0][0], verts[0][1]);
    }
  } else {
    var colors = [ 0xff0000, 0x00ff00, 0x0000ff ];
    for (var i = 0; i !== verts.length + 1; i++) {
      var v0 = verts[i % verts.length], v1 = verts[(i + 1) % verts.length], x0 = v0[0], y0 = v0[1], x1 = v1[0], y1 = v1[1];
      g.lineStyle(lineWidth, colors[i % colors.length], 1);
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.drawCircle(x0, y0, lineWidth * 2);
    }

    g.lineStyle(lineWidth, 0x000000, 1);
    g.drawCircle(offset[0], offset[1], lineWidth * 2);
  }
};

// http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function randomPastelHex() {
  var mix = [ 255, 255, 255 ];
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);

  // mix the color
  red = Math.floor((red + 3 * mix[0]) / 4);
  green = Math.floor((green + 3 * mix[1]) / 4);
  blue = Math.floor((blue + 3 * mix[2]) / 4);

  return rgbToHex(red, green, blue);
}

function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}