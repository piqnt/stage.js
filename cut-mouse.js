/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

Cut.Mouse = {
  x : 0,
  y : 0,

  CLICK : "click",
  START : "touchstart mousedown",
  MOVE : "touchmove mousemove",
  END : "touchend mouseup",

  toString : function() {
    return (this.x | 0) + "x" + (this.y | 0);
  }
};

Cut.Mouse.subscribe = function(listener, elem, move) {
  elem = elem || document;

  var self = this;

  var isTouchSupported = "ontouchstart" in window;
  var CLICK = "click";
  var START = isTouchSupported ? "touchstart" : "mousedown";
  var MOVE = isTouchSupported ? "touchmove" : "mousemove";
  var END = isTouchSupported ? "touchend" : "mouseup";

  elem.addEventListener(CLICK, mouseClick);
  elem.addEventListener(START, mouseStart);
  elem.addEventListener(END, mouseEnd);
  move && elem.addEventListener(MOVE, mouseMove);

  var start = null, click = null;

  function mouseStart(event) {
    update(event, elem);
    DEBUG && console.log("Mouse Start (" + event.type + "): " + self);
    !move && elem.addEventListener(MOVE, mouseMove);
    event.preventDefault();
    publish(event.type, event);

    start = {
      x : self.x,
      y : self.y
    };
    click = null;
  }

  function mouseEnd(event) {
    try {
      // New xy is not valid/available, last xy is used instead.
      DEBUG && console.log("Mouse End (" + event.type + "): " + self);
      !move && elem.removeEventListener(MOVE, mouseMove);
      event.preventDefault();
      publish(event.type, event);

      if (start && start.x == self.x && start.y == self.y) {
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
      // DEBUG && console.log("self Move (" + event.type + "): " +
      // self);
      event.preventDefault();
      publish(event.type, event);
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseClick(event) {
    try {
      update(event, elem);
      DEBUG && console.log("Mouse Click (" + event.type + "): " + self);
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

  var visitor = null, rel = null;

  function publish(type, event) {
    self.type = type;
    self.event = event;
    self.stop = false;
    rel.x = self.x;
    rel.y = self.y;
    listener.visit(visitor);
  }

  rel = {
    x : 0,
    y : 0,
    toString : function() {
      return self + " " + (this.x | 0) + "x" + (this.y | 0);
    }
  };

  visitor = {
    reverse : true,
    visible : true,
    start : function(cut) {
      if (!cut.spy()) {
        cut.matrix().reverse().map(self, rel);
        if (rel.x < 0 || rel.x > cut._pin._width || rel.y < 0
            || rel.y > cut._pin._height) {
          return true;
        }
      }
    },
    end : function(cut) {
      var listeners = cut.listeners(self.type);
      if (listeners) {
        cut.matrix().reverse().map(self, rel);
        for ( var l = 0; l < listeners.length; l++)
          if (listeners[l].call(cut, self.event, rel)) {
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
        self.isTouch = true;
        self.x = event.touches[0].pageX;
        self.y = event.touches[0].pageY;
      } else {
        return;
      }
    } else {
      // mouse events
      self.x = event.clientX;
      self.y = event.clientY;
      // http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html
      if (document.body.scrollLeft || document.body.scrollTop) {
        // body is added as offsetParent
      } else if (document.documentElement) {
        self.x += document.documentElement.scrollLeft;
        self.y += document.documentElement.scrollTop;
      }
    }

    // accounts for border
    self.x -= elem.clientLeft;
    self.y -= elem.clientTop;

    var par = elem;
    while (par) {
      self.x -= par.offsetLeft;
      self.y -= par.offsetTop;
      if (!self.isTouch) {
        // touch events offset scrolling with pageX/Y
        // so scroll offset not needed for them
        self.x += par.scrollLeft;
        self.y += par.scrollTop;
      }

      par = par.offsetParent;
    }

    // see loader
    self.x *= elem.ratio || 1;
    self.y *= elem.ratio || 1;
  }

};