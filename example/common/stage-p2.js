import Stage from "../../src";
import "./p2";

/**
 * P2.js viewer for Stage.js
 */

export class P2Stage extends Stage.Node {
  constructor(world, options) {
    super();
    this.label("P2");

    let self = this;
    this.world = world;

    this.options = {
      maxSubSteps: 3,
      timeStep: 1 / 60,
      debug: false,
      debugPolygons: false,
      lineWidth: 0.025,
      lineColor: "#000000",
      fillColor: function () {
        let red = Stage.math.random(192, 256) | 0;
        let green = Stage.math.random(192, 256) | 0;
        let blue = Stage.math.random(192, 256) | 0;
        return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
      },
      ratio: 128,
      get: function (key) {
        let value = this[key];
        return typeof value === "function" ? value() : value;
      },
      extend: function (options) {
        return Object.assign({}, this, options);
      },
    }.extend(options);

    world
      .on("addBody", function (e) {
        self.addRenderable(e.body);
      })
      .on("removeBody", function (e) {
        self.removeRenderable(e.body);
      })
      .on("addSpring", function (e) {
        self.addRenderable(e.spring);
      })
      .on("removeSpring", function (e) {
        self.removeRenderable(e.spring);
      });

    this.drawContacts = false;
    this.toggleContact = function (toggle) {
      if (arguments.length) {
        this.drawContacts = toggle;
      } else {
        this.drawContacts = !this.drawContacts;
      }
      return this;
    };

    // Add initial bodies
    for (let i = 0; i < world.bodies.length; i++) {
      this.addRenderable(world.bodies[i]);
    }
    for (let i = 0; i < world.springs.length; i++) {
      this.addRenderable(world.springs[i]);
    }

    this.tick(function (t) {
      this.step(1 / 60, t / 1000);
    });

    this.tempv = p2.vec2.fromValues(0, 0);
  }
  step(t) {
    this.world.step(this.options.timeStep, t, this.options.maxSubSteps);

    for (let i = 0; i < this.world.bodies.length; i++) {
      let body = this.world.bodies[i];
      if (body.ui) {
        body.ui.pin({
          offsetX: body.position[0],
          offsetY: -body.position[1],
          rotation: -body.angle,
        });
      }
    }
    for (let i = 0; i < this.world.springs.length; i++) {
      let spring = this.world.springs[i];

      spring.getWorldAnchorA(this.tempv);
      let ax = this.tempv[0];
      let ay = this.tempv[1];

      spring.getWorldAnchorB(this.tempv);
      let bx = this.tempv[0];
      let by = this.tempv[1];

      // Spring position is the mean point between the anchors
      let x = (ax + bx) / 2;
      let y = (ay + by) / 2;

      // Compute distance vector between anchors, in screen coords
      let dx = ax - bx;
      let dy = ay - by;

      let a = Math.atan2(dx, dy) + Math.PI / 2;

      let s = Stage.math.length(dx, dy) / spring.restLength;

      spring.ui.pin({
        offsetX: x,
        offsetY: -y,
        scaleX: s,
        rotation: a,
      });
    }
  }
  addRenderable(obj) {
    if (!this.options.debug && typeof obj.ui !== "undefined") {
      obj.ui && obj.ui.appendTo(this);
      return;
    }

    obj.ui = Stage.layout().appendTo(this);

    if (obj instanceof p2.Body && obj.shapes.length) {
      if (obj.concavePath && !this.options.debugPolygons) {
        let texture = this.drawConvex(obj.concavePath, obj.render);
        Stage.sprite(texture)
          .appendTo(obj.ui)
          .pin({
            handle: 0.5,
            offsetX: obj.shapeOffsets[i] ? obj.shapeOffsets[i][0] : 0,
            offsetY: -(obj.shapeOffsets[i] ? obj.shapeOffsets[i][1] : 0),
            rotation: -obj.shapeAngles[i] || 0,
          });
      } else {
        for (let i = 0; i < obj.shapes.length; i++) {
          let shape = obj.shapes[i];
          let options = shape.render || obj.render;

          let texture = null;
          if (shape instanceof p2.Circle) {
            texture = this.drawCircle(shape.radius, options);
          } else if (shape instanceof p2.Particle) {
            texture = this.drawParticle(options);
          } else if (shape instanceof p2.Plane) {
            texture = this.drawPlane(-10, 10, 10, options);
          } else if (shape instanceof p2.Line) {
            texture = this.drawLine(shape.length, options);
          } else if (shape instanceof p2.Rectangle) {
            texture = this.drawRectangle(shape.width, shape.height, options);
          } else if (shape instanceof p2.Capsule) {
            texture = this.drawCapsule(shape.length, shape.radius, options);
          } else if (shape instanceof p2.Convex) {
            if (shape.vertices.length) {
              texture = this.drawConvex(shape.vertices, options);
            }
          }
          Stage.sprite(texture)
            .appendTo(obj.ui)
            .pin({
              handle: 0.5,
              offsetX: obj.shapeOffsets[i] ? obj.shapeOffsets[i][0] : 0,
              offsetY: -(obj.shapeOffsets[i] ? obj.shapeOffsets[i][1] : 0),
              rotation: -obj.shapeAngles[i] || 0,
            });
        }
      }
    } else if (obj instanceof p2.Spring) {
      let texture = this.drawSpring(obj.restLength, obj.render);
      Stage.sprite(texture).appendTo(obj.ui).pin({
        handle: 0.5,
      });
    }
  }
  removeRenderable(obj) {
    obj.ui && (obj.ui.drop ? obj.ui.drop() : obj.ui.remove());
  }
  drawLine(length, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    lineWidth *= 2;
    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
      this.size(length + 2 * lineWidth, lineWidth, ratio);

      ctx.scale(ratio, ratio);

      ctx.moveTo(lineWidth, lineWidth / 2);
      ctx.lineTo(lineWidth + length, lineWidth / 2);

      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  }
  drawRectangle(w, h, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    let width = w + 2 * lineWidth;
    let height = h + 2 * lineWidth;
    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
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
  }
  drawCircle(radius, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    let width = radius * 2 + lineWidth * 2;
    let height = radius * 2 + lineWidth * 2;
    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
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
  }
  drawParticle(options) {
    options = this.options.extend(options);

    let lineWidth = options.get("lineWidth");
    let lineColor = "";
    let fillColor = options.get("fillColor") || options.get("lineColor");

    let radius = 2 * options.get("lineWidth");

    let width = radius * 2 + lineWidth * 2;
    let height = radius * 2 + lineWidth * 2;
    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
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
  }
  drawCapsule(len, radius, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    let width = len + 2 * radius + 2 * lineWidth;
    let height = 2 * radius + 2 * lineWidth;
    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
      this.size(width, height, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      ctx.moveTo(radius + lineWidth, lineWidth);
      ctx.lineTo(len + radius + lineWidth, lineWidth);
      ctx.arc(len + radius + lineWidth, radius + lineWidth, radius, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(radius + lineWidth, 2 * radius + lineWidth);
      ctx.arc(radius + lineWidth, radius + lineWidth, radius, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });
  }
  drawSpring(length, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    length = Math.max(length, lineWidth * 10);

    let N = 12;
    let dx = length / N;
    let dy = 0.2 * length;

    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
      this.size(length, dy * 2, ratio);

      ctx.scale(ratio, ratio);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.lineJoin = "round";

      ctx.moveTo(0, dy);
      for (let i = 1; i < N; i++) {
        let x = dx * i;
        let y = dy;
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
  }
  drawPlane(x0, x1, max, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    let ratio = options.ratio;

    return Stage.canvas(function (ctx) {
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
      ctx.setLineDash && ctx.setLineDash([0.12, 0.06]);
      ctx.mozDash = [0.12, 0.06];

      ctx.stroke();
    });
  }
  drawConvex(verts, options) {
    options = this.options.extend(options);
    let lineWidth = options.get("lineWidth");
    let lineColor = options.get("lineColor");
    let fillColor = options.get("fillColor");

    if (!verts.length) {
      return;
    }

    let width = 0,
      height = 0;
    let ratio = options.ratio;

    for (let i = 0; i < verts.length; i++) {
      let v = verts[i],
        x = v[0],
        y = -v[1];
      width = Math.max(Math.abs(x), width);
      height = Math.max(Math.abs(y), height);
    }

    return Stage.canvas(function (ctx) {
      this.size(2 * width + 2 * lineWidth, 2 * height + 2 * lineWidth, ratio);

      ctx.scale(ratio, ratio);
      ctx.beginPath();
      for (let i = 0; i < verts.length; i++) {
        let v = verts[i],
          x = v[0] + width + lineWidth,
          y = -v[1] + height + lineWidth;
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
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
  }
}
