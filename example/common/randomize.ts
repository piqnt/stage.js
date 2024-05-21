type NumberFunction = (arg: any) => number;
type NumberOrNumberFunction = number | NumberFunction;

function toNumberFunction(value: NumberOrNumberFunction, fallback: number): NumberFunction {
  if (typeof value === "function") {
    return value;
  }
  if (typeof value === "number") {
    return function () {
      return value;
    };
  }
  return function () {
    return fallback;
  };
}

export default class Randomize<T> {
  _options: {
    value: T;
    weight: NumberFunction;
    xweight?: number;
  }[];
  _lock: T;
  constructor() {
    this._options = [];
  }
  /**
   * For debugging.
   */
  lock(option: T) {
    this._lock = option;
  }
  add(option: T, weight?: NumberOrNumberFunction) {
    weight = toNumberFunction(weight, 1);
    this._options.push({
      value: option,
      weight: weight,
    });
    return this;
  }
  select(select: number) {
    return this._options[select][0];
  }
  random(data?) {
    if (this._lock) {
      return this._lock;
    }

    let sum = 0;
    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      sum += option.xweight = option.weight(data);
    }

    let rand = Math.random() * sum;
    let selected;
    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      selected = option.value; // let last one be selected
      if ((rand -= option.xweight) < 0) {
        break;
      }
    }
    return selected;
  }
  test(a?: any, b?: any) {
    return true;
  }
  reset() {
    return this;
  }
  spacing(space: NumberOrNumberFunction) {
    space = toNumberFunction(space, 1);
    let next = 0;
    this.test = function (t, data) {
      t = typeof t === "number" ? t : 1;
      if (next == 0) {
        next = space(data);
        return false;
      }
      if ((next -= t) <= 0) {
        next = space(data);
        return true;
      }
      return false;
    };
    this.reset = function () {
      next = 0;
      return this;
    };
    return this;
  }
  prob(prob: NumberOrNumberFunction) {
    prob = toNumberFunction(prob, 1);
    this.test = function (data) {
      return Math.random() < prob(data) ? true : false;
    };
    return this;
  }
}
