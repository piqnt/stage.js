/*
 * Cut.js
 * Copyright (c) 2013 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the BSD and MIT licenses
 * @license
 */

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

Cut.Mouse = {
  x : 0,
  y : 0,
  rel : {
    x : 0,
    y : 0,
    toString : function() {
      return (this.x | 0) + "x" + (this.y | 0);
    }
  },

  CLICK : "click",
  START : "touchstart mousedown",
  MOVE : "touchmove mousemove",
  END : "touchend mouseup",

  toString : function() {
    return (this.x | 0) + "x" + (this.y | 0) + "   " + this.rel;
  }
};

Cut.Mouse.get = function(event, elem) {

  this.isTouch = false;

  // touch screen events
  if (event.touches) {
    if (event.touches.length) {
      this.isTouch = true;
      this.x = event.touches[0].pageX;
      this.y = event.touches[0].pageY;
    } else {
      return;
    }
  } else {
    // mouse events
    this.x = event.clientX;
    this.y = event.clientY;
    // http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html
    if (document.body.scrollLeft || document.body.scrollTop) {
      // body is added as offsetParent
    } else if (document.documentElement) {
      this.x += document.documentElement.scrollLeft;
      this.y += document.documentElement.scrollTop;
    }
  }

  // accounts for border
  this.x -= elem.clientLeft;
  this.y -= elem.clientTop;

  var par = elem;
  while (par) {
    this.x -= par.offsetLeft;
    this.y -= par.offsetTop;
    if (!this.isTouch) {
      // touch events offset scrolling with pageX/Y
      // so scroll offset not needed for them
      this.x += par.scrollLeft;
      this.y += par.scrollTop;
    }

    par = par.offsetParent;
  }

  // see loader
  this.x *= elem.ratio || 1;
  this.y *= elem.ratio || 1;

  this.rel.x = this.x;
  this.rel.y = this.y;

  return this;
};

Cut.Mouse.listen = function(listener, elem, move) {
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
    self.get(event, elem);
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
      self.get(event, elem);
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
      self.get(event, elem);
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

  var visitor = null;

  function publish(type, event) {
    self.type = type;
    self.event = event;
    self.stop = false;
    listener.visit(visitor);
  }

  visitor = {
    reverse : true,
    visible : true,
    start : function(cut) {
      if (!cut.spy()) {
        var rel = cut.matrix().reverse().map(self, self.rel);
        if (rel.x < 0 || rel.x > cut._pin._width || rel.y < 0
            || rel.y > cut._pin._height) {
          return true;
        }
      }
    },
    end : function(cut) {
      var listeners = cut.listeners(self.type);
      if (listeners) {
        cut.matrix().reverse().map(self, self.rel);
        for ( var l = 0; l < listeners.length; l++)
          if (listeners[l].call(cut, self.event, self.rel)) {
            return true;
          }
      }
    }
  };

};