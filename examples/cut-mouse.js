DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

var Mouse = {
  x : 0,
  y : 0,
  rel : {
    x : 0,
    y : 0
  }
};

Mouse.toString = function() {
  return (this.x | 0) + "x" + (this.y | 0) + "   " + (this.rel.x | 0) + "x"
      + (this.rel.y | 0);
};

Mouse.ON_CLICK = "handleMouseClick";
Mouse.ON_END = "handleMouseEnd";
Mouse.ON_START = "handleMouseStart";
Mouse.ON_MOVE = "handleMouseMove";

Mouse.get = function(event, elem) {

  var isTouch = false;

  // touch screen events
  if (event.touches) {
    if (event.touches.length) {
      isTouch = true;
      Mouse.x = event.touches[0].pageX;
      Mouse.y = event.touches[0].pageY;
    }
  } else {
    // mouse events
    Mouse.x = event.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
    Mouse.y = event.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
  }

  // accounts for border
  Mouse.x -= elem.clientLeft;
  Mouse.y -= elem.clientTop;

  while (elem) {
    Mouse.x -= elem.offsetLeft;
    Mouse.y -= elem.offsetTop;
    if (!isTouch) {
      // touch events offset scrolling with pageX/Y
      // so scroll offset not needed for them
      Mouse.x += elem.scrollLeft;
      Mouse.y += elem.scrollTop;
    }

    elem = elem.offsetParent;
  }

  Mouse.rel.x = Mouse.x;
  Mouse.rel.y = Mouse.y;

  return Mouse;
};

Mouse.publish = function(name, event, target) {
  Mouse.name = name;
  Mouse.event = event;
  Mouse.stop = false;
  target.visit(Mouse, true);
};

Mouse.start = function(cut) {
  if (!cut.visible()) {
    return true;
  }

  cut.matrix().reverse().map(this, this.rel);
  if (cut.spy()) {
  } else if (this.rel.x < 0 || this.rel.x > cut._pin._width || this.rel.y < 0
      || this.rel.y > cut._pin._height) {
    return;
  }

  var handler = cut[this.name];
  if (typeof handler === "function") {
    if (handler.call(cut, this.event, this.rel)) {
      return this.stop = true;
    }
  }
};

Mouse.end = function(self) {
  return this.stop;
};

Mouse.listen = function(listener, elem, move) {
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

  var start = null, click = null;

  function mouseStart(event) {
    try {
      Mouse.get(event, elem);
      DEBUG && console.log("Mouse Start (" + event.type + "): " + Mouse);
      !move && elem.addEventListener(MOVE, mouseMove);
      event.preventDefault();
      Mouse.publish(Mouse.ON_START, event, listener);

      start = {
        x : Mouse.x,
        y : Mouse.y
      };
      click = null;
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseEnd(event) {
    try {
      // Mouse.get(event, elem) is not valid, last Mouse is used instead.
      DEBUG && console.log("Mouse End (" + event.type + "): " + Mouse);
      !move && elem.removeEventListener(MOVE, mouseMove);
      event.preventDefault();
      Mouse.publish(Mouse.ON_END, event, listener);

      if (start && start.x == Mouse.x && start.y == Mouse.y) {
        DEBUG && console.log("Mouse Click [+]");
        Mouse.publish(Mouse.ON_CLICK, event, listener);
        click = start;
      }
      start = null;
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseMove(event) {
    try {
      Mouse.get(event, elem);
      // DEBUG && console.log("Mouse Move (" + event.type + "): " + Mouse);
      event.preventDefault();
      Mouse.publish(Mouse.ON_MOVE, event, listener);
    } catch (e) {
      console && console.log(e);
    }
  }

  function mouseClick(event) {
    try {
      Mouse.get(event, elem);
      DEBUG && console.log("Mouse Click (" + event.type + "): " + Mouse);
      event.preventDefault();
      if (!click) {
        Mouse.publish(Mouse.ON_CLICK, event, listener);
      } else {
        DEBUG && console.log("Mouse Click [-]");
      }
    } catch (e) {
      console && console.log(e);
    }
  }

};
