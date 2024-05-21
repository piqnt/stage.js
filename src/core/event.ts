import { Component, ComponentEventListener } from "./component";

/** @internal */
export class EventManager {
  static instance = new EventManager();

  /** @internal */
  on(component: Component, name: string, listener: ComponentEventListener<any>) {
    if (typeof name !== "string" && typeof listener !== "function") {
      return;
    }
    component.__listeners[name] = component.__listeners[name] || [];
    component.__listeners[name].push(listener);
    // todo: maybe recompute/set exact value?
    component.updateDeepFlag(name, true);
  }

  /** @internal */
  off(component: Component, name: string, listener: ComponentEventListener<any>) {
    if (typeof name !== "string" && typeof listener !== "function") {
      return;
    }
    const listeners = component.__listeners[name];
    if (!listeners || !listeners.length) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
      // if (!listeners.length) {
      //   delete component.__listeners[type];
      // }
      // todo: maybe recompute/set exact value?
      component.updateDeepFlag(name, false);
    }
  }

  publish(component: Component, name: string, args?: any) {
    const listeners = component.listeners(name);
    if (!listeners || !listeners.length) {
      return 0;
    }
    for (let l = 0; l < listeners.length; l++) {
      listeners[l].apply(component, args);
    }
    return listeners.length;
  }

  listeners(component: Component, name: string) {
    return component.__listeners[name];
  }

  /** @internal */
  updateChildDeepFlags(component: Component, child: Component, value: boolean): void {
    for (const type in child.__flags) {
      if (child.__flags[type] > 0) {
        component.updateDeepFlag(type, value);
      }
    }
  }

  /** @internal */
  updateDeepFlag(component: Component, key: string, value: boolean): void {
    if (value) {
      if (!component.__flags[key] && component.parent()) {
        component.parent().updateDeepFlag(key, true);
      }
      component.__flags[key] = (component.__flags[key] ?? 0) + 1;
    } else if (component.__flags[key] > 0) {
      if (component.__flags[key] == 1 && component.parent()) {
        component.parent().updateDeepFlag(key, false);
      }
      component.__flags[key] = component.__flags[key] - 1;
    }
  }

  /** @internal */
  evalDeepFlag(component: Component, key: string): number {
    if (!component.__flags) {
      return 0;
    }
    return component.__flags[key as string] ?? 0;
  }
}
