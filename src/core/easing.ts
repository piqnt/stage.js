/** @internal */
export const IDENTITY = (x: any) => {
  return x;
};

export type EasingFunctionQuery = string;

export type EasingFunction = (p: number) => number;

/** @internal */
type EasingFactories = (...params: any[]) => EasingFunction;

// todo: pass additional params as ...rest, instead of factories/curring? (`fc`)

export class Easing {
  static init(
    query: EasingName | EasingFunctionQuery | EasingFunction,
    params?: number[],
  ): EasingFunction | undefined {
    if (typeof query === "function") return query;
    if (typeof query !== "string") return undefined;

    let easing: EasingFunction;
    if (query.indexOf("(") === -1) {
      easing = initEasing(query, params);
    } else {
      const tokens = /^((\w|-)+)?(\((.*)\))?$/i.exec(query);
      if (tokens || tokens.length) {
        const name2 = tokens[1];
        const params2 = JSON.parse("[" + tokens[4] + "]") as number[];
        easing = initEasing(name2, params2);
      }
    }

    return easing;
  }
}

/** @internal */
const initEasing = (query: string, params?: number[]): EasingFunction => {
  let easing: EasingFunction;
  const easingFunction = EasingFunctions[query];
  const easingFactory = EasingFactories[query];
  if (easingFunction) {
    easing = easingFunction;
  } else if (easingFactory) {
    if (params) {
      easing = easingFactory.apply(null, params);
    } else {
      easing = easingFactory();
    }
  }
  return easing;
};

/** @internal */ const out = (f: EasingFunction) => (t: number) => 1 - f(1 - t);
/** @internal */ const inOut = (f: EasingFunction) => (t: number) =>
  t < 0.5 ? f(2 * t) / 2 : 1 - f(2 * (1 - t)) / 2;
/** @internal */ const outIn = (f: EasingFunction) => (t: number) =>
  t < 0.5 ? 1 - f(2 * (1 - t)) / 2 : f(2 * t) / 2;

/** @internal */ const linear: EasingFunction = (t: number) => t;
/** @internal */ const quad: EasingFunction = (t: number) => t * t;
/** @internal */ const cubic: EasingFunction = (t: number) => t * t * t;
/** @internal */ const quart: EasingFunction = (t: number) => t * t * t * t;
/** @internal */ const quint: EasingFunction = (t: number) => t * t * t * t * t;
/** @internal */ const sin: EasingFunction = (t: number) => 1 - Math.cos((t * Math.PI) / 2);
/** @internal */ const exp: EasingFunction = (t: number) =>
  t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
/** @internal */ const circle: EasingFunction = (t: number) => 1 - Math.sqrt(1 - t * t);
/** @internal */ const bounce: EasingFunction = (t: number) =>
  t < 1 / 2.75
    ? 7.5625 * t * t
    : t < 2 / 2.75
      ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
      : t < 2.5 / 2.75
        ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
        : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;

/** @internal */ const poly =
  (e: number = 3): EasingFunction =>
  (t: number) =>
    Math.pow(t, e);

/** @internal */ const elastic = (a: number = 1, p: number = 0.45): EasingFunction => {
  /** @internal */ const s = (p / (2 * Math.PI)) * Math.asin(1 / a);
  return (t: number) => 1 + a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p);
};

/** @internal */ const back = (s: number = 1.70158): EasingFunction => {
  return (t: number) => t * t * ((s + 1) * t - s);
};

