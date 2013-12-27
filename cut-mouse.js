/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = true || (typeof DEBUG === 'undefined' || DEBUG) && console;

Cut.Mouse = {
  CLICK : "click",
  START : "touchstart mousedown",
  MOVE : "touchmove mousemove",
  END : "touchend mouseup",
};

Cut.Mouse.subscribe = function(listener, elem, move) {
  elem = elem || document;

  var isTouchSupported = "ontouchstart" in window;
  var CLICK = "click";
  var START = isTouchSupported ? "touchstart" : "mousedown";
  var MOVE = isTouchSupported ? "touchmove" : "mousemove";
  var END = isTouchSupported ? "touchend" : "mouseup";

  elem.addEventListener(CLICK, mouseClick);
  elem.addEventListener(START, mouseStart);
  elem.addEventListener(END, mouseEnd);
  move && elem.addEventListener(MOVE, mouseMove);

  var start = null, click = null, visitor = null;

  var abs = {
    x : 0,
    y : 0,
    toString : function() {
      return this.type + ": " + (this.x | 0) + "x" + (this.y | 0);
    }
  };

  var rel = {
    x : 0,
    y : 0,
    toString : function() {
      return abs + " / " + (this.x | 0) + "x" + (this.y | 0);
    }
  };

  function mouseStart(event) {
    update(event, elem);
    DEBUG && console.log("Mouse Start: " + abs);
    !move && elem.addEventListener(MOVE, mouseMove);
    event.preventDefault();
    publish(event.type, event);

    start = {
      x : abs.x,
      y : abs.y
    };
    click = null;
  }

  function mouseEnd(event) {
    try {
      // New xy is not valid/available, last xy is used instead.
      DEBUG && console.log("Mouse End: " + abs);
      !move && elem.removeEventListener(MOVE, mouseMove);
      event.preventDefault();
      publish(event.type, event);

      if (start && start.x == abs.x && start.y == abs.y) {
        DEBUG && console.log("Mouse Click [+]");
        publish("click", event);
        click = start;
      }
      start = null;
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseMove(event) {
    try {
      update(event, elem);
      // DEBUG && console.log("Mouse Move: " +
      // abs);
      event.preventDefault();
      publish(event.type, event);
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseClick(event) {
    try {
      update(event, elem);
      DEBUG && console.log("Mouse Click: " + abs);
      event.preventDefault();
      if (!click) {
        publish(event.type, event);
      } else {
        DEBUG && console.log("Mouse Click [-]");
      }
    } catch (e) {
      console && console.log(e);
    }
  }

  function publish(type, event) {
    abs.type = type;
    abs.event = event;
    rel.x = abs.x;
    rel.y = abs.y;
    listener.visit(visitor);
  }

  visitor = {
    reverse : true,
    visible : true,
    start : function(cut) {
      if (!cut.spy()) {
        cut.matrix().reverse().map(abs, rel);
        if (rel.x < 0 || rel.x > cut._pin._width || rel.y < 0
            || rel.y > cut._pin._height) {
          return true;
        }
      }
    },
    end : function(cut) {
      var listeners = cut.listeners(abs.type);
      if (listeners) {
        cut.matrix().reverse().map(abs, rel);
        for ( var l = 0; l < listeners.length; l++)
          if (listeners[l].call(cut, abs.event, rel)) {
            return true;
          }
      }
    }
  };

  function update(event, elem) {

    this.isTouch = false;

    // touch screen events
    if (event.touches) {
      if (event.touches.length) {
        abs.isTouch = true;
        abs.x = event.touches[0].pageX;
        abs.y = event.touches[0].pageY;
      } else {
        return;
      }
    } else {
      // mouse events
      abs.x = event.clientX;
      abs.y = event.clientY;
      // http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html
      if (document.body.scrollLeft || document.body.scrollTop) {
        // body is added as offsetParent
      } else if (document.documentElement) {
        abs.x += document.documentElement.scrollLeft;
        abs.y += document.documentElement.scrollTop;
      }
    }

    // accounts for border
    abs.x -= elem.clientLeft;
    abs.y -= elem.clientTop;

    var par = elem;
    while (par) {
      abs.x -= par.offsetLeft;
      abs.y -= par.offsetTop;
      if (!abs.isTouch) {
        // touch events offset scrolling with pageX/Y
        // so scroll offset not needed for them
        abs.x += par.scrollLeft;
        abs.y += par.scrollTop;
      }

      par = par.offsetParent;
    }

    // see loader
    abs.x *= elem.ratio || 1;
    abs.y *= elem.ratio || 1;
  }

};