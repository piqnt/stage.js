import { Vec2Value } from "../common/matrix";

import { Root, Viewport } from "./root";
import { Component } from "./component";

// todo: capture mouse
// todo: implement unmount

// todo: replace this with single synthetic event names
export const POINTER_CLICK = "click";
export const POINTER_DOWN = "touchstart mousedown";
export const POINTER_MOVE = "touchmove mousemove";
export const POINTER_UP = "touchend mouseup";
export const POINTER_CANCEL = "touchcancel mousecancel";

/** @hidden @deprecated */
export const POINTER_START = "touchstart mousedown";
/** @hidden @deprecated */
export const POINTER_END = "touchend mouseup";

class EventPoint {
  x: number;
  y: number;

  clone(obj?: Vec2Value) {
    if (obj) {
      obj.x = this.x;
      obj.y = this.y;
    } else {
      obj = {
        x: this.x,
        y: this.y,
      };
    }
    return obj;
  }

  toString() {
    return (this.x | 0) + "x" + (this.y | 0);
  }
}

// todo: make object readonly for users, to make it safe for reuse
class PointerSyntheticEvent {
  x: number;
  y: number;
  readonly abs = new EventPoint();

  raw: UIEvent;
  type: string;
  timeStamp: number;

  clone(obj?: Vec2Value) {
    if (obj) {
      obj.x = this.x;
      obj.y = this.y;
    } else {
      obj = {
        x: this.x,
        y: this.y,
      };
    }
    return obj;
  }

  toString() {
    return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
  }
}

/** @internal */
class VisitPayload {
  type: string = "";
  x: number = 0;
  y: number = 0;
  timeStamp: number = -1;
  event: UIEvent = null;
  root: Root = null;
  collected: Component[] | null = null;
  toString() {
    return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
  }
}

// todo: define per pointer object? so that don't need to update root
/** @internal */ const syntheticEvent = new PointerSyntheticEvent();

/** @internal */ const PAYLOAD = new VisitPayload();

/** @internal */
export class Pointer {
  static DEBUG = false;
  ratio = 1;

  stage: Root;
  elem: HTMLElement;

  mount(stage: Root, elem: HTMLElement) {
    this.stage = stage;
    this.elem = elem;

    this.ratio = stage.viewport().ratio || 1;
    stage.on("viewport", (viewport: Viewport) => {
      this.ratio = viewport.ratio ?? this.ratio;
    });

    // `click` events are synthesized from start/end events on same components
    // `mousecancel` events are synthesized on blur or mouseup outside element

    elem.addEventListener("touchstart", this.handleStart);
    elem.addEventListener("touchend", this.handleEnd);
    elem.addEventListener("touchmove", this.handleMove);
    elem.addEventListener("touchcancel", this.handleCancel);

    elem.addEventListener("mousedown", this.handleStart);
    elem.addEventListener("mouseup", this.handleEnd);
    elem.addEventListener("mousemove", this.handleMove);

    document.addEventListener("mouseup", this.handleCancel);
    window.addEventListener("blur", this.handleCancel);

    return this;
  }

  unmount() {
    const elem = this.elem;

    elem.removeEventListener("touchstart", this.handleStart);
    elem.removeEventListener("touchend", this.handleEnd);
    elem.removeEventListener("touchmove", this.handleMove);
    elem.removeEventListener("touchcancel", this.handleCancel);

    elem.removeEventListener("mousedown", this.handleStart);
    elem.removeEventListener("mouseup", this.handleEnd);
    elem.removeEventListener("mousemove", this.handleMove);

    document.removeEventListener("mouseup", this.handleCancel);
    window.removeEventListener("blur", this.handleCancel);

    return this;
  }

  clickList: Component[] = [];
  cancelList: Component[] = [];

  handleStart = (event: TouchEvent | MouseEvent) => {
    Pointer.DEBUG && console.debug && console.debug("pointer-start", event.type);
    event.preventDefault();
    this.localPoint(event);
    this.dispatchEvent(event.type, event);

    this.findTargets("click", this.clickList);
    this.findTargets("mousecancel", this.cancelList);
  };