/** @internal */ const EasingFunctions = {
  "linear": linear,
  "linear-in": linear,
  "linear-out": out(linear),
  "linear-in-out": inOut(linear),
  "linear-out-in": outIn(linear),
  "quad": quad,
  "quad-in": quad,
  "quad-out": out(quad),
  "quad-in-out": inOut(quad),
  "quad-out-in": outIn(quad),
  "cubic": cubic,
  "cubic-in": cubic,
  "cubic-out": out(cubic),
  "cubic-in-out": inOut(cubic),
  "cubic-out-in": outIn(cubic),
  "quart": quart,
  "quart-in": quart,
  "quart-out": out(quart),
  "quart-in-out": inOut(quart),
  "quart-out-in": outIn(quart),
  "quint": quint,
  "quint-in": quint,
  "quint-out": out(quint),
  "quint-in-out": inOut(quint),
  "quint-out-in": outIn(quint),
  "sin": sin,
  "sin-in": sin,
  "sin-out": out(sin),
  "sin-in-out": inOut(sin),
  "sin-out-in": outIn(sin),
  "sine": sin,
  "sine-in": sin,
  "sine-out": out(sin),
  "sine-in-out": inOut(sin),
  "sine-out-in": outIn(sin),
  "exp": exp,
  "exp-in": exp,
  "exp-out": out(exp),
  "exp-in-out": inOut(exp),
  "exp-out-in": outIn(exp),
  "expo": exp,
  "expo-in": exp,
  "expo-out": out(exp),
  "expo-in-out": inOut(exp),
  "expo-out-in": outIn(exp),
  "circle": circle,
  "circle-in": circle,
  "circle-out": out(circle),
  "circle-in-out": inOut(circle),
  "circle-out-in": outIn(circle),
  "circ": circle,
  "circ-in": circle,
  "circ-out": out(circle),
  "circ-in-out": inOut(circle),
  "circ-out-in": outIn(circle),
  "bounce": bounce,
  "bounce-in": bounce,
  "bounce-out": out(bounce),
  "bounce-in-out": inOut(bounce),
  "bounce-out-in": outIn(bounce),
};

/** @internal */ const EasingFactories = {
  "poly": poly,
  "poly-in": poly,
  "poly-out": (e: number) => out(poly(e)),
  "poly-in-out": (e: number) => inOut(poly(e)),
  "poly-out-in": (e: number) => outIn(poly(e)),
  "elastic": elastic,
  "elastic-in": elastic,
  "elastic-out": (a: number, p: number) => out(elastic(a, p)),
  "elastic-in-out": (a: number, p: number) => inOut(elastic(a, p)),
  "elastic-out-in": (a: number, p: number) => outIn(elastic(a, p)),
  "back": back,
  "back-in": back,
  "back-out": (s: number) => out(back(s)),
  "back-in-out": (s: number) => inOut(back(s)),
  "back-out-in": (s: number) => outIn(back(s)),
};

export type EasingName =
  | "linear"
  | "linear-in"
  | "linear-out"
  | "linear-in-out"
  | "linear-out-in"
  | "quad"
  | "quad-in"
  | "quad-out"
  | "quad-in-out"
  | "quad-out-in"
  | "cubic"
  | "cubic-in"
  | "cubic-out"
  | "cubic-in-out"
  | "cubic-out-in"
  | "quart"
  | "quart-in"
  | "quart-out"
  | "quart-in-out"
  | "quart-out-in"
  | "quint"
  | "quint-in"
  | "quint-out"
  | "quint-in-out"
  | "quint-out-in"
  | "sin"
  | "sin-in"
  | "sin-out"
  | "sin-in-out"
  | "sin-out-in"
  | "sine"
  | "sine-in"
  | "sine-out"
  | "sine-in-out"
  | "sine-out-in"
  | "exp"
  | "exp-in"
  | "exp-out"
  | "exp-in-out"
  | "exp-out-in"
  | "expo"
  | "expo-in"
  | "expo-out"
  | "expo-in-out"
  | "expo-out-in"
  | "circle"
  | "circle-in"
  | "circle-out"
  | "circle-in-out"
  | "circle-out-in"
  | "circ"
  | "circ-in"
  | "circ-out"
  | "circ-in-out"
  | "circ-out-in"
  | "bounce"
  | "bounce-in"
  | "bounce-out"
  | "bounce-in-out"
  | "bounce-out-in"
  | "poly"
  | "poly-in"
  | "poly-out"
  | "poly-in-out"
  | "poly-out-in"
  | "elastic"
  | "elastic-in"
  | "elastic-out"
  | "elastic-in-out"
  | "elastic-out-in"
  | "back"
  | "back-in"
  | "back-out"
  | "back-in-out"
  | "back-out-in";
