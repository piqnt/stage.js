import { Matrix } from "../common/matrix";
import { Memo } from "../common/memo";

import { Component, ComponentTickListener } from "./component";
import { FitMode, Pin } from "./pin";

export interface LayoutObject {
  // __parent: Component | null;
  // __first: Component | null;
  // __last: Component | null;
  // __next: Component | null;
  // __prev: Component | null;
  // __pin: Pin;
  // __rel_matrix: Matrix;
  // __abs_matrix: Matrix;
  // __memo_abs_matrix: Memo;
  // _revision: number;
  // __memo_align_touch: Memo;
  // __memo_align_children: Memo;
  // __memo_minimize_touch: Memo;
  // __layoutTicker?: any;
  // // todo: remove pin from this interface
  // pin(key: string, value: any): void;
  // pin(key: string): any;
  // getTransform(): Matrix;
  // visible(): boolean;
  // parent(): Component | null;
  // first(visible?: boolean): Component | null;
  // last(visible?: boolean): Component | null;
  // prev(visible?: boolean): Component | null;
  // next(visible?: boolean): Component | null;
  // remove(): any;
  // setParent(parent: Component): void;
  // setFirst(child: Component): void;
  // setLast(child: Component): void;
  // setNext(next: Component): void;
  // setPrev(prev: Component): void;
  // onChildAdded(child: Component): void;
  // onChildRemoved(child: Component): void;
  // touch(): void;
  // tick(fn: ComponentTickListener, beforeChildren?: boolean): void;
  // untick(fn: ComponentTickListener): void;
  // getWidth(): number;
  // getHeight(): number;
  // getBoxWidth(): number;
  // getBoxHeight(): number;
  // setOffsetX(width: number): void;
  // setOffsetY(height: number): void;
  // setAlignX(align: number): void;
  // setAlignY(align: number): void;
}

export interface LayoutManagerInterface {
  getTransform(component: Component): Matrix;

  getTextureTransparency(component: Component): number;
  getTransparency(component: Component): number;

  append(component: Component, child: Component): void;
  prepend(component: Component, child: Component): void;
  insertAfter(component: Component, sibling: Component): void;
  insertBefore(component: Component, sibling: Component): void;
  remove(component: Component): void;
  empty(component: Component): void;

  getParent(component: Component): Component;
  getFirst(component: Component, visible: boolean): Component;
  getLast(component: Component, visible: boolean): Component;
  getNext(component: Component, visible: boolean): Component;
  getPrev(component: Component, visible: boolean): Component;

  setParent(component: Component, parent: Component): void;
  setFirst(component: Component, first: Component): void;
  setLast(component: Component, last: Component): void;
  setNext(component: Component, next: Component): void;
  setPrev(component: Component, prev: Component): void;

  getWidth(component: Component): number;
  getHeight(component: Component): number;
  getBoxWidth(component: Component): number;
  getBoxHeight(component: Component): number;

  setOffsetX(component: Component, value: number): void;
  setOffsetY(component: Component, value: number): void;
  setAlignX(component: Component, value: number): void;
  setAlignY(component: Component, value: number): void;

  minimize(component: Component): void;
  maximize(component: Component): void;
  align(component: Component, type: "row" | "column", align: number): void;

  getPin(component: Component): Pin;
  updatePin(component: Component, data: object): void;
  getPinProp(component: Component, key: string): any;
  setPinProp(component: Component, key: string, value: any): void;
  fit(component: Component, width: number, height: number, mode: FitMode): void;
}

/** @internal */
export class BasicLayoutManager implements LayoutManagerInterface {
  static instance = new BasicLayoutManager();

  getTransform(component: Component): Matrix {
    return component.__pin.toMatrix();
  }

  getTransparency(component: Component): number {
    return component.__pin._alpha;
  }

  getTextureTransparency(component: Component): number {
    return component.__pin._textureAlpha;
  }

  append(parent: Component, child: Component) {
    assertComponent(child);
    assertComponent(parent);

    if (child.parent()) {
      child.remove();
    }

    const last = parent.last();
    if (last) {
      last.setNext(child as Component);
      child.setPrev(last);
    }

    child.setParent(parent as Component);
    parent.setLast(child as Component);

    if (!parent.first()) {
      parent.setFirst(child as Component);
    }

    parent.onChildAdded(child as Component);

    // child._ts_parent = ++revision.component;
    // parent._ts_children = ++revision.component;
    parent.touch();
  }

