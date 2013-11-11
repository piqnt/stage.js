if (typeof DEBUG === 'undefined')
  DEBUG = true;

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

  var mouseStart = null, mouseMove = null, mouseEnd = null, mouseClick = null;
  var start = null, click = null;

  mouseStart = function(event) {
    try {
      Mouse.get(event);
      DEBUG && console.log("Mouse Start: " + Mouse);
      !move && document.addEventListener("touchmove", mouseMove);
      !move && document.addEventListener("mousemove", mouseMove);
      event.preventDefault();
      this.publish(Mouse.ON_START, event, Mouse);

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
      DEBUG && console.log("Mouse End: " + Mouse);
      !move && document.removeEventListener("touchmove", mouseMove);
      !move && document.removeEventListener("mousemove", mouseMove);
      event.preventDefault();
      this.publish(Mouse.ON_END, event, Mouse);

      if (start && start.x == Mouse.x && start.y == Mouse.y) {
        DEBUG && console.log("+Mouse Click");
        this.publish(Mouse.ON_CLICK, event, Mouse);
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
      this.publish(Mouse.ON_MOVE, event, Mouse);
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  mouseClick = function(event) {
    try {
      DEBUG && console.log("Mouse Click: " + Mouse);
      Mouse.get(event);
      event.preventDefault();
      if (!click) {
        this.publish(Mouse.ON_CLICK, event, Mouse);
      } else {
        DEBUG && console.log("-Mouse Click");
      }
    } catch (e) {
      console.log(e);
    }
  }.bind(listener);

  document.addEventListener("click", mouseClick);

  document.addEventListener("touchstart", mouseStart);
  document.addEventListener("touchend", mouseEnd);
  move && document.addEventListener("touchmove", mouseMove);

  document.addEventListener("mousedown", mouseStart);
  document.addEventListener("mouseup", mouseEnd);
  move && document.addEventListener("mousemove", mouseMove);
};
