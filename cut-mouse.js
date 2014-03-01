/*
 * CutJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = true || (typeof DEBUG === 'undefined' || DEBUG) && console;

Cut.prototype.spy = function(spy) {
  if (!arguments.length) {
    return this._spy;
  }
  this._spy = spy ? true : false;
  return this;
};

Cut.Mouse = function() {
  Cut.Mouse.subscribe.apply(Cut.Mouse, arguments);
};

Cut.Mouse.CLICK = "click";
Cut.Mouse.START = "touchstart mousedown";
Cut.Mouse.MOVE = "touchmove mousemove";
Cut.Mouse.END = "touchend mouseup";

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

  var visitor = null;

  var abs = {
    x : 0,
    y : 0,
    toString : function() {
      return (this.x | 0) + "x" + (this.y | 0);
    }
  };

  var rel = {
    x : 0,
    y : 0,
    toString : function() {
      return abs + " / " + (this.x | 0) + "x" + (this.y | 0);
    }
  };

  var clicked = {
    x : 0,
    y : 0,
    state : 0
  };

  function mouseStart(event) {
    update(event, elem);
    DEBUG && console.log("Mouse Start: " + event.type + " " + abs);
    !move && elem.addEventListener(MOVE, mouseMove);
    event.preventDefault();
    publish(event.type, event);

    clicked.x = abs.x;
    clicked.y = abs.y;
    clicked.state = 1;
  }

  function mouseEnd(event) {
    try {
      // New xy is not valid/available, last xy is used instead.
      DEBUG && console.log("Mouse End: " + event.type + " " + abs);
      !move && elem.removeEventListener(MOVE, mouseMove);
      event.preventDefault();
      publish(event.type, event);

      if (clicked.state == 1 && clicked.x == abs.x && clicked.y == abs.y) {
        DEBUG && console.log("Mouse Click [+]");
        publish("click", event);
        clicked.state = 2;
      } else {
        clicked.state = 0;
      }
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseMove(event) {
    try {
      update(event, elem);
      // DEBUG && console.log("Mouse Move: " + event.type + " " +
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
      DEBUG && console.log("Mouse Click: " + event.type + " " + abs);
      event.preventDefault();
      if (clicked.state != 2) {
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
      if (!(cut.spy() || listener === cut)) {
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
        for (var l = 0; l < listeners.length; l++)
          if (listeners[l].call(cut, abs.event, rel)) {
            return true;
          }
      }
    }
  };

  function update(event, elem) {

    var isTouch = false;

    // touch screen events
    if (event.touches) {
      if (event.touches.length) {
        isTouch = true;
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
    abs.x -= elem.clientLeft || 0;
    abs.y -= elem.clientTop || 0;

    var par = elem;
    while (par) {
      abs.x -= par.offsetLeft || 0;
      abs.y -= par.offsetTop || 0;
      if (!isTouch) {
        // touch events offset scrolling with pageX/Y
        // so scroll offset not needed for them
        abs.x += par.scrollLeft || 0;
        abs.y += par.scrollTop || 0;
      }

      par = par.offsetParent;
    }

    // see loader
    abs.x *= listener._ratio || 1;
    abs.y *= listener._ratio || 1;
  }

};