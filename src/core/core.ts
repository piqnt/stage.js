import stats from "../common/stats";
import { Vec2Value } from "../common/matrix";
import { uid } from "../common/uid";
import { getDevicePixelRatio } from "../common/browser";

import { Pin, Pinned, FitMode } from "./pin";
import { Transition, TransitionOptions } from "./transition";

// todo: why there are two iids (other in pin)?
/** @internal */
let iid = 0;
stats.create = 0;

/** @internal */
function assertType<T>(obj: T): T {
  if (obj && obj instanceof Node) {
    return obj;
  }
  throw "Invalid node: " + obj;
}

interface NodeVisitor<D> {
  reverse?: boolean;
  visible?: boolean;
  start?: (node: Node, data?: D) => boolean | void;
  end?: (node: Node, data?: D) => boolean | void;
}

export type NodeTickListener<T> = (
  this: T,
  elapsed: number,
  now: number,
  last: number,
) => boolean | void;

export type NodeEventListener<T> = (this: T, ...args: any[]) => void;

/** @deprecated Use layout() */
export function create() {
  return layout();
}

/** @deprecated Use maximize() */
export function layer() {
  return maximize();
}

/** @deprecated Use minimize() */
export function box() {
  return minimize();
}

// todo: create a new subclass called layout, and make node abstract
// discussion: in some cases sprites are used as parent node, like a window

export function layout() {
  return new Node();
}

export function row(align: number) {
  return layout().row(align).label("Row");
}

export function column(align: number) {
  return layout().column(align).label("Column");
}

export function minimize() {
  return layout().minimize().label("Minimize");
}

export function maximize() {
  return layout().maximize().label("Maximize");
}

// TODO: do not clear next/prev/parent on remove (why?)

// There are three sets of core functions:
// - tree model manipulation functions
// - frame loop and rendering
// - events handling

export class Node implements Pinned {
  /** @internal */ uid = "node:" + uid();

  /** @internal */ _label = "";

  /** @internal */ _parent: Node | null = null;
  /** @internal */ _next: Node | null = null;
  /** @internal */ _prev: Node | null = null;

  /** @internal */ _first: Node | null = null;
  /** @internal */ _last: Node | null = null;

  /** @internal */ _visible = true;

  // this is computed on every render, and used by children
  /** @internal */ _alpha: number = 1;

  /** @internal */ _padding: number = 0;
  /** @internal */ _spacing: number = 0;

  /** @internal */ _pin = new Pin(this);

  /** @internal */ _ts_pin: number;
  /** @internal */ _ts_parent: number;
  /** @internal */ _ts_children: number;
  /** @internal */ _ts_touch: number;

  // todo: don't need to check if these fields are initialized anymore
  /** @internal */ _listeners: Record<string, NodeEventListener<Node>[]> = {};
  /** @internal */ _attrs: Record<string, any> = {};
  /** @internal */ _flags: Record<string, any> = {};
  /** @internal */ _transitions: Transition[] = [];

  /** @internal */ _tickBefore: NodeTickListener<any>[] = [];
  /** @internal */ _tickAfter: NodeTickListener<any>[] = [];

  /** @internal */ _layoutTicker?: () => void;

  // todo: remove this
  MAX_ELAPSE = Infinity;

  /** @internal */ _mo_seq: number;
  /** @internal */ _mo_seqAlign: number;
  /** @internal */ _mo_box: number;

  constructor() {
    stats.create++;
    if (this instanceof Node) {
      this.label(this.constructor.name);
    }
  }

  matrix(relative = false) {
    if (relative === true) {
      return this._pin.relativeMatrix();
    }
    return this._pin.absoluteMatrix();
  }

  /** @hidden */
  getPixelRatio() {
    // todo: parent matrix is not available in the first call
    const m = this._parent?.matrix();
    // todo: why "divide by" pixel ratio
    const pixelRatio = !m ? 1 : Math.max(Math.abs(m.a), Math.abs(m.b)) / getDevicePixelRatio();
    return pixelRatio;
  }

