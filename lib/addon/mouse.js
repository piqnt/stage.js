/*
 * Stage.js
 * Copyright (c) 2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

if (typeof DEBUG === 'undefined')
  DEBUG = true;

require('../core')._load(function(stage, elem) {
  Mouse.subscribe(stage, elem);
});

// TODO: capture mouse

function Mouse() {
}

Mouse.CLICK = 'click';
Mouse.START = 'touchstart mousedown';
Mouse.MOVE = 'touchmove mousemove';
Mouse.END = 'touchend mouseup';
Mouse.CANCEL = 'touchcancel mousecancel';

Mouse.subscribe = function(stage, elem) {
  var visitor = null, data = {};
  var abs = null, rel = null;
  var clicklist = [], cancellist = [];

  elem = elem || document;

  // click events are synthesized from start/end events on same nodes
  // elem.addEventListener('click', handleClick);

  elem.addEventListener('touchstart', handleStart);
  elem.addEventListener('touchend', handleEnd);
  elem.addEventListener('touchmove', handleMove);
  elem.addEventListener('touchcancel', handleCancel);

  elem.addEventListener('mousedown', handleStart);
  elem.addEventListener('mouseup', handleEnd);
  elem.addEventListener('mousemove', handleMove);

  document.addEventListener('mouseup', handleCancel);
  window.addEventListener("blur", handleCancel);

  function handleStart(event) {
    event.preventDefault();
    locate(elem, event, abs);
    DEBUG && console.log('Mouse Start: ' + event.type + ' ' + abs);
    publish(event.type, event);

    lookup('click', clicklist);
    lookup('mousecancel', cancellist);
  }

  function handleEnd(event) {
    event.preventDefault();
    // up/end location is not available, last one is used instead
    DEBUG && console.log('Mouse End: ' + event.type + ' ' + abs);
    publish(event.type, event);

    if (clicklist.length) {
      DEBUG && console.log('Mouse Click: ' + clicklist.length);
      publish('click', event, clicklist);
      cancellist.length = 0;
    }
  }

  function handleCancel(event) {
    if (cancellist.length) {
      DEBUG && console.log('Mouse Cancel: ' + event.type);
      publish('mousecancel', event, cancellist);
    }
  }

  function handleMove(event) {
    event.preventDefault();
    locate(elem, event, abs);
    publish(event.type, event);
  }

  var ratio = stage.viewport().ratio || 1;

  stage.on('viewport', function(size) {
    ratio = size.ratio || ratio;
  });

  function locate(elem, event) {
    locateElevent(elem, event, abs);
    abs.x *= ratio;
    abs.y *= ratio;
  }

  function lookup(type, collect) {
    data.type = type;
    data.root = stage;
    data.event = null;
    collect.length = 0;
    data.collect = collect;

    data.root.visit(visitor, data);
  }

  function publish(type, event, targets) {
    data.type = type;
    data.root = stage;
    data.event = event;
    data.collect = false;
    data.timeStamp = Date.now();

    if (targets) {
      while (targets.length)
        if (visitor.end(targets.shift(), data))
          break;
      targets.length = 0;
    } else {
      data.root.visit(visitor, data);
    }
  }

  visitor = {
    reverse : true,
    visible : true,
    start : function(node, data) {
      return !node._flag(data.type);
    },
    end : function(node, data) {
      // data: event, type, root, collect
      rel.raw = data.event;
      rel.type = data.type;
      rel.timeStamp = data.timeStamp;
      
      var listeners = node.listeners(data.type);
      if (!listeners) {
        return;
      }
      node.matrix().inverse().map(abs, rel);
      if (!(node === data.root || node.hitTest(rel))) {
        return;
      }
      if (data.collect) {
        data.collect.push(node);
      }
      if (data.event) {
        var cancel = false;
        for (var l = 0; l < listeners.length; l++) {
          cancel = listeners[l].call(node, rel) ? true : cancel;
        }
        return cancel;
      }
    }
  };

  abs = {
    x : 0,
    y : 0,
    toString : function() {
      return (this.x | 0) + 'x' + (this.y | 0);
    },
    clone : function(clone) {
      clone = clone || {};
      clone.x = this.x;
      clone.y = this.y;
      return clone;
    }
  };

  rel = {
    x : 0,
    y : 0,
    abs : abs,
    toString : function() {
      return abs + ' / ' + (this.x | 0) + 'x' + (this.y | 0);
    },
    clone : function(clone) {
      clone = clone || {};
      clone.x = this.x;
      clone.y = this.y;
      return clone;
    }
  };

};

function locateElevent(el, ev, loc) {
  // TODO: use pageX/Y if available?
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
