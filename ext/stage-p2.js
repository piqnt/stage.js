/**
 * P2.js viewer for Stage.js
 */
(function() {

  Stage.P2 = Viewer;

  Viewer._super = Stage;
  Viewer.prototype = Stage._create(Viewer._super.prototype);

  function Viewer(world, options) {
    Viewer._super.call(this);
    this.label('P2');

    var self = this;
    this.world = world;

    this.options = {
      maxSubSteps : 3,
      timeStep : 1 / 60,
      debug : false,
      debugPolygons : false,
      lineWidth : 0.025,
      lineColor : '#000000',
      fillColor : function() {
        var red = Stage.Math.random(192, 256) | 0;
        var green = Stage.Math.random(192, 256) | 0;
        var blue = Stage.Math.random(192, 256) | 0;
        return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
      },
      ratio : 128,
      get : function(key) {
        var value = this[key];
        return typeof value === 'function' ? value() : value;
      },
      extend : function(options) {
        return Stage._extend({}, this, options);
      }
    }.extend(options);

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

    this.tick(function(t) {
      this.step(1 / 60, t / 1000);
    });

    this.tempv = p2.vec2.fromValues(0, 0);
  }

  Viewer.prototype.step = function(t) {
    this.world.step(this.options.timeStep, t, this.options.maxSubSteps);

    for (var i = 0; i < this.world.bodies.length; i++) {
      var body = this.world.bodies[i];
      if (body.ui) {
        body.ui.pin({
          offsetX : body.position[0],
          offsetY : -body.position[1],
          rotation : -body.angle
        });
      }
    }
    for (var i = 0; i < this.world.springs.length; i++) {
      var spring = this.world.springs[i];

      spring.getWorldAnchorA(this.tempv);
      var ax = this.tempv[0];
      var ay = this.tempv[1];

      spring.getWorldAnchorB(this.tempv);
      var bx = this.tempv[0];
      var by = this.tempv[1];

      // Spring position is the mean point between the anchors
      var x = (ax + bx) / 2;
      var y = (ay + by) / 2;

      // Compute distance vector between anchors, in screen coords
      var dx = ax - bx;
      var dy = ay - by;

      var a = Math.atan2(dx, dy) + Math.PI / 2;

      var s = Stage.Math.length(dx, dy) / spring.restLength;

      spring.ui.pin({
        offsetX : x,
        offsetY : -y,
        scaleX : s,
        rotation : a
      });
    }
  };

  Viewer.prototype.addRenderable = function(obj) {

    if (!this.options.debug && typeof obj.ui !== "undefined") {
      obj.ui && obj.ui.appendTo(this);
      return;
    }

    obj.ui = Stage.create().appendTo(this);

    if (obj instanceof p2.Body && obj.shapes.length) {
      if (obj.concavePath && !this.options.debugPolygons) {
        var texture = this.drawConvex(obj.concavePath);
        Stage.image(texture).appendTo(obj.ui).pin({
          handle : 0.5,
          offsetX : obj.shapeOffsets[i] ? obj.shapeOffsets[i][0] : 0,
          offsetY : -(obj.shapeOffsets[i] ? obj.shapeOffsets[i][1] : 0),
          rotation : -obj.shapeAngles[i] || 0
        });

      } else {
        for (var i = 0; i < obj.shapes.length; i++) {
          var shape = obj.shapes[i];

          var texture = null;
          if (shape instanceof p2.Circle) {
            texture = this.drawCircle(shape.radius);

          } else if (shape instanceof p2.Particle) {
            texture = this.drawCircle(2 * this.options.get('lineWidth'), {
              lineColor : "",
              fillColor : this.options.lineColor
            });

          } else if (shape instanceof p2.Plane) {
            texture = this.drawPlane(-10, 10, 10);

          } else if (shape instanceof p2.Line) {
            texture = this.drawLine(shape.length);

          } else if (shape instanceof p2.Rectangle) {
            texture = this.drawRectangle(shape.width, shape.height);

          } else if (shape instanceof p2.Capsule) {
            texture = this.drawCapsule(shape.length, shape.radius);

          } else if (shape instanceof p2.Convex) {
            if (shape.vertices.length) {
              texture = this.drawConvex(shape.vertices);
            }
          }
          Stage.image(texture).appendTo(obj.ui).pin({
            handle : 0.5,
            offsetX : obj.shapeOffsets[i] ? obj.shapeOffsets[i][0] : 0,
            offsetY : -(obj.shapeOffsets[i] ? obj.shapeOffsets[i][1] : 0),
            rotation : -obj.shapeAngles[i] || 0
          });
        }
      }

    } else if (obj instanceof p2.Spring) {
      var texture = this.drawSpring(obj.restLength);
      Stage.image(texture).appendTo(obj.ui).pin({
        handle : 0.5
      });
    }

  };

  Viewer.prototype.removeRenderable = function(obj) {
    obj.ui && (obj.ui.drop ? obj.ui.drop() : obj.ui.remove());
  };

  Viewer.prototype.drawLine = function(length, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    lineWidth *= 2;
    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(length + 2 * lineWidth, lineWidth, ratio);

      ctx.scale(ratio, ratio);

      ctx.moveTo(lineWidth, lineWidth / 2);
      ctx.lineTo(lineWidth + length, lineWidth / 2);

      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  };

  Viewer.prototype.drawRectangle = function(w, h, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    var width = w + 2 * lineWidth;
    var height = h + 2 * lineWidth;
    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(width, height, ratio);

      ctx.scale(ratio, ratio);
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

      if (lineColor) {
        ctx.moveTo(radius + lineWidth, radius + lineWidth);
        ctx.lineTo(lineWidth, radius + lineWidth);

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();
      }
    });
  };

  Viewer.prototype.drawCapsule = function(len, radius, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    var width = len + 2 * radius + 2 * lineWidth;
    var height = 2 * radius + 2 * lineWidth;
    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(width, height, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      ctx.moveTo(radius + lineWidth, lineWidth);
      ctx.lineTo(len + radius + lineWidth, lineWidth);
      ctx.arc(len + radius + lineWidth, radius + lineWidth, radius,
          -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(radius + lineWidth, 2 * radius + lineWidth);
      ctx.arc(radius + lineWidth, radius + lineWidth, radius, Math.PI / 2,
          -Math.PI / 2);
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  };

  Viewer.prototype.drawSpring = function(length, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    length = Math.max(length, lineWidth * 10);

    var N = 12;
    var dx = length / N;
    var dy = 0.2 * length;

    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(length, dy * 2, ratio);

      ctx.scale(ratio, ratio);
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

  Viewer.prototype.drawPlane = function(x0, x1, max, options) {
    options = this.options.extend(options);
    var lineWidth = options.get('lineWidth'), lineColor = options
        .get('lineColor'), fillColor = options.get('fillColor');

    var ratio = options.ratio;

    return Stage.canvas(function(ctx) {
      this.size(max * 2, max * 2, ratio);

      ctx.scale(ratio, ratio);

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
      var v = verts[i], x = v[0], y = -v[1];
      width = Math.max(Math.abs(x), width);
      height = Math.max(Math.abs(y), height);
    }

    return Stage.canvas(function(ctx) {
      this.size(2 * width + 2 * lineWidth, 2 * height + 2 * lineWidth, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      for (var i = 0; i < verts.length; i++) {
        var v = verts[i], x = v[0] + width + lineWidth, y = -v[1] + height
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