  pin(key: string): any;
  pin(key: string, value: any): this;
  pin(obj: object): this;
  pin(): Pin;
  pin(a?: object | string, b?: any) {
    if (typeof a === "object") {
      this._pin.set(a);
      return this;
    } else if (typeof a === "string") {
      if (typeof b === "undefined") {
        return this._pin.get(a);
      } else {
        this._pin.set(a, b);
        return this;
      }
    } else if (typeof a === "undefined") {
      return this._pin;
    }
  }

  fit(width: number, height: number, mode?: FitMode): this;
  fit(fit: object): this;
  fit(a, b?, c?) {
    if (typeof a === "object") {
      c = b;
      b = a.y;
      a = a.x;
    }
    this._pin.fit(a, b, c);
    return this;
  }

  /** @hidden @deprecated Use fit */
  scaleTo(a, b?, c?): this {
    return this.fit(a, b, c);
  }

  toString() {
    return "[" + this._label + "]";
  }

  /** @deprecated Use label() */
  id(): string;
  /** @deprecated Use label() */
  id(label: string): this;
  /** @deprecated Use label() */
  id(label?: string) {
    if (typeof label === "undefined") {
      return this._label;
    }
    this._label = label;
    return this;
  }

  label(): string;
  label(label: string): this;
  label(label?: string) {
    if (typeof label === "undefined") {
      return this._label;
    }
    this._label = label;
    return this;
  }

  attr(name: string, value: any): this;
  attr(name: string): any;
  attr(name: string, value?: any) {
    if (typeof value === "undefined") {
      return this._attrs !== null ? this._attrs[name] : undefined;
    }
    (this._attrs !== null ? this._attrs : (this._attrs = {}))[name] = value;
    return this;
  }

  visible(visible: boolean): this;
  visible(): boolean;
  visible(visible?: boolean) {
    if (typeof visible === "undefined") {
      return this._visible;
    }
    this._visible = visible;
    this._parent && (this._parent._ts_children = ++iid);
    this._ts_pin = ++iid;
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

  parent() {
    return this._parent;
  }

  next(visible?: boolean) {
    let next = this._next;
    while (next && visible && !next._visible) {
      next = next._next;
    }
    return next;
  }

  prev(visible?: boolean) {
    let prev = this._prev;
    while (prev && visible && !prev._visible) {
      prev = prev._prev;
    }
    return prev;
  }

  first(visible?: boolean) {
    let next = this._first;
    while (next && visible && !next._visible) {
      next = next._next;
    }
    return next;
  }

  last(visible?: boolean) {
    let prev = this._last;
    while (prev && visible && !prev._visible) {
      prev = prev._prev;
    }
    return prev;
  }

  visit<P>(visitor: NodeVisitor<P>, payload?: P) {
    const reverse = visitor.reverse;
    const visible = visitor.visible;
    if (visitor.start && visitor.start(this, payload)) {
      return;
    }
    let child: Node;
    let next = reverse ? this.last(visible) : this.first(visible);
    while ((child = next)) {
      next = reverse ? child.prev(visible) : child.next(visible);
      if (child.visit(visitor, payload)) {
        return true;
      }
    }
    return visitor.end && visitor.end(this, payload);
  }

  append(...child: Node[]): this;
  append(child: Node[]): this;
  append(child: Node | Node[], more?: Node) {
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        Node.append(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = 0; i < arguments.length; i++) {
        Node.append(this, arguments[i]);
      }
    } else if (typeof child !== "undefined") Node.append(this, child);

    return this;
  }

  prepend(...child: Node[]): this;
  prepend(child: Node[]): this;
  prepend(child: Node | Node[], more?: Node) {
    if (Array.isArray(child)) {
      for (let i = child.length - 1; i >= 0; i--) {
        Node.prepend(this, child[i]);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = arguments.length - 1; i >= 0; i--) {
        Node.prepend(this, arguments[i]);
      }
    } else if (typeof child !== "undefined") Node.prepend(this, child);

    return this;
  }

  appendTo(parent: Node) {
    Node.append(parent, this);
    return this;
  }

  prependTo(parent: Node) {
    Node.prepend(parent, this);
    return this;
  }