  prepend(parent: Component, child: Component) {
    assertComponent(child);
    assertComponent(parent);

    if (child.parent()) {
      child.remove();
    }

    const first = parent.first();
    if (first) {
      first.setPrev(child as Component);
      child.setNext(first);
    }

    child.setParent(parent as Component);
    parent.setFirst(child as Component);

    if (!parent.last()) {
      parent.setLast(child as Component);
    }

    parent.onChildAdded(child as Component);

    // child._ts_parent = ++revision.component;
    // parent._ts_children = ++revision.component;
    parent.touch();
  }

  insertBefore(component: Component, sibling: Component) {
    assertComponent(component);
    assertComponent(sibling);

    component.remove();

    const parent = sibling.parent();
    const prev = sibling.prev();

    if (!parent) {
      return;
    }

    sibling.setPrev(component as Component);
    if (prev) {
      prev.setNext(component as Component);
    } else if (parent) {
      parent.setFirst(component as Component);
    }

    component.setParent(parent);
    component.setParent(prev);
    component.setNext(sibling as Component);

    parent.onChildAdded(component as Component);

    // component._ts_parent = ++revision.component;
    component.touch();
  }

  insertAfter(component: Component, sibling: Component) {
    assertComponent(component);
    assertComponent(sibling);

    component.remove();

    const parent = sibling.parent();
    const next = sibling.next();

    if (!parent) {
      return;
    }

    sibling.setNext(component as Component);
    if (next) {
      next.setPrev(component as Component);
    } else if (parent) {
      parent.setLast(component as Component);
    }

    component.setParent(parent);
    component.setPrev(sibling as Component);
    component.setNext(next);

    parent.onChildAdded(component as Component);

    // component._ts_parent = ++revision.component;
    component.touch();
  }

  remove(component: Component): void {
    assertComponent(component);
    const prev = component.prev();
    const next = component.next();
    const parent = component.parent();

    if (prev) {
      prev.setNext(next);
    }
    if (next) {
      next.setPrev(prev);
    }

    if (parent) {
      if (parent.first() === component) {
        parent.setFirst(next);
      }
      if (parent.last() === component) {
        parent.setLast(prev);
      }

      parent.onChildRemoved(component as Component);

      // parent._ts_children = ++revision.component;
      parent.touch();
    }

    // TODO: do not clear next/prev/parent on remove (why?)

    component.setPrev(null);
    component.setNext(null);
    component.setParent(null);
    // component._ts_parent = ++revision.component;
    // self._parent.touch();
  }

  empty(component: Component) {
    assertComponent(component);
    let child: Component | null = null;
    let next = component.first();
    while ((child = next)) {
      next = child.next();
      child.setParent(null);
      child.setNext(null);
      child.setPrev(null);

      component.onChildRemoved(child as Component);
    }

    component.setFirst(null);
    component.setLast(null);

    // component._ts_children = ++revision.component;
    component.touch();
  }

  getParent(component: Component): Component {
    assertComponent(component);
    return component.__parent;
  }
  setParent(component: Component, parent: Component) {
    assertComponent(component);
    component.__parent = parent;
  }

  getFirst(component: Component, visible?: boolean): Component {
    assertComponent(component);
    let next = component.__first;
    while (next && visible && !next.visible()) {
      next = next.next();
    }
    return next;
  }
  setFirst(component: Component, first: Component) {
    assertComponent(component);
    component.__first = first;
  }

  getLast(component: Component, visible?: boolean): Component {
    assertComponent(component);
    let prev = component.__last;
    while (prev && visible && !prev.visible()) {
      prev = prev.prev();
    }
    return prev;
  }

  setLast(component: Component, last: Component) {
    assertComponent(component);
    component.__last = last;
  }

  getNext(component: Component, visible?: boolean): Component {
    assertComponent(component);
    let next = component.__next;
    while (next && visible && !next.visible()) {
      next = next.next();
    }
    return next;
  }

  setNext(component: Component, next: Component) {
    assertComponent(component);
    component.__next = next;
  }

  getPrev(component: Component, visible?: boolean): Component {
    assertComponent(component);
    let prev = component.__prev;
    while (prev && visible && !prev.visible()) {
      prev = prev.prev();
    }
    return prev;
  }

  setPrev(component: Component, prev: Component) {
    assertComponent(component);
    component.__prev = prev;
  }

  getPin(component: Component): Pin {
    assertComponent(component);
    return component.__pin;
  }

  getPinProp(component: Component, key: string): any {
    assertComponent(component);
    return component.__pin.get(key);
  }

