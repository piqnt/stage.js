/** @internal */
function IDENTITY(x: any) {
  return x;
}

/**
 * Easing function formats are:
 * - [name]
 * - [name\]([params])
 * - [name]-[mode]
 * - [name]-[mode\]([params])
 *
 * Easing function names are 'linear', 'quad', 'cubic', 'quart', 'quint', 'sin' (or 'sine'), 'exp' (or 'expo'), 'circle' (or 'circ'), 'bounce', 'poly', 'elastic', 'back'.
 *
 * Easing modes are 'in', 'out', 'in-out', 'out-in'.
 *
 * For example, 'linear', 'cubic-in', and 'poly(2)'.
 */
export type EasingFunctionName = string;

export type EasingFunction = (p: number) => number;
/** @internal */
type EasingFunctionFactory = (...paras: any[]) => EasingFunction;

/** @internal */
type EasingMode = (f: EasingFunction) => EasingFunction;

/** @internal */
type EasingType =
  | {
      name: string;
      fn: EasingFunction;
    }
  | {
      name: string;
      fc: EasingFunctionFactory;
    };

/** @internal */ const LOOKUP_CACHE: Record<string, EasingFunction> = {};
/** @internal */ const MODE_BY_NAME: Record<string, EasingMode> = {};

// split this to functions and factories
/** @internal */ const EASE_BY_NAME: Record<string, EasingType> = {};

// todo: make easing names and list statics?
// todo: pass additional params as ...rest, instead of factories/curring? (`fc`)
// todo: simplify add functions as (name, fn)?

export class Easing {
  static get(
    token: EasingFunctionName | EasingFunction,
    fallback?: EasingFunction,
  ): EasingFunction {
    fallback = fallback || IDENTITY;
    if (typeof token === "function") {
      return token;
    }
    if (typeof token !== "string") {
      return fallback;
    }
    let easeFn = LOOKUP_CACHE[token];
    if (easeFn) {
      return easeFn;
    }
    const tokens = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(token);
    if (!tokens || !tokens.length) {
      return fallback;
    }

    const easeName = tokens[1];
    const easing = EASE_BY_NAME[easeName];

    const modeName = tokens[3];
    const modeFn = MODE_BY_NAME[modeName];

    const params = tokens[5];

    if (!easing) {
      easeFn = fallback;
    } else if ("fn" in easing && typeof easing.fn === "function") {
      easeFn = easing.fn;
    } else if ("fc" in easing && typeof easing.fc === "function") {
      const args = params ? params.replace(/\s+/, "").split(",") : undefined;
      easeFn = easing.fc.apply(easing.fc, args);
    } else {
      easeFn = fallback;
    }

    if (modeFn) {
      easeFn = modeFn(easeFn);
    }
    // TODO: It can be a memory leak with different `params`.
    LOOKUP_CACHE[token] = easeFn;

    return easeFn;
  }
}

/** @internal */
function addMode(name: string, fn: EasingMode) {
  MODE_BY_NAME[name] = fn;
}

/** @internal */
function addEaseFn(data: EasingType) {
  const names = data.name.split(/\s+/);
  for (let i = 0; i < names.length; i++) {
    const key = names[i];
    if (key) {
      EASE_BY_NAME[key] = data;
    }
  }
}

addMode("in", function (f: EasingFunction) {
  return f;
});

addMode("out", function (f: EasingFunction) {
  return function (t: number) {
    return 1 - f(1 - t);
  };
});

addMode("in-out", function (f: EasingFunction) {
  return function (t: number) {
    return t < 0.5 ? f(2 * t) / 2 : 1 - f(2 * (1 - t)) / 2;
  };
});

addMode("out-in", function (f: EasingFunction) {
  return function (t: number) {
    return t < 0.5 ? 1 - f(2 * (1 - t)) / 2 : f(2 * t) / 2;
  };
});

addEaseFn({
  name: "linear",
  fn: function (t: number) {
    return t;
  },
});

addEaseFn({
  name: "quad",
  fn: function (t: number) {
    return t * t;
  },
});

addEaseFn({
  name: "cubic",
  fn: function (t: number) {
    return t * t * t;
  },
});

addEaseFn({
  name: "quart",
  fn: function (t: number) {
    return t * t * t * t;
  },
});

addEaseFn({
  name: "quint",
  fn: function (t: number) {
    return t * t * t * t * t;
  },
});

addEaseFn({
  name: "sin sine",
  fn: function (t: number) {
    return 1 - Math.cos((t * Math.PI) / 2);
  },
});

addEaseFn({
  name: "exp expo",
  fn: function (t: number) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },
});

addEaseFn({
  name: "circle circ",
  fn: function (t: number) {
    return 1 - Math.sqrt(1 - t * t);
  },
});

addEaseFn({
  name: "bounce",
  fn: function (t: number) {
    return t < 1 / 2.75
      ? 7.5625 * t * t
      : t < 2 / 2.75
        ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
        : t < 2.5 / 2.75
          ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
          : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
});

addEaseFn({
  name: "poly",
  fc: function (e) {
    return function (t: number) {
      return Math.pow(t, e);
    };
  },
});

addEaseFn({
  name: "elastic",
  fc: function (a, p) {
    p = p || 0.45;
    a = a || 1;
    const s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    return function (t: number) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p);
    };
  },
});

addEaseFn({
  name: "back",
  fc: function (s) {
    s = typeof s !== "undefined" ? s : 1.70158;
    return function (t: number) {
      return t * t * ((s + 1) * t - s);
    };
  },
});