  insertNext(sibling: Node, more?: Node) {
    if (Array.isArray(sibling)) {
      for (let i = 0; i < sibling.length; i++) {
        Node.insertAfter(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = 0; i < arguments.length; i++) {
        Node.insertAfter(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      Node.insertAfter(sibling, this);
    }

    return this;
  }

  insertPrev(sibling: Node, more?: Node) {
    if (Array.isArray(sibling)) {
      for (let i = sibling.length - 1; i >= 0; i--) {
        Node.insertBefore(sibling[i], this);
      }
    } else if (typeof more !== "undefined") {
      // deprecated
      for (let i = arguments.length - 1; i >= 0; i--) {
        Node.insertBefore(arguments[i], this);
      }
    } else if (typeof sibling !== "undefined") {
      Node.insertBefore(sibling, this);
    }

    return this;
  }

  insertAfter(prev: Node) {
    Node.insertAfter(this, prev);
    return this;
  }

  insertBefore(next: Node) {
    Node.insertBefore(this, next);
    return this;
  }

  /** @internal */
  static append(parent: Node, child: Node) {
    assertType(child);
    assertType(parent);

    child.remove();

    if (parent._last) {
      parent._last._next = child;
      child._prev = parent._last;
    }

    child._parent = parent;
    parent._last = child;

    if (!parent._first) {
      parent._first = child;
    }

    child._parent._flag(child, true);

    child._ts_parent = ++iid;
    parent._ts_children = ++iid;
    parent.touch();
  }

  /** @internal */
  static prepend(parent: Node, child: Node) {
    assertType(child);
    assertType(parent);

    child.remove();

    if (parent._first) {
      parent._first._prev = child;
      child._next = parent._first;
    }

    child._parent = parent;
    parent._first = child;

    if (!parent._last) {
      parent._last = child;
    }

    child._parent._flag(child, true);

    child._ts_parent = ++iid;
    parent._ts_children = ++iid;
    parent.touch();
  }

  /** @internal */
  static insertBefore(self: Node, next: Node) {
    assertType(self);
    assertType(next);

    self.remove();

    const parent = next._parent;
    const prev = next._prev;

    if (!parent) {
      return;
    }

    next._prev = self;
    // todo:
    (prev && (prev._next = self)) || (parent && (parent._first = self));

    self._parent = parent;
    self._prev = prev;
    self._next = next;

    self._parent._flag(self, true);

    self._ts_parent = ++iid;
    self.touch();
  }

  /** @internal */
  static insertAfter(self: Node, prev: Node) {
    assertType(self);
    assertType(prev);

    self.remove();

    const parent = prev._parent;
    const next = prev._next;

    if (!parent) {
      return;
    }

    prev._next = self;
    // todo:
    (next && (next._prev = self)) || (parent && (parent._last = self));

    self._parent = parent;
    self._prev = prev;
    self._next = next;

    self._parent._flag(self, true);

    self._ts_parent = ++iid;
    self.touch();
  }

  remove(child?: Node, more?: any) {
    if (typeof child !== "undefined") {
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          assertType(child[i]).remove();
        }
      } else if (typeof more !== "undefined") {
        for (let i = 0; i < arguments.length; i++) {
          assertType(arguments[i]).remove();
        }
      } else {
        assertType(child).remove();
      }
      return this;
    }

    if (this._prev) {
      this._prev._next = this._next;
    }
    if (this._next) {
      this._next._prev = this._prev;
    }

    if (this._parent) {
      if (this._parent._first === this) {
        this._parent._first = this._next;
      }
      if (this._parent._last === this) {
        this._parent._last = this._prev;
      }

      this._parent._flag(this, false);

      this._parent._ts_children = ++iid;
      this._parent.touch();
    }

    this._prev = this._next = this._parent = null;
    this._ts_parent = ++iid;
    // this._parent.touch();
    return this;
  }

  empty() {
    let child: Node | null = null;
    let next = this._first;
    while ((child = next)) {
      next = child._next;
      child._prev = child._next = child._parent = null;

      this._flag(child, false);
    }

    this._first = this._last = null;

    this._ts_children = ++iid;
    this.touch();
    return this;
  }

  touch() {
    this._ts_touch = ++iid;
    this._parent && this._parent.touch();
    return this;
  }

  /** @internal */
  _flag(child: Node, value: boolean): Node;
  /** @internal */
  _flag(key: string): boolean;
  /** @internal */
  _flag(key: string, value: boolean): Node;
  /** @internal Deep flag, used for optimizing event distribution. */
  _flag(key: string | Node, value?: boolean) {
    if (typeof value === "undefined") {
      return (this._flags !== null && this._flags[key as string]) || 0;
    }
    if (typeof key === "string") {
      if (value) {
        this._flags = this._flags || {};
        if (!this._flags[key] && this._parent) {
          this._parent._flag(key, true);
        }
        this._flags[key] = (this._flags[key] || 0) + 1;
      } else if (this._flags && this._flags[key] > 0) {
        if (this._flags[key] == 1 && this._parent) {
          this._parent._flag(key, false);
        }
        this._flags[key] = this._flags[key] - 1;
      }
    }
    if (typeof key === "object") {
      if (key._flags) {
        for (const type in key._flags) {
          if (key._flags[type] > 0) {
            this._flag(type, value);
          }
        }
      }
    }
    return this;
  }

  /** @internal */
  hitTest(hit: Vec2Value) {
    const width = this._pin._width;
    const height = this._pin._height;
    return hit.x >= 0 && hit.x <= width && hit.y >= 0 && hit.y <= height;
  }

  /** @hidden */
  prerender() {
    if (!this._visible) {
      return;
    }

    this.prerenderTexture();

    let child: Node;
    let next = this._first;
    while ((child = next)) {
      next = child._next;
      child.prerender();
    }
  }

  /** @hidden */
  prerenderTexture() {
    // to be implemented by subclasses if needed
  }

  /** @hidden */
  private renderedBefore = false;

  /** @hidden */
  render(context: CanvasRenderingContext2D) {
    if (!this._visible) {
      return;
    }
    stats.node++;

    const m = this.matrix();
    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

    // move this elsewhere!
    this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
    const alpha = this._pin._textureAlpha * this._alpha;

    if (context.globalAlpha != alpha) {
      context.globalAlpha = alpha;
    }

    if (!this.renderedBefore) {
      // todo: because getPixelRatio is not accurate before first tick
      this.prerenderTexture();
    }
    this.renderedBefore = true;

    this.renderTexture(context);

    if (context.globalAlpha != this._alpha) {
      context.globalAlpha = this._alpha;
    }

    let child: Node;
    let next = this._first;
    while ((child = next)) {
      next = child._next;
      child.render(context);
    }
  }

  /** @hidden */
  renderTexture(context: CanvasRenderingContext2D) {
    // to be implemented by subclasses if needed
  }

  /** @internal */
  _tick(elapsed: number, now: number, last: number) {
    if (!this._visible) {
      return;
    }

    if (elapsed > this.MAX_ELAPSE) {
      elapsed = this.MAX_ELAPSE;
    }

    let ticked = false;

    if (this._tickBefore !== null) {
      for (let i = 0; i < this._tickBefore.length; i++) {
        stats.tick++;
        const tickFn = this._tickBefore[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }

    let child: Node | null;
    let next = this._first;
    while ((child = next)) {
      next = child._next;
      if (child._flag("_tick")) {
        ticked = child._tick(elapsed, now, last) === true ? true : ticked;
      }
    }

    if (this._tickAfter !== null) {
      for (let i = 0; i < this._tickAfter.length; i++) {
        stats.tick++;
        const tickFn = this._tickAfter[i];
        ticked = tickFn.call(this, elapsed, now, last) === true || ticked;
      }
    }

    return ticked;
  }

  tick(callback: NodeTickListener<this>, before = false) {
    if (typeof callback !== "function") {
      return;
    }
    if (before) {
      if (this._tickBefore === null) {
        this._tickBefore = [];
      }
      this._tickBefore.push(callback);
    } else {
      if (this._tickAfter === null) {
        this._tickAfter = [];
      }
      this._tickAfter.push(callback);
    }
    const hasTickListener = this._tickAfter?.length > 0 || this._tickBefore?.length > 0;
    this._flag("_tick", hasTickListener);
  }

  untick(callback: NodeTickListener<this>) {
    if (typeof callback !== "function") {
      return;
    }
    let i;
    if (this._tickBefore !== null && (i = this._tickBefore.indexOf(callback)) >= 0) {
      this._tickBefore.splice(i, 1);
    }
    if (this._tickAfter !== null && (i = this._tickAfter.indexOf(callback)) >= 0) {
      this._tickAfter.splice(i, 1);
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

  clearTimeout(timer: NodeTickListener<this>) {
    this.untick(timer);
  }

  on(types: string, listener: NodeEventListener<this>): this;
  /** @hidden @deprecated @internal */
  on(types: string[], listener: NodeEventListener<this>): this;
  on(type: string | string[], listener: NodeEventListener<this>) {
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
        this._on(type[i], listener);
      }
    } else if (typeof type === "string") {
      this._on(type, listener);
    } else {
      // invalid
    }
    return this;
  }

  /** @internal */
  _on(type: string, listener: NodeEventListener<this>) {
    if (typeof type !== "string" && typeof listener !== "function") {
      return;
    }
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(listener);
    // todo: maybe recompute/set exact value?
    this._flag(type, true);
  }

  off(types: string, listener: NodeEventListener<this>): this;
  /** @hidden @deprecated @internal */
  off(types: string[], listener: NodeEventListener<this>): this;
  off(type: string | string[], listener: NodeEventListener<this>) {
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
        this._off(type[i], listener);
      }
    } else if (typeof type === "string") {
      this._off(type, listener);
    } else {
      // invalid
    }
    return this;
  }

  /** @internal */
  _off(type: string, listener: NodeEventListener<this>) {
    if (typeof type !== "string" && typeof listener !== "function") {
      return;
    }
    const listeners = this._listeners[type];
    if (!listeners || !listeners.length) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
      // if (!listeners.length) {
      //   delete this._listeners[type];
      // }
      // todo: maybe recompute/set exact value?
      this._flag(type, false);
    }
  }

