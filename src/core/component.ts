import stats from "../common/stats";
import { Matrix, Vec2Value } from "../common/matrix";
import { uid } from "../common/uid";
import { Memo } from "../common/memo";
import { getPixelRatio } from "../common/browser";

import { Pin, Pinned, FitMode } from "./pin";
import { Transition, TransitionOptions } from "./transition";
import { BasicLayoutManager, LayoutManagerInterface, LayoutObject } from "./layout";

import { EventManager } from "./event";

export interface ComponentVisitor {
  reverse?: boolean;
  visible?: boolean;
  start?: (component: Component, data?: any) => boolean | void;
  end?: (component: Component, data?: any) => boolean | void;
}

export type ComponentTickListener = (
  this: Component,
  elapsed: number,
  now: number,
  last: number,
) => boolean | void;

export type ComponentEventListener<T> = (this: T, ...args: any[]) => void;

// todo: don't need to check if initialized (array, object, etc) fields are initialized

/** @internal */ let REVISION = 0;

export class Component implements LayoutObject {
  /** @hidden */ layoutManager: LayoutManagerInterface = BasicLayoutManager.instance;

  /** @internal */ eventManager: EventManager = EventManager.instance;

  /** @internal */ uid = "component:" + uid();

  private _visible = true;
  private _label = "";
  private _attrs: Record<string, any> = {};

  // todo: remove this
  /** @hidden @deprecated */
  MAX_ELAPSE = Infinity;

  // todo: find a better way to track updates
  /** @internal */ _revision = ++REVISION;

  // EventManager
  /** @internal */ __listeners: Record<string, ComponentEventListener<this>[]> = {};
  /** @internal */ __flags: Record<string, number> = {};
  /** @internal */ __tickBefore: ComponentTickListener[] = [];
  /** @internal */ __tickAfter: ComponentTickListener[] = [];

  // LayoutManager
  /** @internal */ __parent: Component | null = null;
  /** @internal */ __next: Component | null = null;
  /** @internal */ __prev: Component | null = null;
  /** @internal */ __first: Component | null = null;
  /** @internal */ __last: Component | null = null;

  /** @internal */ __pin = new Pin(this);
  /** @internal */ __layoutTicker?: () => void;

  /** @internal */ __abs_matrix = new Matrix();
  /** @internal */ __rel_matrix = new Matrix();
  /** @internal */ __memo_abs_matrix = Memo.init();

  /** @internal */ __memo_align_touch = Memo.init();
  /** @internal */ __memo_align_children = Memo.init();
  /** @internal */ __memo_minimize_touch = Memo.init();

  // TransitionManager
  /** @internal */ __transitions: Transition[] = [];

  /** @internal */
  getPixelRatio() {
    // todo: parent matrix is not available in the first call
    const m = this.parent()?.matrix();
    // todo: why "divide by" pixel ratio
    const pixelRatio = !m ? 1 : Math.max(Math.abs(m.a), Math.abs(m.b)) / getPixelRatio();
    return pixelRatio;
  }

  toString() {
    return "[" + this._label + "]";
  }

  /** @deprecated Use label() */
  id(id: string) {
    return this.label(id);
  }

  label(label: string): this;
  label(): string;
  label(label?: string): string | this {
    if (typeof label === "undefined") {
      return this._label;
    }
    this._label = label;
    return this;
  }

  attr(key: string, value: any): this;
  attr(key: string): any;
  attr(key: string, value?: any) {
    if (typeof value === "undefined") {
      return this._attrs !== null ? this._attrs[key] : undefined;
    }
    (this._attrs !== null ? this._attrs : (this._attrs = {}))[key] = value;
    return this;
  }

  /**
   * Updates the revision/timestamp of this component and its parents.
   * This is used internally for component tree lifecycle management, such as updating the rendering.
   */
  touch() {
    this._revision = ++REVISION;
    this.parent() && this.parent().touch();
    return this;
  }

  /** @internal */
  updateChildDeepFlags(child: Component, value: boolean): void {
    this.eventManager.updateChildDeepFlags(this, child, value);
  }

  /** @internal */
  updateDeepFlag(key: string, value: boolean): void {
    this.eventManager.updateDeepFlag(this, key, value);
  }

  /** @internal */
  evalDeepFlag(key: string): number {
    return this.eventManager.evalDeepFlag(this, key);
  }

