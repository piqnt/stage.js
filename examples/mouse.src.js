var Mouse = {
  x : 0,
  y : 0,
};

Mouse.isTouchSupported = "ontouchstart" in window;
Mouse.START = Mouse.isTouchSupported ? "touchstart" : "mousedown";
Mouse.MOVE = Mouse.isTouchSupported ? "touchmove" : "mousemove";
Mouse.END = Mouse.isTouchSupported ? "touchend" : "mouseup";
Mouse.CLICK = "click";

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

  var mouseStart = null, mouseMove = null, mouseEnd = null, mouseClick = null;
  var start = null, click = null;

  mouseStart = function(event) {
    try {
      Mouse.get(event);
      DEBUG && console.log("Mouse Start: " + Mouse.x + "x" + Mouse.y);
      !move && document.addEventListener(Mouse.MOVE, mouseMove);
      event.preventDefault();
      this.publish("handleMouseStart", event, Mouse);

      start = {
        x : Mouse.x,
        y : Mouse.y
      };
      click = null;
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  mouseEnd = function(event) {
    try {
      // Mouse.get(event); Invalid, last Mouse is used instead!
      DEBUG && console.log("Mouse End: " + Mouse.x + "x" + Mouse.y);
      !move && document.removeEventListener(Mouse.MOVE, mouseMove);
      event.preventDefault();
      this.publish("handleMouseEnd", event, Mouse);

      if (start && start.x == Mouse.x && start.y == Mouse.y) {
        this.publish("handleMouseClick", event, Mouse);
        click = start;
      }
      start = null;
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  mouseMove = function(event) {
    try {
      Mouse.get(event);
      // DEBUG && console.log("Mouse Move: " + Mouse.x + "x" + Mouse.y);
      event.preventDefault();
      this.publish("handleMouseMove", event, Mouse);
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  mouseClick = function(event) {
    try {
      Mouse.get(event);
      DEBUG && console.log("Mouse Click: " + Mouse.x + "x" + Mouse.y);
      event.preventDefault();
      if (!click) {
        this.publish("handleMouseClick", event, Mouse);
      }
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  document.addEventListener(Mouse.START, mouseStart);
  document.addEventListener(Mouse.END, mouseEnd);
  document.addEventListener(Mouse.CLICK, mouseClick);
  move && document.addEventListener(Mouse.MOVE, mouseMove);
};