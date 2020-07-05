if (typeof DEBUG === 'undefined')
  DEBUG = true;

require('../core')._load(function(stage, elem) {
  Mouse.subscribe(stage, elem);
});

// TODO: capture mouse

Mouse.CLICK = 'click';
Mouse.START = 'touchstart mousedown';
Mouse.MOVE = 'touchmove mousemove';
Mouse.END = 'touchend mouseup';
Mouse.CANCEL = 'touchcancel mousecancel';

Mouse.subscribe = function(stage, elem) {
  if (stage.mouse) {
    return;
  }

  stage.mouse = new Mouse(stage, elem);

  // `click` events are synthesized from start/end events on same nodes
  // `mousecancel` events are synthesized on blur or mouseup outside element

  elem.addEventListener('touchstart', handleStart);
  elem.addEventListener('touchend', handleEnd);
  elem.addEventListener('touchmove', handleMove);
  elem.addEventListener('touchcancel', handleCancel);

  elem.addEventListener('mousedown', handleStart);
  elem.addEventListener('mouseup', handleEnd);
  elem.addEventListener('mousemove', handleMove);

  document.addEventListener('mouseup', handleCancel);
  window.addEventListener("blur", handleCancel);

  var clicklist = [], cancellist = [];

  function handleStart(event) {
    event.preventDefault();
    stage.mouse.locate(event);
    // DEBUG && console.log('Mouse Start: ' + event.type + ' ' + mouse);
    stage.mouse.publish(event.type, event);

    stage.mouse.lookup('click', clicklist);
    stage.mouse.lookup('mousecancel', cancellist);
  }

  function handleMove(event) {
    event.preventDefault();
    stage.mouse.locate(event);
    stage.mouse.publish(event.type, event);
  }

  function handleEnd(event) {
    event.preventDefault();
    // up/end location is not available, last one is used instead
    // DEBUG && console.log('Mouse End: ' + event.type + ' ' + mouse);
    stage.mouse.publish(event.type, event);

    if (clicklist.length) {
      // DEBUG && console.log('Mouse Click: ' + clicklist.length);
      stage.mouse.publish('click', event, clicklist);
    }
    cancellist.length = 0;
  }

  function handleCancel(event) {
    if (cancellist.length) {
      // DEBUG && console.log('Mouse Cancel: ' + event.type);
      stage.mouse.publish('mousecancel', event, cancellist);
    }
    clicklist.length = 0;
  }
};

function Mouse(stage, elem) {
  if (!(this instanceof Mouse)) {
    // old-style mouse subscription
    return;
  }

  var ratio = stage.viewport().ratio || 1;

  stage.on('viewport', function(size) {
    ratio = size.ratio || ratio;
  });

  this.x = 0;
  this.y = 0;
  this.toString = function() {
    return (this.x | 0) + 'x' + (this.y | 0);
  };
  this.locate = function(event) {
    locateElevent(elem, event, this);
    this.x *= ratio;
    this.y *= ratio;
  };
  this.lookup = function(type, collect) {
    this.type = type;
    this.root = stage;
    this.event = null;
    collect.length = 0;
    this.collect = collect;

    this.root.visit(this.visitor, this);
  };
  this.publish = function(type, event, targets) {
    this.type = type;
    this.root = stage;
    this.event = event;
    this.collect = false;
    this.timeStamp = Date.now();

    if (type !== 'mousemove' && type !== 'touchmove') {
      DEBUG && console.log(this.type + ' ' + this);
    }

    if (targets) {
      while (targets.length)
        if (this.visitor.end(targets.shift(), this))
          break;
      targets.length = 0;
    } else {
      this.root.visit(this.visitor, this);
    }
  };
  this.visitor = {
    reverse : true,
    visible : true,
    start : function(node, mouse) {
      return !node._flag(mouse.type);
    },
    end : function(node, mouse) {
      // mouse: event/collect, type, root
      rel.raw = mouse.event;
      rel.type = mouse.type;
      rel.timeStamp = mouse.timeStamp;
      rel.abs.x = mouse.x;
      rel.abs.y = mouse.y;

      var listeners = node.listeners(mouse.type);
      if (!listeners) {
        return;
      }
      node.matrix().inverse().map(mouse, rel);
      if (!(node === mouse.root || node.attr('spy') || node.hitTest(rel))) {
        return;
      }
      if (mouse.collect) {
        mouse.collect.push(node);
      }
      if (mouse.event) {
        var cancel = false;
        for (var l = 0; l < listeners.length; l++) {
          cancel = listeners[l].call(node, rel) ? true : cancel;
        }
        return cancel;
      }
    }
  };
};

// TODO: define per mouse object with get-only x and y
var rel = {}, abs = {};

defineValue(rel, 'clone', function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(rel, 'toString', function() {
  return (this.x | 0) + 'x' + (this.y | 0) + ' (' + this.abs + ')';
});
defineValue(rel, 'abs', abs);
defineValue(abs, 'clone', function(obj) {
  obj = obj || {}, obj.x = this.x, obj.y = this.y;
  return obj;
});
defineValue(abs, 'toString', function() {
  return (this.x | 0) + 'x' + (this.y | 0);
});

function defineValue(obj, name, value) {
  Object.defineProperty(obj, name, {
    value : value
  });
}

function locateElevent(el, ev, loc) {
  // pageX/Y if available?
  if (ev.touches && ev.touches.length) {
    loc.x = ev.touches[0].clientX;
    loc.y = ev.touches[0].clientY;
  } else {
    loc.x = ev.clientX;
    loc.y = ev.clientY;
  }
  var rect = el.getBoundingClientRect();
  loc.x -= rect.left;
  loc.y -= rect.top;
  loc.x -= el.clientLeft | 0;
  loc.y -= el.clientTop | 0;
  return loc;
};

module.exports = Mouse;
