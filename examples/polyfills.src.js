// Function.bind
// source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError(
          "Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this, args = Array.prototype.slice.call(arguments, 1), type = function() {
    }, bound = function() {
      return self.apply(this instanceof type && obj ? this : obj, args
          .concat(Array.prototype.slice.call(arguments)));
    };
    type.prototype = this.prototype;
    bound.prototype = new type();

    return bound;
  };
}

// window.requestAnimationFrame
(function() {
  var lastTime = 0;
  var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
  for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// Object.create
// source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
  Object.create = (function() {
    function F() {
    }
    return function(o) {
      if (arguments.length != 1) {
        throw new Error(
            'Object.create implementation only accepts one parameter.');
      }
      F.prototype = o;
      return new F();
    };
  })();
}

// console.log
if (!console) {
  window.console = {
    log : function() {
      // alternate logging
    }
  };
}