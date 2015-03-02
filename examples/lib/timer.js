/*
 * ExtraJS
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */

function Timer() {
  var timers = {};

  this.once = function(name, callback, delay) {
    return this.repeat(name, callback, delay, 1);
  };

  this.repeat = function(name, callback, delay, repeat) {
    repeat = (typeof repeat === 'number') ? repeat : Infinity;
    return this.set(name, {
      callback : callback,
      repeat : repeat,
      delay : delay
    });
  };

  this.set = function(name, timer) {
    if (typeof timer.delay !== "function") {
      var delay = timer.delay;
      timer.delay = function() {
        return delay;
      };
    }
    timer.time = timer.time || timer.delay();
    if (typeof repeat !== 'number' || timer < 1) {
      timer.repeat = 1;
    }
    timers[name] = timer;
  };

  this.unset = function(name) {
    delete timers[name];
  };

  this.empty = function() {
    for ( var name in timers) {
      delete timers[name];
    }
  };

  this.tick = function(t) {
    for ( var name in timers) {
      var timer = timers[name];
      timer.time -= t;
      if (timer.time <= 0) {
        if (--timer.repeat <= 0) {
          this.empty(name);
        } else {
          timer.time = timer.delay();
        }
        timer.callback();
      }
    }
  };
}

if (typeof define === "function" && define.amd) { // AMD
  define(function() {
    return Timer;
  });
}
if (typeof module !== 'undefined') { // CommonJS
  module.exports = Timer;
}
