import { Vec2Value } from "../common/matrix";
import { uid } from "../common/uid";

import { Easing, EasingFunction, EasingFunctionName } from "./easing";
import { Component } from "./component";
import { Pinned } from "./pin";

export type TransitionOptions = {
  duration?: number;
  delay?: number;
  append?: boolean;
};

export type TransitionEndListener = (this: Component) => void;

export class Transition implements Pinned {
  /** @internal */ uid = "transition:" + uid();

  /** @internal */ _end: object;
  /** @internal */ _start: object;

  /** @internal */ _ending: TransitionEndListener[] = [];

  /** @internal */ _duration: number;
  /** @internal */ _delay: number;

  /** @internal */ _owner: Component;

  /** @internal */ _time: number;

  /** @internal */ _easing: any;
  /** @internal */ _next: any;

  /** @internal */ _hide: boolean;
  /** @internal */ _remove: boolean;

  constructor(owner: Component, options: TransitionOptions = {}) {
    this._end = {};
    this._duration = options.duration || 400;
    this._delay = options.delay || 0;

    this._owner = owner;
    this._time = 0;
  }

  /** @internal */
  tick(component: Component, elapsed: number, now: number, last: number) {
    this._time += elapsed;

    if (this._time < this._delay) {
      return;
    }

    const time = this._time - this._delay;

    if (!this._start) {
      this._start = {};
      for (const key in this._end) {
        this._start[key] = this._owner.pin(key);
      }
    }

    let p = Math.min(time / this._duration, 1);
    const ended = p >= 1;

    if (typeof this._easing == "function") {
      p = this._easing(p);
    }

    const q = 1 - p;

    for (const key in this._end) {
      this._owner.pin(key, this._start[key] * q + this._end[key] * p);
    }

    return ended;
  }

  /** @internal */
  finish() {
    this._ending.forEach((callback: TransitionEndListener) => {
      try {
        callback.call(this._owner);
      } catch (e) {
        console.error(e);
      }
    });
    return this._next;
  }

  tween(opts?: TransitionOptions): Transition;
  tween(duration?: number, delay?: number): Transition;
  tween(a?: object | number, b?: number) {
    let options: TransitionOptions;
    if (typeof a === "object" && a !== null) {
      options = a;
    } else {
      options = {};
      if (typeof a === "number") {
        options.duration = a;
        if (typeof b === "number") {
          options.delay = b;
        }
      }
    }

    return (this._next = new Transition(this._owner, options));
  }

  duration(duration: number) {
    this._duration = duration;
    return this;
  }

  delay(delay: number) {
    this._delay = delay;
    return this;
  }

  ease(easing: EasingFunctionName | EasingFunction) {
    this._easing = Easing.get(easing);
    return this;
  }

  done(fn: TransitionEndListener) {
    this._ending.push(fn);
    return this;
  }

  hide() {
    this._ending.push(function () {
      this.hide();
    });
    this._hide = true;
    return this;
  }

  remove() {
    this._ending.push(function () {
      this.remove();
    });
    this._remove = true;
    return this;
  }

  pin(key: string, value: any): this;
  pin(obj: object): this;
  pin(key: string): any;
  pin(a?, b?) {
    if (typeof a === "object") {
      for (const attr in a) {
        pinning(this._owner, this._end, attr, a[attr]);
      }
    } else if (typeof b !== "undefined") {
      pinning(this._owner, this._end, a, b);
    }
    return this;
  }

  /**
   *  @hidden @deprecated Use .done(fn) instead.
   */
  then(fn: TransitionEndListener) {
    this.done(fn);
    return this;
  }

  /**
   *  @hidden @deprecated this doesn't do anything anymore, call transition on the component instead.
   */
  clear(forward: boolean) {
    return this;
  }

  size(w: number, h: number) {
    // Pin shortcut, used by Transition and Component
    this.pin("width", w);
    this.pin("height", h);
    return this;
  }

  width(w: number): this;
  width(): number;
  width(w?: number) {
    // Pin shortcut, used by Transition and Component
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  }

  height(h: number): this;
  height(): number;
  height(h?: number) {
    // Pin shortcut, used by Transition and Component
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  }

  offset(value: Vec2Value): this;
  offset(x: number, y: number): this;
  offset(a: number | Vec2Value, b?: number) {
    // Pin shortcut, used by Transition and Component
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    }
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  }

  rotate(a: number) {
    // Pin shortcut, used by Transition and Component
    this.pin("rotation", a);
    return this;
  }

  skew(value: Vec2Value): this;
  skew(x: number, y: number): this;
  skew(a: number | Vec2Value, b?: number) {
    // Pin shortcut, used by Transition and Component
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    } else if (typeof b === "undefined") {
      b = a;
    }
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  }

  scale(value: Vec2Value): this;
  scale(x: number, y: number): this;
  scale(s: number): this;
  scale(a: number | Vec2Value, b?: number) {
    // Pin shortcut, used by Transition and Component
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    } else if (typeof b === "undefined") {
      b = a;
    }
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  }

  alpha(a: number, ta?: number) {
    // Pin shortcut, used by Transition and Component
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  }
}

/** @internal */
function pinning(component: Component, map: object, key: string, value: number) {
  if (typeof component.pin(key) === "number") {
    map[key] = value;
  } else if (typeof component.pin(key + "X") === "number" && typeof component.pin(key + "Y") === "number") {
    map[key + "X"] = value;
    map[key + "Y"] = value;
  }
}