  setPinProp(component: Component, key: string, value: any): void {
    assertComponent(component);
    component.__pin.set(key, value);
  }

  updatePin(component: Component, data: object): void {
    assertComponent(component);
    component.__pin.set(data);
  }

  fit(component: Component, width: number, height: number, mode?: FitMode): void {
    assertComponent(component);
    component.__pin.fit(width, height, mode);
  }

  getBoxWidth(component: Component): number {
    assertComponent(component);
    return component.__pin._boxWidth;
  }

  getBoxHeight(component: Component): number {
    assertComponent(component);
    return component.__pin._boxHeight;
  }

  getWidth(component: Component): number {
    return component.__pin._width;
  }

  getHeight(component: Component): number {
    return component.__pin._height;
  }

  setOffsetX(component: Component, value: number): void {
    component.pin("offsetX", value);
  }

  setOffsetY(component: Component, value: number): void {
    component.pin("offsetY", value);
  }

  setAlignX(component: Component, value: number): void {
    component.pin("alignX", value);
  }

  setAlignY(component: Component, value: number): void {
    component.pin("alignY", value);
  }

  align(component: Component, type: "row" | "column", align: number) {
    component.__layoutTicker && component.untick(component.__layoutTicker);
    component.__layoutTicker = () => {
      if (component.__memo_align_touch.recall(component._revision)) {
        return;
      }

      // const alignChildren = component.__memo_align_children.recall(component._ts_children);

      let width = 0;
      let height = 0;

      let child: Component;
      let next = component.first(true);
      let first = true;
      while ((child = next)) {
        next = child.next(true);

        child.getTransform();
        const w = child.getBoxWidth();
        const h = child.getBoxHeight();

        const hasSize = w > 0 && h > 0;

        if (!hasSize) {
          continue;
        }

        if (type === "column") {
          if (!first) {
            height += component.__pin._spacing;
          }
          // if (child.pin("offsetY") !== height) {
          //   child.pin("offsetY", height);
          // }
          child.setOffsetY(height);

          width = Math.max(width, w);
          height = height + h;
          // if (alignChildren) {
          // child.pin("alignX", align);
          child.setAlignX(align);
          // }
        } else if (type === "row") {
          if (!first) {
            width += component.__pin._spacing;
          }
          // if (child.pin("offsetX") !== width) {
          //   child.pin("offsetX", width);
          // }
          child.setOffsetX(width);

          width = width + w;
          height = Math.max(height, h);
          // if (alignChildren) {
          // child.pin("alignY", align);
          child.setAlignY(align);
          // }
        }
        first = false;
      }
      width += 2 * component.__pin._padding;
      height += 2 * component.__pin._padding;
      if (component.pin("width") !== width) {
        component.pin("width", width);
      }
      if (component.pin("height") !== height) {
        component.pin("height", height);
      }
    };
    component.tick(component.__layoutTicker);
    return this;
  }

  /** Set size to match largest child size. */
  minimize(component: Component) {
    component.__layoutTicker && component.untick(component.__layoutTicker);
    component.__layoutTicker = () => {
      if (component.__memo_minimize_touch.recall(component._revision)) {
        return;
      }

      let width = 0;
      let height = 0;
      let child: Component;
      let next = component.first(true);
      while ((child = next)) {
        next = child.next(true);
        child.getTransform();
        const w = child.getBoxWidth();
        const h = child.getBoxHeight();
        width = Math.max(width, w);
        height = Math.max(height, h);
      }
      width += 2 * component.__pin._padding;
      height += 2 * component.__pin._padding;
      component.pin("width") != width && component.pin("width", width);
      component.pin("height") != height && component.pin("height", height);
    };
    component.tick(component.__layoutTicker);
    return this;
  }

  /** Set size to match parent size. */
  maximize(component: Component) {
    component.__layoutTicker && component.untick(component.__layoutTicker);
    component.__layoutTicker = () => {
      const parent = component.parent();
      if (parent) {
        // const width = parent.pin("width");
        const width = parent.getWidth();
        if (component.pin("width") != width) {
          component.pin("width", width);
        }
        // const height = parent.pin("height");
        const height = parent.getHeight();
        if (component.pin("height") != height) {
          component.pin("height", height);
        }
      }
    };
    component.tick(component.__layoutTicker, true);
    return this;
  }
}

/** @internal */
export function assertComponent<T>(obj: T): T {
  // todo: implement this
  if (obj && obj instanceof Component) {
    return obj;
  }
  throw "Invalid component: " + obj;
}
