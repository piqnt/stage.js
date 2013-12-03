DEBUG = typeof DEBUG === 'undefined' || DEBUG;

var Mouse = {
  x : 0,
  y : 0,
};

Mouse.toString = function() {
  return this.x + "x" + this.y;
};

Mouse.ON_CLICK = "handleMouseClick";
Mouse.ON_END = "handleMouseEnd";
Mouse.ON_START = "handleMouseStart";
Mouse.ON_MOVE = "handleMouseMove";

Mouse.get = function(event, elem) {
  elem = elem || document.body;

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
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
  }

  // accounts for border
  Mouse.x -= elem.clientLeft;
  Mouse.y -= elem.clientTop;

  // parent offsets
  var par = elem;
  while (par) {
    Mouse.x -= par.offsetLeft;
    Mouse.y -= par.offsetTop;
    if (!isTouch) {
      // touch events offset scrolling with pageX/Y
      // so scroll offset not needed for them
      Mouse.x += par.scrollLeft;
      Mouse.y += par.scrollTop;
    }

    par = par.offsetParent;
  }

  return Mouse;
};

Mouse.listen = function(listener, move) {

  var isTouchSupported = "ontouchstart" in window;
  var CLICK = "click";
  var START = isTouchSupported ? "touchstart" : "mousedown";
  var MOVE = isTouchSupported ? "touchmove" : "mousemove";
  var END = isTouchSupported ? "touchend" : "mouseup";

  document.addEventListener(CLICK, mouseClick);
  document.addEventListener(START, mouseStart);
  document.addEventListener(END, mouseEnd);
  move && document.addEventListener(MOVE, mouseMove);

  var start = null, click = null;

  function mouseStart(event) {
    try {
      Mouse.get(event);
      DEBUG && console.log("Mouse Start (" + event.type + "): " + Mouse);
      !move && document.addEventListener(MOVE, mouseMove);
      event.preventDefault();
      listener.publish(Mouse.ON_START, event, Mouse);

      start = {
        x : Mouse.x,
        y : Mouse.y
      };
      click = null;
    } catch (e) {
      console.log(e);
    }
  }

  function mouseEnd(event) {
    try {
      // Mouse.get(event) is not valid, last Mouse is used instead.
      DEBUG && console.log("Mouse End (" + event.type + "): " + Mouse);
      !move && document.removeEventListener(MOVE, mouseMove);
      event.preventDefault();
      listener.publish(Mouse.ON_END, event, Mouse);

      if (start && start.x == Mouse.x && start.y == Mouse.y) {
        DEBUG && console.log("Mouse Click [+]");
        listener.publish(Mouse.ON_CLICK, event, Mouse);
        click = start;
      }
      start = null;
    } catch (e) {
      console.log(e);
    }
  }

  function mouseMove(event) {
    try {
      Mouse.get(event);
      // DEBUG && console.log("Mouse Move (" + event.type + "): " + Mouse);
      event.preventDefault();
      listener.publish(Mouse.ON_MOVE, event, Mouse);
    } catch (e) {
      console.log(e);
    }
  }

  function mouseClick(event) {
    try {
      Mouse.get(event);
      DEBUG && console.log("Mouse Click (" + event.type + "): " + Mouse);
      event.preventDefault();
      if (!click) {
        listener.publish(Mouse.ON_CLICK, event, Mouse);
      } else {
        DEBUG && console.log("Mouse Click [-]");
      }
    } catch (e) {
      console.log(e);
    }
  }

};
