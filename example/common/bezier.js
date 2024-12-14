function bezier(ps, conf) {
  if (!ps || !ps.length) {
    return null;
  }

  conf = conf || {};

  let fx =
    conf.fx ||
    function (p) {
      return p.x || p[0];
    };
  let fy =
    conf.fy ||
    function (p) {
      return p.y || p[1];
    };

  let dx = fx(ps[0]);
  let cx = 3 * (fx(ps[1]) - fx(ps[0]));
  let bx = 3 * (fx(ps[2]) - fx(ps[1])) - cx;
  let ax = fx(ps[3]) - fx(ps[0]) - cx - bx;

  let dy = fy(ps[0]);
  let cy = 3 * (fy(ps[1]) - fy(ps[0]));
  let by = 3 * (fy(ps[2]) - fy(ps[1])) - cy;
  let ay = fy(ps[3]) - fy(ps[0]) - cy - by;

  return function (t, xy) {
    let t2 = t * t,
      t3 = t * t * t;
    let x = ax * t3 + bx * t2 + cx * t + dx;
    let y = ay * t3 + by * t2 + cy * t + dy;
    return __xy(x, y, xy);
  };
}

function __xy(x, y, xy) {
  if (!xy) {
    return {
      x: x,
      y: y,
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
      x: x,
      y: y,
    };
  }
}

export default bezier;