  /** @internal */
  tickTree(elapsed: number, now: number, last: number) {
    if (!this.visible()) {
      return;
    }

    if (elapsed > this.MAX_ELAPSE) {
      elapsed = this.MAX_ELAPSE;
    }

    let ticked = false;

    if (this.__tickBefore !== null) {
      for (let i = 0; i < this.__tickBefore.length; i++) {
        stats.tick++;
        const tickFn = this.__tickBefore[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }

    let child: Component | null;
    let next = this.first();
    while ((child = next)) {
      next = child.next();
      if (child.evalDeepFlag("tickTree")) {
        ticked = child.tickTree(elapsed, now, last) === true ? true : ticked;
      }
    }

    if (this.__tickAfter !== null) {
      for (let i = 0; i < this.__tickAfter.length; i++) {
        stats.tick++;
        const tickFn = this.__tickAfter[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }

    return ticked;
  }

  tick(callback: ComponentTickListener, before = false) {
    if (typeof callback !== "function") {
      return;
    }
    if (before) {
      if (this.__tickBefore === null) {
        this.__tickBefore = [];
      }
      this.__tickBefore.push(callback);
    } else {
      if (this.__tickAfter === null) {
        this.__tickAfter = [];
      }
      this.__tickAfter.push(callback);
    }
    const hasTickListener = this.__tickAfter?.length > 0 || this.__tickBefore?.length > 0;
    this.updateDeepFlag("tickTree", hasTickListener);
  }

  untick(callback: ComponentTickListener) {
    if (typeof callback !== "function") {
      return;
    }
    if (this.__tickBefore) {
      const index = this.__tickBefore.indexOf(callback);
      if (index >= 0) {
        this.__tickBefore.splice(index, 1);
      }
    }
    if (this.__tickAfter) {
      const index = this.__tickAfter.indexOf(callback);
      if (index >= 0) {
        this.__tickAfter.splice(index, 1);
      }
    }
  }

  timeout(callback: () => any, time: number) {
    this.setTimeout(callback, time);
  }

  setTimeout(callback: () => any, time: number) {
    function timer(t: number) {
      if ((time -= t) < 0) {
        this.untick(timer);
        callback.call(this);
      } else {
        return true;
      }
    }
    this.tick(timer);
    return timer;
  }

  clearTimeout(timer: ComponentTickListener) {
    this.untick(timer);
  }

  on(types: string, listener: ComponentEventListener<this>): this;
  /** @hidden @deprecated @internal */
  on(types: string[], listener: ComponentEventListener<this>): this;
  on(type: string | string[], listener: ComponentEventListener<this>) {
    if (!type || !type.length || typeof listener !== "function") {
      return this;
    }
    if (typeof type !== "string" && typeof type.join === "function") {
      // deprecated arguments, type is array
      for (let i = 0; i < type.length; i++) {
        this.on(type[i], listener);
      }
    } else if (typeof type === "string" && type.indexOf(" ") > -1) {
      // deprecated arguments, type is spaced string
      type = type.match(/\S+/g);
      for (let i = 0; i < type.length; i++) {
        this.eventManager.on(this, type[i], listener);
      }
    } else if (typeof type === "string") {
      this.eventManager.on(this, type, listener);
    } else {
      // invalid
    }
    return this;
  }

  off(types: string, listener: ComponentEventListener<this>): this;
  /** @hidden @deprecated @internal */
  off(types: string[], listener: ComponentEventListener<this>): this;
  off(type: string | string[], listener: ComponentEventListener<this>) {
    if (!type || !type.length || typeof listener !== "function") {
      return this;
    }
    if (typeof type !== "string" && typeof type.join === "function") {
      // deprecated arguments, type is array
      for (let i = 0; i < type.length; i++) {
        this.off(type[i], listener);
      }
    } else if (typeof type === "string" && type.indexOf(" ") > -1) {
      // deprecated arguments, type is spaced string
      type = type.match(/\S+/g);
      for (let i = 0; i < type.length; i++) {
        this.eventManager.off(this, type[i], listener);
      }
    } else if (typeof type === "string") {
      this.eventManager.off(this, type, listener);
    } else {
      // invalid
    }
    return this;
  }

  listeners(type: string) {
    return this.eventManager.listeners(this, type);
  }

  publish(name: string, args?: any) {
    return this.eventManager.publish(this, name, args);
  }

  /** @hidden @deprecated @internal */
  trigger(name: string, args?: any) {
    this.publish(name, args);
    return this;
  }

  visit(visitor: ComponentVisitor, payload?: any): boolean | void {
    const reverse = visitor.reverse;
    const visible = visitor.visible;
    if (visitor.start && visitor.start(this, payload)) {
      return;
    }
    let child: Component;
    let next = reverse ? this.last(visible) : this.first(visible);
    while ((child = next)) {
      next = reverse ? child.prev(visible) : child.next(visible);
      if (child.visit(visitor, payload)) {
        return true;
      }
    }
    return visitor.end && visitor.end(this, payload);
  }

  prerenderTree() {
    if (!this.visible()) {
      return;
    }

    this.prerender();

    let child: Component;
    let next = this.first();
    while ((child = next)) {
      next = child.next();
      child.prerenderTree();
    }
  }

  prerender() {}

  renderTree(context: CanvasRenderingContext2D) {
    if (!this.visible()) {
      return;
    }

    const globalAlpha = context.globalAlpha;

    const componentAlpha = this.layoutManager.getTransparency(this) * globalAlpha;
    // todo: move texture transparency rendering logic
    const textureAlpha = this.layoutManager.getTextureTransparency(this) * componentAlpha;

    const m = this.matrix();
    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

    if (context.globalAlpha != textureAlpha) {
      context.globalAlpha = textureAlpha;
    }
    this.render(context);

    let child: Component;
    let next = this.first();
    while ((child = next)) {
      next = child.next();

      if (context.globalAlpha != componentAlpha) {
        context.globalAlpha = componentAlpha;
      }

      child.renderTree(context);
    }

    if (context.globalAlpha != globalAlpha) {
      context.globalAlpha = globalAlpha;
    }
  }

  render(context: CanvasRenderingContext2D) {}

  visible(visible: boolean): this;
  visible(): boolean;
  visible(visible?: boolean) {
    if (typeof visible === "undefined") {
      return this._visible;
    }
    this._visible = visible;
    // if (this.parent()) {
    //   this.parent()._ts_children = ++revision.component;
    // }
    this.touch();
    return this;
  }

  hide() {
    this.visible(false);
    return this;
  }

  show() {
    this.visible(true);
    return this;
  }

  parent(): Component {
    return this.layoutManager.getParent(this) as Component;
  }
  setParent(parent: Component) {
    this.layoutManager.setParent(this, parent);
  }

  first(visible?: boolean): Component {
    return this.layoutManager.getFirst(this, visible) as Component;
  }
  setFirst(first: Component) {
    this.layoutManager.setFirst(this, first);
  }

  last(visible?: boolean): Component {
    return this.layoutManager.getLast(this, visible) as Component;
  }
  setLast(last: Component) {
    this.layoutManager.setLast(this, last);
  }

  next(visible?: boolean): Component {
    return this.layoutManager.getNext(this, visible) as Component;
  }
  setNext(next: Component) {
    this.layoutManager.setNext(this, next);
  }

  prev(visible?: boolean): Component {
    return this.layoutManager.getPrev(this, visible) as Component;
  }
  setPrev(prev: Component) {
    this.layoutManager.setPrev(this, prev);
  }

  append(...child: Component[]): this;
  append(child: Component[]): this;
  append(child: Component | Component[], more?: Component) {
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        this.layoutManager.append(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = 0; i < arguments.length; i++) {
        this.layoutManager.append(this, arguments[i]);
      }
    } else if (typeof child !== "undefined") {
      this.layoutManager.append(this, child);
    }

    return this;
  }

  prepend(...child: Component[]): this;
  prepend(child: Component[]): this;
  prepend(child: Component | Component[], more?: Component) {
    if (Array.isArray(child)) {
      for (let i = child.length - 1; i >= 0; i--) {
        this.layoutManager.prepend(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = arguments.length - 1; i >= 0; i--) {
        this.layoutManager.prepend(this, arguments[i]);
      }
    } else if (typeof child !== "undefined") {
      this.layoutManager.prepend(this, child);
    }

    return this;
  }

  appendTo(parent: Component) {
    this.layoutManager.append(parent, this);
    return this;
  }

  prependTo(parent: Component) {
    this.layoutManager.prepend(parent, this);
    return this;
  }

  insertNext(sibling: Component, more?: Component) {
    if (Array.isArray(sibling)) {
      for (let i = 0; i < sibling.length; i++) {
        this.layoutManager.insertAfter(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = 0; i < arguments.length; i++) {
        this.layoutManager.insertAfter(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      this.layoutManager.insertAfter(sibling, this);
    }

    return this;
  }

  insertPrev(sibling: Component, more?: Component) {
    if (Array.isArray(sibling)) {
      for (let i = sibling.length - 1; i >= 0; i--) {
        this.layoutManager.insertBefore(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = arguments.length - 1; i >= 0; i--) {
        this.layoutManager.insertBefore(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      this.layoutManager.insertBefore(sibling, this);
    }

    return this;
  }

  insertAfter(prev: Component) {
    this.layoutManager.insertAfter(this, prev);
    return this;
  }

  insertBefore(next: Component) {
    this.layoutManager.insertBefore(this, next);
    return this;
  }

  remove(child?: Component, more?: any) {
    if (typeof child !== "undefined") {
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          this.layoutManager.remove(child[i]);
        }
      } else if (typeof more !== "undefined") {
        for (let i = 0; i < arguments.length; i++) {
          this.layoutManager.remove(arguments[i]);
        }
      } else {
        this.layoutManager.remove(child);
      }
      return this;
    }

    this.layoutManager.remove(this);
    return this;
  }

  empty() {
    this.layoutManager.empty(this);
    return this;
  }

  onChildAdded(child: Component) {
    this.updateChildDeepFlags(child as any as Component, true);
  }

  onChildRemoved(child: Component) {
    this.updateChildDeepFlags(child as any as Component, false);
  }

  /** @hidden used by parent for row/column, and parent minimize */
  getBoxWidth(): number {
    return this.layoutManager.getBoxWidth(this);
  }

  /** @hidden used by parent for row/column, and parent minimize */
  getBoxHeight(): number {
    return this.layoutManager.getBoxHeight(this);
  }

  /** @hidden used by child for maximize, and pin align */
  getWidth(): number {
    return this.layoutManager.getWidth(this);
  }

  /** @hidden used by child for maximize, and pin align */
  getHeight(): number {
    return this.layoutManager.getHeight(this);
  }

  /** @hidden used by parent for layout alignment */
  setOffsetX(value: number): void {
    this.layoutManager.setOffsetX(this, value);
  }

  /** @hidden used by parent for layout alignment */
  setOffsetY(value: number): void {
    this.layoutManager.setOffsetY(this, value);
  }

  /** @hidden used by parent for layout alignment */
  setAlignX(value: number): void {
    this.layoutManager.setAlignX(this, value);
  }

  /** @hidden used by parent for layout alignment */
  setAlignY(value: number): void {
    this.layoutManager.setAlignY(this, value);
  }

  /** @internal */
  hitTest(hit: Vec2Value) {
    const width = this.getWidth();
    const height = this.getHeight();
    return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
  }

  matrix(relative = false) {
    const relativeMatrix = this.layoutManager.getTransform(this);

    if (relative === true) {
      this.__rel_matrix.reset(relativeMatrix);
      return this.__rel_matrix;
    }

    const parent = this.parent();

    if (!parent) {
      this.__abs_matrix.reset(relativeMatrix);
      return this.__abs_matrix;
    }

    const parentMatrix = parent.matrix();

    if (
      this.__memo_abs_matrix.recall(
        relativeMatrix.a,
        relativeMatrix.b,
        relativeMatrix.c,
        relativeMatrix.d,
        relativeMatrix.e,
        relativeMatrix.f,
        parentMatrix.a,
        parentMatrix.b,
        parentMatrix.c,
        parentMatrix.d,
        parentMatrix.e,
        parentMatrix.f,
      )
    ) {
      return this.__abs_matrix;
    }

    this.__abs_matrix.reset(relativeMatrix);
    this.__abs_matrix.concat(parentMatrix);

    // this.__abs_matrix.a = relativeMatrix.a * parentMatrix.a + relativeMatrix.b * parentMatrix.c;
    // this.__abs_matrix.b = relativeMatrix.b * parentMatrix.d + relativeMatrix.a * parentMatrix.b;
    // this.__abs_matrix.c = relativeMatrix.c * parentMatrix.a + relativeMatrix.d * parentMatrix.c;
    // this.__abs_matrix.d = relativeMatrix.d * parentMatrix.d + relativeMatrix.c * parentMatrix.b;
    // this.__abs_matrix.e = relativeMatrix.e * parentMatrix.a + parentMatrix.e + relativeMatrix.f * parentMatrix.c;
    // this.__abs_matrix.f = relativeMatrix.f * parentMatrix.d + parentMatrix.f + relativeMatrix.e * parentMatrix.b;

    return this.__abs_matrix;
  }

  // relative to parent
  getTransform() {
    return this.layoutManager.getTransform(this);
  }

  pin(key: string): any;
  pin(key: string, value: any): this;
  pin(obj: object): this;
  pin(): Pin;
  pin(a?: object | string, b?: any) {
    if (typeof a === "object") {
      // this._pin.set(a);
      this.layoutManager.updatePin(this, a);
      return this;
    } else if (typeof a === "string") {
      if (typeof b === "undefined") {
        // return this._pin.get(a);
        return this.layoutManager.getPinProp(this, a);
      } else {
        // this._pin.set(a, b);
        this.layoutManager.setPinProp(this, a, b);
        return this;
      }
    } else if (typeof a === "undefined") {
      // this._pin;
      return this.layoutManager.getPin(this);
    }
  }

  fit(width: number, height: number, mode?: FitMode): this;
  fit(fit: { width: number; height: number }): this;
  fit(a, b?, c?) {
    if (typeof a === "object") {
      c = b;
      b = a.height;
      a = a.width;
    }
    this.layoutManager.fit(this, a, b, c);
    return this;
  }

  /** @hidden @deprecated Use fit */
  scaleTo(a, b?, c?): this {
    return this.fit(a, b, c);
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
  offset(a?: Vec2Value | number, b?: number) {
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
  skew(x: number, y?: number): this;
  skew(a?: Vec2Value | number, b?: number) {
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
  scale(x: number, y?: number): this;
  scale(a: Vec2Value | number, b?: number) {
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

  /** Set padding layout */
  padding(value: number): this;
  /** Get padding. */
  padding(): number;
  padding(value?: number) {
    if (typeof value === "undefined") {
      return this.pin("padding");
    }
    this.pin("padding", value);
    return this;
  }

  /** Set spacing for row, column, monotype */
  spacing(value: number): this;
  /** Get spacing */
  spacing(): number;
  spacing(value?: number) {
    if (typeof value === "undefined") {
      return this.pin("spacing");
    }
    this.pin("spacing", value);
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

  tween(): Transition;
  tween(opts: TransitionOptions): Transition;
  tween(duration: number, delay?: number, append?: boolean): Transition;
  tween(duration: number): Transition;
  tween(a?: object | number, b?: number, c?: boolean) {
    let options: TransitionOptions;
    if (typeof a === "object" && a !== null) {
      options = a;
    } else {
      options = {};
      if (typeof a === "number") {
        options.duration = a;
        if (typeof b === "number") {
          options.delay = b;
          if (typeof c === "boolean") {
            options.append = c;
          }
        } else if (typeof b === "boolean") {
          options.append = b;
        }
      } else if (typeof a === "boolean") {
        options.append = a;
      }
    }

    if (!this.__transitionTickInitied) {
      this.tick(this.__transitionTick, true);
      this.__transitionTickInitied = true;
    }

    this.touch();

    // todo: what is the expected default behavior?
    if (!options.append) {
      this.__transitions.length = 0;
    }

    const transition = new Transition(this, options);
    this.__transitions.push(transition);
    return transition;
  }

  /** @internal */ __transitionTickInitied = false;
  /** @internal */ __transitionTickLastTime = 0;
  /** @internal */
  __transitionTick = (elapsed: number, now: number, last: number) => {
    if (!this.__transitions.length) {
      return false;
    }

    // ignore untracked tick
    const ignore = this.__transitionTickLastTime !== last;
    this.__transitionTickLastTime = now;
    if (ignore) {
      return true;
    }

    const head = this.__transitions[0];

    const ended = head.tick(this, elapsed, now, last);

    // todo: move this logic to TransitionQueue
    if (ended) {
      if (head === this.__transitions[0]) {
        this.__transitions.shift();
      }
      const next = head.finish();
      if (next) {
        this.__transitions.unshift(next);
      }
    }

    return true;
  };

  row(align: number) {
    this.layoutManager.align(this, "row", align);
    return this;
  }

  column(align: number) {
    this.layoutManager.align(this, "column", align);
    return this;
  }

  /** @deprecated Use minimize() */
  box() {
    return this.minimize();
  }

  /** @deprecated Use minimize() */
  layer() {
    return this.maximize();
  }

  /** Set size to match largest child size. */
  minimize() {
    this.layoutManager.minimize(this);
    return this;
  }

  /** Set size to match parent size. */
  maximize() {
    this.layoutManager.maximize(this);
    return this;
  }
}

/** @deprecated Use component() */
export function create() {
  return component();
}

/** @internal Use component() */
export function layout() {
  return component();
}

export function component() {
  return new Component();
}

/** @deprecated Use maximize() */
export function layer() {
  return maximize();
}

/** @deprecated Use minimize() */
export function box() {
  return minimize();
}

export function row(align?: number) {
  return component().row(align).label("Row");
}

export function column(align?: number) {
  return component().column(align).label("Column");
}

export function minimize() {
  return component().minimize().label("Minimize");
}

export function maximize() {
  return component().maximize().label("Maximize");
}
