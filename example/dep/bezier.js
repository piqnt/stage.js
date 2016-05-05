/*
 * Copyright (c) 2016 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

(function() {

  function bezier(ps, conf) {

    if (!ps || !ps.length) {
      return null;
    }

    conf = conf || {};

    var fx = conf.fx || function(p) {
      return p.x || p[0];
    };
    var fy = conf.fy || function(p) {
      return p.y || p[1];
    };

    var dx = fx(ps[0]);
    var cx = 3 * (fx(ps[1]) - fx(ps[0]));
    var bx = 3 * (fx(ps[2]) - fx(ps[1])) - cx;
    var ax = fx(ps[3]) - fx(ps[0]) - cx - bx;

    var dy = fy(ps[0]);
    var cy = 3 * (fy(ps[1]) - fy(ps[0]));
    var by = 3 * (fy(ps[2]) - fy(ps[1])) - cy;
    var ay = fy(ps[3]) - fy(ps[0]) - cy - by;

    return function(t, xy) {
      var t2 = t * t, t3 = t * t * t;
      var x = ax * t3 + bx * t2 + cx * t + dx;
      var y = ay * t3 + by * t2 + cy * t + dy;
      return __xy(x, y, xy);
    };
  }

  function __xy(x, y, xy) {
    if (!xy) {
      return {
        x : x,
        y : y
      };
    } else if (typeof xy === "function") {
      return xy(x, y);
    } else if (xy instanceof Array) {
      xy[0] = x;
      xy[1] = y;
      return xy;
    } else if (typeof xy === "object") {
      xy.x = x;
      xy.y = y;
      return xy;
    } else {
      return {
        x : x,
        y : y
      };
    }
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = bezier;
    }
    exports.bezier = bezier;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return bezier;
    });
  } else if (typeof window !== 'undefined') {
    window.bezier = bezier;
  } else if (typeof global !== 'undefined') {
    global.bezier = bezier;
  } else if (typeof self !== 'undefined') {
    self.bezier = bezier;
  } else {
    this.bezier = bezier;
  }
}).call(this);