  listeners(type: string) {
    return this._listeners[type];
  }

  publish(name: string, args?: any) {
    const listeners = this.listeners(name);
    if (!listeners || !listeners.length) {
      return 0;
    }
    for (let l = 0; l < listeners.length; l++) {
      listeners[l].apply(this, args);
    }
    return listeners.length;
  }

  /** @hidden @deprecated @internal */
  trigger(name: string, args?: any) {
    this.publish(name, args);
    return this;
  }

  size(w: number, h: number) {
    // Pin shortcut, used by Transition and Node
    this.pin("width", w);
    this.pin("height", h);
    return this;
  }

  width(w: number): this;
  width(): number;
  width(w?: number) {
    // Pin shortcut, used by Transition and Node
    if (typeof w === "undefined") {
      return this.pin("width");
    }
    this.pin("width", w);
    return this;
  }

  height(h: number): this;
  height(): number;
  height(h?: number) {
    // Pin shortcut, used by Transition and Node
    if (typeof h === "undefined") {
      return this.pin("height");
    }
    this.pin("height", h);
    return this;
  }

  offset(value: Vec2Value): this;
  offset(x: number, y: number): this;
  offset(a?: Vec2Value | number, b?: number) {
    // Pin shortcut, used by Transition and Node
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    }
    this.pin("offsetX", a);
    this.pin("offsetY", b);
    return this;
  }

  rotate(a: number) {
    // Pin shortcut, used by Transition and Node
    this.pin("rotation", a);
    return this;
  }

  skew(value: Vec2Value): this;
  skew(x: number, y: number): this;
  skew(a?: Vec2Value | number, b?: number) {
    // Pin shortcut, used by Transition and Node
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    } else if (typeof b === "undefined") b = a;
    this.pin("skewX", a);
    this.pin("skewY", b);
    return this;
  }

  scale(value: Vec2Value): this;
  scale(x: number, y: number): this;
  scale(a?: Vec2Value | number, b?: number) {
    // Pin shortcut, used by Transition and Node
    if (typeof a === "object") {
      b = a.y;
      a = a.x;
    } else if (typeof b === "undefined") b = a;
    this.pin("scaleX", a);
    this.pin("scaleY", b);
    return this;
  }

  alpha(a: number, ta?: number) {
    // Pin shortcut, used by Transition and Node
    this.pin("alpha", a);
    if (typeof ta !== "undefined") {
      this.pin("textureAlpha", ta);
    }
    return this;
  }

  tween(opts?: TransitionOptions): Transition;
  tween(duration?: number, delay?: number, append?: boolean): Transition;
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

    if (!this._transitionTickInitied) {
      this.tick(this._transitionTick, true);
      this._transitionTickInitied = true;
    }

    this.touch();

    // todo: what is the expected default behavior?
    if (!options.append) {
      this._transitions.length = 0;
    }

    const transition = new Transition(this, options);
    this._transitions.push(transition);
    return transition;
  }

  /** @internal */ _transitionTickInitied = false;
  /** @internal */ _transitionTickLastTime = 0;
  /** @internal */
  _transitionTick = (elapsed: number, now: number, last: number) => {
    if (!this._transitions.length) {
      return false;
    }

    // ignore untracked tick
    const ignore = this._transitionTickLastTime !== last;
    this._transitionTickLastTime = now;
    if (ignore) {
      return true;
    }

    const head = this._transitions[0];

    const ended = head.tick(this, elapsed, now, last);

    // todo: move this logic to TransitionQueue
    if (ended) {
      if (head === this._transitions[0]) {
        this._transitions.shift();
      }
      const next = head.finish();
      if (next) {
        this._transitions.unshift(next);
      }
    }

    return true;
  };

  row(align: number) {
    this.align("row", align);
    return this;
  }

  column(align: number) {
    this.align("column", align);
    return this;
  }

  align(type: "row" | "column", align: number) {
    this._padding = this._padding;
    this._spacing = this._spacing;

    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      (this._layoutTicker = () => {
        if (this._mo_seq == this._ts_touch) {
          return;
        }
        this._mo_seq = this._ts_touch;

        const alignChildren = this._mo_seqAlign != this._ts_children;
        this._mo_seqAlign = this._ts_children;

        let width = 0;
        let height = 0;

        let child: Node;
        let next = this.first(true);
        let first = true;
        while ((child = next)) {
          next = child.next(true);

          child.matrix(true);
          const w = child.pin("boxWidth");
          const h = child.pin("boxHeight");

          if (type == "column") {
            !first && (height += this._spacing);
            child.pin("offsetY") != height && child.pin("offsetY", height);
            width = Math.max(width, w);
            height = height + h;
            alignChildren && child.pin("alignX", align);
          } else if (type == "row") {
            !first && (width += this._spacing);
            child.pin("offsetX") != width && child.pin("offsetX", width);
            width = width + w;
            height = Math.max(height, h);
            alignChildren && child.pin("alignY", align);
          }
          first = false;
        }
        width += 2 * this._padding;
        height += 2 * this._padding;
        this.pin("width") != width && this.pin("width", width);
        this.pin("height") != height && this.pin("height", height);
      }),
    );
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

  /**
   * Set size to match largest child size.
   */
  minimize() {
    this._padding = this._padding;

    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      (this._layoutTicker = () => {
        if (this._mo_box == this._ts_touch) {
          return;
        }
        this._mo_box = this._ts_touch;

        let width = 0;
        let height = 0;
        let child: Node;
        let next = this.first(true);
        while ((child = next)) {
          next = child.next(true);
          child.matrix(true);
          const w = child.pin("boxWidth");
          const h = child.pin("boxHeight");
          width = Math.max(width, w);
          height = Math.max(height, h);
        }
        width += 2 * this._padding;
        height += 2 * this._padding;
        this.pin("width") != width && this.pin("width", width);
        this.pin("height") != height && this.pin("height", height);
      }),
    );
    return this;
  }

  /**
   * Set size to match parent size.
   */
  maximize() {
    this._layoutTicker && this.untick(this._layoutTicker);
    this.tick(
      (this._layoutTicker = () => {
        const parent = this.parent();
        if (parent) {
          const width = parent.pin("width");
          if (this.pin("width") != width) {
            this.pin("width", width);
          }
          const height = parent.pin("height");
          if (this.pin("height") != height) {
            this.pin("height", height);
          }
        }
      }),
      true,
    );
    return this;
  }

  // TODO: move padding to pin
  /**
   * Set cell spacing for layout.
   */
  padding(pad: number) {
    this._padding = pad;
    return this;
  }

  /**
   * Set cell spacing for row and column layout.
   */
  spacing(space: number) {
    this._spacing = space;
    return this;
  }
}
