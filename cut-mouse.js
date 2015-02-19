/*
 * CutJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

DEBUG = typeof DEBUG === 'undefined' || DEBUG;

function Mouse() {
  Mouse.subscribe.apply(Mouse, arguments);
};

Mouse.CLICK = 'click';
Mouse.START = 'touchstart mousedown';
Mouse.MOVE = 'touchmove mousemove';
Mouse.END = 'touchend mouseup';
Mouse.CANCEL = 'touchcancel';

Mouse.subscribe = function(root, elem) {
  var visitor = null, data = {}, abs = null, rel = null, clicked = [];

  elem = elem || document;

  // click events are synthesized from start/end events on same nodes
  // elem.addEventListener('click', handleClick);

  // TODO: with 'if' mouse doesn't work on touch screen, without 'if' two
  // events on Android
  if ('ontouchstart' in window) {
    elem.addEventListener('touchstart', handleStart);
    elem.addEventListener('touchend', handleEnd);
    elem.addEventListener('touchmove', handleMove);
    elem.addEventListener('touchcancel', handleCancel);

  } else {
    elem.addEventListener('mousedown', handleStart);
    elem.addEventListener('mouseup', handleEnd);
    elem.addEventListener('mousemove', handleMove);
  }

  function handleStart(event) {
    Mouse._xy(root, elem, event, abs);
    DEBUG && console.log('Mouse Start: ' + event.type + ' ' + abs);
    event.preventDefault();
    publish(event.type, event);

    findClicks();
  }

  function handleEnd(event) {
    // New xy is not valid/available, last xy is used instead.
    DEBUG && console.log('Mouse End: ' + event.type + ' ' + abs);
    event.preventDefault();
    publish(event.type, event);

    if (clicked.length) {
      DEBUG && console.log('Mouse Click: ' + clicked.length);
      fireClicks(event);
    }
  }

  function handleCancel(event) {
    DEBUG && console.log('Mouse Cancel: ' + event.type);
    event.preventDefault();
    publish(event.type, event);
  }

  function handleMove(event) {
    Mouse._xy(root, elem, event, abs);
    // DEBUG && console.log('Mouse Move: ' + event.type + ' ' +
    // abs);
    if (!root._flag(event.type)) {
      return;
    }
    event.preventDefault();
    publish(event.type, event);
  }

  function findClicks() {
    while (clicked.length) {
      clicked.pop();
    }
    publish('click', null, clicked);
  }

  function fireClicks(event) {
    data.event = event;
    data.type = 'click';
    data.root = root;
    data.collect = false;

    var cancel = false;
    while (clicked.length) {
      var cut = clicked.shift();
      if (cancel) {
        continue;
      }
      cancel = visitor.end(cut, data) ? true : cancel;
    }
  }

  function publish(type, event, collect) {
    rel.x = abs.x;
    rel.y = abs.y;

    data.event = event;
    data.type = type;
    data.root = /* root._capture || */root;
    data.collect = collect;

    data.root.visit(visitor, data);
  }

  visitor = {
    reverse : true,
    visible : true,
    start : function(cut, data) {
      return !cut._flag(data.type);
    },
    end : function(cut, data) {
      // data: event, type, root, collect
      rel.raw = data.event;
      rel.type = data.type;
      var listeners = cut.listeners(data.type);
      if (!listeners) {
        return;
      }
      cut.matrix().reverse().map(abs, rel);
      if (!(cut === data.root || cut.attr('spy') || Mouse._isInside(cut, rel))) {
        return;
      }
      if (data.collect) {
        data.collect.push(cut);
        return;
      }
      var cancel = false;
      for (var l = 0; l < listeners.length; l++) {
        cancel = listeners[l].call(cut, rel) ? true : cancel;
      }
      return cancel;
    }
  };

  abs = {
    x : 0,
    y : 0,
    toString : function() {
      return (this.x | 0) + 'x' + (this.y | 0);
    }
  };

  rel = {
    x : 0,
    y : 0,
    toString : function() {
      return abs + ' / ' + (this.x | 0) + 'x' + (this.y | 0);
    }
  };

};

Mouse._isInside = function(cut, point) {
  return point.x >= 0 && point.x <= cut._pin._width && point.y >= 0
      && point.y <= cut._pin._height;
};

Mouse._xy = function(root, elem, event, point) {

  var isTouch = false;

  // touch screen events
  if (event.touches) {
    if (event.touches.length) {
      isTouch = true;
      point.x = event.touches[0].pageX;
      point.y = event.touches[0].pageY;
    } else {
      return;
    }
  } else {
    // mouse events
    point.x = event.clientX;
    point.y = event.clientY;
    // See http://goo.gl/JuVnF2
    if (document.body.scrollLeft || document.body.scrollTop) {
      // body is added as offsetParent
    } else if (document.documentElement) {
      point.x += document.documentElement.scrollLeft;
      point.y += document.documentElement.scrollTop;
    }
  }

  // accounts for border
  point.x -= elem.clientLeft || 0;
  point.y -= elem.clientTop || 0;

  var par = elem;
  while (par) {
    point.x -= par.offsetLeft || 0;
    point.y -= par.offsetTop || 0;
    if (!isTouch) {
      // touch events offset scrolling with pageX/Y
      // so scroll offset not needed for them
      point.x += par.scrollLeft || 0;
      point.y += par.scrollTop || 0;
    }

    par = par.offsetParent;
  }

  point.x *= root.viewport().ratio || 1;
  point.y *= root.viewport().ratio || 1;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mouse;
}