  handleMove = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    this.localPoint(event);
    this.dispatchEvent(event.type, event);
  };

  handleEnd = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    // up/end location is not available, last one is used instead
    Pointer.DEBUG && console.debug && console.debug("pointer-end", event.type);
    this.dispatchEvent(event.type, event);

    if (this.clickList.length) {
      Pointer.DEBUG && console.debug && console.debug("pointer-click: ", event.type, this.clickList?.length);
      this.dispatchEvent("click", event, this.clickList);
    }
    this.cancelList.length = 0;
  };

  handleCancel = (event: TouchEvent | MouseEvent | FocusEvent) => {
    if (this.cancelList.length) {
      Pointer.DEBUG && console.debug && console.debug("pointer-cancel", event.type, this.clickList?.length);
      this.dispatchEvent("mousecancel", event, this.cancelList);
    }
    this.clickList.length = 0;
  };

  /**
   * Computer the location of the pointer event in the canvas coordination
   */
  localPoint(event: TouchEvent | MouseEvent) {
    const elem = this.elem;
    let x: number;
    let y: number;
    // pageX/Y if available?

    if ((event as TouchEvent).touches?.length) {
      x = (event as TouchEvent).touches[0].clientX;
      y = (event as TouchEvent).touches[0].clientY;
    } else {
      x = (event as MouseEvent).clientX;
      y = (event as MouseEvent).clientY;
    }

    const rect = elem.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    x -= elem.clientLeft | 0;
    y -= elem.clientTop | 0;

    PAYLOAD.x = x * this.ratio;
    PAYLOAD.y = y * this.ratio;
  }

  /**
   * Find eligible target for and event type, used to keep trace components to dispatch click event
   */
  findTargets(type: string, result: Component[]) {
    const payload = PAYLOAD;

    payload.type = type;
    payload.root = this.stage;
    payload.event = null;
    payload.collected = result;
    payload.collected.length = 0;

    this.stage.visit(
      {
        reverse: true,
        visible: true,
        start: this.visitStart,
        end: this.visitEnd,
      },
      payload,
    );
  }

  dispatchEvent(type: string, event: UIEvent, targets?: Component[]) {
    const payload = PAYLOAD;

    payload.type = type;
    payload.root = this.stage;
    payload.event = event;
    payload.timeStamp = Date.now();
    payload.collected = null;

    if (type !== "mousemove" && type !== "touchmove") {
      Pointer.DEBUG && console.debug && console.debug("pointer:dispatchEvent", payload, targets?.length);
    }

    if (targets) {
      while (targets.length) {
        const component = targets.shift();
        if (this.visitEnd(component, payload)) {
          break;
        }
      }
      targets.length = 0;
    } else {
      this.stage.visit(
        {
          reverse: true,
          visible: true,
          start: this.visitStart,
          end: this.visitEnd,
        },
        payload,
      );
    }
  }

  visitStart = (component: Component, payload: VisitPayload) => {
    return !component._flag(payload.type);
  };

  visitEnd = (component: Component, payload: VisitPayload) => {
    // mouse: event/collect, type, root
    syntheticEvent.raw = payload.event;
    syntheticEvent.type = payload.type;
    syntheticEvent.timeStamp = payload.timeStamp;
    syntheticEvent.abs.x = payload.x;
    syntheticEvent.abs.y = payload.y;

    const listeners = component.listeners(payload.type);
    if (!listeners) {
      return;
    }

    component.matrix().inverse().map(payload, syntheticEvent);

    // deep flags are used to decide to pass down event, and spy is not used for that
    // we use spy to decide if an event should be delivered to elements that do not have hitTest
    // todo: collect and pass hitTest result upward instead, probably use visit payload
    const isEventTarget = component === payload.root || component.attr("spy") || component.hitTest(syntheticEvent);
    if (!isEventTarget) {
      return;
    }

    if (payload.collected) {
      payload.collected.push(component);
    }

    // todo: when this condition is false?
    if (payload.event) {
      // todo: use a function call to cancel processing events, like dom
      let stop = false;
      for (let l = 0; l < listeners.length; l++) {
        stop = listeners[l].call(component, syntheticEvent) ? true : stop;
      }
      return stop;
    }
  };
}

/** @hidden @deprecated @internal */
export const Mouse = {
  CLICK: "click",
  START: "touchstart mousedown",
  MOVE: "touchmove mousemove",
  END: "touchend mouseup",
  CANCEL: "touchcancel mousecancel",
};
