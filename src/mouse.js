if (typeof DEBUG === 'undefined')
  DEBUG = true;

// todo: capture mouse
// todo: implement unmount

export class Mouse {
  static CLICK = 'click';
  static START = 'touchstart mousedown';
  static MOVE = 'touchmove mousemove';
  static END = 'touchend mouseup';
  static CANCEL = 'touchcancel mousecancel';
  
  x = 0;
  y = 0;
  ratio = 1;

  stage;
  elem;

  constructor() {
  }

  mount(stage, elem) {
    this.stage = stage;
    this.elem = elem;

    this.ratio = stage.viewport().ratio || 1;  
    stage.on('viewport', (size) => {
      this.ratio = size.ratio ?? this.ratio;
    });

    // `click` events are synthesized from start/end events on same nodes
    // `mousecancel` events are synthesized on blur or mouseup outside element
  
    elem.addEventListener('touchstart', this.handleStart);
    elem.addEventListener('touchend', this.handleEnd);
    elem.addEventListener('touchmove', this.handleMove);
    elem.addEventListener('touchcancel', this.handleCancel);
  
    elem.addEventListener('mousedown', this.handleStart);
    elem.addEventListener('mouseup', this.handleEnd);
    elem.addEventListener('mousemove', this.handleMove);
  
    document.addEventListener('mouseup', this.handleCancel);
    window.addEventListener("blur", this.handleCancel);

    return this;
  }

  unmount() {
    const elem = this.elem;

    elem.removeEventListener('touchstart', this.handleStart);
    elem.removeEventListener('touchend', this.handleEnd);
    elem.removeEventListener('touchmove', this.handleMove);
    elem.removeEventListener('touchcancel', this.handleCancel);
  
    elem.removeEventListener('mousedown', this.handleStart);
    elem.removeEventListener('mouseup', this.handleEnd);
    elem.removeEventListener('mousemove', this.handleMove);
  
    document.removeEventListener('mouseup', this.handleCancel);
    window.removeEventListener("blur", this.handleCancel);

    return this;
  }

  clicklist = [];
  cancellist = [];

  handleStart = (event) => {
    event.preventDefault();
    this.locate(event);
    // DEBUG && console.log('Mouse Start: ' + event.type + ' ' + this);
    this.publish(event.type, event);

    this.lookup('click', this.clicklist);
    this.lookup('mousecancel', this.cancellist);
  }

  handleMove = (event) => {
    event.preventDefault();
    this.locate(event);
    this.publish(event.type, event);
  }

  handleEnd = (event) => {
    event.preventDefault();
    // up/end location is not available, last one is used instead
    // DEBUG && console.log('Mouse End: ' + event.type + ' ' + this);
    this.publish(event.type, event);

    if (this.clicklist.length) {
      // DEBUG && console.log('Mouse Click: ' + this.clicklist.length);
      this.publish('click', event, this.clicklist);
    }
    this.cancellist.length = 0;
  }

  handleCancel = (event) => {
    if (this.cancellist.length) {
      // DEBUG && console.log('Mouse Cancel: ' + event.type);
      this.publish('mousecancel', event, this.cancellist);
    }
    this.clicklist.length = 0;
  }

  toString = function() {
    return (this.x | 0) + 'x' + (this.y | 0);
  };

  locate = function(event) {
    const elem = this.elem;
    let x;
    let y;
    // pageX/Y if available?
    if (event.touches && event.touches.length) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    var rect = elem.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    x -= elem.clientLeft | 0;
    y -= elem.clientTop | 0;

    this.x = x * this.ratio;
    this.y = y * this.ratio;
  };

  lookup = function(type, collect) {
    this.type = type;
    this.root = this.stage;
    this.event = null;
    collect.length = 0;
    this.collect = collect;

    this.root.visit({
      reverse : true,
      visible : true,
      start : this.visitStart,
      end : this.visitEnd
    }, this);
  };

  publish = function(type, event, targets) {
    this.type = type;
    this.root = this.stage;
    this.event = event;
    this.collect = false;
    this.timeStamp = Date.now();

    if (type !== 'mousemove' && type !== 'touchmove') {
      DEBUG && console.log(this.type + ' ' + this);
    }

    if (targets) {
      while (targets.length)
        if (this.visitEnd(targets.shift()))
          break;
      targets.length = 0;
    } else {
      this.root.visit({
        reverse : true,
        visible : true,
        start : this.visitStart,
        end : this.visitEnd
      }, this);
    }
  };

  visitStart = (node) => {
    return !node._flag(this.type);
  }

  visitEnd = (node) => {
    // mouse: event/collect, type, root
    rel.raw = this.event;
    rel.type = this.type;
    rel.timeStamp = this.timeStamp;
    rel.abs.x = this.x;
    rel.abs.y = this.y;

    var listeners = node.listeners(this.type);
    if (!listeners) {
      return;
    }
    node.matrix().inverse().map(this, rel);
    if (!(node === this.root || node.attr('spy') || node.hitTest(rel))) {
      return;
    }
    if (this.collect) {
      this.collect.push(node);
    }
    if (this.event) {
      var cancel = false;
      for (var l = 0; l < listeners.length; l++) {
        cancel = listeners[l].call(node, rel) ? true : cancel;
      }
      return cancel;
    }
  }

}

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
