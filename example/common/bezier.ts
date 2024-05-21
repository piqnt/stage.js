type Point = { x: number; y: number };

function fx(p: any): number {
  if (typeof p === "object" && p !== null) {
    return p.x ?? p[0];
  }
  return undefined;
}

function fy(p: any): number {
  if (typeof p === "object" && p !== null) {
    return p.y ?? p[1];
  }
  return undefined;
}

type CurveGenerator = {
  fn: (t: number, result: (x: number, y: number) => any) => any;
  object: (t: number, result?: Point) => Point;
  array: (t: number, result: [number, number]) => [number, number];
};

function bezier(points: Point[] | [number, number][]): CurveGenerator {
  if (!points || !points.length) {
    return null;
  }

  const dx = fx(points[0]);
  const cx = 3 * (fx(points[1]) - fx(points[0]));
  const bx = 3 * (fx(points[2]) - fx(points[1])) - cx;
  const ax = fx(points[3]) - fx(points[0]) - cx - bx;

  const dy = fy(points[0]);
  const cy = 3 * (fy(points[1]) - fy(points[0]));
  const by = 3 * (fy(points[2]) - fy(points[1])) - cy;
  const ay = fy(points[3]) - fy(points[0]) - cy - by;

  return {
    array: function (t: number, result: [number, number]) {
      const t2 = t * t;
      const t3 = t * t * t;
      const x = ax * t3 + bx * t2 + cx * t + dx;
      const y = ay * t3 + by * t2 + cy * t + dy;

      result[0] = x;
      result[1] = y;
      return result;
    },
    object: function (t: number, result: Point) {
      const t2 = t * t;
      const t3 = t * t * t;
      const x = ax * t3 + bx * t2 + cx * t + dx;
      const y = ay * t3 + by * t2 + cy * t + dy;

      if (result) {
        result.x = x;
        result.y = y;
        return result;
      } else {
        return {
          x: x,
          y: y,
        };
      }
    },
    fn: function (t: number, result: (x: number, y: number) => any) {
      const t2 = t * t;
      const t3 = t * t * t;
      const x = ax * t3 + bx * t2 + cx * t + dx;
      const y = ay * t3 + by * t2 + cy * t + dy;

      return result(x, y);
    },
  };
}

export default bezier;
