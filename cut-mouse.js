/*
 * CutJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

if (typeof Cut === 'undefined' && typeof require === 'function')
  Cut = require('./cut-core');

DEBUG = (typeof DEBUG === 'undefined' || DEBUG) && console;

Cut.Mouse = function() {
  Cut.Mouse.subscribe.apply(Cut.Mouse, arguments);
};

Cut.Mouse.CLICK = 'click';
Cut.Mouse.START = 'touchstart mousedown';
Cut.Mouse.MOVE = 'touchmove mousemove';
Cut.Mouse.END = 'touchend mouseup';

Cut.Mouse.subscribe = function(root, elem, move) {
  elem = elem || document;

  elem.addEventListener('click', mouseClick);

  // TODO: with 'if' mouse doesn't work on touch screen, without 'if' two events
  // on Android
  if ('ontouchstart' in window) {
    elem.addEventListener('touchstart', function(event) {
      mouseStart(event, 'touchmove');
    });
    elem.addEventListener('touchend', function(event) {
      mouseEnd(event, 'touchmove');
    });
    move && elem.addEventListener('touchmove', mouseMove);

  } else {
    elem.addEventListener('mousedown', function(event) {
      mouseStart(event, 'mousemove');
    });
    elem.addEventListener('mouseup', function(event) {
      mouseEnd(event, 'mousemove');
    });
    move && elem.addEventListener('mousemove', mouseMove);
  }

  var visitor = null;

  var abs = {
    x : 0,
    y : 0,
    toString : function() {
      return (this.x | 0) + 'x' + (this.y | 0);
    }
  };

  var rel = {
    x : 0,
    y : 0,
    toString : function() {
      return abs + ' / ' + (this.x | 0) + 'x' + (this.y | 0);
    }
  };

  var clicked = {
    x : 0,
    y : 0,
    state : 0
  };

  function mouseStart(event, moveName) {
    update(event, elem);
    DEBUG && console.log('Mouse Start: ' + event.type + ' ' + abs);
    !move && elem.addEventListener(moveName, mouseMove);
    event.preventDefault();
    publish(event.type, event);

    clicked.x = abs.x;
    clicked.y = abs.y;
    clicked.state = 1;
  }

  function mouseEnd(event, moveName) {
    try {
      // New xy is not valid/available, last xy is used instead.
      DEBUG && console.log('Mouse End: ' + event.type + ' ' + abs);
      !move && elem.removeEventListener(moveName, mouseMove);
      event.preventDefault();
      publish(event.type, event);

      if (clicked.state == 1 && clicked.x == abs.x && clicked.y == abs.y) {
        DEBUG && console.log('Mouse Click [+]');
        publish('click', event);
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
      // DEBUG && console.log('Mouse Move: ' + event.type + ' ' +
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
      DEBUG && console.log('Mouse Click: ' + event.type + ' ' + abs);
      event.preventDefault();
      if (clicked.state != 2) {
        publish(event.type, event);
      } else {
        DEBUG && console.log('Mouse Click [-]');
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
    // visitor.count = 0;
    root.visit(visitor);
    // console.log(visitor.count);
  }

  visitor = {
    reverse : true,
    visible : true,
    start : function(cut) {
      if (!cut._listens(abs.type)) {
        return true;
      }
    },
    end : function(cut) {
      // visitor.count++;
      var listeners = cut.listeners(abs.type);
      if (!listeners) {
        return;
      }
      cut.matrix().reverse().map(abs, rel);
      if (cut === root || cut.attr('spy')) {
      } else if (rel.x < 0 || rel.x > cut._pin._width || rel.y < 0
          || rel.y > cut._pin._height) {
        return;
      }
      rel.raw = abs.event;
      for (var l = 0; l < listeners.length; l++) {
        if (listeners[l].call(cut, rel)) {
          return;
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
      // See http://goo.gl/JuVnF2
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
    abs.x *= root._ratio || 1;
    abs.y *= root._ratio || 1;
  }

};