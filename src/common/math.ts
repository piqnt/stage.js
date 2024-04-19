/** @internal */ const math_random = Math.random;
/** @internal */ const math_sqrt = Math.sqrt;

/** @internal */
export function random(min?: number, max?: number): number {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  return min == max ? min : math_random() * (max - min) + min;
}

/** @internal */
export function wrap(num: number, min?: number, max?: number): number {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
}

/** @internal */
export function clamp(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
}

/** @internal */
export function length(x: number, y: number): number {
  return math_sqrt(x * x + y * y);
}

export const math = Object.create(Math);

math.random = random;
math.wrap = wrap;
math.clamp = clamp;
math.length = length;

/** @hidden @deprecated @internal */
math.rotate = wrap;
/** @hidden @deprecated @internal */
math.limit = clamp;
